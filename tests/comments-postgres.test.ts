import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import { MemoryCommentsRepository } from "../src/lib/comments/memory-repository";
import {
  PostgresCommentsRepository,
  createPool,
  migrate,
  purgeExpiredComments,
  readPostgresSettings,
} from "../src/lib/comments/postgres";
import type { CommentsRepository } from "../src/lib/comments/repository";
import type { NewComment } from "../src/lib/comments/types";

const settings = readPostgresSettings(process.env);
const skipPostgres = {
  skip: settings
    ? false
    : "COMMENTS_DATABASE_URL is not configured; the PostgreSQL contract was not exercised.",
};

function newComment(overrides: Partial<NewComment> = {}): NewComment {
  const body = overrides.body ?? "A considered remark about the review workflow.";
  return {
    articleSlug: "contract-article",
    parentId: null,
    depth: 0,
    authorName: "Test Visitor",
    body,
    status: "pending",
    isStaff: false,
    staffLogin: null,
    moderationReason: null,
    authorKey: "author-key-1",
    bodyHash: createHash("sha256").update(body).digest("hex"),
    ...overrides,
  };
}

/**
 * One contract, run against both adapters. The in-memory double exists so the
 * domain rules can be tested without a database; it is only trustworthy as a stand
 * in while it behaves identically to the adapter that production uses, so the same
 * assertions run against both.
 */
async function assertRepositoryContract(repository: CommentsRepository) {
  // Round trip, and the abuse keys never come back out.
  const created = await repository.createComment(newComment());
  assert.equal(created.status, "pending");
  assert.equal(created.articleSlug, "contract-article");
  assert.equal((created as unknown as Record<string, unknown>).authorKey, undefined);
  assert.equal((created as unknown as Record<string, unknown>).bodyHash, undefined);
  assert.deepEqual(await repository.getComment(created.id), created);
  assert.equal(await repository.getComment("00000000-0000-4000-8000-000000000000"), null);

  // A pending comment is not public.
  assert.deepEqual(await repository.listPublicComments("contract-article"), []);

  // A missing comment is distinguishable from a refused transition.
  assert.equal(
    await repository.applyDecision({
      commentId: "00000000-0000-4000-8000-000000000000",
      action: "approve",
      actorLabel: "editor#1",
      reason: null,
    }),
    null
  );

  const approved = await repository.applyDecision({
    commentId: created.id,
    action: "approve",
    actorLabel: "editor#1",
    reason: null,
  });
  assert.equal(approved?.status, "approved");
  assert.equal(approved?.moderatorLabel, "editor#1");
  assert.ok(approved?.moderatedAt);

  const publicThread = await repository.listPublicComments("contract-article");
  assert.deepEqual(publicThread.map((comment) => comment.id), [created.id]);

  // Exactly one audit event per applied transition.
  const events = await repository.listModerationEvents(created.id);
  assert.equal(events.length, 1);
  assert.equal(events[0].action, "approve");
  assert.equal(events[0].fromStatus, "pending");
  assert.equal(events[0].toStatus, "approved");
  assert.equal(events[0].actorLabel, "editor#1");

  // Abuse counters see the comment regardless of its status.
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  assert.equal(await repository.countCommentsSince({ authorKey: "author-key-1", since: dayAgo }), 1);
  assert.equal(await repository.countCommentsSince({ authorKey: "someone-else", since: dayAgo }), 0);

  const duplicate = await repository.findRecentDuplicate({
    articleSlug: "contract-article",
    authorKey: "author-key-1",
    bodyHash: created.id ? createHash("sha256").update("A considered remark about the review workflow.").digest("hex") : "",
    since: dayAgo,
  });
  assert.equal(duplicate?.id, created.id);
  assert.equal(
    await repository.findRecentDuplicate({
      articleSlug: "contract-article",
      authorKey: "author-key-1",
      bodyHash: "a-different-hash",
      since: dayAgo,
    }),
    null
  );

  // Reports, and their resolution when the comment is moderated.
  const report = await repository.createReport({
    commentId: created.id,
    reason: "spam",
    detail: null,
    reporterKey: "reporter-key-1",
  });
  assert.equal(report.status, "open");
  assert.equal((report as unknown as Record<string, unknown>).reporterKey, undefined);
  assert.equal(await repository.countReportsSince({ reporterKey: "reporter-key-1", since: dayAgo }), 1);

  const queue = await repository.listForModeration({ status: "approved" });
  assert.equal(queue.totalItems, 1);
  assert.equal(queue.items[0].openReports, 1);

  // Search matches the author, body and slug; a miss returns an empty page.
  assert.equal((await repository.listForModeration({ status: "all", search: "considered" })).totalItems, 1);
  assert.equal((await repository.listForModeration({ status: "all", search: "zzzznomatch" })).totalItems, 0);

  // Removal is a tombstone: the row stays, the content goes.
  const removed = await repository.applyDecision({
    commentId: created.id,
    action: "remove",
    actorLabel: "editor#1",
    reason: "off-topic",
  });
  assert.equal(removed?.status, "removed");
  assert.equal(removed?.body, "");
  assert.equal(removed?.authorName, "");

  const afterRemoval = await repository.listPublicComments("contract-article");
  assert.deepEqual(afterRemoval.map((comment) => comment.id), [created.id]);
  assert.equal(afterRemoval[0].body, "");

  // `removed` is terminal, so a further decision leaves the comment untouched and
  // writes no second event.
  const refused = await repository.applyDecision({
    commentId: created.id,
    action: "approve",
    actorLabel: "editor#2",
    reason: null,
  });
  assert.equal(refused?.status, "removed");
  assert.equal((await repository.listModerationEvents(created.id)).length, 2);

  // Pending and rejected never reach the public thread.
  const pending = await repository.createComment(newComment({ body: "A second pending remark about review." }));
  const rejected = await repository.createComment(newComment({ body: "A third remark, rejected on review." }));
  await repository.applyDecision({
    commentId: rejected.id,
    action: "reject",
    actorLabel: "editor#1",
    reason: null,
  });
  const publicIds = (await repository.listPublicComments("contract-article")).map((c) => c.id);
  assert.ok(!publicIds.includes(pending.id));
  assert.ok(!publicIds.includes(rejected.id));

  // Pagination reports the whole set while returning one page of it.
  const firstPage = await repository.listForModeration({ status: "all", page: 1, pageSize: 2 });
  assert.equal(firstPage.totalItems, 3);
  assert.equal(firstPage.items.length, 2);
  assert.equal(firstPage.totalPages, 2);
}

