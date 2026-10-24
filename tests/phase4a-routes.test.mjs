import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

async function get(pathname, options) {
  return fetch(`${baseUrl}${pathname}`, { redirect: "manual", ...options });
}

test("the published CMS article renders and remains discoverable across Insights", async () => {
  const [hub, article, search, tag, archived, sitemap] = await Promise.all([
    get("/blog"),
    get("/blog/understanding-document-redaction"),
    get("/blog?query=document"),
    get("/blog?tag=data-privacy"),
    get("/blog/cms-publishing-test"),
    get("/sitemap.xml"),
  ]);
  const [hubHtml, articleHtml, searchHtml, tagHtml, sitemapXml] = await Promise.all([
    hub.text(),
    article.text(),
    search.text(),
    tag.text(),
    sitemap.text(),
  ]);

  for (const response of [hub, article, search, tag, sitemap]) assert.equal(response.status, 200);
  assert.equal(archived.status, 404);
  assert.equal((hubHtml.match(/<h1\b/g) ?? []).length, 1);
  assert.match(hubHtml, /data-insights-page="true"/);
  assert.doesNotMatch(hubHtml, /data-editorial-theme="light"/);
  assert.match(hubHtml, /<h1[^>]*>\s*Insights\s*<\/h1>/);
  assert.doesNotMatch(hubHtml, /Practical guidance for safer redaction/);
  assert.match(hubHtml, /aria-label="Featured insight"/);
  assert.match(hubHtml, /%2Fimages%2Fproduct%2Fhero-document-review\.png/);
  assert.doesNotMatch(hubHtml, /aria-label="Filter content by type"/);
  assert.doesNotMatch(hubHtml, />\s*Company News\s*</);
  assert.doesNotMatch(hubHtml, />\s*Product Updates\s*</);
  assert.doesNotMatch(hubHtml, />\s*Guides &amp; Tutorials\s*</);
  assert.doesNotMatch(hubHtml, /aria-label="Article categories"/);
  assert.doesNotMatch(hubHtml, /aria-label="Filter content by tag"/);
  assert.match(hubHtml, /Understanding Document Redaction and Why It Matters/);
  assert.doesNotMatch(hubHtml, /No content has been published yet/i);
  assert.doesNotMatch(hubHtml, /coming soon|sample article|untitled article/i);
  assert.match(articleHtml, /rel="canonical" href="https:\/\/saferedact\.io\/blog\/understanding-document-redaction"/);
  assert.match(searchHtml, /Understanding Document Redaction and Why It Matters/);
  assert.match(tagHtml, /Understanding Document Redaction and Why It Matters/);
  assert.match(sitemapXml, /\/blog\/understanding-document-redaction<\/loc>/);
  assert.doesNotMatch(sitemapXml, /cms-publishing-test/);
  assert.match(hubHtml, /<form[^>]+role="search"/);
  assert.match(tagHtml, /<form[^>]+role="search"/);
  assert.doesNotMatch(tagHtml, /aria-label="Filter content by type"/);
});

test("an empty Insights search explains the result and offers a server-rendered reset", async () => {
  const response = await get("/blog?query=no-such-openredakt-article");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /No content matches your search/);
  assert.match(html, /href="\/blog"[^>]*>\s*browse all content\s*<\/a>/i);
  assert.match(html, /<meta name="robots" content="[^"]*noindex/i);
});

test("filtered Insights results use a chronological archive with semantic month headings", async () => {
  const response = await get("/blog?query=document");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /aria-label="Chronological article archive"/);
  assert.match(html, /<h2[^>]*>October 2026<\/h2>/);
  assert.match(html, /href="\/blog\/understanding-document-redaction"/);
});

test("a long-form article exposes breadcrumbs, matching heading anchors, TOC, and a demo-only side CTA", async () => {
  const response = await get("/blog/understanding-document-redaction");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /aria-label="Breadcrumb"/);
  assert.match(html, /aria-label="On this page"/);
  assert.match(html, /href="#what-is-document-redaction"/);
  assert.match(html, /<h2[^>]*id="what-is-document-redaction"/);
  assert.match(html, /alt="OpenRedakt document review workspace"/);
  assert.match(html, /aria-label="Discuss your redaction workflow"/);
  assert.match(html, /href="\/#demo-enquiry"/);
  assert.match(html, /id="article-closing-cta"/);
  const sidebar = html.match(/<div data-article-sidebar="true" class="([^"]+)"/);
  assert.ok(sidebar, "the sticky article sidebar should have an explicit scroll-owner boundary");
  assert.doesNotMatch(sidebar[1], /(?:max-h-|overflow-y-auto|overscroll-contain)/);
  assert.match(html, /data-toc-scroll-region="true"/);
  assert.doesNotMatch(html, /id="related-articles-heading"/);
  assert.doesNotMatch(html, /download|sign in|log in|free trial/i);
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

