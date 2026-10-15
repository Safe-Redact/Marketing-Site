import { spawn } from "node:child_process";
import { accessSync, constants } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultPort = 3000;

function fail(message) {
  console.error(`Local HTTPS development server did not start: ${message}`);
  process.exit(1);
}

function requiredPath(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    fail(`${name} is required. Copy .env.example to .env.local and set it.`);
  }
  const resolved = path.resolve(repositoryRoot, value);
  try {
    accessSync(resolved, constants.R_OK);
  } catch {
    fail(`${name} does not point at a readable file.`);
  }
  return resolved;
}

function resolvePort() {
  const raw = process.env.DEV_HTTPS_PORT?.trim() || String(defaultPort);
  const port = Number(raw);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    fail("DEV_HTTPS_PORT must be an integer from 1 to 65535.");
  }
  return port;
}

// The broker matches the admin origin exactly, including port. A dev server on any
// other port is rejected at /auth, so refuse to start rather than fail at login.
function assertOriginMatchesPort(port) {
  const origin = process.env.PUBLIC_SITE_ORIGIN?.trim();
  if (!origin) {
    fail("PUBLIC_SITE_ORIGIN is required so the admin origin matches the broker allowlist.");
  }

  let parsed;
  try {
    parsed = new URL(origin);
  } catch {
    fail("PUBLIC_SITE_ORIGIN must be an absolute HTTPS origin.");
  }

  if (parsed.protocol !== "https:") {
    fail("PUBLIC_SITE_ORIGIN must use https, because the CMS origin is served over TLS.");
  }

  const originPort = Number(parsed.port || 443);
  if (originPort !== port) {
    fail(
      `PUBLIC_SITE_ORIGIN port ${originPort} does not match the dev server port ${port}. ` +
        "The broker would deny every login from a non-matching origin."
    );
  }
}

// Next silently moves to the next free port when the requested one is taken, which
// changes the origin and breaks the exact-origin allowlist. Check first instead.
function assertPortAvailable(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        fail(
          `port ${port} is already in use. Stop that process first — Next would move to ` +
            "another port and the admin origin would no longer match the broker allowlist."
        );
      }
      fail(`port ${port} could not be checked (${error.code ?? "unknown error"}).`);
    });
    probe.listen(port, "0.0.0.0", () => probe.close(() => resolve()));
  });
}

const port = resolvePort();
const certificatePath = requiredPath("DEV_HTTPS_CERT_PATH");
const privateKeyPath = requiredPath("DEV_HTTPS_KEY_PATH");
assertOriginMatchesPort(port);
await assertPortAvailable(port);

const nextBin = path.join(repositoryRoot, "node_modules", "next", "dist", "bin", "next");
const child = spawn(
  process.execPath,
  [
    nextBin,
    "dev",
    "--port",
    String(port),
    "--experimental-https",
    "--experimental-https-cert",
    certificatePath,
    "--experimental-https-key",
    privateKeyPath,
  ],
  { cwd: repositoryRoot, stdio: "inherit" }
);

child.once("error", () => fail("the Next.js development server could not be spawned."));
child.once("exit", (code, signal) => {
  process.exitCode = signal ? 1 : code ?? 0;
});
