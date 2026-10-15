# Phase 5 provider-neutral design specification

Date: 2026-10-14  
Status: proposed for implementation review  
Implementation branch: `feat/saferedact-publishing-and-comments`  
Branch base: `origin/master` at `012d3dd11166bc7e354ba8ced2f612970b5e01a6`

## Purpose

Phase 5 adds provider-neutral CI and publishing readiness while preserving the existing marketing site and public blog. It does not redesign the homepage, activate visitor comments, create an administration application, or deploy production infrastructure.

Netlify is an optional stakeholder-preview adapter only. It is not an authentication authority, production host assumption, content API, or required deployment target.

## Verified starting state

- The reviewed commit `fa7212ab4a83bf3dd6202beb5523041c95585c50` is an ancestor of `origin/master`.
- Pull request 1 was merged into `master`; the remote stakeholder-review branch was deleted after merge.
- The local stakeholder-review branch remains unchanged at the reviewed commit.
- The Phase 5 branch was created from `origin/master` without changing local `master`.
- Netlify deploy-preview status exists for the former review pull request, but production-host configuration is not available and is not inferred.
- No GitHub Actions workflow, `netlify.toml`, CMS OAuth service, comments database, or production comment API exists.

## Architecture decisions

### 1. Provider-neutral application

The Next.js application remains the single public website. It may run on any host that supports the existing Next.js production build, server routes, environment variables, HTTPS, and Git-triggered builds.

Deployment-specific values are configuration, not source-code constants:

- public site origin;
- public CMS OAuth broker origin;
- CMS authentication endpoint path;
- Git publication branch and repository identity;
- OAuth callback URL and allowed admin origins at the broker;
- future comments database connection and server credentials.

No application source, static CMS shell, or CI workflow may depend on a Netlify domain or API.

### 2. CMS authentication boundary

Decap keeps its `github` backend and `editorial_workflow`. Authentication is delegated to a separately deployed OAuth broker implementing Decap's `/auth` and `/callback` protocol.

The initially considered maintained candidate was [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth). Its reference deployment targets Cloudflare Workers, independently from the website host.

Source review of commit `33674be7ec77c1b771983650d979cae88160e093` found active maintenance, an MIT licence, server-side client-secret use, a 10-minute secure/Lax CSRF cookie, state comparison, narrowed `public_repo` support, and token delivery through the Decap popup protocol. It also found that `ALLOWED_DOMAINS` is optional, matching is hostname-only rather than exact origin matching, the initial non-token handshake uses wildcard `postMessage`, callback URI enforcement relies on the GitHub OAuth application registration, and that revision contains no automated test suite. Consequently it is **not approved for production as-is**. SafeRedact must use a reviewed hardening fork or another maintained broker that requires exact scheme/host/port origins and passes the acceptance tests in this specification.

The broker choice remains replaceable behind the same public endpoint contract. Do not build an ad hoc OAuth implementation inside the marketing application.

The marketing repository exposes only public broker coordinates through generated Decap configuration. The OAuth client secret and code-to-token exchange exist only in the broker's server-side secret store.

### 3. CMS configuration delivery

The current static `public/admin/config.yml` silently falls back to Decap's Netlify OAuth default because it has no `base_url`. Phase 5 must remove that implicit dependency.

The proposed implementation stores a non-public template in the repository and renders the public `config.yml` from non-secret build environment variables. If CMS authentication configuration is absent, rendering fails closed to a reserved non-routable origin and the studio remains non-operational; it must never fall back to `api.netlify.com`.

The renderer will:

1. validate origins with the platform URL parser;
2. require HTTPS outside explicitly enabled local development;
3. reject credentials, query strings, fragments, and unexpected paths;
4. serialize values safely rather than using string substitution;
5. emit no client secret, access token, private key, or server-only database value;
6. generate deterministic output for CI and deployment builds.

The generated configuration remains public by design. It may contain the site origin, broker origin, repository, publication branch, OAuth scope, and authentication endpoint path. None of those values is an authentication secret.

### 4. OAuth flow and trust boundaries

```text
staff browser at PUBLIC_SITE_ORIGIN/admin
  -> GET OAUTH_PUBLIC_BASE_URL/OAUTH_AUTH_ENDPOINT
  -> broker creates signed/single-use state and redirects to GitHub
  -> GitHub redirects only to OAUTH_CALLBACK_URL
  -> broker validates state, callback, allowed origin, and authorization code
  -> broker exchanges code using server-held client secret
  -> broker returns the user token only to the exact initiating admin origin
  -> Decap uses the user token with GitHub for the configured repository
  -> editorial workflow creates a review branch and pull request to master
```

Required controls:

- exact HTTPS callback URI; no wildcard callback in production;
- high-entropy, single-use, expiring state tied to the initiating origin;
- exact allowlist for production and explicitly approved preview origins;
- exact `postMessage` target origin and sender-origin validation;
- no tokens or authorization codes in logs, analytics, URLs after callback, or error text;
- named staff identities with repository access and organization MFA policy;
- `public_repo` only while the repository is public; re-review before any visibility change;
- revocation and offboarding procedure;
- separate OAuth applications or isolated credentials for production and non-production.

