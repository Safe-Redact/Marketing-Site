# SafeRedact final acceptance

Audit date: 2026-10-16

Branch: `feat/saferedact-publishing-and-comments`

Reviewed HEAD: `d477c370ada77372933857a0feb2d196129c7252`

## Baseline and scope

GitHub's `origin/master` contains the reviewed branch tip through merge commit `200059d0eb7432126fc412bc6769be08fa05f2fb`, and its tree matched reviewed HEAD `d477c370ada77372933857a0feb2d196129c7252` before this cleanup. The merged remote feature ref had been deleted; the authorized handoff recreates it with a normal push of one cleanup commit. The local `master` ref is stale and was not changed. The auxiliary `.claude/worktrees/magical-mendeleev-8eb196` checkout is clean at `012d3dd` and was preserved. No merge, rebase, reset, force-push, deployment, OAuth registration, or repository-setting change was performed.

Marketing capability copy was checked against the read-only application repository at `M:\Safaridesk\redact`. The application source confirms Windows desktop workflows for PDFs and supported converted documents, images, audio, and video; face, licence-plate, OCR/text, document-PII and transcript analysis; operator review; document export verification; local processing components; and optional configured cloud engines. The website avoids claiming universal detection or unattended correctness and tells users to review rendered output.

## Acceptance matrix

| # | Area | Status | Evidence and limitation |
| ---: | --- | --- | --- |
| 1 | Marketing homepage | PASS | Source/component contracts, route tests, typecheck, lint, and production build pass. Product language is supported by the desktop source. |
| 2 | Product screenshots | PARTIAL | Seven optimized product images are wired through Next Image with responsive sizing; five match approved masters byte-for-byte and two are intentional crops. `format-video.png` contains identifiable people and a PBS NewsHour watermark, so publication rights require owner approval. |
| 3 | Responsive design | BLOCKED | Responsive source rules and static contracts pass, but current rendered acceptance at 1440, 768, 390, and 320 px could not be performed under the browser/localhost access restriction. |
| 4 | Navigation | PARTIAL | Header, footer, anchor, mobile-menu, keyboard, active-section, and reduced-motion contracts pass. Final browser keyboard and viewport acceptance remains blocked. |
| 5 | Blog and Insights | PASS | One Insights hub, search, content-type filters, category pages, pagination, article routes, safe Markdown, empty states, and newly completed tag links/filtering pass automated tests. No fictional content was added. |
| 6 | News and product updates | PASS | News and product updates are content types within Insights; `/news` redirects to `/blog?type=news`; only Insights is top-level navigation. |
| 7 | Staff CMS login | BLOCKED | OAuth broker checks pass locally, but no live login can be claimed until the Safe-Redact organization approves the OAuth App and approved credentials/origins are configured. |
| 8 | Article creation/editing | BLOCKED | Decap schema and generated configuration are tested; live editor operations need the approved OAuth App and a non-production editorial branch. |
| 9 | CMS publishing | BLOCKED | Draft visibility gates and editorial configuration pass. Organization OAuth approval, live login, protected-branch rules, and end-to-end editorial acceptance are still required. |
| 10 | PostgreSQL | PASS | Local PostgreSQL 18.1 migration is applied; repository integration tests run against the configured database. Role checks show the application role is not superuser and cannot create databases or roles. |
| 11 | Visitor comments | PARTIAL | Validation, pending-by-default persistence, safe text rendering, privacy-preserving abuse keys, API routes, and real PostgreSQL adapter tests pass. Production collection must remain off until hosting, privacy, retention, and abuse controls are approved. |
| 12 | Replies and reporting | PARTIAL | Reply/report domain, route, persistence, state, and audit tests pass. No live browser session or production traffic was used. |
| 13 | Staff moderation | BLOCKED | Server-side GitHub identity, numeric allowlist, repository push-permission checks, audit history, and tombstones are tested with doubles. A real authenticated staff moderation session was not possible. |
| 14 | Contact form | PASS | Accessible form labels, bounded validation, honeypot, error states, honest delivery status, and route regression tests pass. |
| 15 | Demo enquiries | PASS | Unconfigured delivery accepts valid enquiries without falsely claiming receipt; the UI directs users to `support@saferedact.io` when delivery matters. |
| 16 | Real lead delivery | BLOCKED | HTTPS transport and failure modes are tested with mocks only. No approved mailbox/CRM provider or production credentials are configured or live-tested. |
| 17 | Security | PARTIAL | Source-backed review covers public/admin CSP, headers, OAuth state/PKCE/callback/origin validation, staff authorization, Markdown rendering, database access, secrets, comments, and leads. Spoofable forwarding-header trust was fixed with fail-closed `TRUST_PROXY_HOPS`. External controls and browser acceptance remain outstanding. |
| 18 | SEO | PASS | Metadata, canonical handling, Open Graph, structured article data, robots, legacy redirect, and published-only sitemap contracts pass. Search, tag, and deep-page refinements are noindex/follow. |
| 19 | Performance | NOT TESTED | Image optimization and loading intent were source-reviewed, but no authorized browser performance trace, Core Web Vitals run, or layout-shift measurement was available. |
| 20 | Dependency health | PARTIAL | Root and broker production audits report zero vulnerabilities. The full root audit reports nine development/tooling advisory nodes (two moderate, seven high) whose available remediations require disruptive version changes; no forced upgrade was attempted. |
| 21 | Git attribution | PARTIAL | Human author/committer identities are intact, and a repository commit hook now rejects common automated AI trailers. Five already-pushed commits contain a Claude co-author trailer and were merged to `master`; removing them requires separately authorized shared-history coordination and force-pushes. |
| 22 | Documentation cleanup | PASS | The approved `/docs` directory and 65 tracked obsolete files were removed. Essential setup, migration, backup/restore, OAuth, CI, security, and deployment information is retained in the root and broker READMEs. References and tests were repaired. |
| 23 | Deployment readiness | BLOCKED | Requires host selection, trusted proxy contract, OAuth approval/deployment, real lead delivery, comments privacy/retention and maintenance controls, production database verification, branch protection, legal destinations, rights clearance, and browser acceptance. CI does not deploy. |

