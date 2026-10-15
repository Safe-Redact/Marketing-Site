# SafeRedact CMS staff login activation runbook

Date: 2026-10-15
Status: **operational inspection complete; no credential, deployment, or live login performed**
Scope: activate the existing `/admin` Decap login against the existing broker in `services/cms-oauth-broker/`. No redesign, no second CMS, no production change.

## What this inspection executed

| Check | Result |
| --- | --- |
| `git status` / branch | `feat/saferedact-publishing-and-comments`; all reported uncommitted and untracked work intact and untouched |
| `npm --prefix services/cms-oauth-broker test` | **32/32 pass** on Node v22.13.0 / npm 11.13.0 (executed 2026-10-15) |
| Everything else | Source and documentation read only. The 88/88 root suite, lint, typecheck, build, and audit results remain **historical reports**, not re-verified here |

Nothing was written to the repository except this document.

---

## 1. Already implemented (no work required)

| Capability | Location |
| --- | --- |
| Admin route and static Decap shell | `src/app/admin/page.tsx`, `public/admin/index.html` |
| Decap config template and renderer | `config/decap-cms.yml`, `scripts/render-cms-config.mjs` |
| OAuth broker (`/health`, `/auth`, `/callback`) | `services/cms-oauth-broker/src/` |
| Exact-origin allowlist, exact callback, signed single-use state, PKCE S256, staff ID allowlist, repo push check | `config.mjs`, `transaction.mjs`, `github.mjs`, `broker.mjs` |
| Decap popup protocol with exact `targetOrigin` | `popup.mjs` |
| CI (typecheck, lint, build, full suite, production audit, secret scan) | `.github/workflows/ci.yml` |

### Answer 1 — the actual admin URL

- `GET /admin` -> redirect to `/admin/index.html` (`src/app/admin/page.tsx:10`; asserted in `tests/phase4a-routes.test.mjs:53`).
- `GET /admin/index.html` -> the Decap shell (the real editor URL).
- `GET /admin/config.yml` -> the generated public configuration.
- `/admin/` **with a trailing slash is not a served path.** Do not use it in any OAuth registration or bookmark.

The generated configuration is currently in its fail-closed default state: `base_url: https://cms-auth.invalid`, `site_domain: site.invalid`, `branch: master`. Login cannot work until the build environment supplies real coordinates.

### Answer 3 — is a broker deployed and accessible?

**No.** The repository contains no deployment artifact of any kind: no `netlify.toml`, `vercel.json`, `Dockerfile`, or deploy workflow; CI only tests and audits. `services/cms-oauth-broker/` has no `node_modules` installed locally. The broker is a dependency-free Node >= 22 process that terminates its own TLS and must be started by an operator (section 3).

---

## 2. Requires user configuration

### Answer 2 — can the existing Netlify preview be the temporary HTTPS CMS origin?

Conditionally yes, but it is **not** the cheapest first step, and three constraints are hard:

1. **The origin must be stable and exact.** `OAUTH_ALLOWED_ORIGINS` and `PUBLIC_SITE_ORIGIN` are compared byte-for-byte including scheme, host, and port (`config.mjs` `exactHttpsOrigin`). Per-pull-request preview URLs change on every PR, so a deploy-preview URL is unusable. Only a stable site or branch-deploy origin can be allowlisted.
2. **No preview URL is discoverable from this repository.** No Netlify configuration or environment reference exists here; `LAUNCH_BLOCKERS.md` only states that previews "may continue for stakeholder review". If you want to use one, supply the exact origin — it is not invented here.
3. **Netlify cannot host the broker.** `server.mjs` creates a long-lived `node:https` server from explicit certificate and key file paths, and `transaction.mjs` keeps state in process memory with consume-once semantics. Multiple instances, cold starts, or a restart mid-login deny the callback. The broker needs one continuously running process.

Note also that `tests/phase5-infrastructure.test.mjs:48-50,163` forbid `netlify.app` / `netlify.com` URLs in the configuration template, admin shell, workflow, and active source. Supplying a preview origin through deployment environment variables is compliant; **committing it is not**.

**Recommended first environment: local HTTPS.** It needs no new hosting and satisfies every control. `next dev` supports `--experimental-https` (verified present in the installed Next 15 CLI), and GitHub accepts `localhost` callback URLs.

### Answers 4 and 5 — exact GitHub OAuth application URLs

No OAuth application exists; an authorized `Safe-Redact` owner must create a **non-production** one.

- **Homepage URL:** the exact CMS origin root — the same value set as `PUBLIC_SITE_ORIGIN` (local example: `https://localhost:3000`). This field is informational to GitHub. `DECAP_AUTH_DEPLOYMENT_PLAN.md:41` suggests `https://saferedact.io/admin/`; that path is **not served** by this application (see Answer 1), so prefer the origin root, or `/admin` if a path is wanted.
- **Authorization callback URL:** exactly `${OAUTH_PUBLIC_ORIGIN}/callback`, one entry only (local example with the default port: `https://localhost:8787/callback`). Enforced in `config.mjs` `exactCallback` and re-checked in `transaction.mjs` `consumeOAuthTransaction`.

