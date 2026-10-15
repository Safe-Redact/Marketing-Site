import assert from "node:assert/strict";
import test from "node:test";

import { createBroker } from "../src/broker.mjs";
import { loadConfig } from "../src/config.mjs";
import { MemoryTransactionStore } from "../src/transaction.mjs";

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
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
}

function startRequest(overrides = "") {
  return new Request(
    `${config.publicOrigin}/auth?provider=github&site_id=cms.dev.example%3A3000&scope=public_repo${overrides}`
  );
}

function callbackRequest(location, setCookie, overrides = {}) {
  const authorization = new URL(location);
  const state = authorization.searchParams.get("state");
  const url = overrides.url ?? `${config.callbackUrl}?code=${encodeURIComponent(overrides.code ?? "approved-code")}&state=${encodeURIComponent(overrides.state ?? state)}`;
  return new Request(url, {
    headers: { Cookie: setCookie.split(";", 1)[0] },
  });
}

function successfulGitHubFetch() {
  return async (request) => {
    if (request.url === config.githubTokenUrl) {
      return jsonResponse({
        access_token: "approved-access-token",
        token_type: "bearer",
        scope: "public_repo",
        expires_in: 28_800,
      });
    }
    if (request.url.endsWith("/user")) {
      return jsonResponse({ id: 101, login: "approved-editor", type: "User" });
    }
    return jsonResponse({
      full_name: "Safe-Redact/Marketing-Site",
      permissions: { push: true },
    });
  };
}

test("valid OAuth initialization issues an exact GitHub redirect and secure transaction cookie", async () => {
  const broker = createBroker({ config, store: new MemoryTransactionStore() });
  const response = await broker(startRequest());
  const location = new URL(response.headers.get("location"));

  assert.equal(response.status, 302);
  assert.equal(location.origin + location.pathname, config.githubAuthorizeUrl);
  assert.equal(location.searchParams.get("redirect_uri"), config.callbackUrl);
  assert.equal(location.searchParams.get("scope"), "public_repo");
  assert.match(location.searchParams.get("state"), /^[A-Za-z0-9_-]{43}$/);
  assert.match(location.searchParams.get("code_challenge"), /^[A-Za-z0-9_-]{43}$/);
  assert.equal(location.searchParams.get("code_challenge_method"), "S256");
  assert.match(response.headers.get("set-cookie"), /^__Host-saferedact-oauth-state=/);
  assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
});

test("initialization rejects invalid origin, provider, scope, and malformed requests before redirect", async () => {
  const broker = createBroker({ config, store: new MemoryTransactionStore() });
  const requests = [
    new Request(`${config.publicOrigin}/auth?provider=github&site_id=evil.dev.example&scope=public_repo`),
    new Request(`${config.publicOrigin}/auth?provider=gitlab&site_id=cms.dev.example%3A3000&scope=public_repo`),
    new Request(`${config.publicOrigin}/auth?provider=github&site_id=cms.dev.example%3A3000&scope=repo`),
    new Request(`${config.publicOrigin}/auth?provider=github&site_id=https%3A%2F%2Fcms.dev.example%3A3000&scope=public_repo`),
    new Request(`${config.publicOrigin}/auth`, { method: "POST" }),
    new Request(`https://other-auth.example/auth?provider=github&site_id=cms.dev.example%3A3000&scope=public_repo`),
  ];

  for (const request of requests) {
    const response = await broker(request);
    assert.ok(response.status >= 400);
    assert.equal(response.headers.has("location"), false);
    assert.doesNotMatch(await response.text(), /development-client|client_secret/i);
  }
});

