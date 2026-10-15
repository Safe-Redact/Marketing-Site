import { randomBytes } from "node:crypto";

function exactHttpsOrigin(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("Popup target must be an exact HTTPS origin.");
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash ||
    parsed.hostname.includes("*")
  ) {
    throw new Error("Popup target must be an exact HTTPS origin.");
  }
  return parsed.origin;
}

function scriptJson(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

function protocolMessage(outcome) {
  if (outcome?.status === "success") {
    if (typeof outcome.token !== "string" || !outcome.token || outcome.provider !== "github") {
      throw new Error("Popup success outcome is invalid.");
    }
    return `authorization:github:success:${JSON.stringify({
      token: outcome.token,
      provider: "github",
    })}`;
  }
  return `authorization:github:error:${
    typeof outcome?.message === "string" && outcome.message
      ? outcome.message
      : "Authentication could not be completed."
  }`;
}

export function createPopupResponse({ origin, outcome }) {
  const targetOrigin = exactHttpsOrigin(origin);
  const message = protocolMessage(outcome);
  const nonce = randomBytes(18).toString("base64url");
  const body = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SafeRedact CMS authentication</title></head>
<body><p>Completing secure authentication…</p>
<script nonce="${nonce}">
(() => {
  "use strict";
  const targetOrigin = ${scriptJson(targetOrigin)};
  const handshake = "authorizing:github";
  const result = ${scriptJson(message)};
  let completed = false;
  const finish = () => {
    if (completed || !window.opener) return;
    completed = true;
    window.opener.postMessage(result, targetOrigin);
    window.setTimeout(() => window.close(), 250);
  };
  window.addEventListener("message", (event) => {
    if (event.origin !== targetOrigin || event.source !== window.opener || event.data !== handshake) return;
    finish();
  }, { once: false });
  if (window.opener) window.opener.postMessage(handshake, targetOrigin);
  window.setTimeout(finish, 1500);
})();
</script></body></html>`;

  return new Response(body, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
      "Content-Type": "text/html; charset=utf-8",
      "Cross-Origin-Opener-Policy": "unsafe-none",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      Pragma: "no-cache",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}
