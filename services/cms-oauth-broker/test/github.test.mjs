import assert from "node:assert/strict";
import test from "node:test";

import { loadConfig } from "../src/config.mjs";
import { authorizeStaff, buildAuthorizationUrl, exchangeCode } from "../src/github.mjs";

const config = loadConfig({
  GITHUB_OAUTH_CLIENT_ID: "development-client-id",
  GITHUB_OAUTH_CLIENT_SECRET: "development-client-secret",
  OAUTH_PUBLIC_ORIGIN: "https://auth.dev.example:8443",
  OAUTH_CALLBACK_URL: "https://auth.dev.example:8443/callback",
  OAUTH_ALLOWED_ORIGINS: "https://cms.dev.example:3000",
  OAUTH_ALLOWED_REPOSITORY: "Safe-Redact/Marketing-Site",
  OAUTH_ALLOWED_GITHUB_USER_IDS: "101",
  OAUTH_STATE_SECRET: Buffer.alloc(32, 7).toString("base64url"),
  OAUTH_GITHUB_SCOPE: "public_repo",
});

function jsonResponse(value, init = {}) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });
}

test("buildAuthorizationUrl sends exact callback, minimal scope, state, and PKCE S256", () => {
  const url = buildAuthorizationUrl({
    state: "s".repeat(43),
    codeChallenge: "c".repeat(43),
    config,
  });

  assert.equal(url.origin + url.pathname, "https://github.com/login/oauth/authorize");
  assert.equal(url.searchParams.get("client_id"), "development-client-id");
  assert.equal(url.searchParams.get("redirect_uri"), "https://auth.dev.example:8443/callback");
  assert.equal(url.searchParams.get("scope"), "public_repo");
  assert.equal(url.searchParams.get("state"), "s".repeat(43));
  assert.equal(url.searchParams.get("code_challenge"), "c".repeat(43));
  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  assert.equal(url.searchParams.has("client_secret"), false);
});

test("exchangeCode performs a strict server-side exchange and drops refresh material", async () => {
  let capturedRequest;
  const fetchImpl = async (request) => {
    capturedRequest = request;
    return jsonResponse({
      access_token: "approved-access-token",
      token_type: "bearer",
      scope: "public_repo",
      expires_in: 28_800,
      refresh_token: "must-not-leave-the-broker",
      refresh_token_expires_in: 15897600,
    });
  };

  const token = await exchangeCode({
    code: "approved-code",
    codeVerifier: "v".repeat(86),
    config,
    fetchImpl,
  });

  assert.deepEqual(token, { accessToken: "approved-access-token", expiresIn: 28_800 });
  assert.equal(capturedRequest.url, "https://github.com/login/oauth/access_token");
  assert.equal(capturedRequest.method, "POST");
  assert.equal(capturedRequest.headers.get("accept"), "application/json");
  const body = new URLSearchParams(await capturedRequest.text());
  assert.equal(body.get("client_id"), "development-client-id");
  assert.equal(body.get("client_secret"), "development-client-secret");
  assert.equal(body.get("code"), "approved-code");
  assert.equal(body.get("redirect_uri"), config.callbackUrl);
  assert.equal(body.get("code_verifier"), "v".repeat(86));
});

test("exchangeCode rejects provider, scope, malformed, oversized, and network failures generically", async () => {
  const cases = [
    async () => new Response("denied", { status: 401 }),
    async () => jsonResponse({ access_token: "token", token_type: "bearer", scope: "repo" }),
    async () => jsonResponse({ access_token: "token", token_type: "bearer", scope: "public_repo" }),
    async () => jsonResponse({ token_type: "bearer", scope: "public_repo" }),
    async () => new Response("not-json", { headers: { "Content-Type": "application/json" } }),
    async () => new Response(`{"access_token":"${"a".repeat(70_000)}"}`, {
      headers: { "Content-Type": "application/json" },
    }),
    async () => {
      throw new Error("network contained approved-code");
    },
  ];

  for (const fetchImpl of cases) {
    await assert.rejects(
      exchangeCode({
        code: "approved-code",
        codeVerifier: "v".repeat(86),
        config,
        fetchImpl,
      }),
      (error) => error instanceof Error &&
        /token exchange failed/i.test(error.message) &&
        !error.message.includes("approved-code")
    );
  }
});

test("authorizeStaff accepts only an allowlisted GitHub user with repository write permission", async () => {
  const requested = [];
  const fetchImpl = async (request) => {
    requested.push({ url: request.url, authorization: request.headers.get("authorization") });
    if (request.url.endsWith("/user")) {
      return jsonResponse({ id: 101, login: "approved-editor", type: "User" });
    }
    return jsonResponse({
      id: 55,
      full_name: "Safe-Redact/Marketing-Site",
      private: false,
      permissions: { admin: false, maintain: false, push: true, triage: true, pull: true },
    });
  };

  const staff = await authorizeStaff({
    accessToken: "approved-access-token",
    config,
    fetchImpl,
  });

  assert.deepEqual(staff, { id: 101, login: "approved-editor" });
  assert.deepEqual(requested.map(({ url }) => url), [
    "https://api.github.com/user",
    "https://api.github.com/repos/Safe-Redact/Marketing-Site",
  ]);
  assert.ok(requested.every(({ authorization }) => authorization === "Bearer approved-access-token"));
});

test("authorizeStaff denies unapproved, removed, read-only, malformed, and unavailable identities", async () => {
  const scenarios = [
    async (request) => request.url.endsWith("/user")
      ? jsonResponse({ id: 999, login: "not-approved", type: "User" })
      : jsonResponse({ permissions: { push: true } }),
    async (request) => request.url.endsWith("/user")
      ? jsonResponse({ id: 101, login: "approved-editor", type: "User" })
      : jsonResponse({ permissions: { push: false } }),
    async () => jsonResponse({ id: "not-a-number", login: "broken", type: "User" }),
    async () => new Response("revoked", { status: 401 }),
    async () => {
      throw new Error("network contained approved-access-token");
    },
  ];

  for (const fetchImpl of scenarios) {
    await assert.rejects(
      authorizeStaff({ accessToken: "approved-access-token", config, fetchImpl }),
      (error) => error instanceof Error &&
        /staff authorization failed/i.test(error.message) &&
        !error.message.includes("approved-access-token")
    );
  }
});
