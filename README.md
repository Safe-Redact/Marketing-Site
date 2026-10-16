# SafeRedact marketing site

The public marketing website for SafeRedact, an AI-powered redaction software platform. It explains verified product capabilities, hosts the Insights content hub, accepts demo/contact enquiries, and can expose moderated article discussions. It does not distribute the desktop application or provide an application login.

The site is a Next.js 15 App Router application using React 19, TypeScript, and Tailwind CSS. It requires a Node.js server for middleware, API routes, and dynamic content; it is not a static export.

## Local setup

Node.js 22 is the supported development and CI runtime.

```text
npm ci
npm run dev
```

The normal HTTP site is available at `http://localhost:3000`. The CMS authentication flow requires trusted HTTPS; see **CMS and OAuth** below.

## Verification commands

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | TypeScript validation |
| `npm run lint` | ESLint through the current Next.js integration |
| `npm run build` | Production build with fail-closed CMS configuration |
| `npm test` | Complete static, content, route, PostgreSQL, and OAuth regression suite |
| `npm run check:secrets` | Deterministic tracked-file secret-pattern check |
| `npm audit --omit=dev --audit-level=low` | Root production dependency audit |
| `npm --prefix services/cms-oauth-broker audit --omit=dev --audit-level=low` | Broker production dependency audit |
| `git diff --check` | Whitespace and conflict-marker check |

CI runs these checks without deploying. The intended required GitHub checks are `quality / verify`, `security / production-audit`, and `security / tracked-secret-policy`. Repository administrators must separately enforce pull requests, independent approval, current checks, resolved review conversations, and blocked force-push/deletion on the production branch.

This checkout enables `.githooks/commit-msg` through the repository-local `core.hooksPath` setting. New clones should run `git config --local core.hooksPath .githooks`; the hook rejects known automated AI attribution trailers without changing the human author or committer identity.

## Configuration boundaries

Copy `.env.example` to the ignored `.env.local` only for local development. Deployment values belong in the host environment or secret store. Never commit `.env*`, certificates, database URLs, API tokens, OAuth secrets, authorization codes, cookies, or GitHub access tokens.

`TRUST_PROXY_HOPS` is the number of reverse-proxy hops that normalize and append `X-Forwarded-For`. It defaults to `0`, which ignores forwarding headers and groups unattributed requests into one defensive rate-limit bucket. Set it only after verifying the selected host's proxy chain; a typical single trusted proxy uses `1`.

## Insights and publishing

Public content lives as validated Markdown in `content/blog`. Only entries with `status: published` and a current or past publication date appear in listings, article routes, filters, or the sitemap. Draft, scheduled, and archived entries remain undiscoverable.

The editor is served at `/admin/index.html` (`/admin` redirects there). Its generated public configuration is `public/admin/config.yml`; the file is ignored and must contain deployment coordinates only, never credentials. Configure the root environment with:

- `CMS_ENABLED`
- `PUBLIC_SITE_ORIGIN`
- `CMS_OAUTH_PUBLIC_BASE_URL`
- `CMS_OAUTH_AUTH_ENDPOINT`
- `CMS_GITHUB_REPOSITORY`
- `CMS_PUBLISH_BRANCH`
- `CMS_AUTH_SCOPE` (currently exactly `public_repo`)

Run `npm run cms:config` and inspect the generated file before starting an enabled CMS. Missing configuration renders non-routable `.invalid` origins. Use a reviewed non-production publishing branch for acceptance; OAuth authentication does not replace GitHub branch protection or editorial approval.

## CMS and OAuth

The confidential GitHub OAuth broker is isolated in `services/cms-oauth-broker` and is not imported by the public application. For controlled local testing:

1. Create a separately authorized non-production GitHub OAuth App.
2. Set the app Homepage URL to the exact `PUBLIC_SITE_ORIGIN`.
3. Set its only Authorization callback URL to the exact `OAUTH_CALLBACK_URL`, which must equal `OAUTH_PUBLIC_ORIGIN` plus `/callback`; disable wildcard callback matching and enable expiring user tokens.
4. Copy `services/cms-oauth-broker/.env.example` to its ignored `.env.local`, supply the server-only values, and keep certificate/key material outside the repository.
5. Install and verify the broker, then start both HTTPS processes:

```text
npm --prefix services/cms-oauth-broker ci
npm --prefix services/cms-oauth-broker run check
npm --prefix services/cms-oauth-broker test
npm run oauth:dev
npm run dev:https
```

The broker requires `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `OAUTH_PUBLIC_ORIGIN`, `OAUTH_CALLBACK_URL`, `OAUTH_ALLOWED_ORIGINS`, `OAUTH_ALLOWED_REPOSITORY`, `OAUTH_ALLOWED_GITHUB_USER_IDS`, `OAUTH_STATE_SECRET`, `OAUTH_GITHUB_SCOPE`, `OAUTH_TLS_CERT_PATH`, and `OAUTH_TLS_KEY_PATH`. Optional limits are documented in the broker environment template.

The current in-memory OAuth transaction store supports one long-running HTTPS process only. Do not deploy it to multiple replicas or an ephemeral serverless runtime until an atomic shared consume-once TTL store is implemented. The Safe-Redact organization must approve the OAuth App before organization-restricted staff can complete login.

## Visitor comments and moderation

Comments are off unless both `COMMENTS_DATABASE_URL` and a 32-character-or-longer `COMMENTS_ABUSE_SECRET` are configured. PostgreSQL is accessed only through `CommentsRepository`. Visitor submissions are validated, stored pending, and never public before moderation. Staff API requests require a GitHub bearer token whose numeric user ID is allowlisted by `COMMENTS_STAFF_GITHUB_USER_IDS` and whose current repository permission includes push access.

For local PostgreSQL:

```text
npm run db:provision
npm run comments:migrate
npm test
```

`db:provision` is deliberately restricted to loopback and prompts for the PostgreSQL superuser password. The application password is read from the ignored connection URL. On a server, create a non-superuser application role, keep PostgreSQL private, enable TLS for non-loopback connections, install `pgcrypto` as an administrator, and run `npm run comments:migrate` after deployment.

Back up and test restoration regularly:

```text
pg_dump --format=custom --no-owner --dbname "$COMMENTS_DATABASE_URL" --file "comments-YYYY-MM-DD.dump"
pg_restore --no-owner --dbname "$TARGET_DATABASE_URL" comments-YYYY-MM-DD.dump
```

Do not restore development data into production and do not reuse the development abuse secret. The repository contains tested retention logic for rejected comments and removed tombstones, but no scheduler; production needs an approved maintenance job and retention policy before collection is enabled.

## Contact and demo enquiries

`POST /api/contact` validates and bounds JSON, applies a honeypot and in-process throttling, and logs only an opaque reference and outcome. With no provider configured it returns an honest accepted-but-not-delivered response. Real delivery requires all of `LEAD_DELIVERY_ENDPOINT`, `LEAD_DELIVERY_TOKEN`, `LEAD_DELIVERY_FROM`, and `LEAD_DELIVERY_TO`; only a successful provider acknowledgement is reported as delivered.

Before production activation, approve the provider and destination, configure shared/edge abuse protection for multi-instance hosting, verify a real non-production delivery, add monitoring, and approve privacy and retention terms. The current application-level lead limiter is process-local.

## Deployment requirements

- A Next.js-compatible Node.js 22 environment with HTTPS.
- Exact public site and OAuth origins supplied through environment variables.
- Secret storage for broker, database, and optional lead-delivery credentials.
- A private, backed-up PostgreSQL service if comments are enabled.
- One broker process until the transaction store is replaced.
- Edge request controls and verified forwarding-header normalization.
- GitHub branch protection and organization OAuth approval.
- Legal/privacy destinations and final cross-browser, mobile, accessibility, and performance acceptance.

The production host is intentionally not hardcoded. CI contains no deploy job, and temporary preview hosting is not part of the application architecture.
