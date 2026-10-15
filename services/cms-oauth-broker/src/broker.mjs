import { randomUUID } from "node:crypto";

import { authorizeStaff, buildAuthorizationUrl, exchangeCode } from "./github.mjs";
import { createPopupResponse } from "./popup.mjs";
import {
  MemoryTransactionStore,
  clearTransactionCookie,
  consumeOAuthTransaction,
  createOAuthTransaction,
} from "./transaction.mjs";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function plainResponse(status, message, extraHeaders = {}) {
  return new Response(message, {
    status,
    headers: {
      ...noStoreHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function exactParameter(searchParams, name) {
  const values = searchParams.getAll(name);
  return values.length === 1 ? values[0] : null;
}

function safeLog(logger, event, outcome, correlationId) {
  try {
    logger(Object.freeze({ event, outcome, correlationId }));
  } catch {
    // Authentication behavior must not depend on the logging sink.
  }
}

function withClearedCookie(response) {
  const headers = new Headers(response.headers);
  headers.append("Set-Cookie", clearTransactionCookie());
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function createBroker({
  config,
  store,
  fetchImpl = fetch,
  logger = () => {},
  now = Date.now,
} = {}) {
  if (!config) throw new Error("OAuth broker configuration is required.");
  const transactionStore = store ?? new MemoryTransactionStore({
    capacity: config.maxPendingTransactions,
  });

  return async function handle(request) {
    const correlationId = randomUUID();
    let url;
    try {
      url = new URL(request.url);
    } catch {
      return plainResponse(400, "Invalid request.");
    }

    if (url.origin !== config.publicOrigin) {
      safeLog(logger, "oauth.request", "rejected", correlationId);
      return plainResponse(400, "Invalid request.");
    }

    if (request.method !== "GET") {
      return plainResponse(405, "Method not allowed.", { Allow: "GET" });
    }

    if (url.pathname === "/health") {
      return plainResponse(200, "ok");
    }

    if (url.pathname === "/auth") {
      const provider = exactParameter(url.searchParams, "provider");
      const siteId = exactParameter(url.searchParams, "site_id");
      const scope = exactParameter(url.searchParams, "scope");
      const origin = siteId ? config.siteIdOrigins.get(siteId) : null;
      if (provider !== "github" || scope !== config.scope || !origin) {
        safeLog(logger, "oauth.initialize", "rejected", correlationId);
        return plainResponse(403, "Authentication request was denied.");
      }

      try {
        const transaction = await createOAuthTransaction({
          origin,
          config,
          store: transactionStore,
          now: now(),
        });
        const location = buildAuthorizationUrl({
          state: transaction.state,
          codeChallenge: transaction.codeChallenge,
          config,
        });
        safeLog(logger, "oauth.initialize", "accepted", correlationId);
        return new Response(null, {
          status: 302,
          headers: {
            ...noStoreHeaders,
            Location: location.href,
            "Set-Cookie": transaction.setCookie,
          },
        });
      } catch {
        safeLog(logger, "oauth.initialize", "failed", correlationId);
        return plainResponse(503, "Authentication is temporarily unavailable.");
      }
    }

    if (url.pathname === "/callback") {
      let transaction;
      try {
        transaction = await consumeOAuthTransaction({
          request,
          config,
          store: transactionStore,
          now: now(),
        });
      } catch {
        safeLog(logger, "oauth.callback", "rejected", correlationId);
        return plainResponse(400, "Authentication could not be completed.", {
          "Set-Cookie": clearTransactionCookie(),
        });
      }

      try {
        const providerError = exactParameter(url.searchParams, "error");
        const code = exactParameter(url.searchParams, "code");
        if (providerError || !code) {
          throw new Error("Provider denied authentication.");
        }
        const token = await exchangeCode({
          code,
          codeVerifier: transaction.codeVerifier,
          config,
          fetchImpl,
        });
        await authorizeStaff({
          accessToken: token.accessToken,
          config,
          fetchImpl,
        });
        safeLog(logger, "oauth.callback", "accepted", correlationId);
        return withClearedCookie(createPopupResponse({
          origin: transaction.origin,
          outcome: {
            status: "success",
            token: token.accessToken,
            provider: "github",
          },
        }));
      } catch {
        safeLog(logger, "oauth.callback", "rejected", correlationId);
        return withClearedCookie(createPopupResponse({
          origin: transaction.origin,
          outcome: {
            status: "error",
            message: "Authentication could not be completed.",
          },
        }));
      }
    }

    return plainResponse(404, "Not found.");
  };
}
