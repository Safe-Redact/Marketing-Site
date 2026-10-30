# Staging readiness: OpenRedakt marketing redesign

Date: 2026-10-30 · Scope: Git audit and Netlify staging preparation (**no commits, pushes, branch changes, Netlify changes or deploys were made**)

Labels used throughout:
- **Verified:** confirmed from the repository, a local production build or public HTTP/DNS.
- **Requires confirmation:** cannot be established with the access available (no Netlify CLI, link or token on this machine).
- **Blocking:** must be fixed before the staging deployment.

The only network operations were `git fetch origin` (updates `origin/*` tracking refs only), an unauthenticated read of the public GitHub API, HTTP HEAD requests to the public domains, DNS lookups and `npm audit`.

---

## 1. Current branch status (Verified)

| Item | Finding |
|---|---|
| Working branch | `feat/openredakt-stage-b-features` |
| Upstream | `origin/feat/openredakt-stage-b-features` at `11cc27e` |
| Unpushed commits | 1 local commit, `b7d1fac` (merge of `origin/master`). It brings in `3b36988` and `68b6546`, which are already on `origin/master`. |
| Relation to `origin/master` (`68b6546`) | **0 behind, 3 ahead** (`addbf40` insights revamp, `11cc27e` marketing site revamp, `b7d1fac` merge). Merge base = `origin/master` tip, so the branch contains all of production plus the redesign. |
| Uncommitted work | **114 tracked files changed** (+2,139 / −2,578) and **338 untracked files** (23 source/test/docs/assets, 315 verification screenshots) |
| `origin/staging` | **Does not exist** (`git ls-remote` / fetch) |
| Remote default branch | `origin/HEAD → origin/master` |
| `origin/main` | Stale: 2 commits ("initial setup", "add readme"), an ancestor of `master`, 26 behind. Not a production candidate. |
| Local `master` | 2 behind `origin/master`. Irrelevant: all proposed commands use `origin/master`. |
| Line endings | `core.autocrlf` warnings (LF→CRLF) only. `git diff --check` is clean. |

## 2. Git history findings (Verified)

- The redesign history is linear on top of production. No unrelated commits are mixed in: `addbf40` (insights/blog revamp) and `11cc27e` (marketing revamp) are both part of this redesign line and already on the feature branch's remote.
- Stale local branches (`feat/saferedact-publishing-and-comments` with its upstream gone, `claude/magical-mendeleev-8eb196`) are untouched by this release.
- **The GitHub repository is public** (the unauthenticated API returns 200). Consequences:
  - **Tracked raw masters are already public, in the tip and in history:**
    - `assets/product-screenshots/raw/homepage.png`: local paths, legacy branding, test names.
    - `raw/format-video.png`: third-party broadcast footage with identifiable people.
    - Plus the other raw masters.
  - **`origin/master` still contains the same unapproved images in `public/images/product/`** (9 files, including `format-video.png`, `homepage.png`, `step-open.png`). If production builds `master`, they are publicly served today. This redesign deletes them from `public/`, but history keeps them.
  - Some tracked docs contain local machine paths and internal repository and branch names (`docs/openredakt-*-audit.md`, `docs/design/redesign/*`, `docs/marketing/capability-evidence-register.md`). Low severity; pre-existing.
- **None of the six supplied originals in `M:\site images` exists anywhere in Git history.** Checked by content hash (`git hash-object` + `cat-file -e`) and by path name.

## 3. Proposed staging commit scope

