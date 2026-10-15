import { readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import type { PoolClient } from "pg";
import { canTransition } from "../policy";
import type { CommentsRepository } from "../repository";
import type {
  Comment,
  CommentReport,
  ModerationComment,
  ModerationDecision,
  ModerationEvent,
  ModerationPage,
  ModerationQuery,
  NewComment,
  NewReport,
} from "../types";

const COMMENT_COLUMNS = [
  "id",
  "article_slug",
  "parent_id",
  "depth",
  "author_name",
  "body",
  "status",
  "is_staff",
  "staff_login",
  "created_at",
  "updated_at",
  "moderated_at",
  "moderator_label",
  "moderation_reason",
] as const;

const commentColumns = COMMENT_COLUMNS.join(", ");
const qualifiedCommentColumns = COMMENT_COLUMNS.map((column) => `c.${column}`).join(", ");

interface CommentRow {
  id: string;
  article_slug: string;
  parent_id: string | null;
  depth: number;
  author_name: string;
  body: string;
  status: Comment["status"];
  is_staff: boolean;
  staff_login: string | null;
  created_at: Date;
  updated_at: Date;
  moderated_at: Date | null;
  moderator_label: string | null;
  moderation_reason: string | null;
  open_reports?: string | number;
}

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    articleSlug: row.article_slug,
    parentId: row.parent_id,
    depth: row.depth,
    authorName: row.author_name,
    body: row.body,
    status: row.status,
    isStaff: row.is_staff,
    staffLogin: row.staff_login,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    moderatedAt: row.moderated_at?.toISOString() ?? null,
    moderatorLabel: row.moderator_label,
    moderationReason: row.moderation_reason,
  };
}

function targetStatus(action: ModerationDecision["action"]): Comment["status"] {
  if (action === "approve") return "approved";
  if (action === "reject") return "rejected";
  return "removed";
}

export interface PostgresRepositoryOptions {
  connectionString: string;
  /** Managed PostgreSQL almost always terminates TLS; a local cluster usually does not. */
  ssl?: boolean;
  maxConnections?: number;
}

/**
 * Reads connection settings from the environment, or returns null when the database
 * is not configured, so the caller can refuse submissions rather than accept them
 * into nowhere.
 */
export function readPostgresSettings(
  environment: Record<string, string | undefined>
): PostgresRepositoryOptions | null {
  const connectionString = environment.COMMENTS_DATABASE_URL?.trim();
  if (!connectionString) return null;

  let parsed: URL;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error("Comments configuration error: COMMENTS_DATABASE_URL must be a postgres:// URL.");
  }
  if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
    throw new Error("Comments configuration error: COMMENTS_DATABASE_URL must be a postgres:// URL.");
  }

  const loopback = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  const sslSetting = environment.COMMENTS_DATABASE_SSL?.trim().toLowerCase();
  // A managed host is reached over TLS unless the operator opts out explicitly.
  const ssl = sslSetting ? sslSetting !== "false" : !loopback;

  return { connectionString, ssl };
}

export function createPool(options: PostgresRepositoryOptions): Pool {
  return new Pool({
    connectionString: options.connectionString,
    ssl: options.ssl ? { rejectUnauthorized: true } : undefined,
    max: options.maxConnections ?? 5,
  });
}

/** Applies schema.sql. Idempotent, so it is safe to run on every deploy. */
export async function migrate(pool: Pool): Promise<void> {
  const schemaPath = path.join(process.cwd(), "src", "lib", "comments", "postgres", "schema.sql");
  await pool.query(await readFile(schemaPath, "utf8"));
}

/**
 * The PostgreSQL CommentsRepository.
 *
 * Held to the same contract as the in-memory double: pending and rejected comments
 * never leave listPublicComments, a refused transition leaves the comment
 * untouched, and every applied decision writes exactly one audit event.
 * tests/comments-postgres.test.ts runs both adapters through identical assertions,
 * so a divergence fails rather than surprising production.
 */
export class PostgresCommentsRepository implements CommentsRepository {
  constructor(private readonly pool: Pool) {}

