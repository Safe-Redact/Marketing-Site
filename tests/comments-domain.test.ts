import assert from "node:assert/strict";
import test from "node:test";

import { createRateLimiter, deriveAuthorKey, requestAddress } from "../src/lib/comments/abuse";
import { MemoryCommentsRepository } from "../src/lib/comments/memory-repository";
import {
  MAX_THREAD_DEPTH,
  TOMBSTONE_BODY,
  assessSpam,
  buildPublicThread,
  canTransition,
  countPublicComments,
  hashCommentBody,
  normalizeCommentText,
} from "../src/lib/comments/policy";
import {
  CommentsService,
  MAX_COMMENTS_PER_DAY,
  staffLabel,
  type ArticleGate,
} from "../src/lib/comments/service";
import type { Comment, StaffIdentity } from "../src/lib/comments/types";

const PUBLISHED = "practical-redaction-review-guide";
const UNPUBLISHED = "a-draft-nobody-approved";
const SECRET = "test-abuse-key-secret-not-a-real-one";
const staff: StaffIdentity = { id: 4_242, login: "moderator" };

const articles: ArticleGate = {
  async isPublished(slug) {
    return slug === PUBLISHED;
  },
};

interface Harness {
  service: CommentsService;
  repository: MemoryCommentsRepository;
  advance(milliseconds: number): void;
}

function harness(): Harness {
  let currentTime = Date.parse("2026-10-15T09:00:00.000Z");
  const now = () => new Date(currentTime);
  const repository = new MemoryCommentsRepository({ now });
  const service = new CommentsService({
    repository,
    articles,
    abuseKeySecret: SECRET,
    submissionLimiter: createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 }),
    reportLimiter: createRateLimiter({ limit: 10, windowMs: 60 * 60 * 1000 }),
    now,
  });
  return {
    service,
    repository,
    advance(milliseconds: number) {
      currentTime += milliseconds;
    },
  };
}

function submission(overrides: Record<string, unknown> = {}) {
  return {
    articleSlug: PUBLISHED,
    authorName: "Amina Patel",
    body: "A clear, specific question about how the review workflow handles scanned pages.",
    ...overrides,
  };
}

async function approvedComment(
  { service, repository }: Harness,
  overrides: Record<string, unknown> = {},
  address = "198.51.100.10"
): Promise<Comment> {
  const result = await service.submit({ payload: submission(overrides), address });
  assert.ok(result.ok, "submission should be accepted");
  const decided = await service.decide(result.id, { action: "approve" }, staff);
  assert.ok(decided.ok);
  const stored = await repository.getComment(result.id);
  assert.ok(stored);
  return stored;
}

test("a visitor comment on a published article is stored pending, never public", async () => {
  const context = harness();
  const result = await context.service.submit({
    payload: submission(),
    address: "198.51.100.10",
  });

  assert.ok(result.ok);
  assert.equal(result.status, "pending");
  assert.deepEqual(await context.service.publicThread(PUBLISHED), []);

  const queue = await context.service.listForModeration({ status: "pending" });
  assert.ok(queue.ok);
  assert.equal(queue.page.totalItems, 1);
  assert.equal(queue.page.items[0]?.authorName, "Amina Patel");
});

test("comments are refused for an article that is not published", async () => {
  const context = harness();
  const result = await context.service.submit({
    payload: submission({ articleSlug: UNPUBLISHED }),
    address: "198.51.100.10",
  });

  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.code, "unknown-article");
});

test("markup, control characters and oversized bodies are refused", async () => {
  const context = harness();
  const cases: Array<[string, Record<string, unknown>]> = [
    ["markup in the body", { body: "<script>alert(1)</script> plus a sentence to pass length." }],
    ["an anchor tag", { body: "Read more <a href=\"https://example.com\">here</a> about this." }],
    ["markup in the name", { authorName: "<b>Amina</b>" }],
    ["a zero-width character", { body: `A body with a hidden​character inside of it here.` }],
    ["a body past the limit", { body: "x".repeat(2_001) }],
    ["a name with no letters", { authorName: "12345" }],
    ["a link in the name", { authorName: "visit www.example.com" }],
    ["an unknown field", { nickname: "extra" }],
  ];

  for (const [label, overrides] of cases) {
    const result = await context.service.submit({
      payload: submission(overrides),
      address: "198.51.100.10",
    });
    assert.equal(result.ok, false, `${label} should be refused`);
    assert.equal(result.ok === false && result.code, "invalid", label);
  }
});

