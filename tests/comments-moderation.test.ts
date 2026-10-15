import assert from "node:assert/strict";
import test from "node:test";

import { createRateLimiter } from "../src/lib/comments/abuse";
import { MemoryCommentsRepository } from "../src/lib/comments/memory-repository";
import {
  createModerationDecisionHandler,
  createModerationHistoryHandler,
  createModerationQueueHandler,
  createStaffReplyHandler,
} from "../src/lib/comments/moderation-http";
import { CommentsService } from "../src/lib/comments/service";
import type { ArticleGate } from "../src/lib/comments/service";
import {
  authorizeStaffRequest,
  bearerToken,
  readStaffAuthSettings,
  resetStaffAuthCache,
} from "../src/lib/comments/staff-auth";

const publishedSlug = "practical-redaction-review-guide";
const articles: ArticleGate = { async isPublished(slug) { return slug === publishedSlug; } };
const staff = { id: 101, login: "approved-editor" };

function buildService() {
  const repository = new MemoryCommentsRepository();
  return {
    repository,
    service: new CommentsService({
      repository,
      articles,
      abuseKeySecret: "a-development-abuse-secret-of-sufficient-length",
      submissionLimiter: createRateLimiter({ limit: 50, windowMs: 600_000 }),
      reportLimiter: createRateLimiter({ limit: 50, windowMs: 600_000 }),
    }),
  };
}

const allowStaff = async () => ({ ok: true as const, staff });
const denyStaff = async () => ({ ok: false as const });

