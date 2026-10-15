# Decap authentication deployment plan

Date: 2026-10-14
Status: **design only — authentication is not deployed**

> Phase 5 update: `PHASE5_DESIGN_SPEC.md` and `DECAP_NETLIFY_AUTH_PLAN.md` supersede provider-specific assumptions in this earlier plan. The OAuth broker origin, public site origin, callback, and allowed origins are deployment environment values. Netlify is preview-only and is not the selected authentication architecture.

## Current readiness

The public site contains a static Decap shell at `/admin/index.html` and a GitHub backend definition for `Safe-Redact/Marketing-Site`. The content schema and editorial workflow exist, but the shell has no authentication service, OAuth application, client secret, allowed-origin policy, or tested staff identity. It is not a working publishing portal.

The repository is public and its default branch is `master`. For a public repository, the narrow GitHub OAuth scope is `public_repo`; do not request the broader `repo` scope unless repository visibility changes and the need is re-approved. Decap's GitHub backend requires each editor to have repository push access. See [Decap's GitHub backend documentation](https://decapcms.org/docs/github-backend/) and [backend/OAuth proxy flow](https://decapcms.org/docs/backends-overview/).

## Recommended authentication shape

Use one reviewed, HTTPS-only OAuth broker on a dedicated origin, for example `https://auth.saferedact.io`, after the hosting provider is selected. The broker must hold the GitHub OAuth client secret server-side, implement `/auth` and `/callback`, verify state, and allow only the production admin origin.

Proposed future Decap settings (not applied in this phase):

```yaml
backend:
  name: github
  repo: Safe-Redact/Marketing-Site
  branch: master
  use_graphql: true
  base_url: https://auth.saferedact.io
  auth_endpoint: auth
  auth_scope: public_repo
  site_domain: saferedact.io
```

The exact broker domain is a placeholder for architecture review, not a deployed destination. Do not add it to production configuration until DNS, TLS, callback behavior, and ownership are verified.

## GitHub application setup

An authorized organization owner must create a GitHub OAuth App or approve a narrowly installed GitHub App-based service. GitHub recommends considering a GitHub App because it supports finer repository permissions and short-lived credentials; Decap compatibility must be verified before changing backend choice. GitHub's web flow requirements are documented in [Authorizing OAuth apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps).

For a conventional Decap OAuth broker:

- Application name: organization-approved SafeRedact Content Studio name.
- Homepage URL: `https://saferedact.io/admin/`.
- Authorization callback URL: `https://<approved-auth-host>/callback`.
- Repository scope: `public_repo` while the repository remains public.
- Access: only named SafeRedact staff accounts that also have the required repository permission.
- OAuth client secret: broker/runtime secret store only; never Git, `NEXT_PUBLIC_*`, Decap config, logs, preview output, or client-side JavaScript.

## Server-side configuration contract

Exact environment-variable names depend on the selected broker implementation. The deployment must provide equivalent server-only values for:

- GitHub OAuth client ID;
- GitHub OAuth client secret;
- exact callback URL;
- allowed admin origin `https://saferedact.io`;
- repository allowlist `Safe-Redact/Marketing-Site`;
- requested scope `public_repo`;
- cryptographically strong OAuth state/session secret if required by the broker;
- production log level that excludes tokens, codes, request bodies, and personal data.

The client ID is not a secret, but it still belongs in reviewed configuration. The client secret and token exchange must remain on the broker. Decap may hold the resulting user token in its browser session to call GitHub; therefore the admin origin, third-party scripts, CSP, token lifetime, logout, and staff-device security are part of the trust boundary.

## Origin, callback, and HTTPS rules

- Serve both the marketing site and OAuth broker over valid HTTPS; no production HTTP callback.
- Match the registered callback exactly; reject alternate schemes, hosts, ports, and paths.
- Generate and verify a single-use, high-entropy OAuth `state` value to prevent login CSRF.
- Broker responses may post authentication results only to the exact `https://saferedact.io` origin.
- Do not use `*` CORS or `postMessage` target origins.
- Reject callbacks without valid state, expired state, authorization code, expected repository, or authorized staff identity.
- Return generic browser errors; keep secret/token detail out of URLs and logs.

## Staff authorization and lifecycle

Authentication by GitHub is not sufficient. Before activation:

1. Create an approved GitHub team or named access list for SafeRedact editors.
2. Give only the minimum repository role Decap actually requires.
3. Require organization MFA and apply the organization identity/offboarding policy.
4. Remove repository access immediately when a staff member leaves or changes role.
5. Review active OAuth grants and organization applications on a fixed cadence.
6. Rotate the OAuth secret after suspected exposure, staff/provider transition, or according to the selected platform policy.

## Failure behavior

- OAuth unavailable: show a clear login/service-unavailable message; do not fall back to anonymous or shared credentials.
- User lacks repository authorization: deny access without disclosing repository internals.
- Callback/state validation fails: discard the code/token and require a fresh login.
- GitHub API unavailable or rate-limited: preserve the editor's draft locally only if Decap supports it safely; do not claim publication.
- CI or deployment fails after merge: the Git commit remains the source of truth; alert maintainers and do not show the article as deployed until the public route confirms it.

## Required acceptance sequence

1. Select and security-review the broker/provider; record owner, cost, data processing, uptime, and secret-storage model.
2. Configure a non-production OAuth app and exact HTTPS callback.
3. Add `base_url`, `auth_endpoint`, `auth_scope`, and `site_domain` only after the endpoint exists.
4. Verify allowed and denied staff accounts.
5. Verify login state/CSRF handling, logout, token revocation, origin restrictions, and error paths.
6. Verify Decap creates a workflow branch/PR instead of publishing directly to `master`.
7. Verify required branch checks and reviewer approval block unsafe changes.
8. Publish one approved factual test article, merge it, observe a successful deploy, and verify only the published article enters sitemap/metadata.
9. Run authorized browser accessibility, keyboard, responsive, CSP, console, and token-leak checks.

Until every step passes, staff publishing status is **BLOCKED**.
