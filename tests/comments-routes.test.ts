import assert from "node:assert/strict";
import test from "node:test";

import { MemoryCommentsRepository } from "../src/lib/comments/memory-repository";
import { createRateLimiter } from "../src/lib/comments/abuse";
import {
  createListThreadHandler,
  createReportCommentHandler,
  createSubmitCommentHandler,
} from "../src/lib/comments/http";
import { CommentsService } from "../src/lib/comments/service";
import type { ArticleGate } from "../src/lib/comments/service";

const publishedSlug = "practical-redaction-review-guide";

const articles: ArticleGate = {
  async isPublished(slug: string) {
    return slug === publishedSlug;
  },
};

function buildService(repository = new MemoryCommentsRepository()) {
  return {
    repository,
    service: new CommentsService({
      repository,
      articles,
      abuseKeySecret: "a-development-abuse-secret-of-sufficient-length",
      submissionLimiter: createRateLimiter({ limit: 3, windowMs: 600_000 }),
      reportLimiter: createRateLimiter({ limit: 5, windowMs: 600_000 }),
    }),
  };
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/comments", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.7", ...headers },
    body: JSON.stringify(body),
  });
}

const validComment = {
  articleSlug: publishedSlug,
  parentId: null,
  authorName: "Test Visitor",
  body: "A considered remark about the documented review workflow.",
};

test("comments are refused outright when the deployment has no database", async () => {
  const submit = createSubmitCommentHandler({ service: null });
  const report = createReportCommentHandler({ service: null });
  const list = createListThreadHandler({ service: null });

  for (const response of [
    await submit(post(validComment)),
    await report(post({ commentId: "x", reason: "spam" })),
    await list(new Request(`http://localhost/api/comments?article=${publishedSlug}`)),
  ]) {
    const result = await response.json();
    assert.equal(response.status, 503);
    assert.equal(result.ok, false);
    assert.equal(result.code, "disabled");
    // Nothing is accepted into nowhere, and the visitor is told plainly.
    assert.doesNotMatch(result.message, /COMMENTS_DATABASE_URL|secret|postgres/i);
  }
});

test("an accepted comment is held for moderation and never appears in the public thread", async () => {
  const { service } = buildService();
  const submit = createSubmitCommentHandler({ service });
  const list = createListThreadHandler({ service });

  const response = await submit(post(validComment));
  const result = await response.json();

  assert.equal(response.status, 202);
  assert.equal(result.ok, true);
  assert.equal(result.status, "pending");
  assert.match(result.message, /moderation/i);

  const thread = await (
    await list(new Request(`http://localhost/api/comments?article=${publishedSlug}`))
  ).json();
  assert.deepEqual(thread.comments, []);
});

test("an approved comment becomes public and carries no moderation data", async () => {
  const { service, repository } = buildService();
  const submit = createSubmitCommentHandler({ service });
  const list = createListThreadHandler({ service });

  const created = await (await submit(post(validComment))).json();
  await repository.applyDecision({
    commentId: created.id,
    action: "approve",
    actorLabel: "editor#1",
    reason: null,
  });

  const thread = await (
    await list(new Request(`http://localhost/api/comments?article=${publishedSlug}`))
  ).json();

  assert.equal(thread.comments.length, 1);
  const node = thread.comments[0];
  assert.equal(node.authorName, "Test Visitor");
  assert.equal(node.removed, false);
  assert.deepEqual(node.replies, []);
  // The public shape carries no status, no moderator and no abuse key.
  for (const leaked of ["status", "authorKey", "moderatorLabel", "moderationReason", "staffLogin"]) {
    assert.equal(node[leaked], undefined, leaked);
  }
});

test("comments are refused on an article that is not published", async () => {
  const { service } = buildService();
  const submit = createSubmitCommentHandler({ service });

  const response = await submit(post({ ...validComment, articleSlug: "not-a-real-article" }));
  const result = await response.json();

  assert.equal(response.status, 404);
  assert.equal(result.code, "unknown-article");
});

test("the honeypot is refused exactly like a validation miss", async () => {
  const { service } = buildService();
  const submit = createSubmitCommentHandler({ service });

  const honeypot = await submit(post({ ...validComment, website: "http://spam.example" }));
  const short = await submit(post({ ...validComment, body: "x" }));

  assert.equal(honeypot.status, 400);
  assert.equal(short.status, 400);
  const honeypotBody = await honeypot.json();
  // Identical code and wording, so a sender cannot tell which control caught it.
  assert.equal(honeypotBody.code, "invalid");
  assert.equal(honeypotBody.issues, undefined);
});

test("a burst from one address is rate limited with a retry hint", async () => {
  const { service } = buildService();
  const submit = createSubmitCommentHandler({ service });

  const statuses: number[] = [];
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await submit(post({ ...validComment, body: `A distinct remark number ${attempt}.` }));
    statuses.push(response.status);
    if (response.status === 429) {
      assert.ok(Number(response.headers.get("retry-after")) > 0);
      // A rate-limit answer says nothing a sender could tune against.
      assert.equal((await response.json()).issues, undefined);
      break;
    }
  }
  assert.ok(statuses.includes(429), `expected a 429, saw ${statuses.join(",")}`);
});

test("oversized and wrongly typed bodies are refused before the domain sees them", async () => {
  const { service } = buildService();
  const submit = createSubmitCommentHandler({ service });

  const oversized = await submit(post({ ...validComment, body: "x".repeat(12_000) }));
  const wrongType = await submit(
    new Request("http://localhost/api/comments", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "not json",
    }) as never
  );

  assert.equal(oversized.status, 413);
  assert.equal(wrongType.status, 415);
});

test("the thread endpoint requires a usable article slug", async () => {
  const { service } = buildService();
  const list = createListThreadHandler({ service });

  for (const query of ["", "?article=", "?article=Not%20A%20Slug", `?article=${"x".repeat(200)}`]) {
    const response = await list(new Request(`http://localhost/api/comments${query}`));
    assert.equal(response.status, 400, query);
  }
});

test("reporting an unknown comment is refused and a valid report is accepted", async () => {
  const { service, repository } = buildService();
  const submit = createSubmitCommentHandler({ service });
  const report = createReportCommentHandler({ service });

  const created = await (await submit(post(validComment))).json();
  await repository.applyDecision({
    commentId: created.id,
    action: "approve",
    actorLabel: "editor#1",
    reason: null,
  });

  const unknown = await report(
    post({ commentId: "00000000-0000-4000-8000-000000000000", reason: "spam", detail: null })
  );
  assert.equal(unknown.status, 404);

  const accepted = await report(post({ commentId: created.id, reason: "spam", detail: null }));
  const body = await accepted.json();
  assert.equal(accepted.status, 202);
  assert.equal(body.ok, true);
  assert.match(body.message, /reported/i);

  // The report is visible to moderation, not to the public thread.
  const queue = await repository.listForModeration({ status: "approved" });
  assert.equal(queue.items[0].openReports, 1);
});

test("every comment response forbids caching", async () => {
  const { service } = buildService();
  const submit = createSubmitCommentHandler({ service });
  const list = createListThreadHandler({ service });

  const responses = [
    await submit(post(validComment)),
    await list(new Request(`http://localhost/api/comments?article=${publishedSlug}`)),
  ];
  for (const response of responses) {
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});
