import type {
  Comment,
  CommentReport,
  ModerationDecision,
  ModerationEvent,
  ModerationPage,
  ModerationQuery,
  NewComment,
  NewReport,
} from "./types";

/**
 * The only way the application reaches persisted comments.
 *
 * Every method speaks in domain types from ./types, so an adapter may be written
 * for any store. Two exist: an in-memory double used by the unit tests, and the
 * PostgreSQL adapter under ./postgres. Nothing above this interface knows which
 * one it holds.
 */
export interface CommentsRepository {
  createComment(input: NewComment): Promise<Comment>;

  getComment(id: string): Promise<Comment | null>;

  /**
   * Everything the public thread may need for one article: approved comments plus
   * removed tombstones. Pending and rejected comments must never be returned here —
   * that boundary is the adapter's responsibility, not the caller's.
   */
  listPublicComments(articleSlug: string): Promise<Comment[]>;

  listForModeration(query: ModerationQuery): Promise<ModerationPage>;

  /**
   * Applies a decision and records the audit event atomically. Returns null when the
   * comment does not exist, and leaves the comment untouched when the transition is
   * not allowed, so the caller can tell a missing row from a refused transition.
   */
  applyDecision(decision: ModerationDecision): Promise<Comment | null>;

  countCommentsSince(input: { authorKey: string; since: Date }): Promise<number>;

  findRecentDuplicate(input: {
    articleSlug: string;
    authorKey: string;
    bodyHash: string;
    since: Date;
  }): Promise<Comment | null>;

  createReport(input: NewReport): Promise<CommentReport>;

  countReportsSince(input: { reporterKey: string; since: Date }): Promise<number>;

  listModerationEvents(commentId: string): Promise<ModerationEvent[]>;
}
