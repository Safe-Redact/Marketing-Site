# Phase 5B authentication security specification

Date: 2026-10-15  
Status: **design accepted for non-production implementation; live authentication blocked**  
Repository revision reviewed: `012d3dd11166bc7e354ba8ced2f612970b5e01a6` plus the uncommitted Phase 5 working tree  
Broker revision reviewed: `sveltia/sveltia-cms-auth@33674be7ec77c1b771983650d979cae88160e093`

## Decision

SafeRedact must not deploy the reviewed upstream broker unchanged. The pinned revision is small, actively maintained at the time of this review, MIT-licensed, and compatible with Decap's popup protocol, but it does not satisfy the required exact-origin, callback, least-scope, response-hardening, and test guarantees.

The recommended path is a narrowly maintained SafeRedact hardening fork of the pinned upstream revision. The fork remains an independently deployable authentication service and does not become part of the marketing application. It may be approved for non-production only after the patches and contract tests in this specification pass. We should periodically compare the fork with upstream and retire it in favor of an upstream or other maintained broker if that implementation later satisfies the same contract without local patches.

This recommendation is conditional. A maintained broker that already provides exact origins, explicit callbacks, PKCE, fail-closed configuration, narrow scope, safe popup delivery, and test evidence is preferable to maintaining a fork. No candidate has yet been verified to meet all those properties.

## Evidence basis

### Observed repository behavior

- `config/decap-cms.yml` uses the GitHub backend and `publish_mode: editorial_workflow`.
- `scripts/render-cms-config.mjs` serializes only reviewed public deployment coordinates.
- Missing CMS deployment configuration generates reserved `https://*.invalid` values and prevents Decap's implicit Netlify fallback.
- The renderer rejects non-HTTPS origins, URL credentials, path/query/fragment additions, unsafe repository and branch values, and scopes other than `public_repo`.
- The article loader exposes only `status: published` articles whose publication date is current or past.
- GitHub's public repository API reported `Safe-Redact/Marketing-Site` as public, with default branch `master`, head `012d3dd11166bc7e354ba8ced2f612970b5e01a6`, and `protected: false` on 2026-10-15.

### Observed broker behavior

The broker review was refreshed against upstream on 2026-10-15; `origin/main` still resolved to the pinned commit.

Positive properties in the pinned source:

- the client secret is consumed only by the server-side worker;
- OAuth state is generated with `crypto.randomUUID()`;
- state is stored in a 10-minute `Secure`, `HttpOnly`, `SameSite=Lax` cookie and compared at callback;
- the state cookie is deleted after the callback response;
- the authorization code is exchanged server-to-server;
- `public_repo` can be requested;
- token-bearing popup responses use the received message origin as `postMessage` target rather than `*`.

Gaps established by source inspection:

| Required property | Pinned behavior | Decision |
| --- | --- | --- |
| Exact allowed origins | `ALLOWED_DOMAINS` is optional and matches hostname patterns only | Must patch; scheme, hostname, and port must match an explicit exact allowlist |
| Exact callback | GitHub flow omits explicit `redirect_uri`; correctness depends on OAuth-app registration | Must patch and test explicit configured callback on authorization and exchange |
| Protected state | Random state cookie is compared, but it is not bound to exact origin, callback, or PKCE verifier | Must bind those values in a protected, single-use transaction |
| Narrow GitHub scope | Invalid or absent scope falls back to broader `repo,user` | Must reject; SafeRedact permits exactly `public_repo` while the repository is public |
| PKCE | Not implemented | Add S256 PKCE as defense in depth for authorization-code interception |
| Restricted messaging | Token response is not sent with wildcard target, but initial handshake uses `*`; trust is hostname-only | Remove wildcard delivery and bind all messages to the exact initiating origin |
| Staff authorization | Any GitHub user can complete OAuth; repository permissions fail later in Decap | Add explicit staff/repository authorization before releasing a token |
| Token response hardening | No explicit `Cache-Control: no-store`, CSP, referrer, or MIME-sniffing headers | Add security headers and test them |
| Token lifetime | Broker does not manage a session or refresh; GitHub token behavior is external | Require expiring-token policy and tested reauthentication behavior |
| Behavioral tests | No automated test suite in the pinned revision | Add contract, integration, and negative-path tests before deployment |