test("the honeypot refusal is indistinguishable from a validation failure", async () => {
  const context = harness();
  const trapped = await context.service.submit({
    payload: submission({ website: "https://spam.example" }),
    address: "198.51.100.10",
  });
  const invalid = await context.service.submit({
    payload: submission({ body: "x" }),
    address: "198.51.100.11",
  });

  assert.equal(trapped.ok, false);
  assert.equal(invalid.ok, false);
  assert.equal(
    trapped.ok === false && trapped.code,
    invalid.ok === false && invalid.code
  );
  // No field-level detail, so the trap is not named back to the sender.
  assert.equal(trapped.ok === false && trapped.issues, undefined);
});

test("normalization folds whitespace so the same text hashes alike", () => {
  const typed = "First line\r\n\r\n\r\n   Second    line   ";
  const pasted = "First line\n\nSecond line";

  assert.equal(normalizeCommentText(typed), pasted);
  assert.equal(hashCommentBody(typed), hashCommentBody(pasted));
});

test("a resubmission of the same body by the same visitor is refused once stored", async () => {
  const context = harness();
  const first = await context.service.submit({ payload: submission(), address: "198.51.100.10" });
  const second = await context.service.submit({
    payload: submission({ body: `  ${submission().body}  ` }),
    address: "198.51.100.10",
  });

  assert.ok(first.ok);
  assert.equal(second.ok, false);
  assert.equal(second.ok === false && second.code, "duplicate");
});

test("a different visitor may post the same text", async () => {
  const context = harness();
  await context.service.submit({ payload: submission(), address: "198.51.100.10" });
  const other = await context.service.submit({ payload: submission(), address: "203.0.113.7" });

  assert.ok(other.ok);
});

test("the burst limiter refuses a flood from one abuse key", async () => {
  const context = harness();
  const results = [];
  for (let index = 0; index < 7; index += 1) {
    results.push(
      await context.service.submit({
        payload: submission({ body: `Distinct comment number ${index} about the workflow.` }),
        address: "198.51.100.10",
      })
    );
  }

  assert.equal(results.filter((result) => result.ok).length, 5);
  const refused = results[5];
  assert.equal(refused.ok, false);
  assert.equal(refused.ok === false && refused.code, "rate-limited");
  assert.ok(refused.ok === false && (refused.retryAfterSeconds ?? 0) > 0);
});

test("the durable daily limit counts stored rows, not process memory", async () => {
  const context = harness();
  for (let index = 0; index < MAX_COMMENTS_PER_DAY; index += 1) {
    const result = await context.service.submit({
      payload: submission({ body: `Comment ${index} with enough words to pass validation.` }),
      address: "198.51.100.10",
    });
    assert.ok(result.ok, `comment ${index} should be accepted`);
    // Past the burst window each time, so only the durable limit can refuse.
    context.advance(11 * 60 * 1000);
  }

  const refused = await context.service.submit({
    payload: submission({ body: "One comment past the daily allowance for this visitor." }),
    address: "198.51.100.10",
  });
  assert.equal(refused.ok, false);
  assert.equal(refused.ok === false && refused.code, "rate-limited");
});

test("spam signals flag a comment for review rather than deciding it", async () => {
  const context = harness();
  const result = await context.service.submit({
    payload: submission({
      body: "Cheap deals https://a.example https://b.example https://c.example www.d.example",
    }),
    address: "198.51.100.10",
  });

  assert.ok(result.ok);
  assert.equal(result.flagged, true);
  assert.equal(result.status, "pending");

  const queue = await context.service.listForModeration({ status: "pending" });
  assert.ok(queue.ok);
  assert.equal(queue.page.items[0]?.moderationReason, "automated-screen:links");
});

test("shouting and repetition are flagged, ordinary prose is not", () => {
  assert.equal(assessSpam({ authorName: "A", body: "THIS IS ENTIRELY SHOUTED TEXT ABOUT NOTHING" }).spam, true);
  assert.equal(assessSpam({ authorName: "A", body: "aaaaaaaaaaaaaaaaaa buy now" }).spam, true);
  assert.equal(
    assessSpam({
      authorName: "A",
      body: "A measured paragraph about redaction review, with one link https://example.com in it.",
    }).spam,
    false
  );
});

test("a reply attaches only to an approved comment on the same article", async () => {
  const context = harness();
  const pending = await context.service.submit({ payload: submission(), address: "198.51.100.10" });
  assert.ok(pending.ok);

  const replyToPending = await context.service.submit({
    payload: submission({ parentId: pending.id, body: "A reply to something not yet approved." }),
    address: "203.0.113.7",
  });
  assert.equal(replyToPending.ok, false);
  assert.equal(replyToPending.ok === false && replyToPending.code, "unknown-parent");

  const approved = await context.service.decide(pending.id, { action: "approve" }, staff);
  assert.ok(approved.ok);

  const reply = await context.service.submit({
    payload: submission({ parentId: pending.id, body: "A reply to something now approved." }),
    address: "203.0.113.7",
  });
  assert.ok(reply.ok);
  assert.equal(reply.status, "pending");
});