| Category | Files (summary) | Include? |
|---|---|---|
| 1. Homepage and visual design | `src/app/page.tsx`, `src/components/sections/{Hero,ProblemStatement,WhySafeRedact,HowItWorks,Services,InsightsPreview,Faq,Industries,…}`, `src/content/{hero,platform}.ts`, `src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx` (Geist fonts), `cinematic.module.css`; deleted `TrustBar`, `ReviewStatement`, `content/trust-bar.ts` | Yes |
| 2. Navigation and shared layout | `src/components/layout/*` (pill header, mobile nav, dropdowns, footer with invitation), `src/content/navigation.ts`, `src/hooks/useElementInView.ts`, `SupportChatLauncher.tsx`, `not-found.tsx`; deleted `ContextualCta` | Yes |
| 3. Product imagery and masking | `scripts/build-product-images.mjs`, `src/content/media.ts`, `src/components/media/{ProductShot,AppWindow,ProductStoryVisual,Diagrams}.tsx`, `src/components/features/*`, `src/components/industries/*`, `assets/product-screenshots/derived/*` (6 masked masters), `public/images/product/*` (6 added, 9 deleted), `.gitignore` (ignores `assets/product-screenshots/source/`); deleted `src/components/visuals/*` | Yes |
| 4. Pricing and packages | `src/app/pricing/page.tsx`, `src/components/pricing/PricingCards.tsx` (package links to `/book-a-demo?package=`) | Yes |
| 5. Blog/CMS | `src/app/blog/*`, `src/components/blog/*` (editorial cover fallback, styling), `ModerationPanel.tsx` (colour tokens only) | Yes |
| 6. Book a Demo and contact | `src/app/book-a-demo/page.tsx` (new), `src/app/contact/page.tsx`, `src/components/sections/FinalCta.tsx` (shared form, panel variant) | Yes |
| 7. SEO and metadata | `src/content/pages.ts` (book-a-demo SEO), `src/lib/marketing/site-routes.ts` (sitemap/route registry), `src/content/{features,industries}.ts`, `src/lib/marketing/{content,industries}.ts` (video removed from scope) | Yes |
| 8. Tests and documentation | 16 updated test files, new `tests/product-media.test.ts`, deleted `tests/showcase-theme.test.ts`, `package.json` (test list only); `docs/design/{product-visual-audit,homepage-storytelling-revision}.md`, `docs/marketing/product-screenshot-manifest.md`, `assets/product-screenshots/README.md`, this file | Yes (B1 owner-accepted) |
| 9. Dependencies and build configuration | No dependency or lockfile change; `package.json` changes only the test file list. `next.config.ts` and `src/app/robots.ts` gain an opt-in `SITE_NOINDEX` switch for review deployments (unset in production = unchanged), covered by `tests/site-noindex.test.ts` and documented in `.env.example`. | Yes |
| 10. Unrelated or suspicious | No unrelated code changes found. **Exclude** `docs/superpowers/screenshots/2026-10-30-homepage-storytelling/reference-gitbook/` (third-party website captures). | Exclude |
| Verification screenshots | 6 new folders under `docs/superpowers/screenshots/` (≈ 21 MB, 315 files; the repo already tracks 451 such files) | Optional. A separate docs commit is recommended, minus `reference-gitbook/`. |

## 4. Product asset publication safety

| Check | Result |
|---|---|
| Originals not tracked or staged | **Verified.** Absent from Git; `assets/product-screenshots/source/` is ignored. Originals are read in place via `PRODUCT_SCREENSHOTS_SOURCE`. |
| Published assets permanently masked | **Verified.** Six derived masters, flattened RGB, no EXIF/XMP/IPTC/ICC. Masked regions keep 1.8–2.2% of their edge energy; unmasked pixels are unchanged. |
| Fingerprints and allowlist | **Verified.** The pipeline pins each original's SHA-256 and deletes any unlisted file in `public/images/product/`. `tests/product-media.test.ts` checks that served files, the pipeline list and the registry match, along with revisions and crops (4/4 pass). |
| No dark-theme screenshots in public routes | **Verified** in the production build. `hero-document-review.png`, `format-documents.png`, `format-video.png`, `homepage.png` and `step-open.png` all return **404**. |
| All referenced product images resolve | **Verified.** All 6 images referenced across `/`, `/features`, both feature pages, `/how-it-works`, `/why-openredakt`, `/industries` and `/blog` return 200. |
| No video or image-redaction marketing | **Verified.** Content validation and scope tests pass. Video was removed from the content types. |
| Build contains only approved assets | **Verified.** `public/images/product/` holds exactly the 6 registered files. |
| B1 (owner-accepted) | `docs/design/product-visual-audit.md` quotes, in plain text, some names and paths the masks hide. The owner has accepted this for now: the public repository is temporary. The pipeline, registry, manifest and README do not contain them. |

