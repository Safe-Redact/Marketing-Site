# CMS staff login — local HTTPS walkthrough

Date: 2026-10-15
Target: admin `https://localhost:3000`, broker `https://localhost:8787`
Status: **configuration validated offline; no credential, certificate, or live login created**

Companion to `CMS_LOGIN_ACTIVATION_RUNBOOK.md`. That document covers what exists and why; this one is the executable sequence for the local environment.

## Quick start (after the one-time setup below)

Environment values live in two git-ignored files, so no variable has to be retyped per shell:

| File | Holds | Loaded by |
| --- | --- | --- |
| `.env.local` | public CMS coordinates and local cert paths | `npm run cms:config`, `npm run dev:https` |
| `services/cms-oauth-broker/.env.local` | OAuth client ID/secret, allowlists, state key, TLS paths | `npm run oauth:dev` |

```powershell
npm run oauth:dev   # terminal 1 — broker on https://localhost:8787
npm run dev:https   # terminal 2 — site on https://localhost:3000
```

Both load their file through Node's native `--env-file-if-exists`, which is why the CMS renderer sees the values even though `predev:https` runs it before Next reads anything. A value exported in the shell overrides the file, and `npm test` never reads either file — the test render is forced to the disabled profile through `npm run cms:config:test`.

`npm run dev:https` refuses to start when a certificate path is unreadable, when the port is taken, or when `PUBLIC_SITE_ORIGIN`'s port does not match the dev port — the three mistakes that otherwise surface as a 403 at `/auth`. `npm run oauth:dev` keeps the broker's existing fail-closed startup: a missing or malformed value aborts before the listener opens.

Start from the templates: copy `.env.example` and `services/cms-oauth-broker/.env.example`, then fill in the real values. Steps 1-3 below cover the one-time certificate and credential setup.

## Offline validation already performed

Run against the real modules with placeholder credentials, no network, nothing written to the repository:

| Check | Result |
| --- | --- |
| `loadConfig` accepts the exact broker values below | pass — `publicOrigin https://localhost:8787`, `callbackUrl https://localhost:8787/callback`, `site_id` map `localhost:3000 -> https://localhost:3000` |
| `/auth?provider=github&site_id=localhost%3A3000&scope=public_repo` | `302` to `https://github.com/login/oauth/authorize` with `redirect_uri=https://localhost:8787/callback`, `scope=public_repo`, 43-char `state`, 43-char `code_challenge`, `code_challenge_method=S256` |
| Transaction cookie | `__Host-saferedact-oauth-state=...; HttpOnly; Max-Age=600; Path=/; SameSite=Lax; Secure` |
| Same request with `site_id=localhost:3001` | `403` denied — proves the port is part of the identity |
| Rendered config for these values | `base_url: https://localhost:8787`, `auth_endpoint: auth`, `auth_scope: public_repo`, **`site_domain: localhost:3000`**, `site_url: https://localhost:3000` |

So the port pair below is consistent end to end. The remaining unknowns are all external: the OAuth application, the certificates, the staff IDs, and the review branch.

---

## Step 0 — external prerequisites (not in this repository)

1. **Non-production GitHub OAuth application** created by an authorized `Safe-Redact` owner:
   - Homepage URL: `https://localhost:3000`
   - Authorization callback URL: `https://localhost:8787/callback` — exactly this, as the only redirect URI
   - Per-URI wildcard redirect matching: **off** (legacy single-URI apps default to on)
   - Expiring (short-lived) user tokens: **on**; do not request `offline_access`
   - Organization approval if OAuth application restrictions are enforced
2. **Staff numeric GitHub user IDs.** `gh` is not installed on this machine, so read them with curl (public endpoint, no token needed):
   ```bash
   curl -s https://api.github.com/users/LOGIN
   ```
   Use the `"id"` value. Each ID must also have push access to `Safe-Redact/Marketing-Site`.