The upstream source logs only an unsupported scope warning and does not log codes or tokens in the inspected path. The hardened service must nevertheless enforce a structured redaction policy because platform request logging and future error handling can create new exposure.

## Trust boundaries

```text
Named staff browser on exact approved /admin origin
  -> dedicated HTTPS OAuth broker /auth
  -> GitHub OAuth authorization endpoint
  -> exact broker /callback
  -> GitHub token endpoint using server-held secret and PKCE verifier
  -> GitHub identity and repository-permission verification
  -> exact approved opener origin through postMessage
  -> Decap creates a cms/* branch and pull request
  -> protected master requires CI and independent approval
  -> hosting provider builds the reviewed merge
```

The broker authenticates a GitHub identity and returns a scoped user token. It does not approve content, override GitHub authorization, merge pull requests, deploy the website, or determine whether an article is publicly eligible.

## Required invariants

1. Every accepted browser origin equals one configured HTTPS origin after URL canonicalization, including scheme, hostname, and effective port.
2. Every OAuth callback equals the configured HTTPS callback URL and the OAuth application has wildcard callback matching disabled.
3. Every authorization attempt has an unpredictable, single-use transaction that expires within ten minutes and is bound to the initiating origin, provider, callback, and PKCE verifier.
4. The authorization request and token exchange both send the same explicit callback URI.
5. GitHub authorization uses S256 PKCE and the code verifier never enters browser-visible configuration or logs.
6. Missing or malformed configuration denies authentication before any redirect or token exchange.
7. The requested scope is exactly `public_repo` while the repository remains public. Unknown or broader scopes are rejected, not replaced with a broader fallback.
8. The GitHub API host is fixed to `github.com` unless a separately reviewed GitHub Enterprise configuration is enabled.
9. A token is released only for an approved named staff identity that retains write access to `Safe-Redact/Marketing-Site`.
10. Every popup message is sent only to the exact origin bound to the transaction. No token, code, or success payload uses wildcard delivery.
11. Authorization codes, access tokens, refresh tokens, client secrets, state values, PKCE verifiers, cookies, and request bodies are absent from logs, analytics, error pages, and URLs after callback processing.
12. Callback responses are non-cacheable and use a restrictive CSP, `Referrer-Policy: no-referrer`, and `X-Content-Type-Options: nosniff`.
13. The broker stores no long-lived GitHub user token. Decap must require reauthentication after GitHub token expiry or revocation.
14. Revoked, offboarded, unauthorized, or expired users fail closed without receiving repository data or a reusable token.
15. OAuth success cannot bypass protected-branch review, required CI, or the public article eligibility rules.

## Required broker changes

### Configuration

The hardened broker must require server-side values equivalent to:

| Semantic value | Requirement |
| --- | --- |
| `GITHUB_OAUTH_CLIENT_ID` | Present; server-managed; never accepted from a request |
| `GITHUB_OAUTH_CLIENT_SECRET` | Present in secret storage; never serialized or logged |
| `OAUTH_PUBLIC_ORIGIN` | One exact HTTPS broker origin |
| `OAUTH_CALLBACK_URL` | Exactly `${OAUTH_PUBLIC_ORIGIN}/callback` unless a reviewed path is configured |
| `OAUTH_ALLOWED_ORIGINS` | Non-empty list of exact HTTPS admin origins; no globs or naked hostnames |
| `OAUTH_ALLOWED_REPOSITORY` | Exactly `Safe-Redact/Marketing-Site` |
| `OAUTH_ALLOWED_STAFF` | Named immutable GitHub user IDs or a separately reviewed authorization source |
| `OAUTH_STATE_SECRET` | At least 256 bits from the deployment secret store when transaction state is signed/encrypted |
| `OAUTH_GITHUB_SCOPE` | Exactly `public_repo` |

