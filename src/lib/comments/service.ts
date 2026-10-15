import { z } from "zod";
import { deriveAuthorKey } from "./abuse";
import type { RateLimiter } from "./abuse";
import {
  MAX_THREAD_DEPTH,
  actionTargetStatus,
  assessSpam,
  buildPublicThread,
  canTransition,
  commentSubmissionSchema,
  hashCommentBody,
  isValidCommentId,
  moderationDecisionSchema,
  moderationQuerySchema,
  reportSubmissionSchema,
  staffReplySchema,
} from "./policy";
import type { CommentsRepository } from "./repository";
import type {
  Comment,
  ModerationEvent,
  ModerationPage,
  PublicComment,
  StaffIdentity,
} from "./types";

/** Durable limits, counted from the stored rows so they survive a restart. */
export const MAX_COMMENTS_PER_DAY = 10;
export const MAX_REPORTS_PER_DAY = 20;
export const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Whether an article may take comments. Implemented over the Markdown content
 * loader in src/lib/blog, and kept as a port so the domain never touches the file
 * system and the unit tests never need a content directory.
 */
export interface ArticleGate {
  isPublished(slug: string): Promise<boolean>;
}

export interface CommentsServiceDependencies {
  repository: CommentsRepository;
  articles: ArticleGate;
  /** HMAC key for the opaque abuse identifier. Never leaves the server. */
  abuseKeySecret: string;
  submissionLimiter: RateLimiter;
  reportLimiter: RateLimiter;
  now?: () => Date;
}

export type FailureCode =
  | "invalid"
  | "unknown-article"
  | "unknown-parent"
  | "unknown-comment"
  | "too-deep"
  | "rate-limited"
  | "duplicate"
  | "conflict";

export interface Failure {
  ok: false;
  code: FailureCode;
  message: string;
  retryAfterSeconds?: number;
  /** Field-level detail, only for a genuine validation failure. */
  issues?: Array<{ path: string; message: string }>;
}

export type Result<T> = ({ ok: true } & T) | Failure;

function failure(code: FailureCode, message: string, extra: Partial<Failure> = {}): Failure {
  return { ok: false, code, message, ...extra };
}