3. **A non-production publishing branch that exists on `origin`.** Today `origin` has only `master` (default, 4 commits ahead) and `main` (stale, holding only `add readme`). Neither is an acceptable review target: `master` is production and `main`'s purpose is undefined. Create and push a dedicated branch — for example `cms-nonprod` from `master` — which is a repository-changing action and needs your authorization.

   Be aware that `.github/workflows/ci.yml` triggers on `pull_request` into `master` and on pushes to `master` and `feat/saferedact-publishing-and-comments` only. Pull requests Decap opens **into `cms-nonprod` will run no CI checks**, so editorial-acceptance scenarios 4-5 ("required checks rerun") cannot be satisfied until that branch is added to the workflow triggers — a separate authorized change.

---

## Step 1 — certificates

`mkcert` is not installed; `openssl` is available but a manually trusted self-signed pair is more steps and more risk. One `mkcert` certificate covers `localhost` on both ports, so you need exactly one pair.

```powershell
winget install FiloSottile.mkcert
```

Then, in a terminal that can write to the machine trust store (`mkcert -install` needs elevation on Windows):

```powershell
mkcert -install
New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\saferedact-cms-dev-certs" | Out-Null
Set-Location "$env:LOCALAPPDATA\saferedact-cms-dev-certs"
mkcert localhost 127.0.0.1 ::1
```

This produces `localhost+2.pem` and `localhost+2-key.pem` in that directory. Keep them **outside the repository**: `*.pem` is git-ignored, but `scripts/check-secrets.mjs` also rejects `*.pem`/`*.key` filenames outright, and a key inside the working tree is an avoidable risk.

Record the two absolute paths; both the broker and `next dev` use the same pair.

---

## Step 2 — terminal A: the broker

One process, never restarted mid-login (the transaction store is in memory).

```powershell
npm --prefix services/cms-oauth-broker ci
npm --prefix services/cms-oauth-broker run check
npm --prefix services/cms-oauth-broker test
```

Set the environment. The two secrets are read interactively so they never reach PowerShell's saved history, and the state key is generated straight into the variable so no human ever sees it:

```powershell
$certDir = "$env:LOCALAPPDATA\saferedact-cms-dev-certs"
$env:GITHUB_OAUTH_CLIENT_ID     = Read-Host "OAuth client ID"
$env:GITHUB_OAUTH_CLIENT_SECRET = Read-Host "OAuth client secret"
$env:OAUTH_STATE_SECRET         = node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
$env:OAUTH_PUBLIC_ORIGIN        = "https://localhost:8787"
$env:OAUTH_CALLBACK_URL         = "https://localhost:8787/callback"
$env:OAUTH_ALLOWED_ORIGINS      = "https://localhost:3000"
$env:OAUTH_ALLOWED_REPOSITORY   = "Safe-Redact/Marketing-Site"
$env:OAUTH_ALLOWED_GITHUB_USER_IDS = Read-Host "Staff GitHub numeric IDs (comma separated)"
$env:OAUTH_GITHUB_SCOPE         = "public_repo"
$env:OAUTH_TLS_CERT_PATH        = "$certDir\localhost+2.pem"
$env:OAUTH_TLS_KEY_PATH         = "$certDir\localhost+2-key.pem"
$env:OAUTH_PORT                 = "8787"
npm --prefix services/cms-oauth-broker start
```

Expected single log line:

```json
{"event":"oauth.server","outcome":"listening","host":"127.0.0.1","port":8787}
```

Anything else means fail-closed startup: the message is deliberately generic, so re-check the table in the runbook (section 2A) value by value. The most common causes are a state secret that is not exactly 43 base64url characters, a callback that is not the public origin plus `/callback`, and an unreadable certificate path.

Health check from a third terminal — PowerShell uses the Windows trust store, so `mkcert -install` makes this verify properly without weakening TLS:

```powershell
Invoke-WebRequest https://localhost:8787/health | Select-Object -ExpandProperty Content
```

`ok` proves the process is up. It proves nothing about OAuth.

---

## Step 3 — terminal B: the site

