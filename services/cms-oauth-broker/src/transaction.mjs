import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const cookieName = "__Host-saferedact-oauth-state";
const statePattern = /^[A-Za-z0-9_-]{43}$/;

function signState(state, secret) {
  return createHmac("sha256", Buffer.from(secret, "base64url"))
    .update(state, "utf8")
    .digest("base64url");
}

function safeEqual(left, right) {
  const leftBytes = Buffer.from(left, "utf8");
  const rightBytes = Buffer.from(right, "utf8");
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function transactionCookie(state, config) {
  const value = `${state}.${signState(state, config.stateSecret)}`;
  const maxAge = Math.floor(config.transactionTtlMs / 1000);
  return `${cookieName}=${value}; HttpOnly; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`;
}

function parseTransactionCookie(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`).exec(cookieHeader);
  return match?.[1] ?? null;
}

export class MemoryTransactionStore {
  #records = new Map();
  #capacity;

  constructor({ capacity = 1024 } = {}) {
    if (!Number.isSafeInteger(capacity) || capacity <= 0) {
      throw new Error("OAuth transaction store capacity is invalid.");
    }
    this.#capacity = capacity;
  }

  #pruneExpired(now) {
    for (const [state, transaction] of this.#records) {
      if (transaction.expiresAt <= now) this.#records.delete(state);
    }
  }

  async put(transaction) {
    this.#pruneExpired(transaction.issuedAt);
    if (this.#records.has(transaction.state)) {
      throw new Error("OAuth transaction could not be created.");
    }
    if (this.#records.size >= this.#capacity) {
      throw new Error("OAuth authentication is temporarily unavailable.");
    }
    this.#records.set(transaction.state, Object.freeze({ ...transaction }));
  }

  async consume(state, now) {
    this.#pruneExpired(now);
    const transaction = this.#records.get(state) ?? null;
    this.#records.delete(state);
    if (!transaction || transaction.expiresAt <= now) return null;
    return transaction;
  }
}

export async function createOAuthTransaction({ origin, config, store, now = Date.now() }) {
  if (!config.allowedOrigins.has(origin)) {
    throw new Error("OAuth request origin is not allowed.");
  }

  const state = randomBytes(32).toString("base64url");
  const codeVerifier = randomBytes(64).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier, "utf8").digest("base64url");
  const transaction = {
    state,
    origin,
    provider: "github",
    callbackUrl: config.callbackUrl,
    codeVerifier,
    issuedAt: now,
    expiresAt: now + config.transactionTtlMs,
  };

  await store.put(transaction);

  return {
    state,
    codeVerifier,
    codeChallenge,
    setCookie: transactionCookie(state, config),
  };
}

export async function consumeOAuthTransaction({ request, config, store, now = Date.now() }) {
  const callback = new URL(request.url);
  const expected = new URL(config.callbackUrl);
  if (callback.origin !== expected.origin || callback.pathname !== expected.pathname) {
    throw new Error("OAuth callback URL is not allowed.");
  }

  const returnedStates = callback.searchParams.getAll("state");
  if (returnedStates.length !== 1) {
    throw new Error("OAuth state parameter is invalid.");
  }
  const [returnedState] = returnedStates;
  const cookieValue = parseTransactionCookie(request);
  if (!cookieValue) {
    throw new Error("OAuth transaction cookie is missing.");
  }

  const [cookieState, signature, extra] = cookieValue.split(".");
  if (
    extra !== undefined ||
    !statePattern.test(cookieState ?? "") ||
    !signature ||
    !safeEqual(signature, signState(cookieState, config.stateSecret))
  ) {
    throw new Error("OAuth transaction cookie is invalid.");
  }

  const transaction = await store.consume(cookieState, now);
  if (!transaction) {
    throw new Error("OAuth transaction is invalid, expired, or already used.");
  }
  if (!statePattern.test(returnedState) || !safeEqual(returnedState, cookieState)) {
    throw new Error("OAuth state mismatch.");
  }
  if (
    transaction.origin !== config.siteIdOrigins.get(new URL(transaction.origin).host) ||
    transaction.callbackUrl !== config.callbackUrl ||
    transaction.provider !== "github"
  ) {
    throw new Error("OAuth transaction binding is invalid.");
  }

  return transaction;
}

export function clearTransactionCookie() {
  return `${cookieName}=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure`;
}
