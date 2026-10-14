import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

async function get(pathname, options) {
  return fetch(`${baseUrl}${pathname}`, { redirect: "manual", ...options });
}

test("empty production blog renders an honest accessible landing page", async () => {
  const response = await get("/blog");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Blog &amp; Insights/);
  assert.match(html, /No articles have been published yet/i);
  assert.doesNotMatch(html, /development fixture/i);
  assert.match(html, /<form[^>]+role="search"/);
});

test("search results are not indexed as duplicate editorial pages", async () => {
  const response = await get("/blog?query=privacy");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<meta name="robots" content="[^"]*noindex/i);
});

test("invalid and unpublished article slugs are not accessible", async () => {
  const [missing, encodedTraversal] = await Promise.all([
    get("/blog/not-a-real-article"),
    get("/blog/%2e%2e%2fnot-a-real-article"),
  ]);

  assert.equal(missing.status, 404);
  assert.ok([400, 404].includes(encodedTraversal.status));
});

test("unknown categories return not found instead of an invented archive", async () => {
  const response = await get("/blog/category/not-a-real-category");
  assert.equal(response.status, 404);
});

test("public navigation and footer link to the blog without exposing CMS login", async () => {
  const home = await get("/");
  const html = await home.text();

  assert.equal(home.status, 200);
  assert.match(html, /href="\/blog"/);
  assert.doesNotMatch(html, /href="\/admin/);
});

test("admin foundation is noindexed and redirects to the static Decap shell", async () => {
  const redirect = await get("/admin");
  const shell = await get("/admin/index.html");
  const html = await shell.text();

  assert.ok([307, 308].includes(redirect.status));
  assert.equal(redirect.headers.get("location"), "/admin/index.html");
  assert.equal(shell.status, 200);
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  assert.match(html, /decap-cms@3\.17\.1/);
  assert.match(shell.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(shell.headers.get("x-frame-options"), "DENY");
});

test("sitemap lists the public blog but no drafts, fixtures, or administration routes", async () => {
  const response = await get("/sitemap.xml");
  const xml = await response.text();

  assert.equal(response.status, 200);
  assert.match(xml, /https:\/\/saferedact\.io\/blog<\/loc>/);
  assert.doesNotMatch(xml, /development-fixture|draft-development|\/admin/);
});
