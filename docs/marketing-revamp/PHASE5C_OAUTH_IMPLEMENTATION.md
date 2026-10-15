# Phase 5C OAuth implementation

Date: 2026-10-15  
Status: **development implementation complete; live authentication blocked**

## Outcome

SafeRedact now has an isolated GitHub OAuth broker under `services/cms-oauth-broker/`. It is a dependency-free Node.js 22 service and is not imported, bundled, routed, or deployed by the public Next.js marketing application. Hosting remains provider-neutral.

The reviewed `sveltia-cms-auth` revision was used as protocol and security evidence only. It was not deployed or copied unchanged. The resulting service is deliberately narrow rather than a reusable authentication framework.

## Implemented flow

```text
Exact HTTPS Decap origin
  -> GET broker /auth with github, exact site_id, public_repo
  -> single-use server transaction + signed __Host- cookie
  -> GitHub authorization with exact redirect_uri, state, PKCE S256
  -> exact broker /callback
  -> server-side code exchange with client secret and verifier
  -> GitHub /user identity check
  -> exact repository push-permission check
  -> Decap popup protocol to the transaction-bound origin
```

No refresh token or long-lived session is retained. The broker rejects token responses without a positive expiry of at most 24 hours. After token expiry or revocation, the editor must authenticate again.

## Security controls implemented

| Control | Implementation |
| --- | --- |
| Exact origin allowlist | Canonical, credential-free HTTPS origins including port; no paths, globs, duplicates, or HTTP |
| Exact callback | Must equal the configured broker origin plus `/callback`; sent on authorization and exchange |
| State | 256-bit random opaque value, HMAC-bound cookie, server-side record, ten-minute maximum, consumed once; expired records are pruned and pending records are capacity-bounded |
| PKCE | 512-bit verifier and SHA-256 challenge using `S256` |
| Scope | Exactly `public_repo`; broader or absent scope is rejected |
| Staff authorization | Immutable numeric GitHub user-ID allowlist plus current `permissions.push` on the exact repository |
| Secrets | Client secret and state key load only from the broker process environment |
| Provider responses | Status, JSON media type, size, schema, scope, token type, and expiry validated; bounded timeout |
| Popup delivery | Exact transaction-bound `targetOrigin`; inbound handshake checks exact origin and `window.opener` source; no wildcard |
| Browser response | No-store, nonce CSP, no-referrer, no-sniff, frame denial, restricted permissions |
| Logging | Only event, outcome, and random correlation ID; generic public failures |
| Transport | Built-in HTTPS server requires explicit certificate and private-key file paths |
| Fail closed | Missing or malformed configuration prevents startup or denies the request |

## Decap integration

The existing renderer still generates public Decap configuration from deployment environment values and remains disabled by default with reserved `.invalid` origins. `site_domain` now includes the configured port, so the broker can map Decap's `site_id` to one exact scheme/host/port allowlist entry during HTTPS development.

The generated file contains only public coordinates: repository, branch, site origin, broker origin, auth path, and scope. OAuth credentials, staff IDs, state keys, and TLS keys are not rendered.

The GitHub backend, `editorial_workflow`, Markdown article storage, content validation, and draft/public eligibility behavior are unchanged.

## Service boundaries and limitations

- The in-memory transaction store is safe only for one continuously running process. It prunes expired entries and fails closed at `OAUTH_MAX_PENDING_TRANSACTIONS` (default 1024), but multiple replicas, serverless instance switching, or restarts during a transaction will deny the callback. A production deployment needs a shared store with atomic consume-once, TTL, and global capacity semantics.
- Rate limiting and volumetric abuse controls are not implemented in application code. An approved edge/runtime control is required before internet exposure.
- `public_repo` is GitHub's least OAuth scope that lets Decap write this public repository, but it is not repository-specific. The broker verifies the target repository before releasing the token; the browser token still carries GitHub-defined scope.
- Decap receives the user token by design. The approved admin origin therefore requires strong CSP, restricted staff access, dependency review, and no third-party analytics.
- The service requires GitHub OAuth expiring tokens. The OAuth application setting is external and has not been configured or tested.
- Repository branch protection was previously reported absent. OAuth authentication does not provide editorial approval; protected `master`, required CI, and independent review remain mandatory.
- No real OAuth credential, DNS name, certificate, account, service, or deployment was created. No live login claim is made.

## Files added or changed for Phase 5C

- Broker source, tests, lockfile, and security/provenance notes under `services/cms-oauth-broker/`.
- Root test orchestration and provider-neutral CI now install, test, and production-audit the isolated service.
- The CMS renderer preserves ports in `site_domain` and continues to exclude secret values.
- Phase 5 infrastructure contracts now cover broker isolation, CI inclusion, forbidden host-specific URLs, wildcard messaging, and credential patterns.
- The four Phase 5C implementation and acceptance documents are under `docs/marketing-revamp/`.

## Deferred production work

Live use requires separate authorization to create the GitHub OAuth application, configure exact non-production origins, issue and store secrets, provision trusted HTTPS, select a shared transaction store for more than one process, add edge rate limiting and monitoring, protect `master`, deploy the broker, and execute every editorial acceptance scenario.