  async createComment(input: NewComment): Promise<Comment> {
    const { rows } = await this.pool.query<CommentRow>(
      `insert into comments (
         article_slug, parent_id, depth, author_name, body, status,
         is_staff, staff_login, author_key, body_hash, moderation_reason
       ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       returning ${commentColumns}`,
      [
        input.articleSlug,
        input.parentId,
        input.depth,
        input.authorName,
        input.body,
        input.status,
        input.isStaff,
        input.staffLogin,
        input.authorKey,
        input.bodyHash,
        input.moderationReason,
      ]
    );
    return toComment(rows[0]);
  }

  async getComment(id: string): Promise<Comment | null> {
    const { rows } = await this.pool.query<CommentRow>(
      `select ${commentColumns} from comments where id = $1`,
      [id]
    );
    return rows[0] ? toComment(rows[0]) : null;
  }

  async listPublicComments(articleSlug: string): Promise<Comment[]> {
    // Pending and rejected comments must never leave this method. The filter is the
    // adapter's responsibility, not the caller's.
    const { rows } = await this.pool.query<CommentRow>(
      `select ${commentColumns} from comments
       where article_slug = $1 and status in ('approved', 'removed')
       order by created_at asc`,
      [articleSlug]
    );
    return rows.map(toComment);
  }

