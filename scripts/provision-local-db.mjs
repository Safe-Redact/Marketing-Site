import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * One-time local development provisioning.
 *
 * Creates the development database and a least-privilege application role from
 * scripts/provision-local-db.sql. It needs a PostgreSQL superuser, so psql is run
 * with the terminal attached and prompts for that password itself — the superuser
 * password is never read, stored or logged here.
 *
 * The application password is taken from COMMENTS_DATABASE_URL in .env.local and
 * passed to psql as a variable, so it stays out of shell history.
 */

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sqlPath = path.join(repositoryRoot, "scripts", "provision-local-db.sql");

function fail(message) {
  console.error(`Local database provisioning did not run: ${message}`);
  process.exit(1);
}

const connectionString = process.env.COMMENTS_DATABASE_URL?.trim();
if (!connectionString) {
  fail("COMMENTS_DATABASE_URL is required. Copy .env.example to .env.local and set it.");
}

let target;
try {
  target = new URL(connectionString);
} catch {
  fail("COMMENTS_DATABASE_URL must be a postgres:// URL.");
}

const appUser = decodeURIComponent(target.username || "");
const appPassword = decodeURIComponent(target.password || "");
const database = target.pathname.replace(/^\//, "");
const host = target.hostname;
const port = target.port || "5432";

if (!appUser || !appPassword || !database) {
  fail("COMMENTS_DATABASE_URL must include a user, a password and a database name.");
}
if (host !== "127.0.0.1" && host !== "localhost") {
  // This script grants privileges and is for a development machine only.
  fail(`refusing to provision a non-local host (${host}). Provision a server database by hand.`);
}

const superuser = process.env.PGSUPERUSER?.trim() || "postgres";

console.log(
  `Provisioning database "${database}" and role "${appUser}" on ${host}:${port}.\n` +
    `psql will connect as "${superuser}" and ask for that account's password.\n`
);

// stdio is inherited so psql can prompt on the terminal; nothing is captured here.
const child = spawn(
  "psql",
  [
    "-U", superuser,
    "-h", host,
    "-p", port,
    "-d", "postgres",
    "-v", "ON_ERROR_STOP=1",
    "-v", `password=${appPassword}`,
    "-f", sqlPath,
  ],
  { stdio: "inherit", shell: false }
);

child.once("error", (error) => {
  if (error.code === "ENOENT") {
    fail("psql was not found on PATH. Add the PostgreSQL bin directory and try again.");
  }
  fail("psql could not be started.");
});

child.once("exit", (code) => {
  if (code === 0) {
    console.log("\nProvisioned. Next: npm run comments:migrate");
    return;
  }
  fail(`psql exited with code ${code}. The database was not provisioned.`);
});
