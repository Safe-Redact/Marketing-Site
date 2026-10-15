# Comments database — local development and server deployment

The comments store is plain PostgreSQL. Nothing in the application depends on a
managed provider's API, so the same schema and the same adapter run on a local
cluster, on a team-managed server, or on any hosted PostgreSQL. Supabase is **not**
used in production.

The application reaches the database only through `CommentsRepository`
(`src/lib/comments/repository.ts`). Swapping the host is a connection-string change.

---

## 1. Local development

PostgreSQL 17 and 18 are installed natively on this machine (ports 5432 and 5433);
Docker is not present, so the native cluster is used. Two commands, once:

```bash
npm run db:provision
```

Creates `saferedact_comments_dev` and the least-privilege role `saferedact_app` from
`scripts/provision-local-db.sql`. psql prompts for the **superuser** password on the
terminal — it is never read or stored by the script. The application password comes
from `COMMENTS_DATABASE_URL` in `.env.local` and is passed as a psql variable, so it
stays out of shell history.

```bash
npm run comments:migrate
```

Applies `src/lib/comments/postgres/schema.sql` and records it in
`schema_migrations`. Safe to repeat.

Then `npm test` runs the real integration suite instead of skipping it.

### What the role may do

`saferedact_app` can connect to one database, use and create in `public`, and
read/write rows. It is **not** the owner of the database, so it cannot drop it, and
it has no superuser, no `CREATEDB` and no `CREATEROLE`. `pgcrypto` is installed by
the superuser during provisioning, because creating an extension is not something
the application role should be able to do.

### Known local finding

Both local clusters listen on `0.0.0.0`, not just loopback:

```
0.0.0.0:5432   0.0.0.0:5433
```

On a laptop behind a firewall that is usually harmless, but it is wider than this
project needs and wider than the brief asks for. To close it, set in each cluster's
`postgresql.conf`:

```
listen_addresses = 'localhost'
```

and restart that service. **Not changed here** — it is a machine-wide setting that
affects every other database on this computer, so it is the operator's call.

---

## 2. Server deployment

### Provisioning

Any PostgreSQL 14 or newer works; 17 or 18 matches development. On the server:

```sql
create role saferedact_app login password '<generated>';
create database saferedact_comments owner postgres;
\connect saferedact_comments
create extension if not exists "pgcrypto";
grant connect on database saferedact_comments to saferedact_app;
grant usage, create on schema public to saferedact_app;
alter default privileges in schema public
  grant select, insert, update, delete on tables to saferedact_app;
```

`scripts/provision-local-db.sql` is the same shape and can be adapted; the script
wrapper refuses a non-local host on purpose, so a server is provisioned by hand
rather than by a development convenience.

Generate the password with a CSPRNG, for example:

```bash
node -e "console.log(require('node:crypto').randomBytes(24).toString('base64url'))"
```

### Environment variables

Set in the server's secret store or the service's environment — never in the
repository:

| Variable | Purpose |
|---|---|
| `COMMENTS_DATABASE_URL` | `postgres://saferedact_app:<password>@<host>:5432/saferedact_comments` — **secret** |
| `COMMENTS_DATABASE_SSL` | omit for TLS (the default off-loopback); `false` only for a loopback socket |
| `COMMENTS_ABUSE_SECRET` | 32-byte base64url. Keys the HMAC that replaces visitor IP addresses — **secret** |
| `COMMENTS_STAFF_GITHUB_USER_IDS` | numeric GitHub user IDs permitted to moderate |
| `CMS_GITHUB_REPOSITORY` | the content repository moderators must hold write access on |

With `COMMENTS_DATABASE_URL` unset the site runs with comments switched off: the
article page renders no comments section and every endpoint answers 503. That is the
safe default for a first deploy.

### Private network access

The database should not be reachable from the internet. In order of preference:

1. Database and application on the same host, connected over loopback or a Unix
   socket. Then `listen_addresses = 'localhost'` and `COMMENTS_DATABASE_SSL=false`.
2. Separate hosts on a private network. `listen_addresses` bound to the private
   interface only, the public interface firewalled, TLS on, and `pg_hba.conf`
   restricted to the application host's address with `scram-sha-256`.

Never expose 5432 publicly, and never give the application role superuser.

### Persistent storage

The data directory must be on persistent storage that survives a redeploy — a real
volume, not a container's writable layer. Size is modest (comments are text), but
put WAL and data on storage that is backed up, and monitor free space: PostgreSQL
stops accepting writes when the volume fills.

### Migrations

`npm run comments:migrate` after each deploy. Every statement is
`CREATE ... IF NOT EXISTS`, so it is idempotent and non-destructive — it was checked
for `DROP`, `TRUNCATE` and bare `DELETE` and contains none. The runner records the
version and a checksum in `schema_migrations`, and warns if the live schema was
applied from a different version of the file.

### Backups and restoration

```bash
# Nightly, retained off-host
pg_dump --format=custom --no-owner --dbname "$COMMENTS_DATABASE_URL" \
  --file "comments-$(date +%F).dump"

# Restore into an empty database
pg_restore --no-owner --dbname "$TARGET_DATABASE_URL" comments-YYYY-MM-DD.dump
```

`--no-owner` keeps a dump portable between hosts whose role names differ. **Test a
restore before relying on the backup**; an untested backup is an assumption.

For a production cluster, enable WAL archiving or a managed point-in-time-recovery
option as well — a nightly dump loses up to a day.

### Local test data must not reach production

Development rows carry development author keys derived from the **development**
`COMMENTS_ABUSE_SECRET`, and fixture comments reference fixture articles. Start
production from an **empty** database:

1. Provision the production database and role.
2. Run `npm run comments:migrate` against it. Do **not** restore a development dump.
3. Generate a fresh `COMMENTS_ABUSE_SECRET` for production. Reusing the development
   one would make development and production author keys interchangeable.

If something must be carried over, move it row by row with the secret rotated and
the author keys recomputed, rather than restoring a dump.

### HTTPS application deployment

The site must be served over HTTPS; the public Content-Security-Policy and the
`__Host-` cookies used by the OAuth broker both assume a secure origin. Terminate
TLS at a reverse proxy, forward to the Next.js server, and make sure the proxy sets
`X-Forwarded-For` — the comment and enquiry rate limiters read the **first** hop of
that header and fall back to a shared bucket when it is absent.

### Operating system

The final server's OS is not yet confirmed. Nothing here assumes one: PostgreSQL,
`pg_dump`, Node and the migration runner behave the same on Linux and Windows. The
only platform-specific details are service management and the data directory path,
which are decided once the server is known.

---

## 3. Acceptance

The database-backed lifecycle is demonstrated when, against a real cluster:

- `npm run comments:migrate` reports the migration applied and `schema_migrations`
  holds the version and checksum.
- `npm test` runs `tests/comments-postgres.test.ts` **without skipping** — the two
  tests that skip when `COMMENTS_DATABASE_URL` is unset must pass.
- A visitor comment submitted through the site is stored `pending` and is absent
  from the public thread until a moderator approves it.