test("an unknown or malformed parent is refused without revealing which", async () => {
  const context = harness();
  const unknown = await context.service.submit({
    payload: submission({ parentId: "11111111-1111-4111-8111-111111111111" }),
    address: "198.51.100.10",
  });
  const malformed = await context.service.submit({
    payload: submission({ parentId: "not-a-uuid" }),
    address: "198.51.100.11",
  });

  assert.equal(unknown.ok === false && unknown.code, "unknown-parent");
  assert.equal(malformed.ok === false && malformed.code, "invalid");
});

test("threads stop at the configured depth", async () => {
  const context = harness();
  let parent = await approvedComment(context, {}, "198.51.100.10");

  for (let depth = 1; depth < MAX_THREAD_DEPTH; depth += 1) {
    const reply = await context.service.submit({
      payload: submission({ parentId: parent.id, body: `A reply at depth ${depth} in the thread.` }),
      address: `203.0.113.${depth}`,
    });
    assert.ok(reply.ok, `depth ${depth} should be accepted`);
    const decided = await context.service.decide(reply.id, { action: "approve" }, staff);
    assert.ok(decided.ok);
    parent = decided.comment;
  }

  const tooDeep = await context.service.submit({
    payload: submission({ parentId: parent.id, body: "One level deeper than the limit allows." }),
    address: "203.0.113.99",
  });
  assert.equal(tooDeep.ok, false);
  assert.equal(tooDeep.ok === false && tooDeep.code, "too-deep");
});

test("approval publishes a comment and the thread reads in time order", async () => {
  const context = harness();
  const first = await approvedComment(context, { body: "The earlier of two approved comments." }, "198.51.100.1");
  context.advance(60_000);
  const second = await approvedComment(context, { body: "The later of two approved comments." }, "198.51.100.2");

  const thread = await context.service.publicThread(PUBLISHED);
  assert.deepEqual(
    thread.map((node) => node.id),
    [first.id, second.id]
  );
  assert.equal(countPublicComments(thread), 2);
});

test("a rejected comment is invisible to the public thread", async () => {
  const context = harness();
  const submitted = await context.service.submit({ payload: submission(), address: "198.51.100.10" });
  assert.ok(submitted.ok);
  const rejected = await context.service.decide(
    submitted.id,
    { action: "reject", reason: "off topic" },
    staff
  );

  assert.ok(rejected.ok);
  assert.equal(rejected.comment.status, "rejected");
  assert.deepEqual(await context.service.publicThread(PUBLISHED), []);
});

test("removing a comment with approved replies leaves a tombstone, not a hole", async () => {
  const context = harness();
  const parent = await approvedComment(context, { body: "A parent comment that will be removed." });
  const reply = await context.service.submit({
    payload: submission({ parentId: parent.id, body: "A reply that must survive the removal." }),
    address: "203.0.113.7",
  });
  assert.ok(reply.ok);
  assert.ok((await context.service.decide(reply.id, { action: "approve" }, staff)).ok);

  const removed = await context.service.decide(
    parent.id,
    { action: "remove", reason: "personal data" },
    staff
  );
  assert.ok(removed.ok);

  const thread = await context.service.publicThread(PUBLISHED);
  assert.equal(thread.length, 1);
  assert.equal(thread[0]?.removed, true);
  assert.equal(thread[0]?.body, TOMBSTONE_BODY);
  assert.equal(thread[0]?.authorName, "");
  assert.equal(thread[0]?.replies.length, 1);
  assert.equal(countPublicComments(thread), 1);

  // The removed body is gone from the store, not merely hidden at render time.
  const stored = await context.repository.getComment(parent.id);
  assert.equal(stored?.body, "");
});

test("removing a leaf comment drops it from the thread entirely", async () => {
  const context = harness();
  const comment = await approvedComment(context);
  assert.ok((await context.service.decide(comment.id, { action: "remove" }, staff)).ok);

  assert.deepEqual(await context.service.publicThread(PUBLISHED), []);
});

test("a removed comment is terminal and cannot be reinstated", async () => {
  const context = harness();
  const comment = await approvedComment(context);
  assert.ok((await context.service.decide(comment.id, { action: "remove" }, staff)).ok);

  const reinstated = await context.service.decide(comment.id, { action: "approve" }, staff);
  assert.equal(reinstated.ok, false);
  assert.equal(reinstated.ok === false && reinstated.code, "conflict");
  assert.equal(canTransition("removed", "approved"), false);
});

