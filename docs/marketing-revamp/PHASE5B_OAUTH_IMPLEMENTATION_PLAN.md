# Phase 5B OAuth Broker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and validate an independently deployable, Decap-compatible GitHub OAuth broker that satisfies `PHASE5B_AUTH_SECURITY_SPEC.md` without coupling SafeRedact's marketing application to a hosting provider.

**Architecture:** Maintain a narrowly scoped SafeRedact fork of the pinned `sveltia-cms-auth` revision in a separately authorized broker repository. The broker owns secrets, OAuth transactions, GitHub identity checks, and exact-origin popup delivery; the existing marketing repository consumes only its public HTTPS origin through the Phase 5 CMS renderer.

**Tech Stack:** JavaScript/TypeScript edge-compatible runtime, GitHub OAuth authorization-code flow with PKCE, Web Crypto, Node test runner or the broker's approved test framework, locked dependencies, provider-neutral HTTPS deployment.

**Spec:** `docs/marketing-revamp/PHASE5B_AUTH_SECURITY_SPEC.md`

## Global constraints

- Do not implement the broker inside the Next.js marketing application.
- Do not create credentials, accounts, DNS, services, or deployments without separate authorization.
- Keep OAuth client secrets, state secrets, authorization codes, and privileged tokens server-side.
- Permit only exact HTTPS origins and the exact callback URL; no wildcards.
- Permit only `public_repo` while `Safe-Redact/Marketing-Site` remains public.
- Do not enable live CMS authentication until `master` is protected and the non-production acceptance suite passes.
- Do not add comment APIs or modify the marketing design.

## Review focus

- Canonically equivalent but textually different origins must not bypass scheme, host, or port checks.
- Concurrent, expired, replayed, and tampered OAuth transactions must fail without leaking state or tokens.
- A valid GitHub identity without approved staff status or repository write permission must not receive a token.
- Callback, scope, provider, and GitHub-host configuration must not silently fall back to broader or default behavior.
- Popup handshakes and error paths must not introduce wildcard messaging, token caching, or sensitive logs.

---

### Task 1: Authorize and freeze the broker source

**Files:**
- Create in the separately approved broker repository: `SECURITY.md`
- Create in the separately approved broker repository: `UPSTREAM.md`
- Preserve upstream: `src/index.js`
- Record in this repository after authorization: `docs/marketing-revamp/PHASE5B_PUBLISHING_ACCEPTANCE.md`

**Interfaces:**
- Consumes: upstream `sveltia/sveltia-cms-auth@33674be7ec77c1b771983650d979cae88160e093`
- Produces: an immutable SafeRedact fork revision and upstream provenance record

- [ ] Obtain authorization to create or select the broker repository and nominate an owner.
- [ ] Import the exact pinned upstream revision without deployment credentials.
- [ ] Record upstream URL, commit, license, import date, dependency lock digest, and update procedure.
- [ ] Enable repository review and CI in the broker repository only after separate settings authorization.
- [ ] Verify the imported tree matches the reviewed commit before any patch.

### Task 2: Add fail-closed configuration contracts

**Files:**
- Modify in broker repository: `src/index.js`
- Create in broker repository: `src/config.js`
- Create in broker repository: `test/config.test.js`

**Interfaces:**
- Consumes: deployment environment values defined in the security spec
- Produces: `loadConfig(env): BrokerConfig`, which either returns canonical validated values or throws before serving OAuth routes

- [ ] Write failing tests for every missing variable, HTTP origin, credential-bearing URL, wildcard, path-bearing origin, duplicate origin, broad scope, alternate GitHub host, and callback mismatch.
- [ ] Run the configuration tests and record the RED failures.
- [ ] Implement strict URL parsing and exact-origin canonicalization.
- [ ] Require exact broker origin, callback, non-empty allowed origins, repository, staff authorization source, state secret, client ID, and client secret.
- [ ] Reject instead of defaulting when scope or configuration is unsupported.
- [ ] Run the tests GREEN and verify error messages contain no supplied secret values.

