# SafeRedact Blog Implementation Plan

## Scope status

Phase 4A is implemented locally as a read-only public blog plus a safely configured Decap foundation. External GitHub OAuth, branch protection, hosting integration, deployment, real editorial content, and authenticated end-to-end publishing remain launch tasks. Visitor discussions are deferred to Phase 4B.

## Delivered stages

### 1. Repository and Git audit

- Confirmed Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, and the existing design tokens.
- Preserved all Phase 1–3 uncommitted work on `feat/saferedact-marketing-revamp`.
- Verified `origin/HEAD` is `master` and configured Decap to target that reviewed default rather than the feature branch.
- Confirmed there was no existing CMS, database, authentication, or deployment-provider configuration.

### 2. RED content and route contracts

- Added development-only fixtures for published, draft, archived, and future content.
- Established RED failures for the missing content layer and missing public routes/navigation/admin/sitemap behavior.
- Added a separate RED contract for search-result `noindex` metadata.

### 3. Validated content layer

- Added strict Zod frontmatter parsing, safe slug and media rules, Markdown AST validation, reading-time calculation, published eligibility, search, category filtering, pagination, and related-article selection.
- Added safe Next.js metadata and Article JSON-LD mapping.

### 4. Public experience

- Added `/blog`, `/blog/[slug]`, and `/blog/category/[slug]`.
- Added listing, featured, search, category, pagination, article-body, and related-article components.
- Added responsive blog styling inside the existing design system.
- Integrated route-aware Blog navigation while preserving homepage hash behavior and all marketing CTA destinations.
- Kept the production content directory empty and shipped an honest empty state.

### 5. Decap foundation

- Added a pinned Decap 3.17.1 static shell and strict `config.yml`.
- Enabled the GitHub backend, explicit `master` target, local media folder, structured fields, and editorial workflow.
- Added `/admin` redirect, noindex metadata, robots exclusion, and no public navigation link.
- Did not create OAuth credentials, external accounts, callbacks, or secrets.

### 6. SEO and verification

- Added canonical listing/article/category metadata, search noindex, social metadata architecture, Article JSON-LD, and published-only sitemap entries.
- Verified safe missing/invalid routes, empty production state, navigation, and CMS shell behavior on a production server.
- Ran the full local quality suite documented in `PHASE4A_QA_RESULTS.md`.

## Remaining launch sequence

### Milestone A: OAuth and repository controls

1. Choose one supported GitHub OAuth pattern: hosting-provider OAuth, a reviewed self-hosted OAuth proxy, or an approved Decap-hosted service.
2. Create a GitHub OAuth application with the exact production callback URL.
3. Store client secrets only in the selected server/host secret manager.
4. Update `public/admin/config.yml` only with the public authentication endpoint/client identifier fields required by that chosen pattern.
5. Require named staff GitHub accounts with minimum repository access; prohibit shared identities.
6. Protect `master`, require pull-request review and passing checks, and restrict force pushes/deletions.
7. Test login, draft creation, review, publication, archive, deletion, logout, unauthorized access, and offboarding in a non-production environment.
8. Resolve the recorded production dependency advisories through reviewed compatible upgrades and rerun all 41 automated tests.

### Milestone B: Deployment integration

1. Confirm the Next.js host and production domain.
2. Ensure reviewed merges trigger builds and failed validation prevents deployment.
3. Confirm local blog images are optimized and deployment artifact limits are acceptable.
4. Add production monitoring for build failures and broken editorial submissions.
5. Publish one approved, factual article through the reviewed workflow and verify its route, metadata, sitemap entry, and rollback.

### Milestone C: Authorized browser acceptance

1. Capture desktop, tablet, mobile, narrow-mobile, and full-page screenshots.
2. Check keyboard navigation, focus order, active navigation, reduced motion, 200% zoom, and screen-reader landmarks.
3. Verify no horizontal overflow, console errors, hydration errors, or content clipping.
4. Record visual discrepancies without claiming acceptance before evidence exists.

## Phase 4B recommended scope

Phase 4B should begin with a provider-neutral discussion repository and a separate decision on comment storage. It should cover pending-by-default comments and one-level replies, staff moderation identities, report/removal flows, server-side validation, persistent rate limiting, anti-spam, privacy notice/retention/deletion, safe plain-text rendering, and migration/export tests. Comments must remain disabled until the storage provider, hosting target, privacy policy, moderation owner, and abuse controls are approved.

## Dependencies

Installed for Phase 4A:

- `gray-matter` for frontmatter parsing.
- `zod` for strict content validation.
- `react-markdown`, `remark-gfm`, `remark-parse`, `unified`, and `unist-util-visit` for safe Markdown processing.
- `tsx` and `yaml` as development-only test tooling.

Externally required but not created:

- GitHub OAuth application/service.
- Authorized staff GitHub accounts and repository roles.
- Branch protection and required checks.
- A production hosting/deployment integration.
- Approved article content and licensed media.

## Stop conditions

Do not claim live publishing until OAuth and the full draft-to-deployment path pass end-to-end testing. Do not add real secrets to Git, weaken branch protection for convenience, expose `/admin` in marketing navigation, publish unreviewed product claims, or begin visitor comments under Phase 4A.