## Corrections completed

- Added public topic/tag navigation, tag-filter propagation through search/type/pagination, article tag links, unknown-tag handling, canonical/noindex behavior, and accessible single-current-state semantics.
- Replaced direct trust of visitor-supplied forwarding headers with a shared, IP-validated, fail-closed trusted-proxy-suffix parser. `TRUST_PROXY_HOPS` defaults to zero and must only be set from a verified hosting contract.
- Removed obsolete phase documentation while consolidating necessary operational instructions into `README.md` and the broker README.
- Added a tracked repository commit-message hook and enabled it in this checkout through local `core.hooksPath`; the hook blocks common automated AI attribution trailers.
- Ignored local `.claude` launch/worktree state without deleting the clean auxiliary checkout.

## External actions required

1. **Rights:** confirm written authorization for the people and PBS NewsHour frame in `public/images/product/format-video.png`, or separately authorize replacement of that approved asset.
2. **Browser acceptance:** on an authorized runner, serve the production build and test 1440×900, 768×1024, 390×844, and 320×700; inspect navigation, keyboard focus, reduced motion, overflow, console/hydration errors, missing resources, layout shift, and performance.
3. **CMS:** have a Safe-Redact organization Owner approve the GitHub OAuth App. Configure exact HTTPS site/broker origins and callback, allowlisted numeric staff IDs, repository, non-production publishing branch, TLS paths, and server-only secrets from the supplied environment templates. Then perform the documented editorial lifecycle against that branch; do not publish directly to `master`.
4. **GitHub:** require pull requests, independent approval, `quality / verify`, `security / production-audit`, and `security / tracked-secret-policy`, current branches, resolved conversations, and blocked force-push/deletion on the production branch.
5. **Comments:** provision a private TLS PostgreSQL service and least-privilege role, choose retention/privacy text, schedule and monitor retention cleanup, configure shared/edge abuse controls, set the exact trusted proxy hop count, and complete a real staff moderation acceptance session before enabling collection.
6. **Leads:** approve an email/CRM endpoint and destination, configure all four `LEAD_DELIVERY_*` values server-side, add shared/edge throttling and monitoring, and prove a non-production delivery before claiming receipt.
7. **Legal and hosting:** approve privacy/legal destinations, secret storage, HTTPS, log redaction, caching, backup/restore, monitoring, non-production isolation, and the final provider-neutral deployment plan.

