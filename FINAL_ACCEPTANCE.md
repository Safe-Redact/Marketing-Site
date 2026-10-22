# SafeRedact final acceptance

Audit date: 2026-10-17

Branch: `feat/saferedact-publishing-and-comments`

Reconciled remote baseline: `888f259bc68a24fc6a21ca104e49cc97bd4e2fc7`

## Publishing acceptance

The repository now implements the provider-neutral application side of this flow:

`Decap editorial PR → protected master merge → GitHub release workflow → validated standalone artifact → readiness-gated traffic switch → article visible in Insights`

The final production host and its traffic-switch adapter are not selected, so external deployment remains **DEPLOYMENT-PENDING**. No deployment, merge to `master`, push, credentials, or GitHub setting change was performed in this implementation.

### Root causes corrected

1. Decap published to the configured development branch, while deployments did not track those commits. Four real CMS pull requests reached that branch but no production release workflow consumed them.
2. Decap editorial state and the Markdown `status` field could contradict each other. A CMS Publish merge could therefore leave `status: draft` on the target branch.
3. The CMS slug regex accepted one-character values while application validation required at least three characters. The invalid archived test entry then stopped every build because all files are validated before visibility filtering.
4. A future timestamp on a supposedly published entry silently behaved like scheduling, including local/UTC mistakes.
5. The CMS allowed repeated title/tag text and a body-level H1 that duplicated the page title.
6. `preview_path` sent unpublished entries to a public route that correctly returned 404, but the editor presented that as a failed preview.
7. CI validated code but produced no immutable production artifact or application-side readiness/rollback evidence.
8. With a single published article, Insights featured it and also rendered the empty-publication state underneath.

### Implemented lifecycle

- Decap `editorial_workflow` and Git pull requests are authoritative for Draft, In review, Approved, and Published.
- Frontmatter now uses only `publication: immediate | scheduled | archived` for post-merge visibility; legacy `status` is rejected.
- Immediate publication is visible with the approved release and rejects timestamps more than five minutes ahead. Scheduled content becomes visible at its UTC time through dynamically evaluated listings, article/category routes, and sitemap. Archived content remains recoverable in Git but is excluded publicly.
- CMS `preSave` and `prePublish` handlers normalize repeated input and reject invalid slugs, lengths, dates, types, publication intent, tags, images/alt text, raw HTML, unsafe Markdown links, and duplicate page-level headings before the editorial change is saved/published.
- Repository validation independently enforces filename/slug agreement, duplicate slugs, strict frontmatter, safe Markdown, uploaded-image existence, date semantics, and publication state. It is required before builds and in both CI workflows.
- Generic deploy-preview links are disabled. The authenticated editor preview checks the deployed article URL and links to it only after that release returns success; pending drafts are described honestly and never receive a public draft route.
- The preserved invalid CMS test entry was renamed to `cms-publishing-test`, validated, and archived. The approved document-redaction article's repeated title/tag and duplicate body H1 were corrected without deleting its Git history.

### Git and review contract

Decap's GitHub backend creates `cms/<collection>/<slug>` branches and pull requests. Saving adds commits; Publish asks GitHub to merge the pull request into `CMS_PUBLISH_BRANCH` and deletes the editorial branch. The production environment must set that branch to `master` only after this implementation is merged.

Decap does not enforce distinct Writer, Reviewer, and Publisher roles. All CMS users need repository push access. GitHub must therefore require pull requests, an independent approval, current required checks, resolved conversations, no force pushes/deletion, and no ordinary-staff bypass on `master`. OAuth proves identity and repository access; it does not replace review policy.

### Build and release contract

- `.github/workflows/ci.yml` validates pull requests into `master` and the development publishing branch with read-only permissions and no secrets or deployment path.
- `.github/workflows/release.yml` runs only for approved pushes to `master` (or an explicit manual artifact build), checks out the exact SHA, installs locked dependencies, validates content, runs TypeScript, lint, secrets, production audits, build, full tests, packages the standalone server, verifies blue/green behavior, and uploads an immutable artifact.
- Concurrency queues releases and never cancels an in-progress traffic-transition candidate.
- `.release/bundle/release-manifest.json` records the commit SHA, build identity, Next build ID, Node runtime, start command, readiness URL, and traffic-switch contract.
- `/api/health` supplies the no-store readiness response and immutable release identity used by the deployment adapter.
- `release:verify` demonstrated two simultaneously running standalone releases behind a proxy: the prior release stayed available while the candidate started, readiness gated the switch, the published article and Insights listing returned successfully, static assets remained available, and rollback restored the previous release.

