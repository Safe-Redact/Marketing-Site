import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("homepage exposes the approved Phase 1 platform narrative", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /AI-powered redaction/);
  assert.match(html, /Detect sensitive information\. Redact with confidence\./);
  // The hero carries an authentic screenshot of the editor rather than an
  // illustration, so the workbench is asserted through the figure and its
  // described image instead of text that used to sit in a drawn title bar.
  assert.match(html, /data-hero-workbench/);
  assert.match(html, /hero-document-review/);
  assert.match(html, /Screenshot of the current redaction editor/);
  assert.match(html, /Documents &amp; images/);
  assert.match(html, /Video/);
  assert.match(html, /Audio/);
  assert.match(html, /Offline on Windows/);
  assert.match(html, /faces, license plates, and text/i);
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
  assert.match(html, /href="#how-it-works"/);
  assert.match(html, /href="#faq"/);
  assert.match(html, /href="#demo-enquiry"/);
  assert.match(html, /href="mailto:support@saferedact\.io"/);
  assert.doesNotMatch(html, /https:\/\/saferedact\.io\/download/);
  assert.match(html, /aria-controls="mobile-navigation"/);
  assert.match(html, /aria-expanded="false"/);
});