## Git attribution report

The following pushed commits, all merged through pull request #2, contain `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`:

- `dc5da938a78aa992af331dc183e0e84758e586c4`
- `8f26ec749979fb1aeea29ce467e2d90f033abd51`
- `bff32d05b911b43f7ac42875dd1eb8bd3eba282e`
- `2ecf6510aabb38023c2be6c3b9614b825509e172`
- `d477c370ada77372933857a0feb2d196129c7252`

Their Git Author and Committer are the configured human identity, `Maverick254-coder <nyalikotieno@gmail.com>`; the unwanted data is confined to commit-message trailers. GitHub's merge commit uses legitimate platform metadata. A normal cleanup commit cannot remove historical trailers. If removal is required, obtain explicit authorization from branch owners and collaborators, temporarily coordinate branch protection, rewrite every descendant on affected shared branches, force-push with lease, repair or recreate affected pull-request/branch references, and require all collaborators to re-clone or rebase. That disruptive procedure was not performed.

## Verification record

- Root `npm ci`: PASS, 476 packages installed reproducibly.
- Broker `npm ci`: PASS, one package audited.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS with no warnings/errors; Next reports only its `next lint` deprecation notice.
- `npm run build`: PASS on Next.js 15.5.27; 10 static-generation entries completed and all application/API routes were emitted.
- `npm test`: PASS, 192/192 (`41` static + `87` content/domain/PostgreSQL + `27` production-route + `37` OAuth).
- `npm --prefix services/cms-oauth-broker run check`: PASS.
- `npm run check:secrets`: PASS across 235 repository files; ignored environment files were not exposed.
- Root and broker production audits: PASS, zero reported vulnerabilities.
- Full root audit: PARTIAL, nine development/tooling advisory nodes (`2` moderate, `7` high): `@next/eslint-plugin-next`, `eslint-config-next`, `braces`, `chokidar`, `fast-glob`, `micromatch`, `postcss-nested`, `postcss-selector-parser`, and `tailwindcss`. Suggested fixes include breaking/downgrade changes and were not forced.
- `npm run comments:migrate`: PASS; `0001_comments` was already applied to the configured loopback development database.
- Local database role: non-superuser, cannot create databases or roles; application database connect and schema privileges were available.
- Codex Security standard scan `a8b8ef2d-4a67-4f48-9957-6827b3390b26`: completed with zero reportable source findings and partial deployment coverage. The workbench recorded that working-tree contents changed during the scan; the completed report is tied to its original snapshot, while the forwarding-header remediation and final 192-test run are evidenced by the current diff and this verification record. Independent delegated baseline workers were unavailable under the active task policy.
- `git diff --check` and staged-diff check: PASS after the final report update.
- Browser-dependent visual, interaction, console, hydration, resource, and performance acceptance: BLOCKED and not claimed.

## Git handoff

This report accompanies one normal cleanup commit containing the verified audit fixes, operational documentation consolidation, and approved `/docs` deletion. The commit is pushed only to `feat/saferedact-publishing-and-comments`; its exact local and remote SHA are recorded in the final handoff response. The five shared commits are not rewritten merely to remove trailers, and nothing is pushed directly to `master`.
