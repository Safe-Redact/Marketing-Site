# Phase 4A.1 security report

Date: 2026-10-14
Branch: `feat/saferedact-marketing-revamp`
Baseline commit preserved: `31a43055b08a27333c0ec8d9663f691e7f329e5b`
Result: **production dependency gate cleared; external publishing gate remains blocked**

## Scope and method

This pass reviewed the production dependency graph, public contact boundary, filesystem-backed blog ingestion and rendering, the Decap administrative shell, Git publishing assumptions, and Next.js workspace tracing. It used `npm audit --omit=dev --json`, `npm ls --omit=dev --all`, source review, RED/GREEN contract tests, a production build, production HTTP checks, and a host-backed Codex Security scan. No browser restriction was bypassed and no external setting or credential was created.

The original audit counted **8 vulnerable package nodes** but **13 underlying advisories**. Those are different units: `next`, for example, inherited PostCSS and Sharp findings in addition to four advisories against Next itself.

## Production advisory matrix: initial state and disposition

| Advisory | Package and resolved version | Severity | Dependency path | Production use / reachability | Minimum patched version | Compatibility and disposition |
| --- | --- | --- | --- | --- | --- | --- |
| [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) | `next@15.5.23` | Critical | direct production dependency | Public Next server; advisory is especially relevant to Windows-hosted deployments. Production host OS was not established. | `15.5.24` | Updated within Next 15 to `15.5.27`; resolved. |
| [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) | `next@15.5.23` | Critical | direct | Image optimizer path; `next.config.ts` enables AVIF and blog cards use `next/image`. | `15.5.24` | Updated to `15.5.27`; resolved. |
| [GHSA-4jqv-mc3x-m676](https://github.com/advisories/GHSA-4jqv-mc3x-m676) | `next@15.5.23` | High | direct | Vendor conditions emphasize affected self-hosted SSG/ISR cache configurations. This site uses App Router, so exact runtime reachability is constrained, but the installed version was in range. | `15.5.27` | Updated to `15.5.27`; resolved. |
| [GHSA-mcj8-r9mp-w47p](https://github.com/advisories/GHSA-mcj8-r9mp-w47p) | `next@15.5.23` | High | direct | Cache poisoning/cross-user content/DoS conditions depend on hosting and cache topology; topology is unverified. | `15.5.27` | Updated to `15.5.27`; resolved. |
| [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) | `postcss@8.4.31` | Moderate | `next -> postcss` | Production dependency, primarily exercised during trusted CSS/build processing; no public CSS input exists. | `8.5.10` | Next 15.5.27 still pins 8.4.31. A scoped npm override selects `8.5.26`; build and tests pass. |
| [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) | `postcss@8.4.31` | High | `next -> postcss` | Arbitrary source-map file read requires attacker-controlled CSS/sourceMappingURL; none is accepted publicly. | `8.5.12` | Resolved by the same `8.5.26` override. |
| [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) | `postcss@8.4.31` | Moderate | `next -> postcss` | Same trusted build-time path and no public CSS ingestion. | `8.5.23` | Resolved by the same `8.5.26` override. |
| [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | `postcss@8.4.31` | High | `next -> postcss` | Same trusted build-time path and no public CSS ingestion. | `8.5.18` | Resolved by the same `8.5.26` override. |
| [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) | `sharp@0.34.5` | High | `next -> sharp` (optional production dependency) | Image processing can be reached through Next image optimization. | `0.35.0` | Next 15.5.27 accepts the 0.35 line; lockfile updated to `0.35.5`. |
| [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) | `sharp@0.34.5` | High | `next -> sharp` | Image/HEIF processing path. | `0.35.4` | Resolved at `0.35.5`. |
| [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) | `sharp@0.34.5` | High | `next -> sharp` | Image/SVG processing path. | `0.35.5` | Resolved at `0.35.5`. |
| [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | `source-map-js@1.2.1` | High | `next -> postcss -> source-map-js` | Malicious indexed source maps could block the event loop; the site has no public source-map ingestion. | `1.2.2` | Lockfile updated to `1.2.2`; resolved. |
| [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) | `sprintf-js@1.0.3` | Moderate | `gray-matter -> js-yaml -> argparse -> sprintf-js` | Repository-authorized Markdown frontmatter was parsed at build/runtime. The advisory has no patched `sprintf-js` release. | None | Documented before replacement; `gray-matter` was replaced by `yaml`, preserving delimiter parsing plus strict Zod validation. Entire chain removed. |

During remediation, the current registry also identified [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) in `yaml@2.8.1`. It was updated within the same minor line to patched `yaml@2.8.3` before acceptance.

## Final production graph

- `next@15.5.27`
- `next -> postcss@8.5.26` through a narrowly scoped override
- `next -> sharp@0.35.5`
- `source-map-js@1.2.2`
- `yaml@2.8.3`
- `gray-matter`, `js-yaml@3`, `argparse@1`, and `sprintf-js` removed from the production graph
- Final `npm audit --omit=dev`: **0 vulnerabilities**

The PostCSS override remains an intentional compatibility decision. It stays inside PostCSS 8 and passed typecheck, lint, the production build, content tests, and production-route regressions. Remove it when a supported Next 15 release no longer pins the affected version, or evaluate Next 16 only as a separately approved migration.

## Development-only residual risk

The complete audit still reports **9 development package nodes** (7 high, 2 moderate). They are not present in `npm audit --omit=dev` and are not deployed as application runtime dependencies.

| Package node | Path / cause | Status |
| --- | --- | --- |
| `eslint-config-next`, `@next/eslint-plugin-next`, `fast-glob` | lint tooling through `micromatch -> braces` | The audit proposes an incompatible downgrade to ESLint config 14.2.35. Rejected because it would mismatch Next 15. |
| `tailwindcss`, `chokidar`, `fast-glob`, `micromatch`, `braces` | Tailwind 3 build/watch tooling; [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | npm's supported fix is Tailwind 4.3.3, a major migration. Deferred for separate design and visual-regression approval. |
| `postcss-nested`, `postcss-selector-parser` | Tailwind 3 build tooling; [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) | Fix requires a transitive major/Tailwind 4 migration. No untrusted selectors are processed in production. |

Previously vulnerable development copies of `brace-expansion` and `js-yaml` were updated compatibly. CI should continue to run both the full audit and the production-only audit; production deployment should block on production findings, while development findings should remain visible and time-bounded.

## Source-level findings and fixes

### Public contact endpoint — fixed within repository scope

The endpoint previously read arbitrary JSON, checked only truthiness, and logged name, email, organization, file type, and free-form message. It now:

- accepts only `application/json`;
- incrementally caps request bodies at 16 KiB and rejects oversized bodies with 413;
- applies a strict Zod object schema, field lengths, email syntax, and a file-type allowlist;
- adds matching browser-side length constraints;
- logs only an opaque request ID and coarse `accepted-not-delivered` outcome;
- returns 202 with `delivered: false` and `Cache-Control: no-store`;
- tells visitors the enquiry is validated but not stored, emailed, or sent to a CRM.

A reliable distributed rate limiter still requires the chosen hosting platform or an external durable store. That control is an operational deployment requirement; an in-memory serverless counter would give a false guarantee.

### Blog rendering — no reportable exploit found

Slugs are allowlisted; article filenames must match slugs; Zod frontmatter is strict; duplicate YAML keys fail; raw HTML is rejected and skipped; article links and images are allowlisted; remote images are rejected; only published, non-future articles are discoverable; JSON-LD escapes `<` before script insertion.

### Admin shell — launch hardening added

- The exact Decap 3.17.1 CDN bundle now has a verified SHA-384 Subresource Integrity value and `crossorigin="anonymous"`.
- `/admin/:path*` responses receive `Content-Security-Policy: frame-ancestors 'none'`, `X-Frame-Options: DENY`, and `Referrer-Policy: no-referrer`.
- The shell remains noindexed, unlinked from marketing navigation, and non-operational without OAuth.

Self-hosting a reviewed Decap bundle is still preferable before long-term production use; SRI is the bounded fix that avoids adding or vendoring an unapproved dependency in this phase.

## Workspace-root finding

The application root is `M:\Safaridesk\Marketing-Site`, containing `package.json`, its lockfile, `next.config.ts`, `src`, and `public`. The parent `M:\Safaridesk\package-lock.json` is an unrelated empty lockfile named `Projects`; there is no parent `package.json`. It was not edited or deleted.

`next.config.ts` now derives its own directory using `fileURLToPath(import.meta.url)` and sets `outputFileTracingRoot` to that application root. The final build emitted no multiple-lockfile/root inference warning. This follows the [Next.js output tracing guidance](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

## Acceptance and remaining gates

Security status for the local Phase 4A implementation: **CONDITIONAL PASS**.

Cleared locally:

- zero production dependency advisories;
- bounded and privacy-minimized contact handling;
- safe blog parsing/rendering controls;
- explicit application tracing root;
- integrity-pinned, anti-framed admin shell;
- passing build and complete local regression suite.

Still blocks live staff publishing:

- no approved OAuth broker, GitHub application, callback, secrets, or deployment;
- no verified protected-branch rules or required CI workflows;
- no authenticated staff login/draft/review/merge/rebuild acceptance;
- no persistent rate limiting at the hosting edge;
- browser-dependent acceptance remains prohibited and therefore blocked.
