# Decap portable authentication and optional Netlify preview plan

Date: 2026-10-14  
Status: design only; no OAuth service or credentials exist

The filename is retained from the original Phase 5 deliverable. Netlify is not the selected production authentication or hosting architecture.

## Selected architecture

Keep Decap's GitHub backend and editorial workflow. Use a dedicated, independently deployed, Decap-compatible GitHub OAuth broker. The broker is separate from the Next.js website and remains stable if the website moves to another compatible host.

The initial candidate reviewed was `sveltia-cms-auth` at commit `33674be7ec77c1b771983650d979cae88160e093` (latest inspected commit dated 2026-10-11). It is MIT-licensed, actively maintained at the time of review, compatible with Decap's GitHub flow, and independently deployed.

The inspected revision keeps client secrets in the worker environment, requests an allowed `public_repo` scope when supplied, creates a random state value, stores it in a 10-minute `Secure`, `HttpOnly`, `SameSite=Lax` cookie, and compares callback state before token exchange. However:

- `ALLOWED_DOMAINS` is optional, so an omitted value removes the token-origin restriction;
- allowed values are matched by hostname only, not by exact scheme, hostname, and port;
- its initial non-token popup handshake uses wildcard `postMessage`;
- GitHub callback exactness depends on correct external OAuth application registration;
- the inspected revision has lint/audit tooling but no automated behavioral test suite.

Because SafeRedact requires exact-origin validation and fail-closed configuration, this revision is **not recommended for production unchanged**. Production selection requires either a reviewed hardening fork that makes the allowlist mandatory and exact-origin based, or another maintained Decap-compatible broker that passes the same contract tests.

A maintained containerized broker from Decap's external OAuth-client catalogue may implement the same `/auth` and `/callback` contract after equivalent review. The marketing application configuration changes only through `CMS_OAUTH_PUBLIC_BASE_URL`; blog code and hosting remain unchanged.

## Public versus secret configuration

Public CMS configuration may reveal:

- broker origin;
- login endpoint path;
- public site origin;
- GitHub repository and publication branch;
- requested GitHub scope.

It must never contain:

- GitHub OAuth client secret;
- access or refresh token;
- state-signing secret;
- database service credential;
- deployment provider token;
- webhook secret.

The public config is generated from validated deployment environment values so preview, staging, and production can use isolated origins without source edits.

## OAuth transaction

1. Decap opens `{CMS_OAUTH_PUBLIC_BASE_URL}/{CMS_OAUTH_AUTH_ENDPOINT}`.
2. The broker records a single-use, expiring state value bound to the exact initiating admin origin.
3. The broker redirects to GitHub with the approved client ID, scope, state, and exact callback URI.
4. GitHub redirects only to `OAUTH_CALLBACK_URL` with a short-lived authorization code and state.
5. The broker rejects missing, expired, replayed, or mismatched state before exchanging the code.
6. The broker exchanges the code server-to-server using `GITHUB_OAUTH_CLIENT_SECRET`.
7. The broker returns the result only to the exact approved opener origin using the Decap protocol.
8. Decap uses the staff user's token to create workflow branches and pull requests.

GitHub authorization does not grant editorial approval. The user must also be an approved staff identity with the minimum repository permission, and `master` must require CI and review.

## Redirect URI and origin policy

- Production uses one exact HTTPS callback URL owned by SafeRedact operations.
- Wildcard callbacks are prohibited.
- Production and non-production use separate OAuth apps or credentials.
- Preview origins are enumerated or admitted through a separately reviewed narrow rule; broad `*.netlify.app` trust is prohibited.
- The broker must validate both the initiating origin and final `postMessage` target.
- A website-host move changes public-site and broker allowlist environment values, not application source.

## Netlify preview role

Netlify may build temporary stakeholder previews. It does not:

- exchange OAuth codes;
- store production OAuth credentials;
- determine the production origin;
- provide required Identity or Git Gateway services;
- receive application deployment hooks from GitHub CI;
- become a requirement for CMS or blog operation.

CMS login should remain disabled on generic previews unless a dedicated non-production OAuth app and a narrow preview-origin policy are explicitly approved. Content review can still use GitHub pull requests and preview URLs without granting CMS login on every preview.

## Service acceptance checklist

- specific source revision and dependency audit recorded;
- licence and maintainer activity accepted;
- state generation, expiry, replay defense, and cookie properties reviewed;
- exact callback and allowed-origin enforcement tested;
- least GitHub scope confirmed;
- secrets stored only in the broker's managed secret facility;
- tokens/codes absent from application logs and analytics;
- denied staff identity tested;
- credential rotation and staff offboarding tested;
- broker outage fails closed;
- Decap creates a pull request rather than directly publishing;
- revocation and rollback exercise completed.

Until this checklist passes, CMS authentication and staff publishing remain **BLOCKED**.
