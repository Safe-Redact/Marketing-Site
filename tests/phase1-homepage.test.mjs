import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("homepage exposes the approved Phase 1 platform narrative", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  // A context chip and an eyebrow sit above a two-line headline (2026-10-30 revision).
  assert.match(html, /Windows desktop app · Documents and audio/);
  assert.match(html, /Review-led redaction/);
  assert.match(html, /<h1[^>]*>\s*<span[^>]*>Redact with confidence\.<\/span>\s*<span[^>]*>Every decision stays yours\.<\/span>\s*<\/h1>/);
  assert.match(html, /Find and review sensitive information in documents and audio/);
  // The hero shows the current light-theme application (the masked project library)
  // in an application window; no dark capture of an earlier build is published.
  assert.match(html, /data-hero-workbench/);
  assert.match(html, /project-workspace\.png/);
  assert.match(html, /The OpenRedakt project library/);
  assert.doesNotMatch(html, /hero-document-review|format-documents/);
  assert.match(html, /Documents/);
  assert.match(html, /Audio/);
  assert.match(html, /Windows desktop/);
  assert.doesNotMatch(html, /Documents &amp; images|Video review controls|Video files|Scanned images/);
  assert.match(html, /review or adjust/i);
  assert.doesNotMatch(html, /99\.8%|24h|100% Confidential|Accuracy Guaranteed/);
  assert.doesNotMatch(
    html,
    /HIPAA|FISMA|GDPR|GLBA|compliant|encrypted|No Data Retention|one business day|rush processing|audit report/i
  );
  assert.doesNotMatch(html, /translate-y-6 opacity-0/);
});

test("homepage keeps the approved marketing navigation and conversion destinations", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  assert.match(html, /href="#services"/);
  // Global navigation now leads to dedicated pages; the homepage sections keep their
  // anchors for inbound links.
  assert.match(html, /href="\/how-it-works"/);
  assert.match(html, /id="how-it-works"/);
  assert.match(html, /href="#faq"/);
  assert.match(html, /href="\/book-a-demo"/);
  assert.match(html, /href="mailto:support@saferedact\.io"/);
  assert.doesNotMatch(html, /https:\/\/saferedact\.io\/download/);
  assert.match(html, /aria-controls="mobile-navigation"/);
  assert.match(html, /aria-expanded="false"/);
});
