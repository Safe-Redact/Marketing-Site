import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const get = (pathname) => fetch(`${baseUrl}${pathname}`, { redirect: "manual" });
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

const routes = [
  ["/industries", "Industry guides to document, audio, and video redaction."],
  ["/industries/legal", "Redaction review for case files, discovery, and evidence."],
  ["/industries/government", "Redaction for agency records, disclosures, and public release."],
  ["/industries/local-government", "Redaction for council and municipal records that residents can see."],
  ["/industries/healthcare", "Redaction review for patient records and clinical documents."],
  ["/industries/finance", "Redaction for statements, client files, and financial communications."],
  ["/industries/insurance", "Redaction for claims files, recorded statements, and supporting media."],
  ["/industries/education", "Redaction for student records, school correspondence, and campus footage."],
  ["/industries/human-resources", "Redaction for personnel files, workplace investigations, and interview recordings."],
  ["/industries/media-journalism", "Protect sources and bystanders in interviews, footage, and documents."],
  ["/how-it-works", "How OpenRedakt takes a file from source to reviewed output."],
  ["/why-openredakt", "Why OpenRedakt: one review-led workflow for every format."],
  ["/contact", "Contact OpenRedakt or request a demo."],
];
const drafts = ["/industries/real-estate", "/industries/ai-data-teams"];

const pages = new Map();
async function page(path) {
  if (!pages.has(path)) {
    const response = await get(path);
    pages.set(path, { status: response.status, html: await response.text() });
  }
  return pages.get(path);
}

test("new marketing routes render one H1, a canonical, Open Graph, and breadcrumbs", async () => {
  const descriptions = new Set();
  const titles = new Set();
  for (const [path, h1] of routes) {
    const { status, html } = await page(path);
    assert.equal(status, 200, path);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path} should have one H1`);
    assert.ok(html.replace(/&#x27;/g, "'").includes(h1), `${path} needs its approved H1`);
    assert.match(html, new RegExp(`rel="canonical" href="https://saferedact\\.io${escape(path)}"`), path);
    assert.match(html, /<meta property="og:title" content="[^"]+"/, path);
    assert.match(html, /<meta property="og:site_name" content="OpenRedakt"/, path);
    assert.match(html, new RegExp(`<meta property="og:url" content="https://saferedact\\.io${escape(path)}"`), path);
    assert.match(html, /aria-label="Breadcrumb"/, path);
    assert.match(html, /<script type="application\/ld\+json" nonce="[^"]+">\{"@context":"https:\/\/schema\.org","@type":"BreadcrumbList"/, path);
    assert.doesNotMatch(html, /"@type":"FAQPage"/, path);
    assert.doesNotMatch(html, /<meta name="robots" content="noindex/, path);
    titles.add(/<title>([^<]+)<\/title>/.exec(html)?.[1]);
    descriptions.add(/<meta name="description" content="([^"]+)"/.exec(html)?.[1]);
  }
  assert.equal(titles.size, routes.length, "titles must be unique");
  assert.equal(descriptions.size, routes.length, "descriptions must be unique");
});

test("draft industries fail closed and stay out of the sitemap", async () => {
  const sitemap = await (await get("/sitemap.xml")).text();
  for (const path of drafts) {
    const response = await get(path);
    assert.equal(response.status, 404, path);
    assert.doesNotMatch(sitemap, new RegExp(`${escape(path)}</loc>`));
  }
  for (const [path] of routes) assert.match(sitemap, new RegExp(`https://saferedact\\.io${escape(path)}</loc>`), path);
  assert.match(sitemap, /https:\/\/saferedact\.io\/features\/video-redaction<\/loc>/);
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, new Set(sitemap.match(/<loc>[^<]+<\/loc>/g)).size, "no duplicate sitemap URLs");
});