Required application settings:

- **Disable per-URI wildcard redirect matching.** GitHub applies legacy wildcard matching to applications registered with a single redirect URI, so this must be turned off explicitly.
- **Keep expiring (short-lived) user tokens enabled.** New OAuth applications have them on by default (8-hour access token). See the blocking risk in section 5 — this is the most likely cause of a login that fails with a generic error.
- **Do not request `offline_access`.** It would add a second scope, and the broker rejects any token response whose scope is not exactly `public_repo`.
- Obtain organization OAuth approval if `Safe-Redact` enforces application restrictions.

### Answers 6 and 7 — environment variables and where each belongs

**A. Broker process environment** (secret store or injected environment of the host running `services/cms-oauth-broker`; the service never reads `.env` files):

| Variable | Required | Value rule enforced in code |
| --- | --- | --- |
| `GITHUB_OAUTH_CLIENT_ID` | yes | non-empty, no whitespace |
| `GITHUB_OAUTH_CLIENT_SECRET` | yes | **secret**; server-side only |
| `OAUTH_PUBLIC_ORIGIN` | yes | exact HTTPS origin, credential-free, no path, includes any non-default port |
| `OAUTH_CALLBACK_URL` | yes | exactly `OAUTH_PUBLIC_ORIGIN` plus `/callback` |
| `OAUTH_ALLOWED_ORIGINS` | yes | comma-separated exact HTTPS origins; no duplicates; no two entries sharing a host |
| `OAUTH_ALLOWED_REPOSITORY` | yes | `Safe-Redact/Marketing-Site` |
| `OAUTH_ALLOWED_GITHUB_USER_IDS` | yes | comma-separated positive **numeric** IDs (not logins) |
| `OAUTH_STATE_SECRET` | yes | **secret**; exactly 43 base64url characters (32 bytes) |
| `OAUTH_GITHUB_SCOPE` | yes | exactly `public_repo` |
| `OAUTH_TLS_CERT_PATH` / `OAUTH_TLS_KEY_PATH` | yes | readable local paths; required even behind a TLS proxy |
| `OAUTH_PORT` | no | default `8787` |
| `OAUTH_BIND_HOST` | no | default `127.0.0.1` |
| `OAUTH_TRANSACTION_TTL_SECONDS` | no | 60-600, default 600 |
| `OAUTH_MAX_PENDING_TRANSACTIONS` | no | 16-100000, default 1024 |
| `OAUTH_REQUEST_TIMEOUT_MS` | no | 500-10000, default 5000 |

Generate the state key without recording it in the repository or shell history:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

`GITHUB_HOSTNAME`, `GITHUB_API_URL`, and `GITHUB_OAUTH_HOST` must stay unset — any value aborts startup.

**B. Site build environment** (the Next.js build and runtime environment for the CMS origin only — never the default local shell, never CI, never a production context):

| Variable | Value |
| --- | --- |
| `CMS_ENABLED` | `true` |
| `PUBLIC_SITE_ORIGIN` | the exact CMS HTTPS origin, **byte-identical to an entry in `OAUTH_ALLOWED_ORIGINS`** |
| `CMS_OAUTH_PUBLIC_BASE_URL` | the exact broker HTTPS origin (`OAUTH_PUBLIC_ORIGIN`) |
| `CMS_OAUTH_AUTH_ENDPOINT` | `auth` |
| `CMS_GITHUB_REPOSITORY` | `Safe-Redact/Marketing-Site` |
| `CMS_PUBLISH_BRANCH` | an approved **non-production** branch — never `master` |
| `CMS_AUTH_SCOPE` | `public_repo` |

Mechanism: `predev` / `prebuild` / `prestart` run `npm run cms:config`, which renders `public/admin/config.yml` from these values. `site_domain` is set to `URL.host`, that is **host including port** — Decap sends it as `site_id` and the broker maps it back to one allowlisted origin, so the port must match on both sides.

> **Repository hygiene trap:** `public/admin/config.yml` is listed in `.gitignore` **but is already tracked** (`git ls-files` confirms it; it currently shows as modified). Any `dev`, `build`, or `test` run with `CMS_ENABLED=true` rewrites that tracked file with your real origins and branch. Keep it out of every commit, and run `npm run check:secrets` before staging anything.

### Answer 9 — authorizing a SafeRedact staff GitHub account

Three independent conditions, all enforced server-side in `github.mjs` `authorizeStaff`:

1. **Numeric user ID in the allowlist.** Logins are mutable and are not accepted. Read the immutable ID per person:
   ```bash
   gh api /users/LOGIN --jq .id
   ```
   Add the IDs to `OAUTH_ALLOWED_GITHUB_USER_IDS` and restart the broker — configuration is read once at startup.
2. **Current push permission** on `Safe-Redact/Marketing-Site` (`GET /repos/...` must return `permissions.push === true`). Grant it through normal repository or team access, not through the broker.
3. **Account type `User`**, plus an approved grant for this application if the organization restricts OAuth applications.