test("every decision writes an audit event naming the staff identity", async () => {
  const context = harness();
  const submitted = await context.service.submit({ payload: submission(), address: "198.51.100.10" });
  assert.ok(submitted.ok);
  await context.service.decide(submitted.id, { action: "approve" }, staff);
  await context.service.decide(submitted.id, { action: "reject", reason: "duplicate thread" }, staff);

  const history = await context.service.moderationHistory(submitted.id);
  assert.ok(history.ok);
  assert.deepEqual(
    history.events.map((event) => [event.fromStatus, event.toStatus, event.actorLabel]),
    [
      ["pending", "approved", "moderator#4242"],
      ["approved", "rejected", "moderator#4242"],
    ]
  );
  assert.equal(history.events[1]?.reason, "duplicate thread");
  assert.equal(staffLabel(staff), "moderator#4242");
});

test("a staff reply is labelled, published, and recorded as a staff action", async () => {
  const context = harness();
  const parent = await approvedComment(context);
  const reply = await context.service.staffReply(
    parent.id,
    { body: "Thanks for asking — scanned pages go through the same two-pass review." },
    staff
  );

  assert.ok(reply.ok);
  assert.equal(reply.comment.status, "approved");
  assert.equal(reply.comment.isStaff, true);
  assert.equal(reply.comment.staffLogin, "moderator");

  const thread = await context.service.publicThread(PUBLISHED);
  assert.equal(thread[0]?.replies[0]?.isStaff, true);

  const history = await context.service.moderationHistory(reply.comment.id);
  assert.ok(history.ok);
  assert.equal(history.events[0]?.reason, "staff-reply");
  assert.equal(history.events[0]?.actorLabel, "moderator#4242");
});

test("a staff reply requires an approved parent", async () => {
  const context = harness();
  const pending = await context.service.submit({ payload: submission(), address: "198.51.100.10" });
  assert.ok(pending.ok);

  const reply = await context.service.staffReply(pending.id, { body: "Answering early." }, staff);
  assert.equal(reply.ok, false);
  assert.equal(reply.ok === false && reply.code, "unknown-parent");
});

test("a staff reply is still held to the plain-text rule", async () => {
  const context = harness();
  const parent = await approvedComment(context);
  const reply = await context.service.staffReply(
    parent.id,
    { body: "<img src=x onerror=alert(1)> see our docs" },
    staff
  );

  assert.equal(reply.ok, false);
  assert.equal(reply.ok === false && reply.code, "invalid");
});

test("only an approved comment can be reported", async () => {
  const context = harness();
  const pending = await context.service.submit({ payload: submission(), address: "198.51.100.10" });
  assert.ok(pending.ok);

  const early = await context.service.report({
    payload: { commentId: pending.id, reason: "spam" },
    address: "203.0.113.7",
  });
  assert.equal(early.ok === false && early.code, "unknown-comment");

  assert.ok((await context.service.decide(pending.id, { action: "approve" }, staff)).ok);
  const report = await context.service.report({
    payload: { commentId: pending.id, reason: "privacy", detail: "Names a third party." },
    address: "203.0.113.7",
  });
  assert.ok(report.ok);
});

test("a report raises the open-report count in the moderation queue", async () => {
  const context = harness();
  const comment = await approvedComment(context);
  await context.service.report({
    payload: { commentId: comment.id, reason: "abuse" },
    address: "203.0.113.7",
  });

  const queue = await context.service.listForModeration({ status: "approved" });
  assert.ok(queue.ok);
  assert.equal(queue.page.items[0]?.openReports, 1);
});

test("reports are rate limited per reporter", async () => {
  const context = harness();
  const comment = await approvedComment(context);
  const outcomes = [];
  for (let index = 0; index < 12; index += 1) {
    outcomes.push(
      await context.service.report({
        payload: { commentId: comment.id, reason: "spam" },
        address: "203.0.113.7",
      })
    );
  }

  assert.equal(outcomes.filter((outcome) => outcome.ok).length, 10);
  assert.equal(outcomes[10]?.ok === false && outcomes[10].code, "rate-limited");
});

