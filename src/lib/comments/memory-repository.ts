import { randomUUID } from "node:crypto";
import { canTransition } from "./policy";
import type { CommentsRepository } from "./repository";
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
} from "./types";

interface StoredComment extends Comment {
  authorKey: string;
  bodyHash: string;
}

interface StoredReport extends CommentReport {
  reporterKey: string;
}

export interface MemoryRepositoryOptions {
  /** Injected so tests can advance time without sleeping. */
  now?: () => Date;
}

/**
 * An in-memory CommentsRepository.
 *
 * It exists so the domain rules can be tested without a database, and it is held to
 * the same contract as the PostgreSQL adapter: pending and rejected comments never
 * leave listPublicComments, a refused transition leaves the comment untouched, and
 * every applied decision writes an audit event. The two adapters are checked against
 * the same assertions in tests/comments-postgres.test.ts, so a divergence shows up as
 * a failure rather than as a surprise in production.
 *
 * Not for production use: the data lives for the life of the process.
 */
export class MemoryCommentsRepository implements CommentsRepository {
  private readonly comments = new Map<string, StoredComment>();
  private readonly reports: StoredReport[] = [];
  private readonly events: ModerationEvent[] = [];
  private readonly now: () => Date;

  constructor({ now = () => new Date() }: MemoryRepositoryOptions = {}) {
    this.now = now;
  }

  async createComment(input: NewComment): Promise<Comment> {
    const timestamp = this.now().toISOString();
    const stored: StoredComment = {
      id: randomUUID(),
      articleSlug: input.articleSlug,
      parentId: input.parentId,
      depth: input.depth,
      authorName: input.authorName,
      body: input.body,
      status: input.status,
      isStaff: input.isStaff,
      staffLogin: input.staffLogin,
      createdAt: timestamp,
      updatedAt: timestamp,
      moderatedAt: null,
      moderatorLabel: null,
      moderationReason: input.moderationReason,
      authorKey: input.authorKey,
      bodyHash: input.bodyHash,
    };
    this.comments.set(stored.id, stored);
    return publicShape(stored);
  }

  async getComment(id: string): Promise<Comment | null> {
    const stored = this.comments.get(id);
    return stored ? publicShape(stored) : null;
  }

  async listPublicComments(articleSlug: string): Promise<Comment[]> {
    return [...this.comments.values()]
      .filter(
        (comment) =>
          comment.articleSlug === articleSlug &&
          (comment.status === "approved" || comment.status === "removed")
      )
      .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt))
      .map(publicShape);
  }

  async listForModeration(query: ModerationQuery): Promise<ModerationPage> {
    const status = query.status ?? "pending";
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const search = query.search?.toLocaleLowerCase("en");

    const matched = [...this.comments.values()]
      .filter((comment) => {
        if (status !== "all" && comment.status !== status) return false;
        if (query.articleSlug && comment.articleSlug !== query.articleSlug) return false;
        if (!search) return true;
        return [comment.authorName, comment.body, comment.articleSlug]
          .join(" ")
          .toLocaleLowerCase("en")
          .includes(search);
      })
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));

    const start = (page - 1) * pageSize;
    const items: ModerationComment[] = matched.slice(start, start + pageSize).map((comment) => ({
      ...publicShape(comment),
      openReports: this.reports.filter(
        (report) => report.commentId === comment.id && report.status === "open"
      ).length,
    }));

    return {
      items,
      page,
      pageSize,
      totalItems: matched.length,
      totalPages: Math.ceil(matched.length / pageSize),
    };
  }

  async applyDecision(decision: ModerationDecision): Promise<Comment | null> {
    const stored = this.comments.get(decision.commentId);
    if (!stored) return null;

    const target = targetStatus(decision.action);
    if (!canTransition(stored.status, target)) return publicShape(stored);

    const timestamp = this.now().toISOString();
    this.events.push({
      id: randomUUID(),
      commentId: stored.id,
      action: decision.action,
      fromStatus: stored.status,
      toStatus: target,
      actorLabel: decision.actorLabel,
      reason: decision.reason,
      createdAt: timestamp,
    });

    stored.status = target;
    stored.updatedAt = timestamp;
    stored.moderatedAt = timestamp;
    stored.moderatorLabel = decision.actorLabel;
    stored.moderationReason = decision.reason;

    if (target === "removed") {
      // The tombstone keeps its place in the thread and loses its content.
      stored.body = "";
      stored.authorName = "";
    }

    for (const report of this.reports) {
      if (report.commentId === stored.id && report.status === "open") {
        report.status = decision.action === "approve" ? "dismissed" : "reviewed";
        report.reviewedAt = timestamp;
      }
    }

    return publicShape(stored);
  }

  async countCommentsSince({
    authorKey,
    since,
  }: {
    authorKey: string;
    since: Date;
  }): Promise<number> {
    return [...this.comments.values()].filter(
      (comment) =>
        comment.authorKey === authorKey && Date.parse(comment.createdAt) >= since.getTime()
    ).length;
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
    const match = [...this.comments.values()].find(
      (comment) =>
        comment.articleSlug === articleSlug &&
        comment.authorKey === authorKey &&
        comment.bodyHash === bodyHash &&
        Date.parse(comment.createdAt) >= since.getTime()
    );
    return match ? publicShape(match) : null;
  }

  async createReport(input: NewReport): Promise<CommentReport> {
    const stored: StoredReport = {
      id: randomUUID(),
      commentId: input.commentId,
      reason: input.reason,
      detail: input.detail,
      status: "open",
      createdAt: this.now().toISOString(),
      reviewedAt: null,
      reporterKey: input.reporterKey,
    };
    this.reports.push(stored);
    const { reporterKey: _reporterKey, ...report } = stored;
    return report;
  }

  async countReportsSince({
    reporterKey,
    since,
  }: {
    reporterKey: string;
    since: Date;
  }): Promise<number> {
    return this.reports.filter(
      (report) => report.reporterKey === reporterKey && Date.parse(report.createdAt) >= since.getTime()
    ).length;
  }

  async listModerationEvents(commentId: string): Promise<ModerationEvent[]> {
    return this.events
      .filter((event) => event.commentId === commentId)
      .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt));
  }
}

function targetStatus(action: ModerationDecision["action"]): Comment["status"] {
  if (action === "approve") return "approved";
  if (action === "reject") return "rejected";
  return "removed";
}

/** Strips the abuse key and the body hash, which never leave the repository. */
function publicShape(stored: StoredComment): Comment {
  const { authorKey: _authorKey, bodyHash: _bodyHash, ...comment } = stored;
  return { ...comment };
}
