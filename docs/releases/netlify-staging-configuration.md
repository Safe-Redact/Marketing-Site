# Netlify staging configuration guide

Date: 2026-10-30 · Companion to `staging-readiness-2026-10-30.md`

The repository is **provider-neutral**: no `netlify.toml`, no Netlify packages, and tests that forbid Netlify references in workflows and source. Everything below is set in the **Netlify dashboard**. Nothing here changes production behaviour. Every staging protection is opt-in, through values set only for the `staging` branch context.

## 1. Integration switches (names only; never copy values between contexts)

| Integration | Variables | Off when | Staging value |
|---|---|---|---|
| Demo enquiry and contact delivery (`/api/contact`, used by `/book-a-demo`, `/contact`, `/pricing`) | `LEAD_DELIVERY_ENDPOINT`, `LEAD_DELIVERY_TOKEN`, `LEAD_DELIVERY_FROM`, `LEAD_DELIVERY_TO`, `LEAD_DELIVERY_TIMEOUT_MS` | All four main variables unset (a partial set fails loudly) | **Unset**, or all four pointing at a staging-only inbox |
| Blog comments and moderation | `COMMENTS_DATABASE_URL`, `COMMENTS_DATABASE_SSL`, `COMMENTS_ABUSE_SECRET`, `COMMENTS_STAFF_GITHUB_USER_IDS` | URL and secret both unset | **Unset**, or a separate staging database. Never the production database. |
| Support chat (Chatwoot) | `OPENREDAKT_CHATWOOT_ENABLED`, `OPENREDAKT_CHATWOOT_BASE_URL`, `OPENREDAKT_CHATWOOT_WEBSITE_TOKEN` | `OPENREDAKT_CHATWOOT_ENABLED` is not `true` | `OPENREDAKT_CHATWOOT_ENABLED=false` |
| CMS (Decap at `/admin`) | `CMS_ENABLED`, `CMS_PUBLISH_BRANCH`, `CMS_GITHUB_REPOSITORY`, `CMS_OAUTH_PUBLIC_BASE_URL`, `CMS_OAUTH_AUTH_ENDPOINT`, `CMS_AUTH_SCOPE`, `PUBLIC_SITE_ORIGIN` | `CMS_ENABLED=false` (`/admin` then redirects) | `CMS_ENABLED=false`. If ever enabled on staging, `CMS_PUBLISH_BRANCH` must not be `master`. |
| Search indexing | `SITE_NOINDEX` (new, opt-in) | Unset | `SITE_NOINDEX=true` |
| Documentation link | `NEXT_PUBLIC_DOCUMENTATION_URL` | Unset | Unset |
| Release metadata (`/api/health`) | `RELEASE_COMMIT_SHA`, `RELEASE_BUILD_ID` | — | Optional |
| Build runtime | `NODE_VERSION` | — | `22` (matches CI) |
| Analytics | None in the application code | — | Nothing to set. Netlify's own server-side analytics, if enabled, sends nothing to third parties. |
| CMS OAuth broker | `GITHUB_OAUTH_*`, `OAUTH_*` (in `services/cms-oauth-broker`) | Separate service, not part of the site build | Not deployed with the site |

### What a visitor sees on staging with delivery unset

The form still validates and runs spam protection. The API answers `202` with `delivered: false`, and the page says:

> "Enquiry validated" / "Your demo enquiry was validated, but delivery is not yet switched on, so nobody has received it. Please email support@saferedact.io directly."

That message is truthful and clear, so no code change is needed. Nothing is emailed, stored or forwarded.

## 2. Dashboard steps (Site configuration)

1. **Confirm the project.** The connected project is `saferedact-site` (from its deploy-preview comments on PRs #7 and #8). Confirm it is linked to `Safe-Redact/Marketing-Site`. `saferedact.io` itself is still served by LiteSpeed/PHP behind Cloudflare. **Deploy previews currently receive the production Chatwoot token**, so fix the variable scopes (step 3) before any branch deploy.
2. **Build and deploy → Continuous deployment → Branches and deploy contexts**
   - Production branch: confirm. The repository default is `master`; `main` is a stale branch.
   - Branch deploys: **"Let me add individual branches" → `staging`**. Avoid "All", which would deploy every pushed branch.
   - Deploy previews: your choice. If on, give them the same safe values as staging (step 3).
3. **Environment variables.** For every variable in the table:
   - Set its scope so production values apply to the **Production** context only, not "All deploy contexts". If a variable shows "Same value for all deploy contexts", split it.
   - Add **branch-specific values for `staging`**: `CMS_ENABLED=false`, `OPENREDAKT_CHATWOOT_ENABLED=false`, `SITE_NOINDEX=true`, `NODE_VERSION=22`.
   - Leave lead-delivery and comments variables with **no value** in the staging context.
4. **Build settings**
   - Build command: `npm run build` (runs `content:validate` first).
   - Base directory: empty.
   - Leave the publish directory to Netlify's Next.js runtime.
   - Node 22.
5. **Webhooks and notifications.** Check **Build hooks**, **Deploy notifications** (outgoing webhooks, email, Slack) and any **Functions/background** triggers. Make sure notifications meant for production are filtered to the Production context, so a staging deploy does not announce a release.
6. **Access protection**
   - Use **Site configuration → Access & security → Visitor access → Password protection** (Netlify Pro or higher), scoped to non-production deploys.
   - If unavailable on the plan, share the staging URL only internally and rely on `SITE_NOINDEX=true`.
   - A custom staging domain behind Cloudflare Access is an alternative.
7. **Domains.** Do not attach production domains to the staging branch. The review URL is `staging--<site-name>.netlify.app`.

## 3. Compatibility to confirm on the first `staging` deploy

The local production build passes, but Netlify behaviour must be observed, not assumed:

| Check | How |
|---|---|
| Next.js 15 App Router builds under Netlify's Next.js runtime with `output: "standalone"` set | The build log completes; all routes respond |
| Middleware CSP nonce works (edge middleware) | The `Content-Security-Policy` response header has a fresh `nonce-…` per request; pages hydrate (open the mobile menu, expand an FAQ item) |
| `next/image` serves `/images/product/*.png?v=…` | All six product images load; no 400s from the image endpoint |
| `force-dynamic` pages render per request | The blog lists the published article; `/book-a-demo?package=advanced` preselects Advanced |
| No-index active | `curl -sI https://staging--<site>.netlify.app/` shows `X-Robots-Tag: noindex, nofollow`; `/robots.txt` shows `Disallow: /` |
| Integrations off | Submitting `/book-a-demo` shows the "not delivered" message; no chat launcher; `/admin` redirects |
| Retired images absent | `/images/product/format-video.png` and `/images/product/homepage.png` return 404 |

If any of these fail, propose a targeted change (for example a `netlify.toml` with `[build]` settings, or a runtime adjustment) as a separate change, justified by the failing check. It must also be checked against the repository's provider-neutral tests (`tests/phase5-infrastructure.test.mjs`, `tests/release-pipeline.test.mjs`).

## 4. Production is unaffected because

- No command modifies `master`.
- The repository's release workflow runs only on pushes to `master`.
- Netlify builds production only from its production branch.
- Every staging protection is a value scoped to the `staging` context.
- `SITE_NOINDEX` is unset in production, so production headers and `robots.txt` are unchanged.
