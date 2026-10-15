# Phase 5B release checklist

Date: 2026-10-15  
Status: **repository preparation in progress; live publishing NO-GO**

## Working-tree inventory

The Phase 5 tree contained 22 changed paths before these four Phase 5B documents were added. Each path was inspected and is intentional.

| Change group | Paths | Reason |
| --- | --- | --- |
| Provider-neutral CI | `.github/workflows/ci.yml`, `package.json` | Locked install, build/test/audit/secret gates; no deployment |
| CMS source and rendering | `config/decap-cms.yml`, `scripts/render-cms-config.mjs`, `.gitignore`, deleted `public/admin/config.yml` | Generate public configuration from validated non-secret values and fail closed when disabled |
| Admin shell | `public/admin/index.html` | Remove Netlify auth allowances while preserving noindex and pinned Decap bundle |
| Test orchestration/security | `scripts/check-secrets.mjs`, `scripts/run-route-tests.mjs`, `tests/phase5-infrastructure.test.mjs` | Deterministic secret checks, production-server tests, and Phase 5 contracts |
| Updated regressions | `tests/phase4a-content.test.ts`, `tests/phase4a-routes.test.mjs` | Assert generated fail-closed config and no credential/provider fallback |
| Updated existing docs | `BLOG_ARCHITECTURE.md`, `DECAP_AUTH_DEPLOYMENT_PLAN.md`, `DECAP_CMS_SETUP.md` | Replace provider-specific assumptions with the generated provider-neutral model |
| New Phase 5 docs | `COMMENTS_IMPLEMENTATION_PLAN.md`, `DECAP_NETLIFY_AUTH_PLAN.md`, `GITHUB_CI_AND_BRANCH_PROTECTION.md`, `LAUNCH_BLOCKERS.md`, `PHASE5_DESIGN_SPEC.md`, `PHASE5_IMPLEMENTATION_PLAN.md`, `PHASE5_IMPLEMENTATION_REPORT.md` | Record architecture, controls, validation, and deferred work |

No homepage/component styling, visitor comment API, database adapter, host deployment file, credential, `.env` file, account, or external service is included.

## Generated configuration review

- [x] Source schema contains no OAuth credential.
- [x] Generated disabled configuration uses `https://cms-auth.invalid` and `https://site.invalid`.
- [x] Missing enabled values cause generation to fail rather than fall back.
- [x] Origins require credential-free HTTPS with no path, query, or fragment.
- [x] Repository, branch, endpoint, and scope are validated.
- [x] A server-side secret sentinel supplied to the renderer is not serialized.
- [x] Generated `public/admin/config.yml` is ignored and removed from source control.
- [ ] A real deployment configuration has been generated and inspected. **Blocked: no approved broker/origins.**

## OAuth security gate

- [x] Exact upstream broker revision recorded and refreshed against upstream.
- [x] Upstream source reviewed for origin, callback, state, code exchange, messaging, scope, logging, and token handling.
- [x] Upstream broker rejected for unchanged production use.
- [ ] SafeRedact hardening fork or equivalent maintained broker selected.
- [ ] Required patches implemented and reviewed.
- [ ] Behavioral security suite passes on the exact deployable artifact.
- [ ] Non-production DNS, TLS, runtime, secret store, and monitoring approved.
- [ ] OAuth application created with exact callback and wildcard matching disabled.
- [ ] Token expiry, revocation, secret rotation, and rollback rehearsed.

## Publishing workflow gate

- [x] Decap GitHub backend targets `Safe-Redact/Marketing-Site` and `master`.
- [x] `publish_mode: editorial_workflow` is configured.
- [x] Public loader excludes drafts, archives, and future-dated content.
- [x] Content validation rejects malformed frontmatter, executable HTML, unsafe images, and unsafe URL schemes.
- [ ] `master` protected. **Blocked: GitHub reported `protected: false` on 2026-10-15.**
- [ ] Required CI checks active on the latest pull-request SHA.
- [ ] Independent content review and stale-approval dismissal active.
- [ ] Force push, deletion, direct push, and routine bypass blocked.
- [ ] Named staff access, MFA, offboarding, and review ownership approved.
- [ ] Draft-to-publish and withdrawal acceptance scenarios executed.

