# OpenRedakt CMS OAuth broker

This is an isolated, independently deployable Node.js 22 HTTPS service for the Decap CMS GitHub authorization-code flow. It is not imported by the Next.js application and has no runtime dependencies.

The broker accepts exact HTTPS CMS origins, requires an exact HTTPS callback equal to `OAUTH_PUBLIC_ORIGIN/callback`, uses PKCE S256 and signed single-use state, requests exactly `public_repo`, verifies immutable staff IDs plus repository push access, and posts the Decap result only to the transaction-bound opener origin. Client secrets, state keys, codes, and token exchange remain server-side; refresh tokens are neither stored nor returned.

Copy `.env.example` to the ignored `.env.local` for development. Configure the GitHub OAuth App Homepage URL as the exact CMS origin and its sole Authorization callback URL as the exact `OAUTH_CALLBACK_URL`. Wildcard callback matching must remain disabled and expiring access tokens must remain enabled.

```text
npm --prefix services/cms-oauth-broker ci
npm --prefix services/cms-oauth-broker run check
npm --prefix services/cms-oauth-broker test
npm run oauth:dev
```

`npm run oauth:dev` is run from the repository root and loads this service's ignored `.env.local`. Production must inject the same variables through a secret store and use `npm --prefix services/cms-oauth-broker start`.

The in-memory transaction store is limited to one continuously running process. Multiple replicas, ephemeral serverless execution, or restarts during login require an atomic shared consume-once TTL store and a new security acceptance run. Edge request-volume controls and query-string/cookie log redaction are also required before internet exposure.

See `SECURITY.md` for the deployment boundary, `.env.example` for every variable, `UPSTREAM.md` for provenance, and the root `README.md` for end-to-end setup and editorial acceptance constraints.
