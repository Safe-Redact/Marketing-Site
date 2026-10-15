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
  const config = await get("/admin/config.yml");
  const html = await shell.text();
  const configText = await config.text();

  assert.ok([307, 308].includes(redirect.status));
  assert.equal(redirect.headers.get("location"), "/admin/index.html");
  assert.equal(shell.status, 200);
  assert.equal(config.status, 200);
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  assert.match(html, /decap-cms@3\.17\.1/);
  assert.match(configText, /base_url:\s*https:\/\/cms-auth\.invalid/);
  assert.doesNotMatch(configText, /api\.netlify\.com|client_secret|access_token/i);
  assert.match(shell.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(shell.headers.get("x-frame-options"), "DENY");
});

test("only the admin document receives the eval exception; public routes receive none", async () => {
  const [home, blog, shell, config] = await Promise.all([
    get("/"),
    get("/blog"),
    get("/admin/index.html"),
    get("/admin/config.yml"),
  ]);
  const [homeHtml, blogHtml, shellHtml, configText] = await Promise.all([
    home.text(),
    blog.text(),
    shell.text(),
    config.text(),
  ]);

  // Public routes must not grant eval by header or by an inline document policy.
  for (const response of [home, blog]) {
    assert.doesNotMatch(response.headers.get("content-security-policy") ?? "", /unsafe-eval/);
  }
  for (const html of [homeHtml, blogHtml]) {
    assert.doesNotMatch(html, /unsafe-eval/);
  }

  // The exception lives in the admin document's own script-src and nowhere else:
  // not in its response headers, and not on sibling assets under the same path.
  assert.match(shellHtml, /script-src [^";]*'unsafe-eval'/);
  assert.doesNotMatch(shell.headers.get("content-security-policy") ?? "", /unsafe-eval/);
  assert.doesNotMatch(config.headers.get("content-security-policy") ?? "", /unsafe-eval/);
  assert.doesNotMatch(configText, /unsafe-eval/);

  // Anti-framing and referrer protections survive the change.
  assert.match(shell.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(shell.headers.get("x-frame-options"), "DENY");
  assert.equal(shell.headers.get("referrer-policy"), "no-referrer");
});

test("sitemap lists the public blog but no drafts, fixtures, or administration routes", async () => {
  const response = await get("/sitemap.xml");
  const xml = await response.text();

  assert.equal(response.status, 200);
  assert.match(xml, /https:\/\/saferedact\.io\/blog<\/loc>/);
  assert.doesNotMatch(xml, /development-fixture|draft-development|\/admin/);
});

const requiredPublicDirectives = [
  "default-src 'self'",
  "style-src 'self'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
];

const publicRoutes = [
  "/",
  "/blog",
  "/blog?query=privacy",
  "/blog/not-a-real-article",
  "/blog/category/not-a-real-category",
  "/this-route-does-not-exist",
  "/robots.txt",
  "/sitemap.xml",
  "/api/contact",
];

function directives(policy) {
  return new Map(
    policy
      .split(";")
      .map((directive) => directive.trim())
      .filter(Boolean)
      .map((directive) => {
        const [name, ...sources] = directive.split(/\s+/);
        return [name, sources.join(" ")];
      })
  );
}

test("every public route serves the strict nonce-based policy", async () => {
  const responses = await Promise.all(publicRoutes.map((route) => get(route)));

  for (const [index, response] of responses.entries()) {
    const route = publicRoutes[index];
    const policy = response.headers.get("content-security-policy");
    assert.ok(policy, `${route} must carry a Content-Security-Policy header`);

    for (const directive of requiredPublicDirectives) {
      assert.ok(policy.includes(directive), `${route} must keep ${directive}`);
    }

    const scriptSrc = directives(policy).get("script-src");
    assert.match(scriptSrc ?? "", /^'self' 'nonce-[A-Za-z0-9+/]{22}=='$/, route);
  }
});

test("the public policy never grants eval or inline script, and keeps inline style to attributes", async () => {
  const responses = await Promise.all(publicRoutes.map((route) => get(route)));

  for (const [index, response] of responses.entries()) {
    const route = publicRoutes[index];
    const policy = response.headers.get("content-security-policy") ?? "";
    const parsed = directives(policy);

    assert.doesNotMatch(policy, /unsafe-eval/, `${route} must never grant eval`);
    assert.doesNotMatch(parsed.get("script-src") ?? "", /'unsafe-inline'|\*|data:/, route);
    assert.doesNotMatch(parsed.get("style-src") ?? "", /'unsafe-inline'/, route);

    // The admin document widens connect-src to blob: for the editor's media reads.
    // Public routes must stay at 'self' exactly, with no scheme added.
    assert.equal(parsed.get("connect-src"), "'self'", route);

    // The single inline allowance is scoped to the style attribute and nowhere else.
    const inlineAllowances = [...parsed].filter(([, sources]) => sources.includes("'unsafe-inline'"));
    assert.deepEqual(inlineAllowances.map(([name]) => name), ["style-src-attr"], route);
  }
});

test("each response mints its own nonce", async () => {
  const [first, second] = await Promise.all([get("/"), get("/")]);
  const nonceOf = (response) =>
    /'nonce-([^']+)'/.exec(response.headers.get("content-security-policy") ?? "")?.[1];

  const firstNonce = nonceOf(first);
  assert.ok(firstNonce);
  assert.notEqual(firstNonce, nonceOf(second));
});

test("rendered documents carry no script or style the policy would block", async () => {
  // A statically prerendered document would be served with a freshly minted nonce in
  // its header and none on its inline scripts, so this is what guards the nonce
  // mechanism against silently regressing into a broken page.
  const documentRoutes = [
    "/",
    "/blog",
    "/blog?query=privacy",
    "/blog/category/not-a-real-category",
    "/this-route-does-not-exist",
  ];

  for (const route of documentRoutes) {
    const response = await get(route);
    const html = await response.text();
    const nonce = /'nonce-([^']+)'/.exec(response.headers.get("content-security-policy") ?? "")?.[1];
    assert.ok(nonce, `${route} must mint a nonce`);

    for (const tag of html.match(/<script\b[^>]*>/g) ?? []) {
      assert.ok(tag.includes(`nonce="${nonce}"`), `${route} serves an unnonced script: ${tag}`);
    }

    // style-src stays at 'self', so no inline <style> element may reach the browser.
    assert.equal(html.match(/<style\b/g)?.length ?? 0, 0, `${route} serves an inline <style>`);
  }
});

