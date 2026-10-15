import { getPublishedArticleBySlug } from "@/lib/blog/content";
import { createRateLimiter } from "./abuse";
import { createPool, PostgresCommentsRepository, readPostgresSettings } from "./postgres";
import { CommentsService } from "./service";
import type { ArticleGate } from "./service";

/**
 * The composition root for visitor comments.
 *
 * Comments are off until a database and an abuse secret are both configured. That
 * is deliberate: without persistence a submission would be accepted into nowhere,
 * and without the HMAC secret the abuse key would be derivable from the address it
 * is meant to protect. The routes ask `commentsRuntime()` and refuse when it is
 * null, rather than degrading to something that looks like it worked.
 */

/** Published articles and news are the only things that take comments. */
const articleGate: ArticleGate = {
  async isPublished(slug: string) {
    return (await getPublishedArticleBySlug(slug)) !== null;
  },
};

export interface CommentsRuntime {
  service: CommentsService;
}

export class CommentsConfigurationError extends Error {}

let cached: CommentsRuntime | null | undefined;

function build(environment: Record<string, string | undefined>): CommentsRuntime | null {
  const settings = readPostgresSettings(environment);
  const abuseKeySecret = environment.COMMENTS_ABUSE_SECRET?.trim();

  if (!settings && !abuseKeySecret) return null;
  if (!settings || !abuseKeySecret) {
    // Half-configured is worse than off: it is off while looking configured.
    throw new CommentsConfigurationError(
      "Comments configuration error: COMMENTS_DATABASE_URL and COMMENTS_ABUSE_SECRET must be set together."
    );
  }
  if (abuseKeySecret.length < 32) {
    throw new CommentsConfigurationError(
      "Comments configuration error: COMMENTS_ABUSE_SECRET must be at least 32 characters."
    );
  }

  const repository = new PostgresCommentsRepository(createPool(settings));

  return {
    service: new CommentsService({
      repository,
      articles: articleGate,
      abuseKeySecret,
      // A short burst window on top of the service's own daily ceiling.
      submissionLimiter: createRateLimiter({ limit: 3, windowMs: 10 * 60 * 1000 }),
      reportLimiter: createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 }),
    }),
  };
}

/**
 * Resolves once per process; configuration cannot change under a running server.
 * Returns null when comments are switched off.
 */
export function commentsRuntime(
  environment: Record<string, string | undefined> = process.env
): CommentsRuntime | null {
  if (cached === undefined) cached = build(environment);
  return cached;
}

/** Test seam: forget the resolved runtime. */
export function resetCommentsRuntime(): void {
  cached = undefined;
}

/** Builds a runtime around an injected service, for tests and for route wiring. */
export function createCommentsRuntime(service: CommentsService): CommentsRuntime {
  return { service };
}

export { articleGate };