  async listForModeration(query: ModerationQuery): Promise<ModerationPage> {
    const status = query.status ?? "pending";
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions: string[] = [];
    const values: unknown[] = [];
    if (status !== "all") {
      values.push(status);
      conditions.push(`c.status = $${values.length}`);
    }
    if (query.articleSlug) {
      values.push(query.articleSlug);
      conditions.push(`c.article_slug = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search}%`);
      const placeholder = `$${values.length}`;
      conditions.push(
        `(c.author_name ilike ${placeholder} or c.body ilike ${placeholder} or c.article_slug ilike ${placeholder})`
      );
    }
    const where = conditions.length ? `where ${conditions.join(" and ")}` : "";

    const totals = await this.pool.query<{ count: string }>(
      `select count(*)::text as count from comments c ${where}`,
      values
    );
    const totalItems = Number(totals.rows[0].count);

    const limitPlaceholder = `$${values.length + 1}`;
    const offsetPlaceholder = `$${values.length + 2}`;
    const { rows } = await this.pool.query<CommentRow>(
      `select ${qualifiedCommentColumns},
              (select count(*) from comment_reports r
                where r.comment_id = c.id and r.status = 'open') as open_reports
       from comments c
       ${where}
       order by c.created_at desc
       limit ${limitPlaceholder} offset ${offsetPlaceholder}`,
      [...values, pageSize, offset]
    );

    const items: ModerationComment[] = rows.map((row) => ({
      ...toComment(row),
      openReports: Number(row.open_reports ?? 0),
    }));

    return {
      items,
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async applyDecision(decision: ModerationDecision): Promise<Comment | null> {
    return this.inTransaction(async (client) => {
      // Locked for the transaction, so two moderators cannot both apply a decision
      // to one comment and write two audit events for a single transition.
      const current = await client.query<CommentRow>(
        `select ${commentColumns} from comments where id = $1 for update`,
        [decision.commentId]
      );
      if (!current.rows[0]) return null;

      const existing = toComment(current.rows[0]);
      const target = targetStatus(decision.action);
      if (!canTransition(existing.status, target)) return existing;

      await client.query(
        `insert into comment_moderation_events
           (comment_id, action, from_status, to_status, actor_label, reason)
         values ($1, $2, $3, $4, $5, $6)`,
        [existing.id, decision.action, existing.status, target, decision.actorLabel, decision.reason]
      );

      // A removal is a tombstone: the row keeps its place in the thread and loses
      // its content in the same statement that changes its status.
      const { rows } = await client.query<CommentRow>(
        `update comments set
           status = $2,
           updated_at = now(),
           moderated_at = now(),
           moderator_label = $3,
           moderation_reason = $4,
           body = case when $2 = 'removed' then '' else body end,
           author_name = case when $2 = 'removed' then '' else author_name end
         where id = $1
         returning ${commentColumns}`,
        [existing.id, target, decision.actorLabel, decision.reason]
      );

      await client.query(
        `update comment_reports
           set status = $2, reviewed_at = now()
         where comment_id = $1 and status = 'open'`,
        [existing.id, decision.action === "approve" ? "dismissed" : "reviewed"]
      );

      return toComment(rows[0]);
    });
  }

  async countCommentsSince({ authorKey, since }: { authorKey: string; since: Date }): Promise<number> {
    const { rows } = await this.pool.query<{ count: string }>(
      `select count(*)::text as count from comments
       where author_key = $1 and created_at >= $2`,
      [authorKey, since]
    );
    return Number(rows[0].count);
  }

  async findRecentDuplicate({
    articleSlug,
    authorKey,
    bodyHash,
    since,
  }: {
    articleSlug: string;
    authorKey: string;
    bodyHash: string;
    since: Date;
  }): Promise<Comment | null> {
    const { rows } = await this.pool.query<CommentRow>(
      `select ${commentColumns} from comments
       where article_slug = $1 and author_key = $2 and body_hash = $3 and created_at >= $4
       order by created_at desc
       limit 1`,
      [articleSlug, authorKey, bodyHash, since]
    );
    return rows[0] ? toComment(rows[0]) : null;
  }

  async createReport(input: NewReport): Promise<CommentReport> {
    const { rows } = await this.pool.query<{
      id: string;
      comment_id: string;
      reason: CommentReport["reason"];
      detail: string | null;
      status: CommentReport["status"];
      created_at: Date;
      reviewed_at: Date | null;
    }>(
      `insert into comment_reports (comment_id, reason, detail, reporter_key)
       values ($1, $2, $3, $4)
       returning id, comment_id, reason, detail, status, created_at, reviewed_at`,
      [input.commentId, input.reason, input.detail, input.reporterKey]
    );
    const row = rows[0];
    return {
      id: row.id,
      commentId: row.comment_id,
      reason: row.reason,
      detail: row.detail,
      status: row.status,
      createdAt: row.created_at.toISOString(),
      reviewedAt: row.reviewed_at?.toISOString() ?? null,
    };
  }

  async countReportsSince({
    reporterKey,
    since,
  }: {
    reporterKey: string;
    since: Date;
  }): Promise<number> {
    const { rows } = await this.pool.query<{ count: string }>(
      `select count(*)::text as count from comment_reports
       where reporter_key = $1 and created_at >= $2`,
      [reporterKey, since]
    );
    return Number(rows[0].count);
  }

  async listModerationEvents(commentId: string): Promise<ModerationEvent[]> {
    const { rows } = await this.pool.query<{
      id: string;
      comment_id: string;
      action: ModerationEvent["action"];
      from_status: Comment["status"];
      to_status: Comment["status"];
      actor_label: string;
      reason: string | null;
      created_at: Date;
    }>(
      `select id, comment_id, action, from_status, to_status, actor_label, reason, created_at
       from comment_moderation_events
       where comment_id = $1
       order by created_at asc`,
      [commentId]
    );
    return rows.map((row) => ({
      id: row.id,
      commentId: row.comment_id,
      action: row.action,
      fromStatus: row.from_status,
      toStatus: row.to_status,
      actorLabel: row.actor_label,
      reason: row.reason,
      createdAt: row.created_at.toISOString(),
    }));
  }

  private async inTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const result = await work(client);
      await client.query("commit");
      return result;
    } catch (error) {
      await client.query("rollback").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }
}

/**
 * Retention.
 *
 * A rejected comment was never public and is deleted outright once the window
 * passes. A removed tombstone keeps its row so approved replies stay anchored, but
 * its abuse keys are cleared, so the table stops being linkable to a visitor.
 * Approved and pending comments are untouched: retention is not moderation.
 */
export async function purgeExpiredComments(
  pool: Pool,
  { retentionDays = 180 }: { retentionDays?: number } = {}
): Promise<{ rejectedDeleted: number; tombstonesAnonymised: number }> {
  const cutoff = `${retentionDays} days`;

  const deleted = await pool.query(
    `delete from comments where status = 'rejected' and created_at < now() - $1::interval`,
    [cutoff]
  );
  const anonymised = await pool.query(
    `update comments set author_key = '', body_hash = ''
     where status = 'removed' and author_key <> '' and moderated_at < now() - $1::interval`,
    [cutoff]
  );

  return {
    rejectedDeleted: deleted.rowCount ?? 0,
    tombstonesAnonymised: anonymised.rowCount ?? 0,
  };
}
