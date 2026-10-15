import { readFileSync } from "node:fs";
import { createServer } from "node:https";

function required(environment, name) {
  const value = environment[name];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`OAuth HTTPS server configuration error: ${name} is required.`);
  }
  return value.trim();
}

export function loadServerConfig(environment = {}) {
  const certificatePath = required(environment, "OAUTH_TLS_CERT_PATH");
  const privateKeyPath = required(environment, "OAUTH_TLS_KEY_PATH");
  const port = Number(environment.OAUTH_PORT?.trim() || "8787");
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new Error("OAuth HTTPS server configuration error: OAUTH_PORT must be from 1 to 65535.");
  }
  const host = environment.OAUTH_BIND_HOST?.trim() || "127.0.0.1";
  if (!/^[A-Za-z0-9.:[\]_-]+$/.test(host)) {
    throw new Error("OAuth HTTPS server configuration error: OAUTH_BIND_HOST is invalid.");
  }
  return { certificatePath, privateKeyPath, port, host };
}

function fetchHeaders(incoming) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(incoming)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(name, item);
    } else if (value !== undefined) {
      headers.set(name, value);
    }
  }
  return headers;
}

export function createHttpsBrokerServer({ environment = process.env, handler }) {
  if (typeof handler !== "function") {
    throw new Error("OAuth HTTPS server requires a request handler.");
  }
  const serverConfig = loadServerConfig(environment);
  const tls = {
    cert: readFileSync(serverConfig.certificatePath),
    key: readFileSync(serverConfig.privateKeyPath),
    minVersion: "TLSv1.2",
  };
  const server = createServer(tls, async (request, response) => {
    try {
      const incomingUrl = new URL(request.url ?? "/", environment.OAUTH_PUBLIC_ORIGIN);
      const result = await handler(new Request(incomingUrl, {
        method: request.method,
        headers: fetchHeaders(request.headers),
      }));
      response.statusCode = result.status;
      for (const [name, value] of result.headers) response.setHeader(name, value);
      response.end(Buffer.from(await result.arrayBuffer()));
    } catch {
      response.statusCode = 500;
      response.setHeader("Cache-Control", "no-store, max-age=0");
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.end("Authentication service error.");
    }
  });
  return { server, serverConfig };
}

