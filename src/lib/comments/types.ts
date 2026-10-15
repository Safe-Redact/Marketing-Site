/**
 * The comments domain model.
 *
 * Nothing in this file may depend on a database driver, an HTTP framework or a
 * hosting provider. The Postgres adapter under ./postgres maps rows onto these
 * shapes, so the store can move to another PostgreSQL service without the public
 * routes or the moderation rules changing.
 */

/**
 * `removed` is a tombstone rather than a deletion: the row stays so that approved
 * replies underneath it keep their place in the thread, with the body replaced at
 * render time. A comment that is rejected was never public and has no tombstone.
 */
export const COMMENT_STATUSES = ["pending", "approved", "rejected", "removed"] as const;
export type CommentStatus = (typeof COMMENT_STATUSES)[number];

export const MODERATION_ACTIONS = ["approve", "reject", "remove"] as const;
export type ModerationAction = (typeof MODERATION_ACTIONS)[number];

export const REPORT_REASONS = ["spam", "abuse", "off-topic", "privacy", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_STATUSES = ["open", "reviewed", "dismissed"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface Comment {
  id: string;
  articleSlug: string;
  /** The approved comment this one answers, or null for a top-level comment. */
  parentId: string | null;
  /** Depth 0 is top level. Bounded by MAX_THREAD_DEPTH in ./policy. */
  depth: number;
  authorName: string;
  /** Plain text exactly as it will be rendered. Never HTML, never Markdown. */
  body: string;
  status: CommentStatus;
  /**
   * True only when the author was verified against the staff allowlist at the
   * moment of writing. It is never accepted from a request payload.
   */
  isStaff: boolean;
  staffLogin: string | null;
  createdAt: string;
  updatedAt: string;
  moderatedAt: string | null;
  moderatorLabel: string | null;
  moderationReason: string | null;
}

/** What the application asks the repository to store. Status is decided by policy. */
export interface NewComment {
  articleSlug: string;
  parentId: string | null;
  depth: number;
  authorName: string;
  body: string;
  status: CommentStatus;
  isStaff: boolean;
  staffLogin: string | null;
  moderationReason: string | null;
  /**
   * A keyed HMAC of the submitting address, derived per deployment secret. Raw IP
   * addresses are never passed in and never stored.
   */
  authorKey: string;
  /** Hash of the normalized body, used to recognise a resubmission. */
  bodyHash: string;
}

export interface CommentReport {
  id: string;
  commentId: string;
  reason: ReportReason;
  detail: string | null;
  status: ReportStatus;
  createdAt: string;
  reviewedAt: string | null;
}

export interface NewReport {
  commentId: string;
  reason: ReportReason;
  detail: string | null;
  reporterKey: string;
}

export interface ModerationEvent {
  id: string;
  commentId: string;
  action: ModerationAction;
  fromStatus: CommentStatus;
  toStatus: CommentStatus;
  actorLabel: string;
  reason: string | null;
  createdAt: string;
}

/** One node of the public tree. Carries no author key, no status, no moderation data. */
export interface PublicComment {
  id: string;
  authorName: string;
  body: string;
  isStaff: boolean;
  createdAt: string;
  /** True when the node is a tombstone kept only to anchor its replies. */
  removed: boolean;
  replies: PublicComment[];
}

export interface ModerationQuery {
  status?: CommentStatus | "all";
  articleSlug?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ModerationComment extends Comment {
  openReports: number;
}

export interface ModerationPage {
  items: ModerationComment[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ModerationDecision {
  commentId: string;
  action: ModerationAction;
  /** A verified staff identity, rendered as "login#id". Never visitor-supplied. */
  actorLabel: string;
  reason: string | null;
}

export interface StaffIdentity {
  id: number;
  login: string;
}
