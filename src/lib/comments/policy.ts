import { createHash } from "node:crypto";
import { z } from "zod";
import type { Comment, PublicComment } from "./types";

import {
  MAX_BODY_LENGTH,
  MAX_LINKS_IN_BODY,
  MAX_NAME_LENGTH,
  MAX_REPORT_DETAIL_LENGTH,
  MAX_THREAD_DEPTH,
  MIN_BODY_LENGTH,
  MIN_NAME_LENGTH,
} from "./limits";

export {
  MAX_BODY_LENGTH,
  MAX_LINKS_IN_BODY,
  MAX_NAME_LENGTH,
  MAX_REPORT_DETAIL_LENGTH,
  MAX_THREAD_DEPTH,
  MIN_BODY_LENGTH,
  MIN_NAME_LENGTH,
};

/** Mirrors the article slug rule in src/lib/blog/content.ts. */
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Everything except tab and newline. Zero-width and bidirectional controls are
 * included: they are invisible in a rendered comment and are the usual way to
 * disguise a payload or reorder visible text.
 */
// eslint-disable-next-line no-control-regex
const forbiddenControlCharacters =
  /[\u0000-\u0008\u000B-\u001F\u007F-\u009F​-‏‪-‮⁠-⁤⁦-⁩﻿]/;

const htmlLikePattern = /<[/!a-zA-Z]/;
const linkPattern = /\bhttps?:\/\/|\bwww\./gi;

function countLinks(value: string): number {
  return value.match(linkPattern)?.length ?? 0;
}

/**
 * Collapses the whitespace a paste carries without touching the wording: NFC so
 * that visually identical submissions hash alike, CRLF folded, runs of blank lines
 * capped at one, and per-line trailing spaces dropped.
 */
export function normalizeCommentText(value: string): string {
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeAuthorName(value: string): string {
  return value.normalize("NFC").replace(/\s+/g, " ").trim();
}

export function hashCommentBody(body: string): string {
  return createHash("sha256").update(normalizeCommentText(body), "utf8").digest("hex");
}

export function isValidCommentId(value: string): boolean {
  return uuidPattern.test(value);
}

const authorName = z
  .string()
  .transform(normalizeAuthorName)
  .refine((value) => value.length >= MIN_NAME_LENGTH && value.length <= MAX_NAME_LENGTH, {
    message: "A display name must be between 2 and 60 characters.",
  })
  .refine((value) => !forbiddenControlCharacters.test(value), {
    message: "A display name may not contain control characters.",
  })
  .refine((value) => /\p{L}/u.test(value), {
    message: "A display name must contain at least one letter.",
  })
  .refine((value) => countLinks(value) === 0, {
    message: "A display name may not contain a link.",
  })
  .refine((value) => !htmlLikePattern.test(value), {
    message: "A display name may not contain markup.",
  });

const commentBody = z
  .string()
  .transform(normalizeCommentText)
  .refine((value) => value.length >= MIN_BODY_LENGTH && value.length <= MAX_BODY_LENGTH, {
    message: "A comment must be between 2 and 2000 characters.",
  })
  .refine((value) => !forbiddenControlCharacters.test(value), {
    message: "A comment may not contain control characters.",
  })
  .refine((value) => !htmlLikePattern.test(value), {
    // Comments render through React text nodes, so markup would be escaped rather
    // than run. It is refused at the door anyway, which keeps what is stored honest
    // plain text instead of something a future renderer could be talked into parsing.
    message: "Comments are plain text. Markup is not permitted.",
  });

/**
 * The public submission payload.
 *
 * `website` is a honeypot: the form renders it away from both sight and assistive
 * technology, so a value in it marks an unattended submission. The schema accepts
 * it and the service refuses it, which keeps that refusal indistinguishable from an
 * ordinary validation failure.
 */
export const commentSubmissionSchema = z
  .object({
    articleSlug: z.string().trim().min(3).max(100).regex(slugPattern),
    parentId: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      z.string().trim().refine(isValidCommentId, { message: "Unknown parent comment." }).optional()
    ),
    authorName,
    body: commentBody,
    website: z.string().max(200).optional(),
  })
  .strict();

export type CommentSubmission = z.infer<typeof commentSubmissionSchema>;

export const reportSubmissionSchema = z
  .object({
    commentId: z.string().trim().refine(isValidCommentId, { message: "Unknown comment." }),
    reason: z.enum(["spam", "abuse", "off-topic", "privacy", "other"]),
    detail: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      z
        .string()
        .transform(normalizeCommentText)
        .refine((value) => value.length <= MAX_REPORT_DETAIL_LENGTH, {
          message: "Report detail is limited to 500 characters.",
        })
        .refine((value) => !forbiddenControlCharacters.test(value) && !htmlLikePattern.test(value), {
          message: "Report detail must be plain text.",
        })
        .optional()
    ),
    website: z.string().max(200).optional(),
  })
  .strict();

