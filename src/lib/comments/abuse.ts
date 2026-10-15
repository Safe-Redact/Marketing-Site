import { createHmac, timingSafeEqual } from "node:crypto";

export interface RateLimitDecision {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string, now?: number): RateLimitDecision;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  /** Bounds memory so a flood of distinct keys cannot grow the map without end. */
  capacity?: number;
}

/**
 * A sliding-window counter held in this process.
 *
 * Sliding rather than fixed: a fixed window lets a sender post its whole allowance
 * at the end of one window and again at the start of the next, which on a comment
 * form is the burst that matters most.
 *
 * It is deliberately not shared between instances, so behind more than one server
 * each replica enforces its own window and the effective limit multiplies by the
 * replica count. The durable limits in the service — counted from the stored rows —
 * are what actually survive a restart or a second instance; this is only the cheap
 * first gate. A shared store is required before the site runs more than one
 * instance. (Recorded in docs/marketing-revamp/COMMENTS_ACTIVATION.md.)
 */
export function createRateLimiter({
  limit,
  windowMs,
  capacity = 10_000,
}: RateLimiterOptions): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key: string, now = Date.now()): RateLimitDecision {
      const cutoff = now - windowMs;
      for (const [existing, timestamps] of hits) {
        const live = timestamps.filter((timestamp) => timestamp > cutoff);
        if (live.length === 0) hits.delete(existing);
        else hits.set(existing, live);
      }

      if (hits.size >= capacity && !hits.has(key)) {
        // Full and unknown: refuse rather than evict somebody else's window.
        return { allowed: false, retryAfterSeconds: Math.ceil(windowMs / 1000) };
      }

      const timestamps = hits.get(key) ?? [];
      if (timestamps.length >= limit) {
        const oldest = timestamps[0];
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
        };
      }

      timestamps.push(now);
      hits.set(key, timestamps);
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

/**
 * Reads the submitting address for the sole purpose of deriving an abuse key.
 *
 * Only the first forwarded hop is considered, because later entries are supplied by
 * the client. Requests with no usable address share one bucket rather than escaping
 * the limit altogether. The return value is never stored or logged — it goes
 * straight into deriveAuthorKey.
 */
export function requestAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",", 1)[0]?.trim();
  const candidate = first || request.headers.get("x-real-ip")?.trim();
  return candidate && candidate.length <= 64 ? candidate : "unattributed";
}

/**
 * The opaque identifier that stands in for a visitor.
 *
 * A keyed HMAC, not a plain hash: the address space of IPv4 is small enough to
 * enumerate, so an unkeyed digest of an address is the address. Rotating the secret
 * invalidates every stored key, which is the intended way to shorten how long an
 * abuse identifier remains linkable.
 */
export function deriveAuthorKey(address: string, secret: string): string {
  if (!secret) {
    throw new Error("An abuse-key secret is required before comments may be accepted.");
  }
  return createHmac("sha256", secret).update(address, "utf8").digest("base64url");
}

/** Constant-time comparison for the two opaque keys, used by the tests and adapters. */
export function authorKeysMatch(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left, "utf8");
  const rightBytes = Buffer.from(right, "utf8");
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}