## 5. Secrets and configuration

| Check | Result |
|---|---|
| Secret-pattern scan (`npm run check:secrets`) | **Verified** pass (1,352 files) |
| Env files | **Verified.** `.env.local` is ignored (`.gitignore:36`). Committed `.env.example` and `services/cms-oauth-broker/.env.example` hold placeholders only. |
| Certificates/keys | **Verified.** None tracked |
| Dependency audit (as the release workflow runs it) | **Verified.** 0 vulnerabilities in both packages |
| CSP and security headers | **Verified unchanged.** Per-request nonce CSP from `src/middleware.ts`. The development-only overlay rule in `globals.css` does not relax the policy. |
| Local machine paths | Present in older tracked docs (low severity; see §2). Not present in source or served files. |

## 6. Build and test results (Verified, 2026-10-30)

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | Pass |
| ESLint | No warnings or errors |
| Static tests | 45 / 45 |
| Content tests (incl. product media and `site-noindex`) | 162 / 162 |
| No-index switch, production build | `SITE_NOINDEX` unset: no `X-Robots-Tag`, original `robots.txt` with sitemap. `SITE_NOINDEX=true`: `X-Robots-Tag: noindex, nofollow` on `/`, `/pricing`, `/robots.txt`, `/admin`; `robots.txt` is `Disallow: /`. Nonce CSP present in both. |
| OAuth broker tests | 37 / 37 |
| Product-media pipeline test | 4 / 4 |
| Content validation | Pass (2 article files, 2 feature pages, 11 industry entries, 18 routes) |
| `git diff --check` | Clean |
| Production build (isolated copy, `CMS_ENABLED=false`) | Pass |
| Route and link tests (production server) | 53 / 53 |
| Key routes | `/`, `/features`, `/features/document-redaction`, `/features/audio-redaction`, `/industries`, `/how-it-works`, `/why-openredakt`, `/pricing`, `/blog`, `/book-a-demo`, `/contact`, `/robots.txt`, `/sitemap.xml`, `/moderation` → 200; `/admin` → 307 (CMS disabled) |
| Browser interaction checks (earlier today, same code) | 32 / 32 |
| Accessibility (axe, WCAG 2.2 AA tags) | No violations on the tested pages |

## 7. Netlify configuration findings