### Task 3: Protect the OAuth transaction

**Files:**
- Create in broker repository: `src/transaction.js`
- Create in broker repository: `test/transaction.test.js`
- Modify in broker repository: `src/index.js`

**Interfaces:**
- Produces: `createTransaction(input, config): Promise<TransactionCookie>` and `consumeTransaction(request, config): Promise<OAuthTransaction>`
- Transaction fields: exact origin, provider, callback, nonce, issued-at, expiry, PKCE verifier; protected by authenticated encryption or server-side single-use storage

- [ ] Write failing tests for tampering, expiry, replay, origin mismatch, callback mismatch, concurrent transactions, missing cookie, malformed cookie, and deletion on every terminal response.
- [ ] Implement a high-entropy opaque state and PKCE verifier using Web Crypto.
- [ ] Protect the transaction and issue a `__Host-` cookie with the required attributes and ten-minute maximum lifetime.
- [ ] Consume transactions once and delete state on success and failure.
- [ ] Run the focused tests GREEN.

### Task 4: Harden GitHub authorization and exchange

**Files:**
- Create in broker repository: `src/github.js`
- Create in broker repository: `test/github.test.js`
- Modify in broker repository: `src/index.js`

**Interfaces:**
- Produces: `buildAuthorizationUrl(transaction, config): URL`
- Produces: `exchangeCode(input, config): Promise<GitHubToken>`
- Produces: `authorizeStaff(token, config): Promise<AuthorizedStaff>`

- [ ] Write failing tests requiring explicit callback, exact `public_repo`, PKCE S256, fixed GitHub endpoints, bounded response size/time, HTTP status validation, and generic error handling.
- [ ] Write failing tests for an unapproved user, removed user, read-only collaborator, revoked token, malformed GitHub response, and unavailable GitHub API.
- [ ] Add explicit `redirect_uri`, PKCE challenge/verifier, and strict token response parsing.
- [ ] Resolve immutable GitHub user identity and repository permission before token delivery.
- [ ] Reject every identity not in the approved staff source or lacking required repository permission.
- [ ] Ensure refresh tokens, if GitHub returns them, are neither logged nor sent to Decap.
- [ ] Run the focused tests GREEN.

### Task 5: Restrict popup messaging and HTTP responses

**Files:**
- Create in broker repository: `src/popup-response.js`
- Create in broker repository: `test/popup-response.test.js`
- Modify in broker repository: `src/index.js`

**Interfaces:**
- Produces: `createPopupResponse(result, transaction): Response`

- [ ] Write failing tests that reject `*`, hostname-only matches, wrong ports, wrong schemes, wrong `event.source`, unexpected message types, and transaction-origin mismatch.
- [ ] Bind handshake, success, and error delivery to the exact transaction origin.
- [ ] Add no-store, CSP, no-referrer, MIME-sniffing, and frame-denial response headers.
- [ ] Serialize results so attacker-controlled data cannot break out of the script context.
- [ ] Run the focused tests GREEN and inspect the emitted HTML manually.

### Task 6: Add logging, abuse, and operational controls

**Files:**
- Create in broker repository: `src/logging.js`
- Create in broker repository: `test/logging.test.js`
- Create in broker repository: `OPERATIONS.md`

**Interfaces:**
- Produces: bounded non-sensitive security events for success/failure category, latency, and correlation ID

- [ ] Write failing tests proving secrets, tokens, codes, state, verifiers, cookies, request bodies, and personal data are redacted.
- [ ] Add bounded request-size and rate-limit requirements appropriate to the chosen runtime.
- [ ] Document alerting, secret rotation, OAuth revocation, staff offboarding, dependency updates, rollback, and incident response.
- [ ] Confirm broker unavailability fails closed and does not change marketing-site availability.

### Task 7: Build provider-neutral CI and immutable artifacts

**Files:**
- Create in broker repository: `.github/workflows/ci.yml`
- Modify in broker repository: `package.json`
- Preserve broker dependency lockfile

