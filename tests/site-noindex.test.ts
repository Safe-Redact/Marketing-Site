import assert from "node:assert/strict";
import test from "node:test";

import nextConfig from "../next.config";
import robotsRoute from "../src/app/robots";

// Both read SITE_NOINDEX when called (Next calls them at build time), so each case sets
// or clears the variable before calling.
async function load(noIndex: boolean) {
  if (noIndex) process.env.SITE_NOINDEX = "true";
  else delete process.env.SITE_NOINDEX;
  const headers = (await nextConfig.headers?.()) ?? [];
  return { headers, robots: robotsRoute() };
}

test("production default: crawlable, no noindex header", async () => {
  const { headers, robots } = await load(false);

  assert.ok(!JSON.stringify(headers).includes("X-Robots-Tag"));
  assert.deepEqual(robots.rules, [
    { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/moderation", "/api/"] },
  ]);
  assert.match(String(robots.sitemap), /\/sitemap\.xml$/);
});

test("SITE_NOINDEX=true: every path carries noindex and robots disallows all", async () => {
  const { headers, robots } = await load(true);

  assert.deepEqual(headers.at(-1), { source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] });
  assert.deepEqual(robots.rules, [{ userAgent: "*", disallow: "/" }]);
  assert.equal(robots.sitemap, undefined);
  delete process.env.SITE_NOINDEX;
});
