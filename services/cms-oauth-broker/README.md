# SafeRedact CMS OAuth broker

This directory is an isolated, independently deployable Node.js 22 service for the Decap CMS GitHub authorization-code flow. It is not imported by the Next.js application and has no runtime dependencies.

The broker:

- accepts only configured exact HTTPS CMS origins;
- uses single-use, ten-minute server-side transactions, expiry pruning, a bounded pending-transaction store, and a signed `__Host-` cookie;
- uses GitHub PKCE S256 and an exact callback URI;
- requests exactly `public_repo`;
- requires an expiring GitHub access token;
- verifies an immutable GitHub user ID and current write access to the configured repository;
- returns the Decap protocol message only to the transaction-bound opener origin;
- never stores refresh tokens or long-lived access tokens.

Run the deterministic suite with:

```text
npm --prefix services/cms-oauth-broker test
```

See `docs/marketing-revamp/OAUTH_LOCAL_SETUP.md` before starting the service. The included in-memory transaction store is approved only for controlled single-process development. A live multi-instance deployment requires an atomic shared TTL store and a separate security acceptance run.