Also enrol one GitHub identity that is deliberately **not** allowlisted, for the negative tests in `DECAP_EDITORIAL_ACCEPTANCE.md`.

---

## 3. Requires deployment

### Answer 8 — starting the broker for testing

Prerequisites the operator must provide (none exist in the repository): a locally trusted certificate and private key for the broker host name, and the same for the CMS origin. Keep both outside source control — `*.pem` is ignored, and `scripts/check-secrets.mjs` rejects `*.key`, `*.pem`, `*.p12`, and `*.pfx` filenames.

```bash
npm --prefix services/cms-oauth-broker ci
npm --prefix services/cms-oauth-broker run check
npm --prefix services/cms-oauth-broker test
npm --prefix services/cms-oauth-broker start
```

Start it with the section-2A variables injected by an approved secret mechanism, as **exactly one** process. Then, in a separate shell with the section-2B variables set, serve the CMS origin over HTTPS:

```bash
npm run dev -- --experimental-https
```

`--experimental-https`, `--experimental-https-key`, `--experimental-https-cert`, and `--experimental-https-ca` are all available in the installed Next CLI. Supply your own trusted certificate rather than the generated self-signed one, because the browser must trust both origins and TLS warnings must not be bypassed.

Startup is fail-closed: any missing or invalid value prints a generic failure and exits 1 without starting a listener.

For a shared non-production origin instead of localhost, the broker needs a host that provides one long-running process, injected secrets, a trusted certificate, log redaction of query strings and cookies, and an edge rate limit — the last is not implemented in application code (see `PHASE5C_OAUTH_IMPLEMENTATION.md`).

---

## 4. Requires live testing

### Answer 10 — verifying login and article editing

1. `curl https://BROKER_ORIGIN/health` -> `ok`. This proves process availability only, not OAuth readiness.
2. `GET /admin/config.yml` on the CMS origin: confirm `base_url`, `auth_endpoint: auth`, `site_domain` **with port**, `auth_scope: public_repo`, the non-production `branch`, and **no secret of any kind**.
3. Open `https://CMS_ORIGIN/admin/index.html`, click login, and authenticate as an allowlisted staff identity. A successful run emits two broker log lines only — `oauth.initialize accepted` then `oauth.callback accepted` — each with a correlation ID and nothing else.
4. Confirm Decap loads `Safe-Redact/Marketing-Site` and the "Blog articles" collection.
5. Run `DECAP_EDITORIAL_ACCEPTANCE.md` scenarios 1-3 (login, create, save draft) as the minimum proof of "login and article editing": a `cms/...` branch and pull request must appear against the non-production branch, with no direct commit to a protected target.
6. Run the negative scenarios in that document (unlisted user, user without push, expired transaction, replayed callback, wrong port or scheme origin, wrong callback path, modified state). Every one must deny token delivery with a generic message.
7. Clean up: revoke the test grant, delete test branches and content through review, stop the broker, clear injected secrets, and restore `public/admin/config.yml` to its disabled state.

---

## 5. Risks found during this inspection

1. **The token-response contract is the most likely login blocker.** `github.mjs` `exchangeCode` requires `token_type: bearer`, **exactly one** scope equal to `public_repo`, **and** `expires_in` present, positive, and at most 86400. On GitHub.com, short-lived tokens are enabled by default for new OAuth applications (8 hours = 28800), which satisfies this — but if the application has expiring tokens opted out, **every login fails with a generic error and no diagnostic**. Confirm the application-level setting before testing, and do not reach for `offline_access` to force expiry: it adds a second scope that the same check rejects. If a live response is rejected, the correct response is an authorized review of this contract, not loosening the check.
2. **PKCE is fine.** GitHub.com supports `S256` PKCE for OAuth applications and GitHub Apps (announced July 2025), and `response_type` defaults to `code`, which the broker omits.
3. **The admin CSP may block the Decap preview pane.** `public/admin/index.html` sets `frame-src 'none'`, and Decap renders its editor preview inside an iframe. Editing may work while the preview pane fails. Verify this in step 5 above; any fix is a reviewed CSP change, not a silent edit. The login flow itself is unaffected — it uses `window.open` plus `postMessage`, which CSP does not govern, and `connect-src` already allows `https://api.github.com` for the GraphQL backend.
4. **Single-process constraint.** The in-memory transaction store means no second replica, no serverless, and no restart during a login; each denies the callback.
5. **Editorial controls remain outside this flow.** `master` branch protection, required checks, and independent review are unverified repository settings. OAuth authentication grants no editorial approval, and `CMS_PUBLISH_BRANCH` must point away from the production branch for all testing.

## Smallest missing setup step

Everything in code is in place. The smallest external step that unblocks a first login attempt: **an authorized `Safe-Redact` owner creates one non-production GitHub OAuth application with a single non-wildcard callback `https://localhost:8787/callback`, short-lived tokens enabled, and supplies the client ID and secret plus the staff numeric user IDs through a secret mechanism** — together with a locally trusted certificate pair for `localhost:8787` and `localhost:3000`.
