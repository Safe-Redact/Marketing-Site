import assert from "node:assert/strict";
import test from "node:test";

import { loadConfig } from "../src/config.mjs";

const stateSecret = Buffer.alloc(32, 7).toString("base64url");

function validEnvironment(overrides = {}) {
  return {
    GITHUB_OAUTH_CLIENT_ID: "development-client-id",
    GITHUB_OAUTH_CLIENT_SECRET: "development-client-secret",
    OAUTH_PUBLIC_ORIGIN: "https://auth.dev.example:8443",
    OAUTH_CALLBACK_URL: "https://auth.dev.example:8443/callback",
    OAUTH_ALLOWED_ORIGINS: "https://cms.dev.example:3000",
    OAUTH_ALLOWED_REPOSITORY: "Safe-Redact/Marketing-Site",
    OAUTH_ALLOWED_GITHUB_USER_IDS: "101,202",
    OAUTH_STATE_SECRET: stateSecret,
    OAUTH_GITHUB_SCOPE: "public_repo",
    ...overrides,
  };
}

test("loadConfig returns canonical exact origins and minimal GitHub policy", () => {
  const config = loadConfig(validEnvironment({
    OAUTH_ALLOWED_ORIGINS: "https://cms.dev.example:443,https://cms.dev.example:3000",
  }));

  assert.equal(config.publicOrigin, "https://auth.dev.example:8443");
  assert.equal(config.callbackUrl, "https://auth.dev.example:8443/callback");
  assert.deepEqual([...config.allowedOrigins], [
    "https://cms.dev.example",
    "https://cms.dev.example:3000",
  ]);
  assert.equal(config.siteIdOrigins.get("cms.dev.example"), "https://cms.dev.example");
  assert.equal(config.siteIdOrigins.get("cms.dev.example:3000"), "https://cms.dev.example:3000");
  assert.equal(config.repository, "Safe-Redact/Marketing-Site");
  assert.deepEqual([...config.allowedGitHubUserIds], [101, 202]);
  assert.equal(config.scope, "public_repo");
  assert.equal(config.transactionTtlMs, 600_000);
  assert.equal(config.maxPendingTransactions, 1024);
  assert.equal(config.githubAuthorizeUrl, "https://github.com/login/oauth/authorize");
  assert.equal(config.githubTokenUrl, "https://github.com/login/oauth/access_token");
  assert.equal(config.githubApiUrl, "https://api.github.com");
});

test("loadConfig bounds the maximum number of pending OAuth transactions", () => {
  assert.equal(
    loadConfig(validEnvironment({ OAUTH_MAX_PENDING_TRANSACTIONS: "64" }))
      .maxPendingTransactions,
    64
  );
  for (const value of ["0", "15", "100001", "not-a-number"]) {
    assert.throws(
      () => loadConfig(validEnvironment({ OAUTH_MAX_PENDING_TRANSACTIONS: value })),
      /OAUTH_MAX_PENDING_TRANSACTIONS/i
    );
  }
});

test("loadConfig fails closed when any required value is missing", () => {
  for (const name of [
    "GITHUB_OAUTH_CLIENT_ID",
    "GITHUB_OAUTH_CLIENT_SECRET",
    "OAUTH_PUBLIC_ORIGIN",
    "OAUTH_CALLBACK_URL",
    "OAUTH_ALLOWED_ORIGINS",
    "OAUTH_ALLOWED_REPOSITORY",
    "OAUTH_ALLOWED_GITHUB_USER_IDS",
    "OAUTH_STATE_SECRET",
    "OAUTH_GITHUB_SCOPE",
  ]) {
    const environment = validEnvironment();
    delete environment[name];
    assert.throws(() => loadConfig(environment), new RegExp(`${name} is required`));
  }
});

