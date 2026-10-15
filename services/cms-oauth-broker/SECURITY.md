# Security boundary

The broker is a confidential OAuth client. Its client secret, state-signing key, authorization codes, PKCE verifiers, cookies, access tokens, and refresh tokens must never enter source control, public CMS configuration, URLs after callback handling, analytics, or logs.

The service emits only an event name, outcome, and random correlation identifier. Platform access logs must be configured to redact query strings and cookies because the callback request necessarily carries a short-lived authorization code and state in its query.

Current deployment constraints:

- HTTPS is mandatory for the broker and every allowed CMS origin.
- GitHub callback wildcard matching must be disabled.
- GitHub OAuth expiring access tokens must be enabled; non-expiring token responses are rejected.
- The current transaction store is in-memory, single-process, expiry-pruned, and capacity-bounded. Do not use multiple replicas or an ephemeral serverless runtime until a shared atomic consume-once TTL adapter is implemented and tested.
- Rate limiting and request-volume controls remain deployment-edge responsibilities and are required before internet exposure.
- The `public_repo` OAuth scope can reach public repositories available to the editor. The broker checks the configured repository and staff identity, but GitHub OAuth scopes are not repository-specific.
- The returned token is held by Decap in the editor browser. A compromise of the approved admin origin can therefore compromise that token.

Report suspected credential exposure by revoking the OAuth grant, rotating both broker secrets, invalidating active sessions, preserving sanitized evidence, and following SafeRedact's incident process.

