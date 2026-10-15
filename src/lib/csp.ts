import { headers } from "next/headers";

/**
 * The per-request nonce minted by src/middleware.ts.
 *
 * Next stamps its own inline scripts automatically, but author-written script
 * elements have to ask for it. Reading the request headers also keeps the pages
 * that render those scripts out of the static prerender: a prerendered document
 * would be served with a freshly minted nonce in its header and no nonce on its
 * inline scripts, which blocks hydration.
 */
export async function contentSecurityPolicyNonce() {
  return (await headers()).get("x-nonce") ?? undefined;
}
