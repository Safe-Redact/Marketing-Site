# Final website acceptance

Branch `feat/saferedact-publishing-and-comments`, base commit `dc5da93`. Nothing in this pass
is committed or pushed. `master` is untouched.

Status vocabulary, used strictly:

- **Implemented** — code exists and is reviewed.
- **Tests passed** — automated tests cover it and pass.
- **Real integration** — exercised against the live external service.
- **Needs config** — complete, waiting on credentials or an external approval.
- **Blocked** — cannot proceed until someone outside this repository acts.
- **Not built** — no code exists.

## Feature status

| Feature | Implemented | Tests passed | Real integration | Status |
|---|---|---|---|---|
| Marketing homepage | yes | yes | n/a | Complete |
| Responsive navigation, smooth scrolling | yes | yes | browser-verified | Complete |
| Blog listing, search, categories, article pages | yes | yes | n/a | Complete |
| News and announcements, content types, tags | yes | yes | browser-verified | Complete |
| Article SEO metadata, canonical URLs, structured data | yes | yes | n/a | Complete |
| Sitemap and robots | yes | yes | n/a | Complete |
| Strict public CSP (per-request nonce) | yes | yes | browser-verified | Complete |
| Isolated admin CSP | yes | yes | browser-verified | Complete |
| GitHub OAuth broker | yes | yes | **yes — real login** | Complete |
| Decap CMS interface reaches login | yes | yes | **yes** | Complete |
| Decap publishing (create/save/publish) | yes | n/a | **no** | **Blocked** — org OAuth |
| Comments domain model and rules | yes | yes (34) | n/a | Complete |
| Comments PostgreSQL persistence | yes | yes (3) | **yes — local PostgreSQL 18.1** | Complete in development |
| Comments retention controls | yes | yes | **yes — real database** | Complete in development |
| Comments public HTTP routes | yes | yes (10) | **yes — real submission** | Complete in development |
| Comment thread and submission UI | yes | yes | **yes — browser, real database** | Complete in development |
| Staff moderation API and UI | yes | yes (9) | authorization only | **Blocked** — needs a staff GitHub token |
| Lead delivery pipeline | yes | yes (15) | **no** | **Needs config** |
| Privacy notice for visitor comment data | no | — | — | **Blocked** — needs approved copy |

## Verification run on this tree

`npm run typecheck`, `npm run lint`, `npm run build`, `npm run check:secrets` (205 files),
`npm audit --omit=dev` (0 vulnerabilities), `git diff --check`, and:

```
static   39 pass
content  86 pass
routes   27 pass
broker   37 pass
         189 pass, 0 skipped, 0 fail
```

**The PostgreSQL tests no longer skip.** A local cluster (PostgreSQL 18.1, port 5432) is
provisioned and migrated, so `tests/comments-postgres.test.ts` runs the real contract
against a real database. See `DATABASE_DEPLOYMENT.md`.

The 2 skips are the PostgreSQL contract and retention tests. They skip with an explicit
reason rather than passing vacuously, and they run the moment `COMMENTS_DATABASE_URL` is set.

Two environment traps, both hit during this work: a running `next dev` shares `.next` with
`next build` and breaks the route suite, and `npm run test:routes` has no `pretest` hook so a
standalone run depends on whichever CMS profile is on disk. Run the suite through `npm test`
with no dev server up.

## Built in this pass

`src/lib/comments/postgres/` — the persistence layer the domain was written against:

- `schema.sql` — comments, reports and an append-only moderation audit, with the indexes the
  four read paths actually use. Plain PostgreSQL, no provider extension, idempotent.
- `index.ts` — `PostgresCommentsRepository`, plus `readPostgresSettings` (TLS on for any
  non-loopback host unless the operator opts out), `createPool`, `migrate` and
  `purgeExpiredComments`.
- `applyDecision` runs in a transaction with `select … for update`, so two moderators cannot
  both apply a decision to one comment and write two audit events for one transition. The
  tombstone's content is cleared in the same statement that changes its status.
- `scripts/migrate-comments.mjs` and `npm run comments:migrate`. Errors surface the driver
  code only, because a driver error can quote the connection string.

`tests/comments-postgres.test.ts` — one contract, run against **both** adapters. The
in-memory double is only trustworthy as a stand-in while it behaves identically to the
adapter production uses, so the same assertions run against both: public reads exclude
pending and rejected, a missing comment is distinguishable from a refused transition,
`removed` is terminal, exactly one audit event per applied transition, abuse counters,
duplicate detection, report resolution, search and pagination.

### Privacy posture

No raw IP address is stored. `author_key` and `reporter_key` are keyed HMACs derived per
deployment secret, so the table cannot be reversed into a list of visitor addresses even if
disclosed. Retention deletes rejected comments outright and clears the abuse keys on removed
tombstones, which keep their row so approved replies stay anchored.

## What is not built, and why that matters

