import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL;
if (!baseUrl) throw new Error("TEST_BASE_URL is required.");

async function html(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path} should render`);
  return response.text();
}

function visibleText(document) {
  return document
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

test("public pages render OpenRedakt without leaking the retired display brand", async () => {
  const pages = await Promise.all([
    html("/"),
    html("/blog"),
    html("/blog/understanding-document-redaction"),
  ]);

  for (const page of pages) {
    const renderedText = visibleText(page);
    assert.match(renderedText, /OpenRedakt/);
    assert.doesNotMatch(renderedText, /SafeRedact|Safe Redact/);
    assert.doesNotMatch(renderedText, /OpenRedact(?!k)/);
  }
});

test("the staff CMS shell carries the OpenRedakt identity", async () => {
  const response = await fetch(`${baseUrl}/admin/index.html`);
  assert.equal(response.status, 200);
  const page = await response.text();
  assert.match(page, /OpenRedakt Content Studio/);
  assert.doesNotMatch(page, /SafeRedact|Safe Redact/);
});