Authentication proves a GitHub identity; repository authorization and protected-branch review remain independent controls.

### 5. CI boundary

GitHub CI is provider-neutral and never deploys. A pull-request workflow will use read-only repository permissions, avoid `pull_request_target`, pin actions to immutable commits, install with `npm ci`, and run:

1. infrastructure/content contract tests;
2. TypeScript;
3. ESLint;
4. production build;
5. all Node/TypeScript regression tests;
6. production-server route tests;
7. `npm audit --omit=dev`;
8. deterministic tracked-file secret checks;
9. `git diff --check`.

The workflow receives no OAuth, hosting, deployment, or database secret and contains no deployment job. GitHub native secret scanning and push protection remain recommended repository settings requiring separate administrator approval.

### 6. Publishing boundary

- Decap publishes through workflow branches and pull requests targeting `master`.
- Draft, archived, invalid, and future-dated content remains excluded by the public loader.
- Required checks and human review apply equally to source and content pull requests.
- A host may rebuild after an approved merge to `master`; CI itself does not call deployment hooks.
- Netlify may continue to render temporary previews, but no application behavior depends on it.
- Deletion is recovered through a reviewed restore/revert commit.
- Published slug changes require an approved redirect entry and link verification before merge.

### 7. Comments boundary

Supabase PostgreSQL remains the recommended initial persistence provider, but application code will depend on a `CommentsRepository` interface rather than Supabase SDK types. The future public API, moderation service, and database adapter remain separate layers.

No visitor comment collection begins in Phase 5. Persistence, privacy notice, moderation operations, rate limiting, anti-abuse verification, retention, staff authorization, and incident procedures must be operational first.

## Environment contract

### Public/build-time values for the marketing application

| Variable | Purpose | Secret |
| --- | --- | --- |
| `PUBLIC_SITE_ORIGIN` | Canonical deployed site origin used by CMS metadata | No |
| `CMS_OAUTH_PUBLIC_BASE_URL` | Dedicated OAuth broker origin exposed in Decap config | No |
| `CMS_OAUTH_AUTH_ENDPOINT` | Relative broker login endpoint; default `auth` | No |
| `CMS_GITHUB_REPOSITORY` | `owner/repository` allowlisted for generated config | No |
| `CMS_PUBLISH_BRANCH` | Protected publication branch; expected `master` | No |
| `CMS_AUTH_SCOPE` | Reviewed GitHub scope; expected `public_repo` for a public repository | No |
| `CMS_ENABLED` | Explicitly enables deployable CMS authentication configuration | No |

Names are intentionally provider-neutral. Public values must not use a `NETLIFY_*` namespace.

### Server-only values for the independently deployed OAuth broker

| Variable | Purpose | Secret |
| --- | --- | --- |
| `GITHUB_OAUTH_CLIENT_ID` | GitHub OAuth application identifier | No, but server-managed |
| `GITHUB_OAUTH_CLIENT_SECRET` | Code-exchange credential | Yes |
| `OAUTH_CALLBACK_URL` | Exact registered HTTPS callback | No, but server-managed |
| `OAUTH_ALLOWED_ORIGINS` | Exact production/admin and separately approved preview origins | No, but security-sensitive configuration |
| `OAUTH_STATE_SECRET` | Signs or encrypts state/session material if the selected broker requires it | Yes |
| `OAUTH_GITHUB_SCOPE` | Approved minimum scope | No |
| `OAUTH_LOG_LEVEL` | Production logging policy excluding tokens and personal data | No |

The selected broker may use different native names. Deployment documentation must map these semantic requirements to the exact reviewed version without weakening them.

### Future comments service values

| Variable | Purpose | Secret |
| --- | --- | --- |
| `COMMENTS_DATABASE_URL` or provider URL | Server-side database connection | Usually yes |
| `COMMENTS_DATABASE_SECRET` | Privileged service credential | Yes |
| `COMMENTS_ABUSE_HMAC_SECRET` | Derives non-reversible abuse/rate-limit keys | Yes |
| `COMMENTS_TURNSTILE_SECRET` | Server-side anti-bot verification | Yes |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public widget identifier | No |

Comments variables are documented only and will not be consumed in Phase 5.

## Portability acceptance criteria

The design is portable when all of the following are true:

- a build succeeds without Netlify environment variables or APIs;
- no rendered HTML, CMS YAML, source, or CI workflow references a Netlify auth endpoint;
- changing compatible website hosts requires environment and DNS changes, not application code changes;
- changing OAuth broker implementations behind the same Decap contract requires configuration and security review, not blog rewrites;
- CMS secrets exist only at the broker;
- comments persistence can be replaced by another repository adapter;
- preview deployment failures do not block local builds or create a production dependency.

## Explicit non-goals

- No production deployment or deployment workflow.
- No OAuth application, secret, external account, or live callback.
- No custom OAuth implementation in Next.js.
- No public comments API or unsecured moderation page.
- No homepage redesign.
- No repository-settings or branch-protection mutation.

## Approval gate

Application/configuration implementation begins only after this specification and the companion implementation plan are approved. Live CMS authentication remains **BLOCKED** until external broker deployment and end-to-end non-production testing are separately authorized and completed.