**Comments are built but switched off, and that is enforced rather than assumed.** With no
`COMMENTS_DATABASE_URL` the composition root returns null, the article page renders with **no
comments section and no form at all**, and every comment endpoint answers `503` with
`{"ok": false, "code": "disabled"}` and no configuration detail. Verified against a
production build: article page 200 with zero occurrences of the section or the form, and
`POST /api/comments` → 503. Nothing accepts visitor data today.

A half-configured deployment is refused too: a database URL without an abuse secret (or an
abuse secret under 32 characters) raises at composition rather than running with a derivable
author key.

**The staff moderation API and UI are built.** `/moderation` is a noindexed staff page,
excluded from `robots.txt` and the sitemap, carrying the same strict public CSP as every
other route. It reuses the GitHub sign-in the editor already completed (Decap stores the
token under `decap-cms-user` on the same origin) rather than adding a second login.

Authorization is server side on **every** privileged request: the bearer token is exchanged
for an identity at GitHub, checked against the staff allowlist, and confirmed to still hold
write access on the content repository — so revoking access in GitHub revokes moderation
without a deploy here. Every failure answers one opaque 403, so an unknown token and a known
token without write access are indistinguishable, and a GitHub outage is never mistaken for
authorization. The audit trail records the verified `login#id`, never a client-supplied label.

**CSRF:** privileged operations are authorized by an `Authorization` header and never by a
cookie. A cross-site form or image cannot set that header and the browser attaches no ambient
credential to this API, so there is nothing for a forged request to ride on. That is the
defence, written down in `moderation-http.ts`; if this API is ever given a cookie session an
explicit CSRF token becomes required.

**The moderation authorization boundary is settled but unbuilt.** Decap's browser login does
*not* authenticate custom endpoints — it stores a GitHub user token in browser storage, which
is not a session for this application. A moderation API must verify the bearer token itself
via `GET /user` against the staff allowlist, which `authorizeStaff` in
`services/cms-oauth-broker/src/github.mjs` already implements and tests. Reuse it rather than
inventing a second mechanism, and never expose a publicly writable admin API.

## External configuration required

### 1. Comments database — needs config

```
COMMENTS_DATABASE_URL=postgres://…      # pooled connection string; SECRET
COMMENTS_ABUSE_SECRET=<32-byte base64url>   # SECRET; keys the author-key HMAC
# COMMENTS_DATABASE_SSL=false           # only for a local cluster
```

Use a role limited to the comments tables. A Supabase **service-role key must never reach
this application or the browser**. Then:

```bash
npm run comments:migrate   # idempotent
npm test                   # the 2 skipped tests now run against the real database
```

Until those two tests run green against a real cluster, persistence is unverified.

### 2. Lead delivery — needs config

Four variables set together (`LEAD_DELIVERY_ENDPOINT`, `_TOKEN`, `_FROM`, `_TO`); see
`.env.example`. Then submit one enquiry and confirm **200 with `delivered: true`** and that
the mailbox received it.

### 3. Decap publishing — blocked, needs an organization owner

GitHub returns 403 on `POST /git/blobs`. The repository is **public**, so `public_repo` is
correct and sufficient and must not be broadened. The owner is an organization, and the
leading cause is **OAuth App access restrictions with this app unapproved** — it fits login
succeeding, `git push` working on a different credential, and org-owned writes failing.

1. `https://github.com/organizations/Safe-Redact/settings/oauth_application_policy` — grant
   the app if access is restricted.
2. If unrestricted, confirm `maverick254-coder` (id 199049931) holds Write at the repository's
   access settings.

The `/git/blobs` response body names the cause and contains no secret. **It has not been
read**, because that needs an authenticated request.

### 4. Privacy notice — blocked, needs approved copy

A comments feature collects and stores visitor-supplied names and message text. Publishing it
needs a privacy notice saying what is stored, for how long, and how to request removal. The
retention behaviour above is the technical half; the published wording is a business decision
and **no legal or privacy copy has been invented here**. This blocks launching comments
publicly, not building them.

## End-to-end journeys

| Journey | Result |
|---|---|
| Visitor browses the Insights hub: type filters, search, categories | **Passes** — browser-verified |
| Visitor reads an article | **Passes** — hydrated, no console errors, all scripts nonced |
| Visitor submits a demo enquiry | **Partial** — accepted and validated; delivery needs config |
| Visitor submits / replies / reports a comment | **Passes** — a real comment submitted through the browser form was stored `pending` in PostgreSQL, stayed out of the public thread, and appeared only after approval |
| Staff signs in with GitHub | **Passes** — real OAuth, real account |
| Staff creates / publishes an article | **Blocked** — 403, see above |
| Staff uploads an image | **Blocked** — same 403 |
| Staff moderates comments | **Partly** — the decision path ran against the real database (pending → approved, audited, comment became public). The live API returns **403** to an unauthenticated and to a forged-token caller. Signing in as a staff member needs a real GitHub token, which was not available |

No mocked test is counted as real external-service acceptance anywhere in this document.