| Question | Finding | Status |
|---|---|---|
| Netlify config in the repo | **None.** No `netlify.toml`, `_redirects` or `_headers`, no `.netlify/` link, no Netlify CLI on this machine. | Verified |
| Repository hosting design | **Provider-neutral.** `release.yml` builds a standalone Node bundle on pushes to `master` only (blue-green switch/rollback verification), and `ci.yml` runs on PRs to `master`. Tests **forbid** Netlify references in the workflows, release templates and source (`tests/phase5-infrastructure.test.mjs`, `tests/release-pipeline.test.mjs`). Netlify settings therefore belong in the Netlify UI. Adding a `netlify.toml` is possible but untested against those guards. | Verified |
| What serves `saferedact.io` today | `Server: LiteSpeed`, `X-Powered-By: PHP` behind Cloudflare: **not this Next.js app and not Netlify**. `openredakt.com` does not respond. | Verified |
| Netlify project | **`saferedact-site`**, identified from `netlify[bot]` deploy-preview comments on PRs #7 and #8. `saferedact-site.netlify.app` serves this Next.js app (`Server: Netlify`, nonce CSP). Deploy previews are enabled. The dashboard requires sign-in, so settings could not be read. | Verified (public evidence) |
| 1. Which branch Netlify deploys to production | Probably `master`: `master--saferedact-site.netlify.app` serves the site, while `main--` returns 404. Not confirmed in the dashboard. | Requires confirmation |
| 2. Branch deploys enabled? | Unknown. `staging--saferedact-site.netlify.app` returns 404 (no branch exists yet). | Requires confirmation |
| 3. `staging` configured as a deploy branch? | Unknown (and the branch does not exist yet) | Requires confirmation |
| 4. Can the project build this app? | Locally yes. On Netlify, Next.js 15 runs through Netlify's Next.js runtime. Points to verify on the first branch deploy: `output: "standalone"` under the runtime; the middleware nonce CSP (edge middleware); `next/image` with `localPatterns` and `?v=` revisions; dynamic (`force-dynamic`) rendering. | Requires confirmation |
| 5. Different env vars for staging? | Yes (see §8, §9) | Verified (requirement) |
| 6. Could staging invoke production integrations? | **Yes, observed.** Deploy preview 8 loads the production Chatwoot widget with the same website token as production (fingerprint compared, value not recorded), so integration values are shared beyond Production. Comments are off in both (`/api/comments` returns `disabled`). Lead delivery could not be checked without a real submission. | **Blocking B3** |
| 7. Access protection / no-index | Added an opt-in, provider-neutral `SITE_NOINDEX=true`: `X-Robots-Tag: noindex, nofollow` on every response and `robots.txt` disallowing `/`. Unset (production), headers and `robots.txt` are unchanged. Canonical/OG/sitemap URLs stay hard-coded to `https://saferedact.io` (`src/content/site.ts`). Password protection is a Netlify dashboard setting (plan-dependent). See `netlify-staging-configuration.md`. | Code verified; dashboard requires confirmation |

## 8. Required environment variables (names only)

