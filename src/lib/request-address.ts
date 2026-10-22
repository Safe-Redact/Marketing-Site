import { isIP } from "node:net";

const MAX_TRUSTED_PROXY_HOPS = 10;

/**
 * Number of forwarding hops controlled by the deployment.
 *
 * Zero is the secure default: forwarding headers are caller-controlled unless a
 * known reverse-proxy chain overwrites or appends them. An invalid value also
 * fails closed to zero instead of silently trusting arbitrary input.
 */
export function trustedProxyHops(
  environment: Record<string, string | undefined> = process.env
): number {
  const raw = environment.TRUST_PROXY_HOPS?.trim();
  if (!raw) return 0;
  const hops = Number(raw);
  return Number.isSafeInteger(hops) && hops >= 0 && hops <= MAX_TRUSTED_PROXY_HOPS
    ? hops
    : 0;
}

/**
 * Returns the address inserted by the outermost trusted proxy in the configured
 * suffix of `X-Forwarded-For`. Values to its left may have been supplied by the
 * visitor; values to its right are trusted intermediary hops.
 */
export function trustedClientAddress(request: Request, hops = trustedProxyHops()): string {
  if (!Number.isSafeInteger(hops) || hops < 1 || hops > MAX_TRUSTED_PROXY_HOPS) {
    return "unattributed";
  }

  const chain = (request.headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (chain.length < hops) return "unattributed";

  const candidate = chain[chain.length - hops];
  return isIP(candidate) ? candidate : "unattributed";
}