test("the in-memory repository satisfies the comments contract", async () => {
  await assertRepositoryContract(new MemoryCommentsRepository());
});

test("the PostgreSQL repository satisfies the same contract", skipPostgres, async () => {
  const pool = createPool(settings!);
  try {
    await migrate(pool);
    // A contract run owns the fixture article; nothing else is touched.
    await pool.query("delete from comments where article_slug = $1", ["contract-article"]);
    await assertRepositoryContract(new PostgresCommentsRepository(pool));
  } finally {
    await pool.query("delete from comments where article_slug = $1", ["contract-article"]).catch(() => {});
    await pool.end();
  }
});

test("retention deletes rejected comments and unlinks tombstones", skipPostgres, async () => {
  const pool = createPool(settings!);
  const repository = new PostgresCommentsRepository(pool);
  try {
    await migrate(pool);
    await pool.query("delete from comments where article_slug = $1", ["retention-article"]);

    const stale = await repository.createComment(
      newComment({ articleSlug: "retention-article", body: "A remark that will be rejected on review." })
    );
    await repository.applyDecision({
      commentId: stale.id,
      action: "reject",
      actorLabel: "editor#1",
      reason: null,
    });
    const tombstoned = await repository.createComment(
      newComment({ articleSlug: "retention-article", body: "A remark that will be removed on review." })
    );
    await repository.applyDecision({
      commentId: tombstoned.id,
      action: "remove",
      actorLabel: "editor#1",
      reason: null,
    });
    // Age both past the window without waiting for it.
    await pool.query(
      "update comments set created_at = now() - interval '400 days', moderated_at = now() - interval '400 days' where article_slug = $1",
      ["retention-article"]
    );

    const result = await purgeExpiredComments(pool, { retentionDays: 180 });
    assert.ok(result.rejectedDeleted >= 1);
    assert.ok(result.tombstonesAnonymised >= 1);

    // The rejected comment is gone; the tombstone keeps its place but is unlinkable.
    assert.equal(await repository.getComment(stale.id), null);
    const survivor = await repository.getComment(tombstoned.id);
    assert.equal(survivor?.status, "removed");
    const keys = await pool.query<{ author_key: string }>(
      "select author_key from comments where id = $1",
      [tombstoned.id]
    );
    assert.equal(keys.rows[0].author_key, "");
  } finally {
    await pool.query("delete from comments where article_slug = $1", ["retention-article"]).catch(() => {});
    await pool.end();
  }
});