```powershell
$certDir = "$env:LOCALAPPDATA\saferedact-cms-dev-certs"
$env:CMS_ENABLED               = "true"
$env:PUBLIC_SITE_ORIGIN        = "https://localhost:3000"
$env:CMS_OAUTH_PUBLIC_BASE_URL = "https://localhost:8787"
$env:CMS_OAUTH_AUTH_ENDPOINT   = "auth"
$env:CMS_GITHUB_REPOSITORY     = "Safe-Redact/Marketing-Site"
$env:CMS_PUBLISH_BRANCH        = "cms-nonprod"
$env:CMS_AUTH_SCOPE            = "public_repo"
npm run dev -- --port 3000 --experimental-https --experimental-https-cert "$certDir\localhost+2.pem" --experimental-https-key "$certDir\localhost+2-key.pem"
```

`predev` regenerates `public/admin/config.yml` from those values first. Two things to watch:

- **Confirm the port is actually 3000.** If 3000 is occupied, `next dev` moves to the next free port and the origin silently stops matching `OAUTH_ALLOWED_ORIGINS` — every login attempt then returns `403` from `/auth`. Free the port rather than changing the origin.
- **`public/admin/config.yml` is tracked** despite being git-ignored, so it now shows local origins in `git status`. Never stage it.

Verify the generated file before logging in:

```bash
curl -s --cacert "$(mkcert -CAROOT)/rootCA.pem" https://localhost:3000/admin/config.yml | head -12
```

It must show `base_url: https://localhost:8787`, `auth_endpoint: auth`, `site_domain: localhost:3000`, `auth_scope: public_repo`, `branch: cms-nonprod`, and no secret.

---

## Step 4 — the login attempt

Open `https://localhost:3000/admin/index.html` (not `/admin/`, which is not a served path; `/admin` redirects here). Click login and authenticate as an allowlisted staff identity. Do not dismiss or bypass any TLS warning — a warning means the certificate is not trusted, and the popup handshake will fail anyway.

A successful run writes exactly two broker lines:

```json
{"event":"oauth.initialize","outcome":"accepted","correlationId":"..."}
{"event":"oauth.callback","outcome":"accepted","correlationId":"..."}
```

### Reading failures

The broker returns deliberately generic errors, so use the pair (where it failed, which log line) to localise:

| Symptom | Where | Likely cause |
| --- | --- | --- |
| `403` immediately, `oauth.initialize rejected` | `/auth` | `site_id` does not match an allowed origin — wrong port, wrong scheme, or the dev server moved off 3000 |
| GitHub shows a redirect-URI mismatch | GitHub | The application's callback is not exactly `https://localhost:8787/callback` |
| `400` after GitHub, `oauth.callback rejected` | `/callback` | Transaction cookie missing, expired (10 min), replayed, or the broker restarted mid-login |
| Popup shows a generic error, `oauth.callback rejected` | after exchange | Token exchange or staff authorization failed: non-expiring token, scope not exactly `public_repo`, user ID not allowlisted, or no push permission |
| Decap loads but the preview pane is blank | admin page | `frame-src 'none'` in `public/admin/index.html` versus Decap's preview iframe; editing may still work. Any fix is a reviewed CSP change |

The fourth row is the one to expect first. Confirm the OAuth application has short-lived tokens enabled before blaming the allowlist — the broker rejects any token response without `expires_in` (positive, ≤ 86400) and any scope that is not exactly `public_repo`.

---

## Step 5 — prove editing, then tear down

Run scenarios 1-3 of `DECAP_EDITORIAL_ACCEPTANCE.md`: log in, create a clearly non-production article with `status: draft`, save through the editorial workflow, and confirm a `cms/...` branch and a pull request appear against `cms-nonprod` with no direct commit to `master`. Remember that branches in this public repository are publicly readable, so use only non-sensitive content.

Teardown:

1. Stop `next dev` and the broker.
2. Close both terminals so the injected secrets leave process memory.
3. Revoke the test grant at <https://github.com/settings/applications>.
4. Delete the test branch and pull request through normal review.
5. Restore the disabled CMS configuration in a shell with no `CMS_*` variables set, then confirm the diff is clean:
   ```bash
   npm run cms:config
   git diff --stat public/admin/config.yml
   npm run check:secrets
   ```