export const moderationQuerySchema = z
  .object({
    status: z.enum(["pending", "approved", "rejected", "removed", "all"]).default("pending"),
    articleSlug: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      z.string().trim().max(100).regex(slugPattern).optional()
    ),
    search: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      z.string().trim().max(100).optional()
    ),
    page: z.coerce.number().int().min(1).max(10_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict();

export const moderationDecisionSchema = z
  .object({
    action: z.enum(["approve", "reject", "remove"]),
    reason: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      z
        .string()
        .transform(normalizeCommentText)
        .refine((value) => value.length <= 200 && !htmlLikePattern.test(value), {
          message: "A moderation reason must be short plain text.",
        })
        .optional()
    ),
  })
  .strict();

export const staffReplySchema = z
  .object({
    body: commentBody,
  })
  .strict();

/**
 * Transitions a moderator may apply. `removed` is terminal: approved replies may
 * already hang from the tombstone, and putting the original text back later is a
 * decision the audit trail should show as its own event rather than a silent
 * reversal.
 */
const allowedTransitions: Record<string, readonly string[]> = {
  pending: ["approved", "rejected", "removed"],
  approved: ["rejected", "removed"],
  rejected: ["approved", "removed"],
  removed: [],
};

export const actionTargetStatus = {
  approve: "approved",
  reject: "rejected",
  remove: "removed",
} as const;

export function canTransition(from: string, to: string): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export interface SpamAssessment {
  spam: boolean;
  reason: string | null;
}

/**
 * Cheap content heuristics against the bulk, unattended submissions a public form
 * attracts. They are not a judgement about any individual author: a flagged comment
 * is still stored and still appears in the moderation queue, where a person can
 * approve it. The specific signal is never reported back to the submitter, so a
 * sender cannot tune against it.
 */
export function assessSpam(input: { authorName: string; body: string }): SpamAssessment {
  if (countLinks(input.body) > MAX_LINKS_IN_BODY) {
    return { spam: true, reason: "automated-screen:links" };
  }

  const letters = input.body.replace(/[^\p{L}]/gu, "");
  if (letters.length >= 20) {
    const upper = letters.replace(/[^\p{Lu}]/gu, "").length;
    if (upper / letters.length > 0.7) {
      return { spam: true, reason: "automated-screen:shouting" };
    }
  }

  if (/(.)\1{9,}/u.test(input.body)) {
    return { spam: true, reason: "automated-screen:repetition" };
  }

  const words = input.body.toLocaleLowerCase("en").match(/\p{L}+/gu) ?? [];
  if (words.length >= 12 && new Set(words).size / words.length < 0.3) {
    return { spam: true, reason: "automated-screen:repetition" };
  }

  return { spam: false, reason: null };
}

export const TOMBSTONE_BODY = "This comment was removed by a moderator.";

/**
 * Assembles the public tree from the rows the repository returned.
 *
 * A removed comment survives only while an approved descendant needs it as an
 * anchor; otherwise it disappears entirely, so a reader never meets a bare row of
 * tombstones. An orphan — a comment whose parent is not in the visible set — is
 * dropped rather than promoted to the top level, because promotion would stand a
 * reply next to the thread it was answering and change what it appears to say.
 */
export function buildPublicThread(comments: readonly Comment[]): PublicComment[] {
  const byId = new Map<string, Comment>(comments.map((comment) => [comment.id, comment]));
  const childIds = new Map<string | null, string[]>();

  const ordered = [...comments].sort(
    (left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt)
  );
  for (const comment of ordered) {
    if (comment.parentId !== null && !byId.has(comment.parentId)) continue;
    const siblings = childIds.get(comment.parentId) ?? [];
    siblings.push(comment.id);
    childIds.set(comment.parentId, siblings);
  }

  function toNode(comment: Comment): PublicComment | null {
    const replies = (childIds.get(comment.id) ?? [])
      .map((id) => byId.get(id))
      .filter((child): child is Comment => Boolean(child))
      .map(toNode)
      .filter((node): node is PublicComment => node !== null);

    const removed = comment.status === "removed";
    if (removed && replies.length === 0) return null;

    return {
      id: comment.id,
      authorName: removed ? "" : comment.authorName,
      body: removed ? TOMBSTONE_BODY : comment.body,
      isStaff: removed ? false : comment.isStaff,
      createdAt: comment.createdAt,
      removed,
      replies,
    };
  }

  return (childIds.get(null) ?? [])
    .map((id) => byId.get(id))
    .filter((comment): comment is Comment => Boolean(comment))
    .map(toNode)
    .filter((node): node is PublicComment => node !== null);
}

export function countPublicComments(nodes: readonly PublicComment[]): number {
  return nodes.reduce(
    (total, node) => total + (node.removed ? 0 : 1) + countPublicComments(node.replies),
    0
  );
}