Startup or request initialization must fail closed when any required value is absent, ambiguous, duplicated, or unsafe.

### Transaction and callback

- Use `__Host-` cookies with `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, no `Domain`, and a maximum age no greater than ten minutes.
- Protect transaction contents with authenticated encryption or a server-side single-use record keyed by a random opaque state value.
- Include the exact initiating origin, provider, callback, issued time, expiry, nonce, and PKCE verifier in the protected transaction.
- Reject missing, expired, replayed, malformed, or mismatched transactions before contacting the token endpoint.
- Send `redirect_uri` explicitly on both GitHub authorization and token exchange.
- Use PKCE S256 and delete transaction state on every terminal success or failure.

### GitHub authorization

- Reject device flow and implicit flow.
- Reject requested scopes other than `public_repo`.
- After exchange, call GitHub with the resulting token to resolve the immutable user identity and repository permission.
- Release the token only if the identity is approved and current repository permission includes the write capability Decap requires.
- Do not request `read:org` merely to simplify authorization. If team-based authorization later requires it, treat the broader scope as a new security decision.

### Browser response

- The opener-origin handshake, success, and error messages must use the exact transaction-bound origin.
- Validate `event.source === window.opener`, the exact message shape, and exact origin before returning any result.
- Do not send token-bearing data through query strings, fragments, local storage, or analytics.
- Return `Cache-Control: no-store, max-age=0`, `Pragma: no-cache`, a restrictive CSP, `Referrer-Policy: no-referrer`, and `X-Content-Type-Options: nosniff`.
- Error output must use stable codes and generic messages without echoing attacker-controlled values.

## Staff and repository authorization

SafeRedact should use named GitHub identities, organization MFA policy, and the minimum repository role Decap requires. Shared CMS or GitHub accounts are prohibited. Offboarding must remove repository access, remove the identity from the broker allowlist, and revoke the OAuth grant when appropriate.

The repository is currently public. Editorial branches and pull requests in a public repository are publicly readable, even when the production loader hides drafts. Editors must never place secrets, embargoed announcements, personal data, or confidential draft material in Decap. If confidential editorial work becomes a requirement, the repository/workflow architecture must be reconsidered before use.

## Branch and publication control

GitHub reported `master` as unprotected during this review. This is a release blocker. Before live CMS use, an authorized administrator must require pull requests, independent approval, current required checks, conversation resolution, blocked force pushes/deletion, and no routine bypass for `master`.

The required checks are:

- `quality / verify`
- `security / production-audit`
- `security / tracked-secret-policy`

Decap's editorial workflow is a convenience layer, not the enforcement boundary. The protected branch is the authoritative control that prevents an editor from directly pushing or self-merging unreviewed content.

## Maintenance implications

A SafeRedact fork creates an ongoing security product, even though the code is small. Its owner must:

- record the exact upstream and fork commit deployed;
- monitor upstream security and compatibility changes;
- review and merge upstream updates instead of automatically tracking `main`;
- keep dependencies locked and audited;
- maintain behavioral tests for every invariant above;
- rotate secrets and revoke tokens after suspected exposure;
- retain non-sensitive authentication metrics and alerts;
- rehearse rollback to the last accepted broker image;
- review GitHub and Decap protocol changes at least quarterly and before upgrades.

If SafeRedact cannot assign this ownership, the fork should not be deployed. A reviewed managed broker with equivalent controls becomes the preferred option.

## External references

- [GitHub OAuth web flow and redirect rules](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub OAuth application security guidance](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/best-practices-for-creating-an-oauth-app)
- [Decap GitHub backend](https://decapcms.org/docs/github-backend/)
- [Decap editorial workflow](https://decapcms.org/docs/editorial-workflows/)
- [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)

## Acceptance status

The marketing repository is ready to consume a compliant broker through public environment configuration. The upstream broker and the complete publishing workflow are **not accepted for live use** until the hardened implementation, branch protection, non-production deployment, and acceptance suite are separately authorized and completed.