| Purpose | Names | Recommended for the `staging` branch context |
|---|---|---|
| Build | `NODE_VERSION` (22, matching CI), `CMS_ENABLED` | `CMS_ENABLED=false` |
| Site origin / CMS | `PUBLIC_SITE_ORIGIN`, `CMS_OAUTH_PUBLIC_BASE_URL`, `CMS_OAUTH_AUTH_ENDPOINT`, `CMS_GITHUB_REPOSITORY`, `CMS_PUBLISH_BRANCH`, `CMS_AUTH_SCOPE` | Leave the CMS off on staging. If it is ever enabled there, `CMS_PUBLISH_BRANCH` must **not** be `master`. |
| Lead delivery | `LEAD_DELIVERY_ENDPOINT`, `LEAD_DELIVERY_TOKEN`, `LEAD_DELIVERY_FROM`, `LEAD_DELIVERY_TO`, `LEAD_DELIVERY_TIMEOUT_MS` | Unset (the form then validates and clearly says it was not delivered), or all four pointing at a staging inbox |
| Comments | `COMMENTS_DATABASE_URL`, `COMMENTS_DATABASE_SSL`, `COMMENTS_ABUSE_SECRET`, `COMMENTS_STAFF_GITHUB_USER_IDS` | Unset (comments off), or a separate staging database. Never the production DB. |
| Support chat | `OPENREDAKT_CHATWOOT_ENABLED`, `OPENREDAKT_CHATWOOT_BASE_URL`, `OPENREDAKT_CHATWOOT_WEBSITE_TOKEN` | `OPENREDAKT_CHATWOOT_ENABLED=false`, or a staging inbox token |
| Search indexing | `SITE_NOINDEX` (read at build time) | `SITE_NOINDEX=true`. Never set in production. |
| Docs link | `NEXT_PUBLIC_DOCUMENTATION_URL` | Unset |
| Release metadata | `RELEASE_COMMIT_SHA`, `RELEASE_BUILD_ID` (and legacy `SAFEREDACT_COMMIT_SHA`, `SAFEREDACT_RELEASE_ID`) | Optional |
| OAuth broker (separate service) | `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `OAUTH_*` | Not deployed with the site |

## 9. Form and integration safety (Verified from code)

- **Book a Demo / Contact** post to `/api/contact`. Delivery uses `LEAD_DELIVERY_*` (all four or none; a partial set fails loudly).
  - With none set, the null transport accepts the enquiry and the UI says plainly that it was **not delivered**.
  - On staging this is safe: no emails, webhooks or stored leads.
  - The honeypot and validation stay active.
- **Comments** (`/api/comments`, moderation) are off unless the database URL and abuse secret are both set.
- **Chatwoot** loads only when `OPENREDAKT_CHATWOOT_ENABLED=true`.
- **CMS** (`/admin`) renders only with `CMS_ENABLED=true` and a required publish branch.
- **Analytics:** none found in the source.
- **Recommendation:** scope every integration variable to the **Production** context in Netlify (not "All deploy contexts"), and give the `staging` branch context the values in §8. This keeps forms working on staging, with an explicit "not delivered" notice, without touching production systems. No code change is needed.

## 10. Potential conflicts

- None with `origin/master`: the feature branch is 0 behind, so merging into a `staging` cut from `origin/master` is a fast-forward-equivalent merge with no conflicts.
- Re-check before running: `git fetch origin` then `git rev-list --left-right --count origin/master...HEAD`. If `master` moved, merge `origin/master` into the feature branch first and re-run the checks.

## 11. Deployment steps (proposed; **not executed**). Run manually in PowerShell 7 from the repository root.

Preconditions:
- B3 and B4 confirmed in Netlify, using `netlify-staging-configuration.md`.
- Commits use your own Git identity, with no co-author or AI trailers.
- The repository's `commit-msg` hook (`.githooks/commit-msg`) rejects AI attribution. Do not pass `--no-verify`.

**Inclusion plan (137 paths):**
- 114 tracked changes: 93 modified, 21 deleted.
- 23 new files: 5 source, 2 tests, 6 derived masters, 6 published images, 4 docs.
- Paths: `src`, `tests`, `scripts`, `assets/product-screenshots`, `public/images/product`, `docs/design`, `docs/marketing`, `docs/releases`, `.gitignore`, `.env.example`, `package.json`, `next.config.ts`, `tailwind.config.ts`.

**Exclusion plan:**
- `docs/superpowers/screenshots/2026-10-30-homepage-storytelling/reference-gitbook/` (2 third-party captures): never commit.
- The other 313 verification screenshots: optional, separate commit (step 3).
- Never staged and ignored: `.env.local`, `assets/product-screenshots/source/`, `M:\site images` (outside the repository).
- No tracked file needs reverting.

```powershell
# 0. Re-verify state (read-only). Keep this PowerShell window open: $prodTip is reused in step 7.
git fetch origin
git status --short --branch
$prodTip = git rev-parse origin/master; $prodTip             # expect 68b6546...
git rev-list --left-right --count origin/master...HEAD       # expect 0  3
git ls-remote --heads origin staging                         # expect no output

# 1. Stage the redesign: explicit paths only, no screenshots
git add -A -- src tests scripts assets/product-screenshots public/images/product docs/design docs/marketing docs/releases .gitignore .env.example package.json next.config.ts tailwind.config.ts
git diff --cached --name-only | Select-String -Pattern 'reference-gitbook|docs/superpowers|site images|\.env\.local|product-screenshots/source/'   # must print nothing
(git diff --cached --name-only | Measure-Object).Count       # expect 137
git diff --cached --stat | Select-Object -Last 1

# 2. Commit (your identity; no trailers)
git commit -m "Marketing redesign: homepage story, light product imagery with masking pipeline, book-a-demo, staging no-index switch"

