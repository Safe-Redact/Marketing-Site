import { createHttpsEmailTransport, readHttpsEmailSettings } from "./transports/https-email";
import { nullTransport } from "./transports/null";
import type { LeadTransport } from "./types";

/**
 * Chooses the delivery transport from the environment. Returns the fail-closed
 * placeholder when nothing is configured, and throws when configuration is present
 * but incomplete — a half-configured provider would otherwise drop enquiries while
 * the endpoint reported success.
 */
export function resolveLeadTransport(
  environment: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch
): LeadTransport {
  const settings = readHttpsEmailSettings(environment);
  return settings ? createHttpsEmailTransport(settings, fetchImpl) : nullTransport;
}

let cached: LeadTransport | null = null;

/** Resolves once per process; configuration cannot change under a running server. */
export function leadTransport(): LeadTransport {
  cached ??= resolveLeadTransport();
  return cached;
}

/** Test seam: forget the resolved transport. */
export function resetLeadTransport(): void {
  cached = null;
}