test("the header renders Features and Industries disclosure menus with crawlable links", async () => {
  const { html } = await page("/industries/legal");
  for (const id of ["features", "industries"]) {
    assert.match(html, new RegExp(`<button type="button" aria-expanded="false" aria-controls="nav-menu-${id}"`));
    assert.match(html, new RegExp(`<div id="nav-menu-${id}" hidden=""`));
  }
  const industriesPanel = html.slice(html.indexOf('id="nav-menu-industries"'), html.indexOf('id="nav-menu-industries"') + 12000);
  for (const href of ["/industries/legal", "/industries/government", "/industries/healthcare", "/industries/finance", "/industries/insurance", "/industries"]) {
    assert.match(industriesPanel, new RegExp(`href="${escape(href)}"`));
  }
  assert.match(industriesPanel, /<a aria-current="page"[^>]*href="\/industries\/legal"/);
  assert.doesNotMatch(html, /role="menu"/);
  assert.match(html, /aria-controls="mobile-navigation"/);
  for (const draft of drafts) assert.doesNotMatch(html, new RegExp(`href="${escape(draft)}"`));
});

test("industry pages link into features, related industries, the lifecycle page, and contact", async () => {
  const { html } = await page("/industries/media-journalism");
  assert.match(html, /href="\/features\/video-redaction"/);
  assert.match(html, /href="\/industries\/legal"/);
  assert.match(html, /href="\/how-it-works"/);
  assert.match(html, /href="\/contact"/);
  // Media-led layout puts workflows before challenges.
  assert.ok(html.indexOf('id="media-journalism-workflows"') < html.indexOf('id="media-journalism-challenges"'));
  const legal = (await page("/industries/legal")).html;
  assert.ok(legal.indexOf('id="legal-sensitive"') < legal.indexOf('id="legal-workflows"'));
  assert.match(legal, /href="\/blog\/understanding-document-redaction"/);
});

test("the contact page reuses the single demo enquiry form", async () => {
  const { html } = await page("/contact");
  assert.equal((html.match(/id="demo-enquiry"/g) ?? []).length, 1);
  assert.match(html, /<form[^>]+aria-labelledby="demo-enquiry-heading"/);
  assert.match(html, /id="website"[^>]*tabindex="-1"/i);
  assert.match(html, /href="mailto:support@saferedact\.io"/);
});

test("the homepage keeps its section anchors and links to the dedicated pages", async () => {
  const { html } = await page("/");
  for (const id of ["services", "how-it-works", "why-saferedact", "industries", "faq", "demo-enquiry"]) {
    assert.match(html, new RegExp(`id="${id}"`), id);
  }
  for (const href of ["/features", "/industries", "/how-it-works", "/why-openredakt", "/contact", "/blog"]) {
    assert.match(html, new RegExp(`href="${escape(href)}"`), href);
  }
});

test("every internal link on the marketing pages resolves without redirects", async () => {
  const sources = ["/", "/features", "/features/audio-redaction", ...routes.map(([path]) => path)];
  const targets = new Set();
  for (const path of sources) {
    const { html } = await page(path);
    for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      if (!/^\/(?:_next|favicon|admin|api)/.test(match[1])) targets.add(match[1] || "/");
    }
  }
  const broken = [];
  await Promise.all([...targets].map(async (target) => {
    const response = await get(target);
    if (response.status !== 200) broken.push(`${target} → ${response.status}`);
  }));
  assert.deepEqual(broken, []);
  // Home, Features (4), Industries (10), How It Works, Why, Contact, Insights hub and article.
  assert.ok(targets.size >= 20, `expected a connected site, found ${targets.size} internal targets`);
});

test("design prototypes are not routable in production builds", async () => {
  // page.dev.tsx files are only recognised by `next dev` (see next.config.ts pageExtensions).
  for (const path of ["/prototypes", "/prototypes/hero-a", "/prototypes/hero-b"]) {
    const response = await get(path);
    assert.equal(response.status, 404, `${path} must not exist in production`);
  }
  const sitemap = await (await get("/sitemap.xml")).text();
  assert.doesNotMatch(sitemap, /prototypes/);
});
