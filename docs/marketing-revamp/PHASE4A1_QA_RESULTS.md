# Phase 4A.1 QA results

Date: 2026-10-14
Branch: `feat/saferedact-marketing-revamp`
Acceptance: **CONDITIONAL PASS**

## RED/GREEN evidence

The Phase 4A.1 security contract was added before the remaining remediation:

- RED: `node --test tests/phase4a1-security.test.mjs` — 1 passed, 3 failed.
- Failing contracts: vulnerable frontmatter chain still installed; no patched Next-scoped PostCSS resolution; no explicit tracing root.
- GREEN: the same suite — 5 passed, 0 failed after remediation and CMS integrity/anti-framing coverage.

The initial production audit was also a concrete RED gate: 8 vulnerable production package nodes (1 critical, 3 high, 4 moderate) representing 13 advisories. The final production audit is zero.

## Final command results

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS — no warnings/errors; Next reports the expected future deprecation of `next lint` |
| `npm run build` | PASS — Next.js 15.5.27, 9 routes/pages; no multiple-lockfile/root warning |
| `node --test tests/phase4a1-security.test.mjs` | PASS — 5/5 |
| `npx tsx --test tests/phase4a-content.test.ts tests/contact-route.test.ts` | PASS — 11/11 |
| Production HTTP and regression `.mjs` suites | PASS — 39/39 against `next start` |
| Total automated tests | PASS — 50/50 |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| Complete `npm audit` | CONDITIONAL — 9 development-tooling nodes (7 high, 2 moderate); no production nodes |
| Production HTTP contact check | PASS — 202, `accepted: true`, `delivered: false`, `Cache-Control: no-store` |
| Wrong contact media type | PASS — 415 |
| Admin response headers | PASS — `frame-ancestors 'none'`, `X-Frame-Options: DENY` |
| Browser/screenshot acceptance | BLOCKED — existing browser-control restriction preserved |

Two regression assertions initially failed because they encoded the previous "logged locally" wording. The secured endpoint deliberately no longer logs personal enquiry content, so those assertions were updated to require the new validation-only, not-stored/not-delivered disclosure. The final complete suite passed.

## Dependency verification

Final production resolutions:

- Next.js 15.5.27
- PostCSS 8.5.26 within Next through a scoped override
- Sharp 0.35.5
- source-map-js 1.2.2
- YAML 2.8.3
- no `gray-matter`/legacy `js-yaml`/`sprintf-js` production chain

The complete audit's remaining findings are confined to ESLint/Tailwind build tooling. Resolving them through npm's advertised path would require an incompatible Next lint-config downgrade or Tailwind 4 major migration, so they are documented rather than forced.

## Functional and security coverage

- Existing marketing-only navigation and CTA contracts remain green.
- Phase 1–3 layout, disclosure, motion, accessibility-source, and metadata contracts remain green.
- Blog listing, search noindex, missing/traversal routes, categories, admin redirect, and sitemap contracts remain green.
- Draft/archive/future filtering, frontmatter schema, duplicate-key rejection, raw HTML rejection, image/link policy, and article SEO contracts remain green.
- Contact schema, payload limit, media type, no-PII logging, and honest delivery semantics are covered.
- Admin bundle integrity and anti-framing response headers are covered.

## Git and publishing checks

- Current branch remained `feat/saferedact-marketing-revamp`.
- No commit, push, merge, reset, rebase, or history rewrite occurred.
- Remote/default remains `Safe-Redact/Marketing-Site` / `master`.
- The repository contains no local GitHub Actions workflow; the public GitHub API reports zero workflows and no visible rulesets.
- Classic branch protection requires authentication to inspect and remains unverified.
- No OAuth application, callback service, credential, provider account, or deployment was created.

## Remaining limitations

- Staff publishing is not operational until OAuth, protected branch rules, required CI, and deployment hooks are implemented and tested.
- Persistent/distributed contact rate limiting needs the selected deployment edge or durable service.
- Development-tooling advisories require a separately approved Tailwind/Next tooling migration plan.
- Browser-dependent responsive, accessibility, console, and visual acceptance remains blocked by policy.
- Phase 4B comments, moderation, storage, privacy, and abuse systems were not started.

## Final status

**CONDITIONAL PASS**: local production dependencies and source-level Phase 4A blockers are remediated and verified. Live CMS publishing remains blocked on external authentication, repository protection, CI/deployment, and authorized browser acceptance.