The selected host must unpack the artifact into a new immutable directory, inject environment values, start `node server.js` separately, poll `/api/health`, atomically switch its proxy/load balancer, retain the previous release and assets while requests drain, and roll back on failure. A stop-and-restart service does not satisfy this contract.

## Backend regression status

- GitHub OAuth broker: source and automated state, PKCE, origin, callback, token, authorization, popup-target, and failure tests retained. Real organization-approved CMS login and repository writes are stakeholder-confirmed; this run did not receive or expose credentials.
- Visitor comments: PostgreSQL migrations, pending-by-default submission, replies, reporting, moderation permission checks, retention, rate limiting, and privacy-preserving identifiers retained.
- Contact and leads: input validation, honest accepted-not-delivered behavior, provider adapter, timeouts, and failure reporting retained. Real delivery remains externally unconfigured.
- Security: nonce CSP, admin-only Decap exception, CSRF-relevant same-origin JSON boundaries, security headers, Markdown safety, secret scanning, and production dependency audits retained.

## Production-only actions

1. Merge this reviewed branch into `master` through a normal pull request; do not merge CMS content until the new required checks are active.
2. Protect `master` with independent approval and the three CI checks; remove bypass permission from ordinary CMS staff.
3. Configure the production website's public CMS coordinates with `CMS_PUBLISH_BRANCH=master` and deploy the OAuth broker at its approved exact HTTPS origin/callback using server-side secrets.
4. Select a Node.js 22 host and implement the documented artifact retrieval, immutable release directories, secret injection, reverse-proxy switch, drain, monitoring, and rollback adapter.
5. Run one non-production editorial acceptance through Draft → review → GitHub approval → Decap Publish → `master` release artifact → isolated deployment before enabling production publishing.
6. Complete remaining legal/privacy, lead destination, comments privacy/retention, browser/mobile/accessibility/performance, media-rights, monitoring, backup, and incident-response acceptance.

## Verification record

- Content validation: PASS — two files; one public and one archived.
- Production build: PASS — published article route emitted and sitemap evaluated dynamically.
- CMS article route: PASS — `/blog/understanding-document-redaction` returned HTTP 200 in the production-style release test and appeared in Insights, search, its tag filter, metadata, and sitemap.
- Archived article: PASS — `/blog/cms-publishing-test` returned HTTP 404 and was absent from sitemap/public discovery.
- Isolated blue/green release test: PASS — readiness, switch, article, listing, static assets, and rollback.
- Clean dependency installs: PASS — 477 root packages and the dependency-free OAuth broker installed from lockfiles with `npm ci`.
- TypeScript and ESLint: PASS — no type errors, lint warnings, or lint errors.
- Complete regression suite: PASS — 203/203 tests (44 static/security, 95 content/backend, 27 production-route, and 37 OAuth broker tests).
- OAuth source checks: PASS — all broker modules passed Node syntax validation.
- PostgreSQL migration: PASS — `0001_comments` is present and already applied in the configured local acceptance database.
- Secret-pattern scan: PASS — 193 repository files checked; no committed credential pattern or forbidden secret file found.
- Production dependency audits: PASS — zero vulnerabilities in the website and OAuth broker production dependency trees. The full root audit still reports nine development-tool advisory nodes (seven high, two moderate) through `eslint-config-next` and Tailwind tooling; none is shipped in the production artifact.
- Security diff scan: PASS — all 21 security-relevant changed source files reviewed with complete coverage and no reportable finding (scan `d0b02d8f-fe0a-4316-b29b-26618f8c8688`; 320,102 tokens recorded by the scanner).
- `git diff --check`: PASS — no whitespace errors; Git emitted only the repository's existing Windows line-ending notices.
- Browser-dependent visual acceptance remains outside this backend task and is not claimed.

## Historical attribution

The previously reported five Claude co-author trailers remain unchanged in shared history. The repository hook continues to reject new automated attribution trailers. No history rewrite was performed.