test("loadConfig rejects inexact, unsafe, wildcard, and duplicate origins", () => {
  for (const unsafe of [
    "http://cms.dev.example",
    "https://user:password@cms.dev.example",
    "https://cms.dev.example/admin",
    "https://cms.dev.example?preview=true",
    "https://cms.dev.example#fragment",
    "https://*.dev.example",
    "cms.dev.example",
  ]) {
    assert.throws(
      () => loadConfig(validEnvironment({ OAUTH_ALLOWED_ORIGINS: unsafe })),
      /exact credential-free HTTPS origin/i
    );
  }

  assert.throws(
    () =>
      loadConfig(validEnvironment({
        OAUTH_ALLOWED_ORIGINS: "https://cms.dev.example,https://cms.dev.example:443",
      })),
    /duplicate/i
  );
});

test("loadConfig requires the exact configured callback and rejects alternate GitHub hosts", () => {
  for (const callback of [
    "https://auth.dev.example:8443/callback/extra",
    "https://other.dev.example:8443/callback",
    "https://auth.dev.example:8443/callback?next=other",
    "http://auth.dev.example:8443/callback",
  ]) {
    assert.throws(
      () => loadConfig(validEnvironment({ OAUTH_CALLBACK_URL: callback })),
      /callback/i
    );
  }

  assert.throws(
    () => loadConfig(validEnvironment({ GITHUB_HOSTNAME: "github.enterprise.example" })),
    /custom GitHub hosts are not enabled/i
  );
});

test("loadConfig rejects broad scopes, unsafe repositories, and invalid staff identifiers", () => {
  assert.throws(
    () => loadConfig(validEnvironment({ OAUTH_GITHUB_SCOPE: "repo,user" })),
    /public_repo/i
  );
  assert.throws(
    () => loadConfig(validEnvironment({ OAUTH_ALLOWED_REPOSITORY: "invalid repository" })),
    /owner\/repository/i
  );
  assert.throws(
    () => loadConfig(validEnvironment({ OAUTH_ALLOWED_GITHUB_USER_IDS: "101,not-a-number" })),
    /positive GitHub user IDs/i
  );
});

test("loadConfig errors never echo secret material", () => {
  const marker = "SENSITIVE_DO_NOT_REPEAT";

  assert.throws(
    () => loadConfig(validEnvironment({ OAUTH_STATE_SECRET: marker })),
    (error) => error instanceof Error && !error.message.includes(marker)
  );
});

test("the Decap localhost placeholder is aliased only where localhost is already allowed", () => {
  const local = loadConfig(validEnvironment({
    OAUTH_ALLOWED_ORIGINS: "https://localhost:3000",
  }));

  assert.equal(local.siteIdOrigins.get("localhost:3000"), "https://localhost:3000");
  assert.equal(local.siteIdOrigins.get("demo.decapcms.org"), "https://localhost:3000");

  // The alias is a site identifier only. It never becomes an origin the broker will
  // post a token to, and it is absent from a deployment allowlist without localhost.
  assert.equal(local.allowedOrigins.has("https://demo.decapcms.org"), false);
  assert.deepEqual([...local.allowedOrigins], ["https://localhost:3000"]);
  assert.equal(
    loadConfig(validEnvironment()).siteIdOrigins.get("demo.decapcms.org"),
    undefined
  );

  // 127.0.0.1 is not the hostname Decap substitutes on, so it gains no alias.
  assert.equal(
    loadConfig(validEnvironment({ OAUTH_ALLOWED_ORIGINS: "https://127.0.0.1:3000" }))
      .siteIdOrigins.get("demo.decapcms.org"),
    undefined
  );
});

test("an ambiguous or claimed localhost placeholder fails closed", () => {
  // Two localhost origins cannot both own the placeholder, so configuration is refused
  // rather than one of them being picked.
  assert.throws(
    () => loadConfig(validEnvironment({
      OAUTH_ALLOWED_ORIGINS: "https://localhost:3000,https://localhost:4000",
    })),
    /duplicate allowed site identifier/i
  );

  // Nor may the placeholder host be allowlisted alongside a localhost origin.
  assert.throws(
    () => loadConfig(validEnvironment({
      OAUTH_ALLOWED_ORIGINS: "https://localhost:3000,https://demo.decapcms.org",
    })),
    /duplicate allowed site identifier/i
  );
});
