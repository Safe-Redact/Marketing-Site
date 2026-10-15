import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = path.join(repositoryRoot, "src", "lib", "comments", "postgres", "schema.sql");

function fail(message) {
  console.error(`Comments migration did not run: ${message}`);
  process.exit(1);
}

const connectionString = process.env.COMMENTS_DATABASE_URL?.trim();
if (!connectionString) {
  fail("COMMENTS_DATABASE_URL is required. Copy .env.example to .env.local and set it.");
}

let parsed;
try {
  parsed = new URL(connectionString);
} catch {
  fail("COMMENTS_DATABASE_URL must be a postgres:// URL.");
}
if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
  fail("COMMENTS_DATABASE_URL must be a postgres:// URL.");
}

const loopback = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
const sslSetting = process.env.COMMENTS_DATABASE_SSL?.trim().toLowerCase();
const ssl = sslSetting ? sslSetting !== "false" : !loopback;

const pool = new pg.Pool({
  connectionString,
  ssl: ssl ? { rejectUnauthorized: true } : undefined,
  max: 1,
});

const SCHEMA_VERSION = "0001_comments";

try {
  // schema.sql is idempotent, so this is safe to run on every deploy.
  const schema = await readFile(schemaPath, "utf8");
  const checksum = createHash("sha256").update(schema).digest("hex");
  await pool.query(schema);

  const existing = await pool.query(
    "select checksum from schema_migrations where version = $1",
    [SCHEMA_VERSION]
  );
  if (!existing.rows[0]) {
    await pool.query(
      "insert into schema_migrations (version, checksum) values ($1, $2) on conflict (version) do nothing",
      [SCHEMA_VERSION, checksum]
    );
    console.log(`Applied ${SCHEMA_VERSION}.`);
  } else if (existing.rows[0].checksum !== checksum) {
    console.warn(
      `Warning: ${SCHEMA_VERSION} was applied from a different version of schema.sql. ` +
        "The live schema may have drifted from the file; review before relying on it."
    );
  } else {
    console.log(`${SCHEMA_VERSION} is already applied; nothing to do.`);
  }

  // The host is printed without credentials; the URL carries a password.
  console.log(`Comments schema present on ${parsed.hostname}${parsed.pathname}`);
} catch (error) {
  // A driver error can quote the connection string, so only the code is surfaced.
  fail(`the schema could not be applied (${error?.code ?? "unknown error"}).`);
} finally {
  await pool.end().catch(() => {});
}
