# OAuth broker local setup

Date: 2026-10-15  
Status: **repeatable setup instructions; no credential or live-login execution recorded**

## Prerequisites

- Node.js 22 or later.
- Two trusted local HTTPS origins: one for the marketing `/admin/` page and one for the broker. Use distinct local DNS names such as `cms.saferedact.test` and `auth.saferedact.test`; the exact names and ports are environment choices, not application constants.
- A locally trusted certificate for each origin. Certificate and key files must remain outside source control; `*.pem` and `.env*` are ignored.
- A separately authorized non-production GitHub OAuth application.
- Named test staff GitHub IDs with write access to `Safe-Redact/Marketing-Site`, plus a separate unauthorized identity for negative testing.

Do not use production credentials, publish test content, or relax browser TLS warnings. Plain HTTP is rejected intentionally.

## GitHub OAuth application

An authorized GitHub organization owner must create a non-production OAuth application and record:

1. Application name that clearly identifies the non-production SafeRedact CMS.
2. Homepage URL equal to the exact HTTPS CMS origin.
3. Authorization callback URL equal to the exact broker URL ending in `/callback`.
4. Wildcard callback matching disabled.
5. Expiring access tokens enabled. The broker rejects non-expiring responses and intentionally discards refresh tokens so expiry leads to reauthentication.
6. Organization OAuth approval, if the organization enforces OAuth restrictions.

The client ID is deployment configuration. The client secret belongs only in the broker's secret store or securely injected process environment. Never put either value in `public/admin/config.yml`; never put the secret in a shell script, command history, CI pull-request environment, or repository file.

## Broker environment

| Variable | Required | Meaning |
| --- | --- | --- |
| `GITHUB_OAUTH_CLIENT_ID` | Yes | Non-production OAuth application client ID |
| `GITHUB_OAUTH_CLIENT_SECRET` | Yes | Secret-store value used only for server-side exchange |
| `OAUTH_PUBLIC_ORIGIN` | Yes | Exact broker HTTPS origin, including non-default port |
| `OAUTH_CALLBACK_URL` | Yes | Exactly `OAUTH_PUBLIC_ORIGIN` plus `/callback` |
| `OAUTH_ALLOWED_ORIGINS` | Yes | Comma-separated exact HTTPS CMS origins |
| `OAUTH_ALLOWED_REPOSITORY` | Yes | `Safe-Redact/Marketing-Site` |
| `OAUTH_ALLOWED_GITHUB_USER_IDS` | Yes | Comma-separated immutable numeric staff IDs |
| `OAUTH_STATE_SECRET` | Yes | Fresh 32-byte base64url secret; server-side only |
| `OAUTH_GITHUB_SCOPE` | Yes | Exactly `public_repo` |
| `OAUTH_TRANSACTION_TTL_SECONDS` | No | 60–600; default 600 |
| `OAUTH_MAX_PENDING_TRANSACTIONS` | No | 16–100000; default 1024; rejects new initialization at capacity |
| `OAUTH_REQUEST_TIMEOUT_MS` | No | 500–10000; default 5000 |
| `OAUTH_TLS_CERT_PATH` | Yes | Local path to the broker certificate |
| `OAUTH_TLS_KEY_PATH` | Yes | Local path to the broker private key |
| `OAUTH_PORT` | No | HTTPS listen port; default 8787 |
| `OAUTH_BIND_HOST` | No | Listen address; default `127.0.0.1` |

Generate a state key without writing it to the repository:

```text
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Inject the resulting value through an approved local secret mechanism. The service source still reads `process.env` only and fails startup when required values are missing or invalid, so a deployment can inject these from a secret store unchanged.

For local development, `npm run oauth:dev` (root) or `npm run dev` (in the service directory) loads `services/cms-oauth-broker/.env.local` through Node's native `--env-file-if-exists` flag before the service starts. Loading happens in the runtime, not in application code; `npm start` and the test suite never read an env file. Variables already exported in the shell take precedence over the file, and the file is git-ignored. See `.env.example` in that directory for the template.

## CMS build environment

To enable the development CMS configuration, provide:

| Variable | Example shape |
| --- | --- |
| `CMS_ENABLED` | `true` |
| `PUBLIC_SITE_ORIGIN` | exact local CMS HTTPS origin |
| `CMS_OAUTH_PUBLIC_BASE_URL` | exact local broker HTTPS origin |
| `CMS_OAUTH_AUTH_ENDPOINT` | `auth` |
| `CMS_GITHUB_REPOSITORY` | `Safe-Redact/Marketing-Site` |
| `CMS_PUBLISH_BRANCH` | a separately approved non-production review target |
| `CMS_AUTH_SCOPE` | `public_repo` |

The value of `PUBLIC_SITE_ORIGIN` must also appear exactly in `OAUTH_ALLOWED_ORIGINS`, including scheme and port. Run `npm run cms:config`, inspect the generated ignored file, and confirm it contains no credential before starting the site.

## Install, test, and start

```text
npm --prefix services/cms-oauth-broker ci
npm --prefix services/cms-oauth-broker run check
npm --prefix services/cms-oauth-broker test
npm --prefix services/cms-oauth-broker start
```

The server exposes `GET /health`, `GET /auth`, and `GET /callback` only. A successful health response proves process availability, not OAuth readiness.

## Controlled test sequence

1. Start one broker process with approved local TLS and injected non-production secrets.
2. Build/start the marketing site on the exact approved HTTPS CMS origin.
3. Confirm `/admin/config.yml` has the broker origin, `auth`, exact `site_domain` including port, `public_repo`, and the non-production branch; confirm it has no secrets.
4. Confirm broker/platform logging suppresses query strings, cookies, request bodies, codes, tokens, state, and verifiers.
5. Execute `DECAP_EDITORIAL_ACCEPTANCE.md` with non-sensitive test content.
6. Revoke the test grant, remove test branches/content through normal review, stop the broker, and clear injected secrets.

Local/live steps are currently blocked because no OAuth application, credentials, trusted local HTTPS setup, or approved staff test identities were created in Phase 5C.

