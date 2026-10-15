# Phase 5 implementation report

Date: 2026-10-14  
Branch: `feat/saferedact-publishing-and-comments`  
Base: `origin/master` at `012d3dd11166bc7e354ba8ced2f612970b5e01a6`  
Status: **repository implementation PASS; external publishing acceptance BLOCKED**

## Outcome

Phase 5 added provider-neutral CI, fail-closed Decap configuration generation, deterministic secret-pattern checks, production-server test orchestration, and operational documentation. It did not change homepage visuals or marketing functionality, create comment/moderation endpoints, deploy infrastructure, create credentials, or change GitHub settings.

The local stakeholder-review branch remains at `fa7212ab4a83bf3dd6202beb5523041c95585c50`. The Phase 5 branch was created from the reviewed work after it was merged to `origin/master`.

## Implemented changes

### GitHub CI

`.github/workflows/ci.yml` now defines three non-deployment checks:

- `quality / verify` — locked install, TypeScript, ESLint, production build, complete regression suite, and changed-line whitespace validation;
- `security / production-audit` — production dependency audit;
- `security / tracked-secret-policy` — deterministic repository secret/forbidden-file scan.

The workflow uses `contents: read`, `pull_request` rather than `pull_request_target`, no workflow secrets, no deployment actions, no provider CLI, and `persist-credentials: false`. Official actions are pinned to immutable v6.0.0 commits:

- `actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3`;
- `actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903`.

The workflow has not run on GitHub because no push was authorized.

### Provider-neutral CMS configuration

- The Decap schema moved to `config/decap-cms.yml`.
- `scripts/render-cms-config.mjs` generates the public `config.yml` for development, build, start, and tests.
- Only allowlisted public settings enter generated YAML.
- OAuth client secrets, tokens, state secrets, database credentials, and provider deployment credentials are neither read nor rendered.
- Enabled configuration requires credential-free HTTPS site and broker origins, a safe relative auth endpoint, valid repository/branch forms, and the reviewed `public_repo` scope.
- Disabled or missing configuration emits reserved `.invalid` origins. This prevents Decap's implicit `api.netlify.com` fallback and leaves staff login non-operational.
- The admin shell CSP no longer allows Netlify authentication endpoints.
- Decap remains `github` plus `editorial_workflow`, targeting protected `master`.

Expected production public/build variables:

- `CMS_ENABLED=true`
- `PUBLIC_SITE_ORIGIN`
- `CMS_OAUTH_PUBLIC_BASE_URL`
- `CMS_OAUTH_AUTH_ENDPOINT` (defaults to `auth`)
- `CMS_GITHUB_REPOSITORY`
- `CMS_PUBLISH_BRANCH`
- `CMS_AUTH_SCOPE` (currently restricted to `public_repo`)

The OAuth broker separately owns the exact callback URL, allowed origins, GitHub client ID, client secret, and any state-signing secret. Those values are never part of public Decap configuration.

### Tests and scripts

- `tests/phase5-infrastructure.test.mjs` verifies CI privileges, immutable action pins, complete commands, lack of deployment/provider secrets, provider-neutral CMS sources, fail-closed rendering, unsafe configuration rejection, callback policy documentation, and secret scanner coverage.
- `scripts/check-secrets.mjs` scans tracked and non-ignored repository files for private keys and common GitHub, AWS, Stripe, and Slack credential forms, and blocks common secret-bearing filenames.
- `scripts/run-route-tests.mjs` starts the optimized Next.js server on an available loopback port, waits for readiness, runs HTTP regression tests, and terminates the process.
- The admin route test verifies the generated fail-closed CMS configuration is served and contains neither Netlify fallback nor credential fields.

## RED/GREEN evidence

RED command:

```text
node --test tests/phase5-infrastructure.test.mjs
```

Initial result: **0 passed, 4 failed**. Failures were the expected missing CI workflow, CMS template/renderer, and secret scanner.

GREEN targeted result after implementation: **5 passed, 0 failed**. The fifth contract covers the OAuth source-review and exact-callback policy added during implementation.

## Final validation

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 461 packages installed from lockfile |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS — no warnings/errors; existing Next 15 deprecation notice for `next lint` |
| `npm run build` | PASS — Next.js 15.5.27, nine application routes/pages |
| `npm test` | PASS — 55/55 total tests |
| Static/source contracts | PASS — 31/31 |
| TypeScript content/contact contracts | PASS — 11/11 |
| Optimized production-server routes | PASS — 13/13 |
| `npm audit --omit=dev --audit-level=low` | PASS — 0 production vulnerabilities |
| `npm run check:secrets` | PASS — 150 repository files evaluated in the final tree |
| `git diff --check` | PASS |

Browser automation and screenshot acceptance were not attempted because the established browser-access restriction remains in force.

## Development-only advisories

The full `npm audit` continues to report nine development/tooling nodes: two moderate and seven high. Production audit remains zero.

Reported nodes:

- `@next/eslint-plugin-next`
- `braces` — GHSA-vfj7-8cjw-p6xm
- `chokidar`
- `eslint-config-next`
- `fast-glob`
- `micromatch`
- `postcss-nested`
- `postcss-selector-parser` — GHSA-rj75-hqrm-r3gf
- `tailwindcss`

The suggested resolutions include major or regressive framework/tooling changes, including Tailwind 4 or an older Next ESLint configuration. No forced upgrade was attempted.

## OAuth candidate review

`sveltia-cms-auth` commit `33674be7ec77c1b771983650d979cae88160e093` was inspected locally without deployment. Positive findings include active maintenance, MIT licensing, server-side client secrets, CSRF state comparison, a secure 10-minute state cookie, and support for the narrower `public_repo` scope.

It is **not approved unchanged** because its allowlist is optional, origin matching is hostname-only rather than exact scheme/host/port, the initial non-token popup handshake uses wildcard `postMessage`, exact GitHub callback behavior relies on external OAuth-app configuration, and the inspected revision contains no automated behavioral tests.

SafeRedact must choose either a reviewed hardening fork or another maintained Decap-compatible broker that makes exact-origin validation mandatory. Live OAuth functionality is not claimed.

## Outstanding limitations and blockers

- GitHub workflow checks have not run remotely and are not configured as required branch checks.
- No OAuth broker, OAuth app, callback, DNS, TLS, credential, or staff allowlist exists.
- Authentication alone does not approve publication; branch protection, CI, and independent review remain required.
- The final production host and canonical origin are not selected.
- Contact enquiries are accepted/validated but not delivered to email or CRM.
- Legal/privacy/community policies remain unapproved.
- Browser/mobile/accessibility acceptance remains blocked.
- Comments persistence, privacy, moderation, rate limiting, anti-abuse controls, staff authentication, APIs, and UI are intentionally not implemented.

## Git safety

No commit, push, merge, rebase, reset, force-push, deployment, external account, credential, or repository-setting change was performed.
