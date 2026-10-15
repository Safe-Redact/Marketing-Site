import { NextResponse, type NextRequest } from "next/server";

/**
 * The App Router ships its flight payload and hydration bootstrap as inline
 * <script> blocks whose contents change with every build and every page, so a
 * static `script-src 'self'` header blocks hydration and a hash allowlist cannot
 * be maintained. Next does, however, read a nonce out of the Content-Security-Policy
 * *request* header and stamp it onto every script it emits, so the policy is built
 * per request here instead of in next.config.ts.
 */
const sharedDirectives = [
  "default-src 'self'",
  "style-src 'self'",
  // React renders dynamic geometry (reveal delays, chart bar heights) and next/image
  // renders its placeholder through the style attribute. style-src-attr keeps that
  // allowance away from <style> elements, which stay restricted to 'self'.
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "upgrade-insecure-requests",
];

/**
 * The Decap shell declares its own document policy in public/admin/index.html, where
 * the Ajv exception the pinned bundle needs stays confined, and takes its anti-framing
 * headers from next.config.ts. Two enforced policies intersect, so a stricter header
 * from here would break the editor: the admin tree is left alone.
 */
const unprotectedPrefixes = ["/admin", "/_next/static", "/_next/image"];

function isUnprotected(pathname: string) {
  return unprotectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export function middleware(request: NextRequest) {
  if (isUnprotected(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const nonce = createNonce();
  const policy = [`script-src 'self' 'nonce-${nonce}'`, ...sharedDirectives].join("; ");

  // The request copy is what the renderer reads the nonce from; the response copy is
  // what the browser enforces. Both must carry the same nonce.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("content-security-policy", policy);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", policy);
  return response;
}

export const config = {
  // A negative lookahead here trips a Next build invariant against the /admin route,
  // so every path is matched and the exclusions are applied above instead.
  matcher: ["/:path*"],
};