function expectedChatwootSources(parsed, route) {
  const frameSrc = parsed.get("frame-src");

  if (frameSrc === "'none'") {
    return null;
  }

  assert.match(frameSrc ?? "", /^https:\/\/[^\s/]+(?::\d+)?$/, `${route} must use one exact HTTPS chat origin`);
  const origin = new URL(frameSrc).origin;
  assert.equal(frameSrc, origin, `${route} must not grant a path or trailing slash in frame-src`);

  const socketOrigin = origin.replace(/^https:/, "wss:");
  assert.equal(parsed.get("img-src"), `'self' data: ${origin}`, route);
  assert.equal(parsed.get("connect-src"), `'self' ${origin} ${socketOrigin}`, route);

  return origin;
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

    const parsed = directives(policy);
    const chatwootOrigin = expectedChatwootSources(parsed, route);
    const scriptSrc = parsed.get("script-src");
    const expectedScript = chatwootOrigin
      ? new RegExp(`^'self' 'nonce-[A-Za-z0-9+/]{22}==' ${chatwootOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`)
      : /^'self' 'nonce-[A-Za-z0-9+/]{22}=='$/;
    assert.match(scriptSrc ?? "", expectedScript, route);
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

    // The public policy stays at 'self' unless the fail-closed support integration
    // is configured, in which case only one exact HTTPS origin and its WSS peer
    // are permitted. The admin document's blob: allowance must never leak here.
    expectedChatwootSources(parsed, route);

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

test("the legacy newsroom URL permanently redirects into the Insights news filter", async () => {
  const response = await get("/news");

  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "/blog?type=news");
});

test("Insights hides redundant controls on the one-story hub and keeps an escape on filtered views", async () => {
  const [response, filteredResponse] = await Promise.all([
    get("/blog"),
    get("/blog?type=article"),
  ]);
  const [html, filteredHtml] = await Promise.all([response.text(), filteredResponse.text()]);

  assert.equal(response.status, 200);
  assert.equal(filteredResponse.status, 200);
  for (const label of ["All content", "Industry Insights"]) {
    assert.ok(!html.includes(label), `the one-story hub must hide the redundant ${label} filter`);
    assert.ok(filteredHtml.includes(label), `a filtered view must offer the ${label} control`);
  }
  for (const label of ["Company News", "Product Updates", "Guides &amp; Tutorials"]) {
    assert.ok(!html.includes(label), `the hub must not offer an empty ${label} filter`);
  }

  // One content entry in the navigation, and it is the hub.
  assert.match(html, /href="\/blog"/);
  assert.doesNotMatch(html, /href="\/news"/);

  // With one published article, neither the content-type nor category row adds useful
  // choice on the hub. A deliberate filtered URL still retains an escape to all content.
  assert.doesNotMatch(html, /All insights/);
  assert.match(
    filteredHtml,
    /<nav aria-label="Filter content by type"[\s\S]*?href="\/blog"[\s\S]*?All content[\s\S]*?<\/nav>/
  );
});

test("only the active view claims aria-current on the hub", async () => {
  const [plain, filtered] = await Promise.all([get("/blog"), get("/blog?type=news")]);
  const [plainHtml, filteredHtml] = await Promise.all([plain.text(), filtered.text()]);

  // The desktop nav and the mobile menu each mark the Insights section, and exactly
  // one filter chip marks the view. Anything more is a conflicting "you are here".
  const chipCurrent = (html) =>
    (html.match(/aria-current="page"[^>]*href="\/blog\?type=[^"]*"/g) ?? []).length;

  assert.equal(chipCurrent(plainHtml), 0, "the unfiltered hub highlights All content, not a typed chip");
  assert.equal(chipCurrent(filteredHtml), 1, "exactly one type chip is current");
});

test("a type filter is canonical while search and deeper pages are not indexed", async () => {
  const [unfiltered, filtered, searched] = await Promise.all([
    get("/blog"),
    get("/blog?type=news"),
    get("/blog?query=privacy"),
  ]);
  const [plainHtml, filteredHtml, searchedHtml] = await Promise.all([
    unfiltered.text(),
    filtered.text(),
    searched.text(),
  ]);

  assert.match(plainHtml, /rel="canonical" href="https:\/\/saferedact\.io\/blog"/);
  assert.match(filteredHtml, /rel="canonical" href="https:\/\/saferedact\.io\/blog\?type=news"/);
  assert.doesNotMatch(plainHtml, /<meta name="robots" content="[^"]*noindex/i);
  assert.match(searchedHtml, /<meta name="robots" content="[^"]*noindex/i);
});

test("an unknown type falls back to the whole hub rather than erroring", async () => {
  const response = await get("/blog?type=not-a-type");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /rel="canonical" href="https:\/\/saferedact\.io\/blog"/);
});

test("staff surfaces are kept out of crawls and out of the sitemap", async () => {
  const [robots, sitemap, moderation] = await Promise.all([
    get("/robots.txt"),
    get("/sitemap.xml"),
    get("/moderation"),
  ]);
  const [robotsText, xml, html] = await Promise.all([robots.text(), sitemap.text(), moderation.text()]);

  for (const path of ["/admin", "/moderation", "/api/"]) {
    assert.ok(robotsText.includes(`Disallow: ${path}`), `robots must disallow ${path}`);
  }
  assert.doesNotMatch(xml, /\/moderation|\/admin|\/api\//);

  // The moderation tool is noindexed, carries the strict public policy, and grants
  // nothing by being reachable: every action is authorized server side.
  assert.equal(moderation.status, 200);
  assert.match(html, /<meta name="robots" content="[^"]*noindex/i);
  assert.match(moderation.headers.get("content-security-policy") ?? "", /^script-src 'self' 'nonce-/);
  assert.equal(html.match(/<script>/g)?.length ?? 0, 0);
});

test("moderation endpoints never answer a public caller with data", async () => {
  const responses = await Promise.all([
    get("/api/moderation/comments"),
    get("/api/moderation/history?comment=x"),
    get("/api/moderation/comments", { method: "POST", headers: { authorization: "Bearer forged" } }),
  ]);

  for (const response of responses) {
    // 503 when comments are switched off for the deployment, 403 once they are on.
    assert.ok([403, 405, 503].includes(response.status), `unexpected ${response.status}`);
    const body = await response.text();
    assert.doesNotMatch(body, /authorKey|author_key|COMMENTS_DATABASE_URL|postgres/i);
  }
});