test("callback exchanges PKCE code, authorizes staff, and returns token only to the bound origin", async () => {
  const events = [];
  const broker = createBroker({
    config,
    store: new MemoryTransactionStore(),
    fetchImpl: successfulGitHubFetch(),
    logger: (event) => events.push(event),
  });
  const start = await broker(startRequest());
  const callback = callbackRequest(start.headers.get("location"), start.headers.get("set-cookie"));
  const response = await broker(callback);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /authorization:github:success:/);
  assert.match(body, /approved-access-token/);
  assert.match(body, /https:\/\/cms\.dev\.example:3000/);
  assert.doesNotMatch(body, /postMessage\([^;]+,\s*["']\*["']/);
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
  assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
  assert.doesNotMatch(JSON.stringify([...response.headers]), /approved-access-token|approved-code/);
  assert.doesNotMatch(JSON.stringify(events), /approved-access-token|approved-code|development-client-secret/);
  assert.deepEqual(events.map(({ event, outcome }) => [event, outcome]), [
    ["oauth.initialize", "accepted"],
    ["oauth.callback", "accepted"],
  ]);
});

test("callback state is single-use and fails closed after replay or expiry", async () => {
  let now = 1_800_000_000_000;
  const broker = createBroker({
    config,
    store: new MemoryTransactionStore(),
    fetchImpl: successfulGitHubFetch(),
    now: () => now,
  });
  const start = await broker(startRequest());
  const callback = callbackRequest(start.headers.get("location"), start.headers.get("set-cookie"));
  assert.equal((await broker(callback)).status, 200);
  assert.equal((await broker(callback)).status, 400);

  const expiredStart = await broker(startRequest());
  now += config.transactionTtlMs + 1;
  const expiredCallback = callbackRequest(
    expiredStart.headers.get("location"),
    expiredStart.headers.get("set-cookie")
  );
  assert.equal((await broker(expiredCallback)).status, 400);
});

test("token exchange and staff authorization failures return generic exact-origin errors", async () => {
  const deniedFetch = async (request) => {
    if (request.url === config.githubTokenUrl) {
      return jsonResponse({
        access_token: "temporary",
        token_type: "bearer",
        scope: "public_repo",
        expires_in: 28_800,
      });
    }
    if (request.url.endsWith("/user")) {
      return jsonResponse({ id: 999, login: "not-approved", type: "User" });
    }
    return jsonResponse({ full_name: config.repository, permissions: { push: true } });
  };
  for (const fetchImpl of [
    async () => new Response("denied", { status: 401 }),
    deniedFetch,
  ]) {
    const broker = createBroker({ config, store: new MemoryTransactionStore(), fetchImpl });
    const start = await broker(startRequest());
    const response = await broker(callbackRequest(
      start.headers.get("location"),
      start.headers.get("set-cookie")
    ));
    const body = await response.text();
    assert.equal(response.status, 200);
    assert.match(body, /authorization:github:error:/);
    assert.match(body, /Authentication could not be completed/);
    assert.doesNotMatch(body, /temporary|not-approved|approved-code|denied/);
  }
});

test("malformed callbacks and unknown routes are denied without credential disclosure", async () => {
  const broker = createBroker({ config, store: new MemoryTransactionStore() });
  const responses = [
    await broker(new Request(`${config.callbackUrl}?state=broken`)),
    await broker(new Request(`${config.publicOrigin}/unknown`)),
    await broker(new Request(`${config.publicOrigin}/callback`, { method: "POST" })),
  ];
  assert.deepEqual(responses.map(({ status }) => status), [400, 404, 405]);
  for (const response of responses) {
    const body = await response.text();
    assert.doesNotMatch(body, /development-client-secret|stateSecret|client_secret/i);
    assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
  }
});

// decap-cms@3.17.1 discards backend.site_domain whenever the CMS is served from a
// localhost hostname and sends Netlify's demo identifier in its place. Captured from a
// real browser click on "Login with GitHub" at http://localhost:3490/admin/index.html:
//   /auth?provider=github&site_id=demo.decapcms.org&scope=public_repo
const decapLocalhostSiteId = "demo.decapcms.org";

const localhostConfig = loadConfig({
  GITHUB_OAUTH_CLIENT_ID: "development-client-id",
  GITHUB_OAUTH_CLIENT_SECRET: "development-client-secret",
  OAUTH_PUBLIC_ORIGIN: "https://localhost:8787",
  OAUTH_CALLBACK_URL: "https://localhost:8787/callback",
  OAUTH_ALLOWED_ORIGINS: "https://localhost:3000",
  OAUTH_ALLOWED_REPOSITORY: "Safe-Redact/Marketing-Site",
  OAUTH_ALLOWED_GITHUB_USER_IDS: "101",
  OAUTH_STATE_SECRET: Buffer.alloc(32, 7).toString("base64url"),
  OAUTH_GITHUB_SCOPE: "public_repo",
});

test("local development initialization accepts the identifier Decap actually sends", async () => {
  const events = [];
  const broker = createBroker({
    config: localhostConfig,
    store: new MemoryTransactionStore(),
    logger: (event) => events.push(event),
  });

  const response = await broker(
    new Request(
      `${localhostConfig.publicOrigin}/auth?provider=github&site_id=${decapLocalhostSiteId}&scope=public_repo`
    )
  );

  assert.equal(response.status, 302);
  assert.equal(events.at(-1).outcome, "accepted");

  // The alias resolves to the allowlisted origin, never to the placeholder host.
  assert.equal(localhostConfig.siteIdOrigins.get(decapLocalhostSiteId), "https://localhost:3000");
  assert.equal(localhostConfig.allowedOrigins.has(`https://${decapLocalhostSiteId}`), false);

  const location = new URL(response.headers.get("location"));
  assert.equal(location.origin, "https://github.com");
  assert.equal(location.searchParams.get("scope"), "public_repo");
  assert.match(location.searchParams.get("code_challenge"), /^[A-Za-z0-9_-]{43}$/);
  assert.equal(location.searchParams.get("code_challenge_method"), "S256");
});

test("the placeholder is an alias of a localhost origin, not a site identifier anyone may claim", async () => {
  // A deployment whose allowlist holds no localhost origin must still refuse it.
  const broker = createBroker({ config, store: new MemoryTransactionStore() });
  const response = await broker(
    new Request(
      `${config.publicOrigin}/auth?provider=github&site_id=${decapLocalhostSiteId}&scope=public_repo`
    )
  );
  assert.equal(response.status, 403);
  assert.equal(response.headers.has("location"), false);
  assert.equal(config.siteIdOrigins.get(decapLocalhostSiteId), undefined);

  // The alias widens nothing else: provider, scope and unknown sites stay rejected.
  const localhostBroker = createBroker({
    config: localhostConfig,
    store: new MemoryTransactionStore(),
  });
  for (const query of [
    `provider=gitlab&site_id=${decapLocalhostSiteId}&scope=public_repo`,
    `provider=github&site_id=${decapLocalhostSiteId}&scope=repo`,
    `provider=github&site_id=${decapLocalhostSiteId}`,
    "provider=github&site_id=evil.dev.example&scope=public_repo",
    `provider=github&site_id=${decapLocalhostSiteId}&site_id=evil.dev.example&scope=public_repo`,
  ]) {
    const rejected = await localhostBroker(new Request(`${localhostConfig.publicOrigin}/auth?${query}`));
    assert.equal(rejected.status, 403, query);
    assert.equal(rejected.headers.has("location"), false, query);
  }
});

test("a localhost login binds the token to the allowlisted origin, not the placeholder", async () => {
  const broker = createBroker({
    config: localhostConfig,
    store: new MemoryTransactionStore(),
    fetchImpl: successfulGitHubFetch(),
  });
  const start = await broker(
    new Request(
      `${localhostConfig.publicOrigin}/auth?provider=github&site_id=${decapLocalhostSiteId}&scope=public_repo`
    )
  );
  const authorization = new URL(start.headers.get("location"));
  const cookie = start.headers.get("set-cookie").split(";", 1)[0];
  const response = await broker(
    new Request(
      `${localhostConfig.callbackUrl}?code=approved-code&state=${encodeURIComponent(authorization.searchParams.get("state"))}`,
      { headers: { Cookie: cookie } }
    )
  );
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /https:\/\/localhost:3000/);
  assert.doesNotMatch(body, new RegExp(decapLocalhostSiteId.replace(/\./g, "\.")));
});