test("the admin tree keeps its own policy and is never given the public one", async () => {
  const [shell, config, redirect] = await Promise.all([
    get("/admin/index.html"),
    get("/admin/config.yml"),
    get("/admin"),
  ]);

  for (const response of [shell, config, redirect]) {
    const policy = response.headers.get("content-security-policy");
    assert.equal(policy, "frame-ancestors 'none'");
    assert.doesNotMatch(policy, /nonce-|script-src/);
  }

  // The eval exception the Decap bundle needs stays in the document, which is the
  // only policy the admin shell enforces beyond the anti-framing header above.
  const html = await shell.text();
  assert.match(html, /script-src [^";]*'unsafe-eval'/);
});

test("the admin blob allowance never leaks into a response header", async () => {
  const [home, blog, shell, config] = await Promise.all([
    get("/"),
    get("/blog"),
    get("/admin/index.html"),
    get("/admin/config.yml"),
  ]);

  for (const response of [home, blog, shell, config]) {
    assert.doesNotMatch(response.headers.get("content-security-policy") ?? "", /blob:/);
  }

  // It lives in the admin document's own connect-src, and the public documents
  // neither carry a document policy nor mention the scheme.
  const shellHtml = await shell.text();
  assert.match(shellHtml, /connect-src [^";]*blob:/);
  for (const html of await Promise.all([home.text(), blog.text()])) {
    assert.doesNotMatch(html, /http-equiv="Content-Security-Policy"/);
    assert.doesNotMatch(html, /connect-src/);
  }
});