function issuesOf(error: z.ZodError): Array<{ path: string; message: string }> {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export interface SubmitInput {
  payload: unknown;
  /** The submitting address, used only to derive the abuse key. */
  address: string;
}

export interface SubmittedComment {
  /** The id is returned so the UI can show the author their own pending comment. */
  id: string;
  status: Comment["status"];
  /** True when an automated signal flagged the comment for a closer look. */
  flagged: boolean;
}

export class CommentsService {
  private readonly repository: CommentsRepository;
  private readonly articles: ArticleGate;
  private readonly abuseKeySecret: string;
  private readonly submissionLimiter: RateLimiter;
  private readonly reportLimiter: RateLimiter;
  private readonly now: () => Date;

  constructor(dependencies: CommentsServiceDependencies) {
    this.repository = dependencies.repository;
    this.articles = dependencies.articles;
    this.abuseKeySecret = dependencies.abuseKeySecret;
    this.submissionLimiter = dependencies.submissionLimiter;
    this.reportLimiter = dependencies.reportLimiter;
    this.now = dependencies.now ?? (() => new Date());
  }

  /**
   * Accepts a visitor comment or reply.
   *
   * Every accepted comment is stored `pending`, including a reply, so nothing a
   * visitor writes is public before a moderator sees it. An automated spam signal
   * flags the row rather than deciding it: a flagged comment stays in the queue
   * where a person can approve it, instead of being buried as rejected by a
   * heuristic.
   */
  async submit({ payload, address }: SubmitInput): Promise<Result<SubmittedComment>> {
    const parsed = commentSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      return failure("invalid", "This comment could not be accepted.", {
        issues: issuesOf(parsed.error),
      });
    }

    const submission = parsed.data;
    // The honeypot is hidden from sight and from assistive technology, so a value in
    // it is never a person. Reported as an ordinary validation failure.
    if (submission.website) {
      return failure("invalid", "This comment could not be accepted.");
    }

    if (!(await this.articles.isPublished(submission.articleSlug))) {
      return failure("unknown-article", "Comments are not open on this article.");
    }

    const authorKey = deriveAuthorKey(address, this.abuseKeySecret);
    const burst = this.submissionLimiter.check(authorKey, this.now().getTime());
    if (!burst.allowed) {
      return failure("rate-limited", "Too many comments were submitted. Try again later.", {
        retryAfterSeconds: burst.retryAfterSeconds,
      });
    }

    const since = new Date(this.now().getTime() - DAY_MS);
    if ((await this.repository.countCommentsSince({ authorKey, since })) >= MAX_COMMENTS_PER_DAY) {
      return failure("rate-limited", "Too many comments were submitted. Try again later.", {
        retryAfterSeconds: Math.ceil(DAY_MS / 1000),
      });
    }

    let depth = 0;
    let parentId: string | null = null;
    if (submission.parentId) {
      const parent = await this.repository.getComment(submission.parentId);
      // A reply may only attach to an approved comment on the same article. Replying
      // to a pending or rejected comment would leak that it exists.
      if (!parent || parent.status !== "approved" || parent.articleSlug !== submission.articleSlug) {
        return failure("unknown-parent", "That comment is no longer available for replies.");
      }
      if (parent.depth + 1 >= MAX_THREAD_DEPTH) {
        return failure("too-deep", "This conversation has reached its reply limit.");
      }
      parentId = parent.id;
      depth = parent.depth + 1;
    }

    const bodyHash = hashCommentBody(submission.body);
    const duplicate = await this.repository.findRecentDuplicate({
      articleSlug: submission.articleSlug,
      authorKey,
      bodyHash,
      since: new Date(this.now().getTime() - DUPLICATE_WINDOW_MS),
    });
    if (duplicate) {
      return failure("duplicate", "That comment has already been submitted.");
    }

    const screen = assessSpam({ authorName: submission.authorName, body: submission.body });
    const comment = await this.repository.createComment({
      articleSlug: submission.articleSlug,
      parentId,
      depth,
      authorName: submission.authorName,
      body: submission.body,
      status: "pending",
      isStaff: false,
      staffLogin: null,
      moderationReason: screen.reason,
      authorKey,
      bodyHash,
    });

    return { ok: true, id: comment.id, status: comment.status, flagged: screen.spam };
  }

  async report({ payload, address }: SubmitInput): Promise<Result<{ reportId: string }>> {
    const parsed = reportSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      return failure("invalid", "This report could not be accepted.", {
        issues: issuesOf(parsed.error),
      });
    }
    if (parsed.data.website) {
      return failure("invalid", "This report could not be accepted.");
    }

    const reporterKey = deriveAuthorKey(address, this.abuseKeySecret);
    const burst = this.reportLimiter.check(reporterKey, this.now().getTime());
    if (!burst.allowed) {
      return failure("rate-limited", "Too many reports were submitted. Try again later.", {
        retryAfterSeconds: burst.retryAfterSeconds,
      });
    }

    const since = new Date(this.now().getTime() - DAY_MS);
    if ((await this.repository.countReportsSince({ reporterKey, since })) >= MAX_REPORTS_PER_DAY) {
      return failure("rate-limited", "Too many reports were submitted. Try again later.", {
        retryAfterSeconds: Math.ceil(DAY_MS / 1000),
      });
    }

    const comment = await this.repository.getComment(parsed.data.commentId);
    // Only a publicly visible comment can be reported. Anything else would confirm
    // the existence of a comment the reporter was never shown.
    if (!comment || comment.status !== "approved") {
      return failure("unknown-comment", "That comment is no longer available.");
    }

    const report = await this.repository.createReport({
      commentId: comment.id,
      reason: parsed.data.reason,
      detail: parsed.data.detail ?? null,
      reporterKey,
    });

    return { ok: true, reportId: report.id };
  }

  /** The approved thread for one article, as the public page renders it. */
  async publicThread(articleSlug: string): Promise<PublicComment[]> {
    return buildPublicThread(await this.repository.listPublicComments(articleSlug));
  }

  // --- Staff surface. Every method below is reached only after the caller has been
  // --- verified against the staff allowlist; the service takes the verified identity
  // --- as an argument and never derives authority from the request itself.

  async listForModeration(rawQuery: unknown): Promise<Result<{ page: ModerationPage }>> {
    const parsed = moderationQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      return failure("invalid", "That moderation query is not valid.", {
        issues: issuesOf(parsed.error),
      });
    }
    return { ok: true, page: await this.repository.listForModeration(parsed.data) };
  }

  async decide(
    commentId: string,
    rawPayload: unknown,
    staff: StaffIdentity
  ): Promise<Result<{ comment: Comment }>> {
    if (!isValidCommentId(commentId)) {
      return failure("unknown-comment", "That comment does not exist.");
    }
    const parsed = moderationDecisionSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return failure("invalid", "That moderation decision is not valid.", {
        issues: issuesOf(parsed.error),
      });
    }

    const existing = await this.repository.getComment(commentId);
    if (!existing) {
      return failure("unknown-comment", "That comment does not exist.");
    }
    const target = actionTargetStatus[parsed.data.action];
    if (!canTransition(existing.status, target)) {
      return failure(
        "conflict",
        `A ${existing.status} comment cannot be ${target}.`
      );
    }

    const comment = await this.repository.applyDecision({
      commentId,
      action: parsed.data.action,
      actorLabel: staffLabel(staff),
      reason: parsed.data.reason ?? null,
    });
    if (!comment) {
      return failure("unknown-comment", "That comment does not exist.");
    }
    return { ok: true, comment };
  }

  /**
   * A reply written by a verified staff member.
   *
   * It is created pending and then approved through the ordinary decision path, so
   * the audit trail names the staff member who published it rather than showing a
   * comment that appeared already approved. If the approval step fails the reply
   * stays pending in the queue, which is the safe direction to fail.
   */
  async staffReply(
    parentId: string,
    rawPayload: unknown,
    staff: StaffIdentity
  ): Promise<Result<{ comment: Comment }>> {
    const parsed = staffReplySchema.safeParse(rawPayload);
    if (!parsed.success) {
      return failure("invalid", "That reply is not valid.", { issues: issuesOf(parsed.error) });
    }
    if (!isValidCommentId(parentId)) {
      return failure("unknown-parent", "That comment does not exist.");
    }

    const parent = await this.repository.getComment(parentId);
    if (!parent || parent.status !== "approved") {
      return failure("unknown-parent", "A staff reply requires an approved comment.");
    }
    if (parent.depth + 1 >= MAX_THREAD_DEPTH) {
      return failure("too-deep", "This conversation has reached its reply limit.");
    }

    const created = await this.repository.createComment({
      articleSlug: parent.articleSlug,
      parentId: parent.id,
      depth: parent.depth + 1,
      authorName: staff.login,
      body: parsed.data.body,
      status: "pending",
      isStaff: true,
      staffLogin: staff.login,
      moderationReason: null,
      // A staff reply is written through an authenticated session rather than from a
      // public form, so there is no visitor address to key. The label stands in.
      authorKey: `staff:${staff.id}`,
      bodyHash: hashCommentBody(parsed.data.body),
    });

    const approved = await this.repository.applyDecision({
      commentId: created.id,
      action: "approve",
      actorLabel: staffLabel(staff),
      reason: "staff-reply",
    });

    return { ok: true, comment: approved ?? created };
  }

  async moderationHistory(commentId: string): Promise<Result<{ events: ModerationEvent[] }>> {
    if (!isValidCommentId(commentId)) {
      return failure("unknown-comment", "That comment does not exist.");
    }
    return { ok: true, events: await this.repository.listModerationEvents(commentId) };
  }
}

/** The audit label for a staff actor: the login plus the immutable GitHub id. */
export function staffLabel(staff: StaffIdentity): string {
  return `${staff.login}#${staff.id}`;
}
