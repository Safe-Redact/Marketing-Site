# Phase 4A QA Results

> Historical Phase 4A snapshot. The dependency and workspace-root blockers recorded below were remediated in Phase 4A.1; see `PHASE4A_SECURITY_REPORT.md` and `PHASE4A1_QA_RESULTS.md` for the current state.

## Acceptance status

**CONDITIONAL PASS** for the local public blog and Decap foundation.

The application compiles, content and HTTP route contracts pass, and the existing regressions remain part of the final verification suite. The conditions are external GitHub OAuth/publishing configuration and authorized browser visual/accessibility acceptance. Staff login or live publishing is not claimed.

## RED evidence

Before implementation:

- `npx tsx --test tests/phase4a-content.test.ts` failed because the blog content module did not exist.
- The initial production route suite had four failures: `/blog` missing, no public Blog navigation link, `/admin` missing, and no blog sitemap entry. Existing unknown article/category routes returned 404.
- A later focused route contract proved search results emitted `index, follow` before `noindex` metadata was implemented.

During GREEN verification, the production route suite exposed an unknown-category 500 caused by static fallback interacting with category query parameters. Marking the category archive dynamic restored the intended 404; the same production test then passed.

## Automated coverage

Content tests verify:

- draft, archived, and future article exclusion;
- traversal rejection and published-only lookup;
- case-insensitive search, category filtering, and pagination;
- related-article category matching;
- raw HTML, missing alt text, and remote image rejection;
- metadata and Article JSON-LD mapping without ratings;
- Decap repository, branch, editorial workflow, content folder, and media configuration.

Production route tests verify:

- honest accessible empty blog state;
- labeled search UI and search `noindex` behavior;
- missing/traversal article responses;
- unknown category 404;
- public Blog navigation without an admin link;
- noindexed admin shell and pinned Decap asset;
- published-only sitemap architecture with no fixtures/admin URLs.

## Final command record

The final command results are recorded after implementation verification:

| Check | Result |
| --- | --- |
| TypeScript | PASS — `tsc --noEmit` |
| Next.js lint | PASS — no warnings or errors (command itself carries Next 16 deprecation notice) |
| Production build | PASS — Next.js 15.5.23, 9 static/generated pages |
| Phase 4A content tests | PASS — 7/7 |
| Phase 4A production route tests | PASS — 7/7 against `next start` |
| Existing regression tests | PASS — 27/27, run sequentially against the same isolated production server |
| Total automated tests | PASS — 41/41 |
| `git diff --check` | PASS — no whitespace errors; Git emitted line-ending conversion notices only |
| Production dependency audit | BLOCKER — 8 advisories: 1 critical, 3 high, 4 moderate |

The production build also warns that Next.js inferred `M:\Safaridesk` as the tracing root because multiple lockfiles exist. This repository did not delete or alter the parent lockfile. The deployment owner should set an explicit `outputFileTracingRoot` after confirming the intended monorepo boundary.

## Dependency audit findings

`npm audit --omit=dev` reports:

- critical advisories in the resolved Next.js runtime, including unauthenticated RCE advisories relevant to Windows-hosted servers;
- high advisories through Next.js transitive PostCSS and Sharp dependencies;
- a high denial-of-service advisory in `source-map-js`;
- moderate `sprintf-js`/`js-yaml` findings through `gray-matter`.

The audit advertises an ordinary `npm audit fix` for several runtime items, but a complete automatic fix would use `--force` and downgrade `gray-matter` across a breaking major boundary. Neither command was run. Production deployment should remain blocked until maintainers review patched compatible versions, update deliberately, and rerun the full suite.

## Manual/browser limitations

No browser automation or screenshot capture was attempted because the existing browser-access restriction remains in force. The following are not claimed as accepted: screenshot fidelity, responsive pixel comparison, 320px overflow, live keyboard focus order, screen-reader output, reduced-motion observation, hydration console, and live Decap OAuth interaction.

## External blockers

- No approved/configured GitHub OAuth service.
- No authenticated staff publishing test.
- No confirmed hosting/deployment trigger.
- No real approved production article.
- No authorized browser acceptance path.

## Security notes

- Production article content is empty; test fixtures are isolated from the content loader's default directory.
- CMS write credentials are absent from source and browser configuration.
- `/admin` noindex/robots controls do not replace authentication.
- Dependency audit findings must be triaged; do not use forced dependency upgrades without compatibility review.
- Comment security and privacy controls are deliberately deferred rather than partially implemented.