test("moderation search and filtering narrow the queue", async () => {
  const context = harness();
  await context.service.submit({
    payload: submission({ authorName: "Amina Patel", body: "A question about scanned court bundles." }),
    address: "198.51.100.1",
  });
  await context.service.submit({
    payload: submission({ authorName: "Joel Mwangi", body: "A note about audio redaction turnaround." }),
    address: "198.51.100.2",
  });

  const byName = await context.service.listForModeration({ status: "pending", search: "amina" });
  const byBody = await context.service.listForModeration({ status: "pending", search: "AUDIO" });
  const byArticle = await context.service.listForModeration({
    status: "all",
    articleSlug: "some-other-article",
  });

  assert.ok(byName.ok && byBody.ok && byArticle.ok);
  assert.equal(byName.page.totalItems, 1);
  assert.equal(byName.page.items[0]?.authorName, "Amina Patel");
  assert.equal(byBody.page.totalItems, 1);
  assert.equal(byBody.page.items[0]?.authorName, "Joel Mwangi");
  assert.equal(byArticle.page.totalItems, 0);
});

test("the moderation queue paginates newest first", async () => {
  const context = harness();
  for (let index = 0; index < 3; index += 1) {
    await context.service.submit({
      payload: submission({ body: `Queued comment number ${index} for pagination.` }),
      address: `198.51.100.${index + 1}`,
    });
    context.advance(1_000);
  }

  const first = await context.service.listForModeration({ status: "pending", page: 1, pageSize: 2 });
  const second = await context.service.listForModeration({ status: "pending", page: 2, pageSize: 2 });

  assert.ok(first.ok && second.ok);
  assert.equal(first.page.totalItems, 3);
  assert.equal(first.page.totalPages, 2);
  assert.equal(first.page.items.length, 2);
  assert.equal(second.page.items.length, 1);
  assert.ok(
    Date.parse(first.page.items[0]!.createdAt) > Date.parse(second.page.items[0]!.createdAt)
  );
});

test("an invalid moderation query or decision is refused", async () => {
  const context = harness();
  const badStatus = await context.service.listForModeration({ status: "everything" });
  const badAction = await context.service.decide(
    "11111111-1111-4111-8111-111111111111",
    { action: "obliterate" },
    staff
  );

  assert.equal(badStatus.ok === false && badStatus.code, "invalid");
  assert.equal(badAction.ok === false && badAction.code, "invalid");
});

test("a decision on a comment that does not exist is reported as unknown", async () => {
  const context = harness();
  const missing = await context.service.decide(
    "11111111-1111-4111-8111-111111111111",
    { action: "approve" },
    staff
  );

  assert.equal(missing.ok === false && missing.code, "unknown-comment");
});

test("the public thread never carries moderation state or abuse keys", async () => {
  const context = harness();
  const comment = await approvedComment(context);
  const thread = await context.service.publicThread(PUBLISHED);

  const serialized = JSON.stringify(thread);
  assert.match(serialized, new RegExp(comment.id));
  for (const forbidden of ["authorKey", "bodyHash", "status", "moderationReason", "moderatorLabel"]) {
    assert.doesNotMatch(serialized, new RegExp(forbidden), `${forbidden} must not be published`);
  }
});

test("an orphan reply is dropped rather than promoted to the top of the thread", () => {
  const base = {
    articleSlug: PUBLISHED,
    depth: 0,
    authorName: "Amina",
    body: "visible",
    status: "approved" as const,
    isStaff: false,
    staffLogin: null,
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-10-15T09:00:00.000Z",
    moderatedAt: null,
    moderatorLabel: null,
    moderationReason: null,
  };
  const orphan: Comment = {
    ...base,
    id: "22222222-2222-4222-8222-222222222222",
    parentId: "33333333-3333-4333-8333-333333333333",
    depth: 1,
  };

  assert.deepEqual(buildPublicThread([orphan]), []);
});

test("the abuse key is a keyed digest, not the address, and rotates with the secret", () => {
  const address = "198.51.100.10";
  const key = deriveAuthorKey(address, SECRET);

  assert.doesNotMatch(key, /198\.51\.100\.10/);
  assert.equal(key, deriveAuthorKey(address, SECRET));
  assert.notEqual(key, deriveAuthorKey(address, "a-different-secret"));
  assert.notEqual(key, deriveAuthorKey("203.0.113.7", SECRET));
  assert.throws(() => deriveAuthorKey(address, ""), /abuse-key secret/);
});

test("only the first forwarded hop is trusted for the abuse key", () => {
  const forged = new Request("https://saferedact.test/api/comments", {
    headers: { "x-forwarded-for": "198.51.100.10, 203.0.113.7, 192.0.2.1" },
  });
  const none = new Request("https://saferedact.test/api/comments");

  assert.equal(requestAddress(forged), "198.51.100.10");
  assert.equal(requestAddress(none), "unattributed");
});