# 3. (Optional) verification screenshots as a separate commit, without third-party captures
git add -- docs/superpowers/screenshots ':(exclude)docs/superpowers/screenshots/2026-10-30-homepage-storytelling/reference-gitbook'
git diff --cached --name-only | Select-String -Pattern 'reference-gitbook'   # must print nothing
(git diff --cached --name-only | Measure-Object).Count       # expect 313
git commit -m "Docs: redesign verification screenshots"

# 4. Re-run checks on the committed tree
npm run typecheck && npm run lint && npm run test:static && npm run test:content && npm run content:validate && npm run check:secrets
git status --short                                           # expect only the reference-gitbook folder (plus screenshots if step 3 was skipped)

# 5. Push the feature branch (fast-forward; no force)
git push origin feat/openredakt-stage-b-features

# 6. Create staging from production and merge the feature branch
git switch --no-track -c staging origin/master
git merge --no-ff feat/openredakt-stage-b-features -m "Merge redesign into staging for review"
git push -u origin staging
git switch feat/openredakt-stage-b-features

# 7. Verify production was not changed
git fetch origin
(git rev-parse origin/master) -eq $prodTip                   # must print True
git log --oneline -1 origin/master
```

Then, in Netlify: confirm a branch deploy started for `staging` only, no production deploy was triggered, and the staging URL serves the redesign.

Smoke-check on the staging URL:
- the key routes from §6
- the six product images, and 404s for the retired ones
- the CSP header present with a nonce
- `/book-a-demo` submission shows "not delivered"
- the chat launcher is absent (or uses a staging inbox)
- `X-Robots-Tag: noindex, nofollow` on responses and `Disallow: /` in `/robots.txt` (requires `SITE_NOINDEX=true` in the staging context)

## 12. Rollback approach

- **Production** is never touched: no command modifies `master`, and `release.yml` runs only on pushes to `master`.
- **Staging build fails:**
  1. Fix on the feature branch, then commit and push.
  2. `git switch staging`, then `git merge --no-ff feat/openredakt-stage-b-features`.
  3. `git push`, then `git switch` back.
- **Staging should return to production's state:** `git switch staging`, then `git revert -m 1 <merge-commit>`, then `git push`. No `reset --hard`, `clean` or force-push.
- **Netlify:** a previous branch deploy can be re-published from the Netlify UI. Deleting the remote `staging` branch is possible later (`git push origin --delete staging`), but only on explicit approval.

## 13. Outstanding items

| ID | Item | Status |
|---|---|---|
| B1 | Masked names, paths and messages quoted in `docs/design/product-visual-audit.md` | Owner-accepted (temporary public repository) |
| B2 | Exclude `docs/superpowers/screenshots/2026-10-30-homepage-storytelling/reference-gitbook/` (third-party captures) | **Blocking** (handled by the commands in §11) |
| B3 | Confirm Netlify environment variables are scoped so the `staging` context cannot reach production lead delivery, the comments database, Chatwoot or CMS publishing to `master` | **Blocking** (deploy) |
| B4 | Confirm that a Netlify project exists for this repository, its production branch, and that branch deploys include `staging` | **Blocking** (deploy) |
| R1 | Confirm Netlify's Next.js runtime handles `output: "standalone"`, the edge-middleware nonce CSP and `next/image` local patterns (first branch deploy) | Requires confirmation |
| R2 | Set `SITE_NOINDEX=true` for the `staging` context and confirm the header on the deployed URL; add dashboard password protection if the plan allows | Requires confirmation |
| R3 | Repository is public, including raw masters in history | Owner-accepted (temporary) |
| R4 | Production `master` currently tracks the unapproved images in `public/images/product/`; if production serves `master`, they are public until this redesign reaches production | Owner awareness |
| R5 | Hosting is not yet decided in the repository (provider-neutral release pipeline). Revisit the force-dynamic CSP and edge-nonce option once Netlify is chosen. | Note |
