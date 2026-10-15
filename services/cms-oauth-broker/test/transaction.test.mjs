import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import { loadConfig } from "../src/config.mjs";
import {
  MemoryTransactionStore,
  clearTransactionCookie,
  consumeOAuthTransaction,
  createOAuthTransaction,
} from "../src/transaction.mjs";

const now = 1_800_000_000_000;
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

function callbackRequest(state, cookie, url = `${config.callbackUrl}?code=approved-code&state=${state}`) {
  return new Request(url, { headers: cookie ? { Cookie: cookie } : {} });
}

function cookiePair(setCookie) {
  return setCookie.split(";", 1)[0];
}

test("createOAuthTransaction binds an exact origin and PKCE verifier to secure state", async () => {
  const store = new MemoryTransactionStore();
  const created = await createOAuthTransaction({
    origin: "https://cms.dev.example:3000",
    config,
    store,
    now,
  });

  assert.match(created.state, /^[A-Za-z0-9_-]{43}$/);
  assert.match(created.codeVerifier, /^[A-Za-z0-9_-]{86}$/);
  assert.equal(
    created.codeChallenge,
    createHash("sha256").update(created.codeVerifier).digest("base64url")
  );
  assert.match(created.setCookie, /^__Host-saferedact-oauth-state=/);
  assert.match(created.setCookie, /HttpOnly/);
  assert.match(created.setCookie, /Secure/);
  assert.match(created.setCookie, /SameSite=Lax/);
  assert.match(created.setCookie, /Path=\//);
  assert.match(created.setCookie, /Max-Age=600/);
  assert.doesNotMatch(created.setCookie, /Domain=/i);

  const stored = await consumeOAuthTransaction({
    request: callbackRequest(created.state, cookiePair(created.setCookie)),
    config,
    store,
    now,
  });
  assert.equal(stored.origin, "https://cms.dev.example:3000");
  assert.equal(stored.callbackUrl, config.callbackUrl);
  assert.equal(stored.codeVerifier, created.codeVerifier);
  assert.equal(stored.expiresAt, now + 600_000);
});

test("consumeOAuthTransaction succeeds once and rejects replay", async () => {
  const store = new MemoryTransactionStore();
  const created = await createOAuthTransaction({
    origin: "https://cms.dev.example:3000",
    config,
    store,
    now,
  });
  const request = callbackRequest(created.state, cookiePair(created.setCookie));

  const consumed = await consumeOAuthTransaction({ request, config, store, now: now + 1_000 });
  assert.equal(consumed.state, created.state);
  assert.equal(consumed.origin, "https://cms.dev.example:3000");

  await assert.rejects(
    consumeOAuthTransaction({ request, config, store, now: now + 2_000 }),
    /invalid, expired, or already used/i
  );
});

test("MemoryTransactionStore rejects new active records at its capacity", async () => {
  const store = new MemoryTransactionStore({ capacity: 2 });
  const transaction = (state, issuedAt = now) => ({
    state,
    issuedAt,
    expiresAt: issuedAt + 600_000,
  });

  await store.put(transaction("first"));
  await store.put(transaction("second"));
  await assert.rejects(store.put(transaction("third")), /temporarily unavailable/i);
});

test("MemoryTransactionStore prunes expired abandoned records before enforcing capacity", async () => {
  const store = new MemoryTransactionStore({ capacity: 2 });
  await store.put({ state: "expired-one", issuedAt: now, expiresAt: now + 1 });
  await store.put({ state: "expired-two", issuedAt: now, expiresAt: now + 1 });

  await assert.doesNotReject(
    store.put({ state: "fresh", issuedAt: now + 2, expiresAt: now + 600_002 })
  );
});

test("consumeOAuthTransaction rejects expired, mismatched, and tampered state", async () => {
  const expiredStore = new MemoryTransactionStore();
  const expired = await createOAuthTransaction({
    origin: "https://cms.dev.example:3000",
    config,
    store: expiredStore,
    now,
  });
  await assert.rejects(
    consumeOAuthTransaction({
      request: callbackRequest(expired.state, cookiePair(expired.setCookie)),
      config,
      store: expiredStore,
      now: now + 600_000,
    }),
    /invalid, expired, or already used/i
  );

  const mismatchStore = new MemoryTransactionStore();
  const mismatch = await createOAuthTransaction({
    origin: "https://cms.dev.example:3000",
    config,
    store: mismatchStore,
    now,
  });
  await assert.rejects(
    consumeOAuthTransaction({
      request: callbackRequest("A".repeat(43), cookiePair(mismatch.setCookie)),
      config,
      store: mismatchStore,
      now,
    }),
    /state mismatch/i
  );

  const tamperedStore = new MemoryTransactionStore();
  const tampered = await createOAuthTransaction({
    origin: "https://cms.dev.example:3000",
    config,
    store: tamperedStore,
    now,
  });
  const tamperedCookie = `${cookiePair(tampered.setCookie).slice(0, -1)}x`;
  await assert.rejects(
    consumeOAuthTransaction({
      request: callbackRequest(tampered.state, tamperedCookie),
      config,
      store: tamperedStore,
      now,
    }),
    /transaction cookie/i
  );
});

test("consumeOAuthTransaction requires the exact callback and a valid host cookie", async () => {
  const store = new MemoryTransactionStore();
  const created = await createOAuthTransaction({
    origin: "https://cms.dev.example:3000",
    config,
    store,
    now,
  });

  await assert.rejects(
    consumeOAuthTransaction({
      request: callbackRequest(
        created.state,
        cookiePair(created.setCookie),
        `https://auth.dev.example:8443/callback/other?code=approved-code&state=${created.state}`
      ),
      config,
      store,
      now,
    }),
    /callback URL/i
  );
  await assert.rejects(
    consumeOAuthTransaction({
      request: callbackRequest(created.state, ""),
      config,
      store,
      now,
    }),
    /transaction cookie/i
  );
});

test("consumeOAuthTransaction rejects duplicate state parameters", async () => {
  const store = new MemoryTransactionStore();
  const created = await createOAuthTransaction({
    origin: "https://cms.dev.example:3000",
    config,
    store,
    now,
  });
  const url = `${config.callbackUrl}?code=approved-code&state=${created.state}&state=${created.state}`;

  await assert.rejects(
    consumeOAuthTransaction({
      request: callbackRequest(created.state, cookiePair(created.setCookie), url),
      config,
      store,
      now,
    }),
    /state parameter/i
  );
});

test("independent concurrent transactions cannot consume each other", async () => {
  const store = new MemoryTransactionStore();
  const first = await createOAuthTransaction({
    origin: "https://cms.dev.example:3000",
    config,
    store,
    now,
  });
  const second = await createOAuthTransaction({
    origin: "https://cms.dev.example:3000",
    config,
    store,
    now,
  });

  await assert.rejects(
    consumeOAuthTransaction({
      request: callbackRequest(first.state, cookiePair(second.setCookie)),
      config,
      store,
      now,
    }),
    /state mismatch/i
  );
  const firstResult = await consumeOAuthTransaction({
    request: callbackRequest(first.state, cookiePair(first.setCookie)),
    config,
    store,
    now,
  });
  assert.equal(firstResult.state, first.state);
});

test("clearTransactionCookie expires the host-only transaction cookie", () => {
  const cookie = clearTransactionCookie();
  assert.match(cookie, /^__Host-saferedact-oauth-state=;/);
  assert.match(cookie, /Max-Age=0/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.doesNotMatch(cookie, /Domain=/i);
});
