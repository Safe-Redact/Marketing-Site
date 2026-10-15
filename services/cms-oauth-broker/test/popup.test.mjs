import assert from "node:assert/strict";
import test from "node:test";

import { createPopupResponse } from "../src/popup.mjs";

test("success popup pins every message to the exact initiating origin", async () => {
  const response = createPopupResponse({
    origin: "https://cms.dev.example:3000",
    outcome: { status: "success", token: "temporary-token", provider: "github" },
  });
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /https:\/\/cms\.dev\.example:3000/);
  assert.match(body, /event\.origin !== targetOrigin/);
  assert.match(body, /event\.source !== window\.opener/);
  assert.match(body, /authorizing:github/);
  assert.match(body, /authorization:github:success:/);
  assert.match(body, /temporary-token/);
  assert.doesNotMatch(body, /postMessage\([^;]+,\s*["']\*["']/);
  assert.doesNotMatch(body, /location\.origin/);
});

test("error popup uses a stable public message and never includes sensitive details", async () => {
  const response = createPopupResponse({
    origin: "https://cms.dev.example:3000",
    outcome: {
      status: "error",
      message: "Authentication could not be completed.",
    },
  });
  const body = await response.text();

  assert.match(body, /authorization:github:error:/);
  assert.match(body, /Authentication could not be completed/);
  assert.doesNotMatch(body, /client_secret|code_verifier|access_token/i);
  assert.doesNotMatch(body, /postMessage\([^;]+,\s*["']\*["']/);
});

test("popup responses carry strict no-store and browser security headers", () => {
  const response = createPopupResponse({
    origin: "https://cms.dev.example:3000",
    outcome: { status: "error", message: "Authentication could not be completed." },
  });

  assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
  assert.equal(response.headers.get("pragma"), "no-cache");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.match(response.headers.get("content-security-policy"), /default-src 'none'/);
  assert.match(response.headers.get("content-security-policy"), /script-src 'nonce-/);
  assert.match(response.headers.get("content-type"), /^text\/html/);
});

test("popup generation rejects non-HTTPS and path-bearing origins", () => {
  for (const origin of [
    "http://cms.dev.example:3000",
    "https://cms.dev.example:3000/admin",
    "https://*.dev.example",
  ]) {
    assert.throws(
      () => createPopupResponse({
        origin,
        outcome: { status: "error", message: "Authentication could not be completed." },
      }),
      /exact HTTPS origin/i
    );
  }
});
