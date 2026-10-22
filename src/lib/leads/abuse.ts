import { trustedClientAddress } from "@/lib/request-address";

export interface RateLimitDecision {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  /** Bounds memory so a flood of distinct clients cannot grow the map without end. */
  capacity?: number;
}

/**
 * A fixed-window counter held in this process.
 *
 * It is deliberately not shared between instances: behind more than one server each
 * replica enforces its own window, so the effective limit multiplies by the replica
 * count. That is acceptable for a marketing form and must be replaced by a shared
 * store before this endpoint is fronted by several instances.
 */
export function createRateLimiter({ limit, windowMs, capacity = 10_000 }: RateLimiterOptions) {
  const windows = new Map<string, { count: number; resetAt: number }>();

  return function check(key: string, now = Date.now()): RateLimitDecision {
    for (const [existing, window] of windows) {
      if (window.resetAt <= now) windows.delete(existing);
    }
    if (windows.size >= capacity && !windows.has(key)) {
      // Full and unknown: refuse rather than evict someone else's window.
      return { allowed: false, retryAfterSeconds: Math.ceil(windowMs / 1000) };
    }

    const window = windows.get(key);
    if (!window || window.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    window.count += 1;
    if (window.count > limit) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((window.resetAt - now) / 1000)) };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  };
}

/**
 * Derives a rate-limit key from the trusted deployment proxy suffix. Requests with
 * no configured proxy contract share one bucket rather than trusting a visitor's
 * forwarding header and allowing rate-limit evasion.
 */
export function clientKey(request: Request, hops?: number): string {
  return trustedClientAddress(request, hops);
}

const urlPattern = /\bhttps?:\/\/|\bwww\./gi;
const MAX_LINKS = 2;

/**
 * Cheap content heuristics. These reject the bulk, unattended submissions a public
 * form attracts; they are not a judgement about any individual sender, so a refusal
 * is reported as a validation failure rather than an accusation.
 */
export function looksAutomated(enquiry: { message: string; name: string }): boolean {
  const links = enquiry.message.match(urlPattern)?.length ?? 0;
  if (links > MAX_LINKS) return true;
  // A name that is entirely punctuation or digits is not a person's name.
  if (!/[\p{L}]/u.test(enquiry.name)) return true;
  return false;
}