**Interfaces:**
- Produces: immutable verified broker revision or image digest; no deployment

- [ ] Add least-privilege pull-request CI with SHA-pinned actions and no secrets for untrusted changes.
- [ ] Run formatting, lint, unit/integration tests, dependency audit, secret scan, and build/bundle verification.
- [ ] Add deterministic tests that search emitted artifacts for credentials and unsafe origins.
- [ ] Do not add automatic deployment.

### Task 8: Protect the publishing branch

**Files:**
- No repository file is a substitute for this administrator setting.
- Update after authorization: `docs/marketing-revamp/PHASE5B_PUBLISHING_ACCEPTANCE.md`

**Interfaces:**
- Consumes: CI check names from `.github/workflows/ci.yml`
- Produces: enforced pull-request publication boundary on `master`

- [ ] Obtain explicit authorization to change GitHub repository settings.
- [ ] Require pull requests, independent approval, stale-review dismissal, conversation resolution, and the three Phase 5 CI checks.
- [ ] Block direct pushes, force pushes, branch deletion, and routine bypass.
- [ ] Verify Decap's service/user identities cannot bypass the rule.
- [ ] Capture read-only evidence of the active rule and a rejected direct-push attempt in non-production conditions.

### Task 9: Configure an isolated non-production environment

**Files:**
- Update only after authorization: deployment-specific environment configuration outside Git
- Do not commit: OAuth credentials or `.env` files

**Interfaces:**
- Consumes: exact site/broker origins, OAuth application, staff allowlist, protected branch, broker artifact
- Produces: isolated HTTPS test environment for the acceptance plan

- [ ] Obtain authorization to create the OAuth app, broker runtime, DNS/TLS, secrets, and named tester access.
- [ ] Use a separate non-production OAuth application and credentials.
- [ ] Keep Netlify optional and preview-only; do not use Netlify Identity or Git Gateway.
- [ ] Configure the marketing build with public CMS variables only.
- [ ] Verify generated `config.yml` contains the expected public values and no secrets.
- [ ] Run every scenario in `PHASE5B_PUBLISHING_ACCEPTANCE.md` and retain redacted evidence.

### Task 10: Release review and rollback decision

**Files:**
- Update: `docs/marketing-revamp/PHASE5B_RELEASE_CHECKLIST.md`
- Update: `docs/marketing-revamp/PHASE5B_PUBLISHING_ACCEPTANCE.md`

**Interfaces:**
- Consumes: immutable broker revision, CI evidence, branch-protection evidence, and completed acceptance results
- Produces: explicit GO or NO-GO decision; no implicit launch

- [ ] Confirm every security invariant and acceptance scenario has evidence.
- [ ] Confirm production and non-production credentials, origins, and staff lists are isolated.
- [ ] Re-review the exact broker diff against current upstream.
- [ ] Rehearse broker rollback, token revocation, article archive/revert, and website deployment rollback.
- [ ] Obtain separate authorization before production credentials, deployment, or CMS enablement.

## Marketing repository commit and pull-request plan

The current working tree should remain uncommitted until separately authorized. When authorization is granted, use reviewable commits without rewriting history:

1. `ci: add provider-neutral quality and security gates` — `.github/workflows/ci.yml`, package scripts, route runner, secret scanner, and their tests.
2. `feat: make Decap authentication provider-neutral and fail closed` — CMS template, renderer, generated-file removal/ignore rule, admin CSP, and CMS regression tests.
3. `docs: define secure publishing and OAuth acceptance` — Phase 5 and Phase 5B documentation.

The pull request should target `master`, list the three required CI checks, state that live OAuth remains disabled, and call out the unprotected-branch blocker. It must not claim broker deployment or successful staff authentication.

## Implementation stop conditions

Stop without bypass if the broker cannot provide exact-origin messaging, explicit callback validation, PKCE, narrow scope, staff authorization, no-store responses, redacted logs, or deterministic tests. Also stop if enabling authentication would precede branch protection, require production credentials in a preview, or introduce a host-specific dependency into the marketing application.