function moderationRequest(url: string, body?: unknown) {
  return new Request(`http://localhost${url}`, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? {} : { "content-type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

async function seedApproved(repository: MemoryCommentsRepository, service: CommentsService) {
  const submitted = await service.submit({
    payload: {
      articleSlug: publishedSlug,
      parentId: null,
      authorName: "Test Visitor",
      body: "A considered remark about the documented review workflow.",
    },
    address: "198.51.100.7",
  });
  assert.ok(submitted.ok);
  await repository.applyDecision({
    commentId: submitted.id,
    action: "approve",
    actorLabel: "editor#1",
    reason: null,
  });
  return submitted.id;
}

// --- Authorization ----------------------------------------------------------

test("every moderation endpoint refuses an unverified caller identically", async () => {
  const { service } = buildService();
  const deps = { service, authorize: denyStaff };

  const responses = [
    await createModerationQueueHandler(deps)(moderationRequest("/api/moderation/comments")),
    await createModerationDecisionHandler(deps)(
      moderationRequest("/api/moderation/comments?comment=x", { action: "approve" })
    ),
    await createStaffReplyHandler(deps)(
      moderationRequest("/api/moderation/replies?parent=x", { body: "A staff reply." })
    ),
    await createModerationHistoryHandler(deps)(moderationRequest("/api/moderation/history?comment=x")),
  ];

  for (const response of responses) {
    const result = await response.json();
    assert.equal(response.status, 403);
    assert.equal(result.code, "denied");
    // One wording for every failure: an unknown token and a known token without
    // write access must not be distinguishable.
    assert.equal(result.message, "Moderation requires a verified staff account.");
    assert.equal(response.headers.get("www-authenticate"), "Bearer");
  }
});

test("a bearer token is read from the header and nothing else", () => {
  const read = (headers: Record<string, string>) =>
    bearerToken(new Request("http://localhost/api/moderation/comments", { headers }));

  assert.equal(read({ authorization: "Bearer gho-development-token" }), "gho-development-token");
  assert.equal(read({ authorization: "bearer gho-development-token" }), "gho-development-token");
  assert.equal(read({ authorization: "Basic gho-development-token" }), null);
  assert.equal(read({ authorization: "Bearer " }), null);
  assert.equal(read({ authorization: `Bearer ${"x".repeat(2000)}` }), null);
  assert.equal(read({}), null);
  // A cookie is never a credential here, which is what makes CSRF a non-issue.
  assert.equal(read({ cookie: "token=gho-development-token" }), null);
});

test("authorization requires the allowlist and repository write access", async () => {
  resetStaffAuthCache();
  const settings = readStaffAuthSettings({
    COMMENTS_STAFF_GITHUB_USER_IDS: "101",
    CMS_GITHUB_REPOSITORY: "Safe-Redact/Marketing-Site",
  })!;

  const githubFor = (user: unknown, repository: unknown) =>
    (async (url: string) =>
      new Response(JSON.stringify(String(url).endsWith("/user") ? user : repository), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })) as unknown as typeof fetch;

  const request = (token = "gho-development-token") =>
    new Request("http://localhost/api/moderation/comments", {
      headers: { authorization: `Bearer ${token}` },
    });

  const approvedUser = { id: 101, login: "approved-editor", type: "User" };
  const writeRepository = {
    full_name: "Safe-Redact/Marketing-Site",
    permissions: { push: true },
  };

  const allowed = await authorizeStaffRequest(request("token-allowed"), {
    settings,
    fetchImpl: githubFor(approvedUser, writeRepository),
  });
  assert.deepEqual(allowed, { ok: true, staff: { id: 101, login: "approved-editor" } });

  for (const [label, user, repository] of [
    ["id not on the allowlist", { id: 999, login: "someone", type: "User" }, writeRepository],
    ["an organization, not a user", { id: 101, login: "org", type: "Organization" }, writeRepository],
    ["read-only on the repository", approvedUser, { full_name: "Safe-Redact/Marketing-Site", permissions: { push: false } }],
    ["a different repository", approvedUser, { full_name: "Someone-Else/Fork", permissions: { push: true } }],
  ] as const) {
    resetStaffAuthCache();
    const result = await authorizeStaffRequest(request(`token-${label}`), {
      settings,
      fetchImpl: githubFor(user, repository),
    });
    assert.deepEqual(result, { ok: false, reason: "denied" }, label);
  }

  // A GitHub outage must never be mistaken for authorization.
  resetStaffAuthCache();
  const broken = await authorizeStaffRequest(request("token-broken"), {
    settings,
    fetchImpl: (async () => {
      throw new Error("socket closed");
    }) as unknown as typeof fetch,
  });
  assert.deepEqual(broken, { ok: false, reason: "denied" });
});

test("staff settings fail closed on a half or malformed configuration", () => {
  assert.equal(readStaffAuthSettings({}), null);
  for (const environment of [
    { COMMENTS_STAFF_GITHUB_USER_IDS: "101" },
    { CMS_GITHUB_REPOSITORY: "Safe-Redact/Marketing-Site" },
    { COMMENTS_STAFF_GITHUB_USER_IDS: "approved-editor", CMS_GITHUB_REPOSITORY: "Safe-Redact/Marketing-Site" },
    { COMMENTS_STAFF_GITHUB_USER_IDS: "101", CMS_GITHUB_REPOSITORY: "not a repository" },
  ]) {
    assert.throws(() => readStaffAuthSettings(environment), /configuration error/i, JSON.stringify(environment));
  }
});

// --- Moderation actions -----------------------------------------------------

test("the queue is readable and searchable by a verified moderator", async () => {
  const { service, repository } = buildService();
  await seedApproved(repository, service);
  await service.submit({
    payload: {
      articleSlug: publishedSlug,
      parentId: null,
      authorName: "Second Visitor",
      body: "A second remark that stays pending for review.",
    },
    address: "203.0.113.9",
  });

  const queue = createModerationQueueHandler({ service, authorize: allowStaff });
  const pending = await (await queue(moderationRequest("/api/moderation/comments?status=pending"))).json();
  assert.equal(pending.page.totalItems, 1);

  const searched = await (
    await queue(moderationRequest("/api/moderation/comments?status=all&search=second"))
  ).json();
  assert.equal(searched.page.totalItems, 1);
  assert.equal(searched.page.items[0].authorName, "Second Visitor");

  const empty = await (
    await queue(moderationRequest("/api/moderation/comments?status=all&search=zzzznomatch"))
  ).json();
  assert.equal(empty.page.totalItems, 0);
});

test("a decision is applied, audited against the verified identity, and refused when impossible", async () => {
  const { service, repository } = buildService();
  const submitted = await service.submit({
    payload: {
      articleSlug: publishedSlug,
      parentId: null,
      authorName: "Test Visitor",
      body: "A remark that will be approved then removed.",
    },
    address: "198.51.100.7",
  });
  assert.ok(submitted.ok);

  const decide = createModerationDecisionHandler({ service, authorize: allowStaff });
  const history = createModerationHistoryHandler({ service, authorize: allowStaff });

  const approved = await decide(
    moderationRequest(`/api/moderation/comments?comment=${submitted.id}`, { action: "approve" })
  );
  assert.equal(approved.status, 200);
  assert.equal((await approved.json()).comment.status, "approved");

  const removed = await decide(
    moderationRequest(`/api/moderation/comments?comment=${submitted.id}`, {
      action: "remove",
      reason: "off-topic",
    })
  );
  assert.equal((await removed.json()).comment.body, "");

  // `removed` is terminal: a further decision is a conflict, not a silent no-op.
  const refused = await decide(
    moderationRequest(`/api/moderation/comments?comment=${submitted.id}`, { action: "approve" })
  );
  assert.equal(refused.status, 409);
  assert.equal((await refused.json()).code, "conflict");

  const events = (await (await history(moderationRequest(`/api/moderation/history?comment=${submitted.id}`))).json())
    .events;
  assert.equal(events.length, 2);
  // The audit names the verified GitHub identity, never a client-supplied label.
  for (const event of events) assert.equal(event.actorLabel, "approved-editor#101");

  const unknown = await decide(
    moderationRequest("/api/moderation/comments?comment=00000000-0000-4000-8000-000000000000", {
      action: "approve",
    })
  );
  assert.equal(unknown.status, 404);
  assert.equal(repository instanceof MemoryCommentsRepository, true);
});

test("a staff reply is published under the verified identity and marked as staff", async () => {
  const { service, repository } = buildService();
  const parentId = await seedApproved(repository, service);

  const reply = createStaffReplyHandler({ service, authorize: allowStaff });
  const response = await reply(
    moderationRequest(`/api/moderation/replies?parent=${parentId}`, {
      body: "Thank you for raising this; the review step is documented in the guide.",
    })
  );
  const result = await response.json();

  assert.equal(response.status, 201);
  assert.equal(result.comment.isStaff, true);
  assert.equal(result.comment.staffLogin, "approved-editor");
  assert.equal(result.comment.status, "approved");
  assert.equal(result.comment.authorName, "approved-editor");

  // It appears in the public thread beneath its parent, flagged as staff.
  const thread = await service.publicThread(publishedSlug);
  assert.equal(thread.length, 1);
  assert.equal(thread[0].replies.length, 1);
  assert.equal(thread[0].replies[0].isStaff, true);

  // A reply to something that is not an approved comment is refused.
  const orphan = await reply(
    moderationRequest("/api/moderation/replies?parent=00000000-0000-4000-8000-000000000000", {
      body: "A reply to nothing at all.",
    })
  );
  assert.equal(orphan.status, 404);
});

test("moderation responses are never cached", async () => {
  const { service, repository } = buildService();
  await seedApproved(repository, service);
  const queue = createModerationQueueHandler({ service, authorize: allowStaff });

  const response = await queue(moderationRequest("/api/moderation/comments?status=all"));
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("moderation is unavailable, not merely denied, when comments are switched off", async () => {
  const queue = createModerationQueueHandler({ service: null, authorize: allowStaff });
  const response = await queue(moderationRequest("/api/moderation/comments"));
  const result = await response.json();

  assert.equal(response.status, 503);
  assert.equal(result.code, "disabled");
  assert.doesNotMatch(result.message, /COMMENTS_DATABASE_URL|secret|postgres/i);
});