## Repository verification gate

The following must be rerun immediately before an authorized commit or pull request:

- [ ] `npm ci`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] `npm audit --omit=dev --audit-level=low`
- [ ] `npm run check:secrets`
- [ ] `git diff --check`
- [ ] Review `git status --short --branch`
- [ ] Confirm `public/admin/config.yml`, `.next`, `node_modules`, `.env*`, credentials, and local state are not staged

### Current local verification

The complete gate was run on 2026-10-15 after the Phase 5B documents were created:

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 461 packages installed from the lockfile |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS — no warnings/errors; Next 15 emitted its existing `next lint` deprecation notice |
| `npm run build` | PASS — Next.js 15.5.27, nine application routes/pages |
| `npm test` | PASS — 55/55 tests: 31 static/source, 11 content/contact, 13 production-server routes |
| `npm audit --omit=dev --audit-level=low` | PASS — zero production vulnerabilities |
| Full install audit | Nine development/tooling advisory nodes: two moderate, seven high; unchanged from Phase 5 |
| `npm run check:secrets` | PASS — 154 repository files evaluated |
| `git diff --check` | PASS — no whitespace errors; Git emitted line-ending conversion notices only |

This evidence applies to the current uncommitted tree. It does not replace the mandatory fresh run immediately before an authorized commit or pull request.

## Proposed commits

No commit is authorized in Phase 5B. After explicit approval, preserve history and create normal commits in this order:

1. `ci: add provider-neutral quality and security gates`
   - CI workflow, package scripts, route test runner, secret scanner, and associated contracts.
2. `feat: make Decap authentication provider-neutral and fail closed`
   - Decap template and renderer, ignored generated artifact, admin CSP, and CMS content/route tests.
3. `docs: define secure CMS publishing readiness`
   - Phase 5 and Phase 5B architecture, security, acceptance, blocker, and operational documents.

Before staging, inspect each path again and stage explicit filenames or reviewed groups. Do not use an indiscriminate command that could include newly appearing local files.

## Proposed pull request

Suggested title: `Prepare provider-neutral CI and secure CMS publishing`

The description should state:

- provider-neutral GitHub CI is added without deployment;
- Decap remains disabled by default and fails closed;
- CMS config contains public coordinates only;
- no OAuth service, credential, or external account was created;
- no comment API or homepage redesign is included;
- production dependency audit and regression results;
- the broker is not approved unchanged;
- `master` branch protection and live OAuth acceptance remain blockers;
- Netlify is preview-only.

The PR must target `master` and must not be merged until the new workflow has run successfully and a reviewer confirms the branch/security plan. Creating, pushing, or opening that PR requires separate authorization.

## Exact actions requiring authorization

### Source control

- create the three local commits;
- push `feat/saferedact-publishing-and-comments`;
- open a draft pull request;
- merge any pull request.

### GitHub administration

- configure the `master` ruleset/branch protection;
- approve actual CODEOWNERS users or teams;
- create and configure a GitHub OAuth application;
- approve organization OAuth access and staff roles;
- enable or change native secret scanning/push protection.

### Broker infrastructure

- create/select the SafeRedact broker repository;
- fork or copy the pinned upstream source;
- provision non-production runtime, DNS, TLS, secret storage, rate limiting, logs, and alerts;
- create/store OAuth and state credentials;
- deploy, rollback, rotate, revoke, or delete broker infrastructure.

### Live acceptance

- enable CMS authentication in a non-production marketing deployment;
- use authorized and unauthorized test identities;
- execute browser/OAuth scenarios;
- create test branches, pull requests, content, media, and deployment builds;
- enable production CMS configuration or credentials.

## Go/no-go decision

Repository code may proceed to a separately authorized pull request after the verification gate passes. Live CMS authentication and publishing remain **NO-GO** until the hardened broker, protected branch, named staff controls, isolated non-production environment, and every scenario in `PHASE5B_PUBLISHING_ACCEPTANCE.md` have passed with sanitized evidence.
