# OpenRedakt Rebrand and Chatwoot Migration Inspection Report and Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the SafeRedact marketing site to **OpenRedakt** and add a privacy-conscious, brand-specific Chatwoot support experience without changing product claims, the marketing-only architecture, or unrelated application behavior.

**Architecture:** Keep the current Next.js marketing application, design system, Git-backed Insights publishing, contact flow, and provider-neutral release pipeline. Centralize public brand coordinates, migrate user-facing copy and metadata in controlled groups, and integrate a dedicated OpenRedakt Chatwoot website inbox through one root-level client component with exact-origin configuration, a singleton lifecycle, click-to-load behavior, and a direct-contact fallback.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Decap CMS, custom GitHub OAuth broker, Git-backed Markdown, PostgreSQL comments, Chatwoot Website SDK.

**Spec:** User-supplied “OpenRedakt Website Rebranding & Safaridesk Chatwoot Migration — Inspection Only” brief dated 2026-10-21.

## Global Constraints

- The new public brand is **OpenRedakt**, always spelled with a K.
- Preserve the marketing-only rule: no application login, installer, download, or direct desktop-application access in active public CTAs.
- Preserve verified document, image, audio, and video redaction capabilities; do not add certifications, accuracy claims, privacy guarantees, or AI capabilities.
- Do not copy the Safaridesk Chatwoot website token, inbox, visitor records, knowledge base, analytics identifiers, or customer data.
- Do not change technical identifiers, domains, repository ownership, credentials, or deployment settings until their migration decisions are approved.
- Do not alter `M:\Safaridesk\Safaridesk-Home`, `M:\Safaridesk\redact`, or `M:\Safaridesk\control-center` during marketing implementation.
- Preserve the target repository's current uncommitted Phase 1–5 and showcase work.

## Review Focus

- Old-brand leakage in rendered text, accessible names, metadata, structured data, the CMS, comments, screenshots, and fallback/error messages.
- Premature canonical/domain migration that sends crawlers or visitors to an unapproved or unprovisioned OpenRedakt domain.
- Cross-brand Chatwoot leakage caused by reusing the Safaridesk website token, inbox, local-storage namespace, remote knowledge base, or conversation history.
- A CSP change that is broader than the exact Chatwoot script, frame, image, HTTPS API, and WebSocket origins actually required.
- Duplicate widget instances, lost conversation continuity, or inaccessible launcher behavior across App Router navigation and mobile layouts.

---

## 1. Executive summary

### Confirmed

- The target is a Next.js 15.5.27 App Router application on branch `feat/saferedact-publishing-and-comments`, HEAD `b5590f259474bd12d13d0fb596fa0082ac5a64e2`, tracking the same-named `origin` branch. The working tree contains substantial pre-existing, intentional-looking screenshot, showcase, CSP, test, and documentation changes. They must be preserved.
- The reference is a separate Next.js 16.1.6 App Router application on `main`, HEAD `6e6ed5697148da53f6bb7fec04921bd6985c910a`. Its only working-tree item is an untracked `.env`. That file was not read. It is not covered by the reference repository's current `.gitignore`, which is a repository hygiene risk to fix separately.
- Safaridesk uses Chatwoot's **native website widget only**. A single inline loader in `src/app/layout.tsx:116-132` loads the SDK from the Safaridesk Chatwoot host and calls `chatwootSDK.run`. No custom launcher component, wrapper, CSS override, identity bridge, error handler, locale option, or automated Chatwoot test exists in the repository.
- Live inspection of `https://safaridesk.io/en-US` on 2026-10-21 matched the source. It showed a native green lower-right bubble, an English greeting, online/reply-time text, a Start Conversation control, knowledge-base suggestions, and Chatwoot attribution. Those strings and availability are remote inbox settings, not repository copy.
- The live widget loads before a visitor chooses cookie preferences. That behavior should not be copied automatically into OpenRedakt.
- The target has no Chatwoot implementation or equivalent support launcher. Its CSP currently allows only same-origin scripts/connections/images and explicitly sets `frame-src 'none'`, so Chatwoot cannot function until a narrow policy change is made.
- The brand scan found **203 SafeRedact variants across 79 files**, excluding `.git`, `.next`, `node_modules`, environment files, and TypeScript build output. A global replacement would break compatibility-sensitive identifiers.
- There are no active legal, privacy, or cookie-policy routes in the target. Production Chatwoot activation is blocked until appropriate disclosure/destination decisions are approved.

### Recommendation

Use a dedicated OpenRedakt Chatwoot website inbox and token. Add one typed, client-only `SupportChat` integration at the public root layout. Show a small OpenRedakt-styled launcher immediately, but defer the third-party SDK and network connection until the visitor activates chat (or until a future approved consent preference permits it). Then open Chatwoot's native panel through its supported SDK and preserve a mailto fallback when configuration or loading fails.

This keeps the current OpenRedakt visual system, minimizes third-party execution, prevents Safaridesk conversation leakage, and avoids importing Safaridesk's Bootstrap/CSS system.

## 2. Repository architecture comparison

| Concern | Marketing-Site target | Safaridesk-Home reference | Reuse implication |
|---|---|---|---|
| Framework | Next.js 15.5.27, React 19.1, App Router | Next.js 16.1.6, React 19.2, App Router; dormant Vite files remain | Reuse behavior, not source wholesale |
| Styling | Tailwind 3.4; Poppins/Inter; navy/coral/cyan tokens | Bootstrap 5, global CSS files, Remixicon | Do not import source CSS/classes |
| Public routing | `/`, `/blog`, article/category routes; staff `/admin` and `/moderation`; API routes | Localized public routes through `src/proxy.ts`; marketing/auth/studio routes | Target stays English and marketing-only |
| Content | Typed TS modules plus Git Markdown/Decap | TS modules plus Sanity | Chat copy must not be coupled to either CMS |
| SEO | Next metadata, JSON-LD, dynamic sitemap/robots | Metadata manifest, schemas, localized sitemap/robots, llms files | Rebrand target metadata only; retain its SEO model |
| Forms | Honest `/api/contact` delivery adapter; disabled transport returns `delivered: false` | Server proxy to a backend API | Preserve target contact semantics |
| Discussions | Provider-neutral PostgreSQL repository; moderated comments | None found | Chatwoot is support, not a replacement for article comments |
| Authentication | Decap + isolated GitHub OAuth broker; GitHub staff checks | Sanity Studio and public auth pages | Do not connect Chatwoot to CMS or app authentication |
| Security | Per-request CSP nonce; strict `connect-src`, `img-src`, `frame-src`; focused admin CSP | Basic security headers only; no CSP | Target needs a narrow Chatwoot-specific CSP extension |
| Deployment | `output: standalone`; SHA-pinned CI; provider-neutral artifact and blue/green contracts; no automatic production deploy | Docker, private registry, Nginx, Watchtower | Do not copy provider/host assumptions |
| Tests | Typecheck, lint, build, 200+ regression/security tests, release contracts | Lint/build scripts and visual QA captures; no automated Chatwoot tests | Add target-native tests |

### Existing target design to preserve

- Colors: canvas `#080914`, raised surface `#101525`, coral `#E47755`, cyan `#33B7FF`, mint `#55E6D0` (`tailwind.config.ts:7-61`).
- Typography: Poppins headings and Inter body (`src/app/layout.tsx:6-17`, `tailwind.config.ts:63-79`).
- Existing responsive header, accessible mobile navigation, smooth anchor offsets, reduced-motion behavior, product showcase, Insights, contact form, and footer.

## 3. Complete SafeRedact-to-OpenRedakt brand inventory

### A. User-facing references that must change

| Surface | Confirmed locations | Required migration |
|---|---|---|
| Global identity | `src/content/site.ts:3-10`, `src/components/layout/Header.tsx:77-86`, `src/components/layout/Footer.tsx:34-42,80-82` | Name, visible wordmark, home accessible label, footer copyright, tagline/email after approval |
| Navigation/anchors | `src/content/site.ts:12-19`, `src/components/layout/Footer.tsx:7-25`, `src/components/sections/WhySafeRedact.tsx:29-45` | Visible “Why OpenRedakt”; decide whether to retain the old hash as a compatibility alias |
| Homepage copy | `src/content/hero.ts`, `how-it-works.ts`, `platform.ts`, `quality.ts`, `faq.ts`, `final-cta.ts`; section components under `src/components/sections` | Controlled copy migration while preserving capability qualifiers |
| Contact states | `src/components/sections/FinalCta.tsx:50-69,87-100`, `src/lib/leads/contact.ts:154` | OpenRedakt team wording and approved support address; preserve delivered/not-delivered honesty |
| Product alt text | `src/components/visuals/showcase-screenshots.ts:22-79`, `src/content/platform.ts:94-194` | Replace accessible old-brand names without altering screenshot meaning |
| Insights | `src/app/blog/page.tsx:58-72,115-201`, category page, `src/lib/blog/seo.ts:4-53`, `src/components/blog/CommentThread.tsx:46-117` | OpenRedakt titles, publisher, team badges, empty states and category descriptions |
| CMS/editor | `config/decap-cms.yml:15-20,74-77`, `public/admin/index.html:31-35`, disabled config response | OpenRedakt Content Studio copy and byline guidance |
| Published article | `content/blog/understanding-document-redaction.md:7` | Change organizational byline only with editorial approval |
| SEO/schema | `src/app/layout.tsx:26-90`, `src/app/sitemap.ts:9-46`, `src/app/robots.ts:3-15`, `src/lib/blog/seo.ts` | OpenRedakt metadata/Organization publisher and approved canonical origin |
| Accessibility | Header/footer home labels, section/tab labels, screenshot alts, trust-bar label, FAQ prose | Explicit OpenRedakt wording and keyboard/screen-reader regression coverage |
| Staff UI | `src/app/moderation/page.tsx:17`, staff badges and CMS shell | Rebrand staff-facing visible strings |

### B. Technical identifiers to retain temporarily for compatibility

- `WhySafeRedact` file/component names and `#why-saferedact` fragment until a deliberate internal rename and old-fragment compatibility decision.
- npm package names `saferedact-service-landing` and `@saferedact/cms-oauth-broker` until package and lockfile migration is explicitly approved.
- Release health contract and environment names `saferedact-release/v1`, `SAFEREDACT_RELEASE_ID`, and `SAFEREDACT_COMMIT_SHA` until deployment consumers are migrated together.
- Database role/database names `saferedact_app` and `saferedact_comments_dev` until a database migration and grants plan exists.
- OAuth cookie `__Host-saferedact-oauth-state`, broker User-Agent, moderation User-Agent, release artifact prefix, and the CMS validation global. These are non-public but may have operational consumers or active sessions.
- Current feature branch name. Git history must not be rewritten for branding.

### C. External-service or domain decisions required

- Canonical public origin: current hardcoded value is `https://saferedact.io` in layout, sitemap, robots, site config and blog SEO. No OpenRedakt domain has been approved in the repository.
- Support email: current public fallback is `support@saferedact.io`. An OpenRedakt mailbox must exist and be tested before replacing it.
- GitHub owner/repository: `Safe-Redact/Marketing-Site` is enforced by CMS OAuth and comment moderation. Repository renaming is not required for public branding and must not be guessed.
- OAuth App name/callback origins and broker deployment origin require coordinated changes only if domain/repository ownership changes.
- Lead sender/destination addresses, DNS, redirects, social profiles, analytics, and any official OpenRedakt legal entity name remain unapproved.
- A dedicated OpenRedakt Chatwoot website inbox, website token, base origin, agent membership, support hours, knowledge base, retention rules, and escalation owner are required. The Safaridesk values must not be reused.

### D. Historical material to preserve intentionally

- `FINAL_ACCEPTANCE.md`, existing READMEs, security records, and Git history should be updated only where they describe current operations; historical evidence remains in Git.
- `content/blog/cms-publishing-test.md` is archived acceptance content. Keep it excluded from public discovery; decide whether its historical description should retain the old name.
- Test fixtures may retain obviously fictional `.test`/`.example` identifiers when they prove compatibility, but rendered expectations should migrate with public copy.
- Current approved screenshots remain untouched during the website text pass. Recapture them from the actual rebranded desktop application in a later coordinated asset task.

### E. Security-sensitive identifiers not to change blindly

- `.env.local`, the reference repository's untracked `.env`, OAuth client secrets, lead tokens, PostgreSQL URLs, abuse secrets, staff GitHub IDs, TLS key/certificate paths, cookies and GitHub access tokens.
- `CMS_GITHUB_REPOSITORY` and broker repository allowlists because they enforce authorization.
- CSP origins and callback origins because a loose replacement can widen trust or break authentication.

### Visual-asset findings

- `public/favicon.svg` is a generic redaction icon in the current navy/coral palette, not an approved OpenRedakt logo.
- No dedicated Open Graph/Twitter sharing graphic was found.
- `public/images/product/homepage.png` and `step-open.png` visibly contain “Safe Redact”; `step-open.png` also shows a local filesystem path containing the old name. These must be recaptured after the desktop application rebrand, not edited in-place.
- Other product screenshots contain the current application icon and should be reviewed after the desktop brand is final even where no wordmark is visible.
- `assets/product-screenshots/raw` and `public/images/product` both contain locally modified files. Do not regenerate or overwrite them during the website rebrand.

## 4. Safaridesk Chatwoot implementation map

| Source | Lines | Confirmed behavior | Code vs remote |
|---|---:|---|---|
| `M:\Safaridesk\Safaridesk-Home\src\app\layout.tsx` | 116-132 | `next/script` runs after interaction, dynamically adds `<base>/packs/js/sdk.js`, then initializes one website inbox | Code |
| Same file | 119, 126-127 | Base origin and a public website inbox token are hardcoded in client source | Code; token value intentionally omitted here |
| Same root layout | 111-116 | Cookie consent UI and marketing tags mount, but Chatwoot is not gated by their state | Code |
| `src/features/shared/CookieConsentClient.tsx` | 18-89 | Stores necessary/preferences/analytics/marketing choices | Code, but not connected to Chatwoot |
| `src/features/shared/MarketingTagsClient.tsx` | whole file | Applies consent to GTM only | Code |
| `next.config.mjs` | 48-62 | Basic frame/content/referrer/permissions headers; no CSP | Code |
| Live widget | inspected 2026-10-21 | Lower-right native launcher, English greeting, online status/reply estimate, Start Conversation, popular articles, Chatwoot attribution | Chatwoot inbox/installation settings |
| Repository-wide search | n/a | No custom launcher, `window.$chatwoot` calls, `setUser`, metadata, locale settings, lifecycle cleanup, error listener, or widget CSS | Confirmed absence |

### Lifecycle assessment

- The loader is in the App Router root layout, so ordinary client navigation normally preserves it and the Chatwoot iframe/session.
- `next/script` has a stable ID, but the source has no explicit singleton guard. A target implementation should guard both the SDK script and initialization so Fast Refresh, remounts, and test harnesses cannot duplicate it.
- The source relies on Chatwoot/browser storage for anonymous continuity. It does not map a SafariDesk authenticated identity into Chatwoot.
- No repository fallback is shown if the SDK fails. The target should keep the approved support email visible and announce load errors accessibly.
- The live widget was English even on the localized site because the repository sets no locale/browser-language option. OpenRedakt is currently English-only; set `locale: "en"` explicitly rather than inheriting an agent-dashboard default.
- The live inspection stopped before **Start Conversation** to avoid creating a remote conversation. Pre-chat fields, email collection, uploads and conversation-start behavior therefore remain remote-configuration items to verify in a dedicated non-production inbox.

## 5. Source-to-target reuse/adaptation matrix

| Safaridesk feature | Target equivalent | Reuse decision | OpenRedakt adaptation |
|---|---|---|---|
| Native lower-right bubble | None | Adapt behavior | Small OpenRedakt launcher; keep clear of mobile navigation and contact controls |
| Native Chatwoot panel | None | Reuse SDK capability | Dedicated OpenRedakt inbox/token and approved remote branding |
| Root-layout availability | Public root layout exists | Adapt | One client component mounted once; exclude staff `/admin` and `/moderation` unless explicitly wanted |
| Hardcoded base/token | No Chatwoot config | Replace | Validated deployment variables; fail closed when absent |
| Always-load SDK | Strict CSP, no consent UI/legal pages | Replace | Click-to-load by default, or approved consent-category gating later |
| Greeting/availability | Existing contact/demo messaging | Adapt remotely | OpenRedakt wording; never promise availability not backed by staffing |
| Knowledge-base suggestions | Insights exists, but not a support KB | Omit initially | Add only approved support articles; do not point at generic marketing posts as product support |
| Anonymous visitor | Marketing site has no customer login | Reuse | Keep anonymous; do not call `setUser` or send form data automatically |
| English default | English-only target | Adapt | Explicit `en`; future locale mapping only when target adds localization |
| Conversation persistence | No equivalent | Reuse Chatwoot behavior | New OpenRedakt inbox prevents Safaridesk continuity/leakage |
| Error handling | Email fallback exists | Add | Timeout/error state, retry, and approved mailto link |
| Analytics/consent | No target cookie banner | Replace | Do not emit analytics or visitor metadata; document Chatwoot storage and retention |
| Safaridesk colors/icon | OpenRedakt navy/coral/cyan system | Replace | Use approved OpenRedakt icon; retain existing site tokens unless branding approves change |

## 6. Recommended OpenRedakt Chatwoot architecture

### Components and boundaries

- `src/components/support/SupportChat.tsx`: client lifecycle and accessible status/fallback; no business secrets.
- `src/components/support/SupportChatLauncher.tsx`: local button matching existing control tokens, 44px minimum target, clear label and unread/status treatment.
- `src/lib/support/chatwoot-config.ts`: parse and exact-origin validate public base URL and public website token; return disabled state when incomplete.
- `src/types/chatwoot.d.ts`: narrow types for `chatwootSDK`, `$chatwoot`, supported events and methods.
- `src/app/layout.tsx`: mount one integration outside page sections so route changes preserve the iframe/session.
- `src/middleware.ts`: add only the approved Chatwoot HTTPS origin to `script-src`, `connect-src`, `frame-src`, and `img-src`, plus the exact WebSocket origin to `connect-src`; retain nonces, `frame-ancestors 'none'`, and all existing defaults.

### Runtime sequence

1. Render the local launcher without contacting Chatwoot.
2. On activation, verify complete configuration and HTTPS origins.
3. Set approved SDK settings before injecting the script: hidden native bubble if a custom launcher is used, `position: "right"`, `locale: "en"`, browser-language disabled, and an approved theme mode.
4. Reuse an existing marked SDK `<script>` if present; otherwise append one script and attach load/error listeners.
5. Initialize exactly once and listen for `chatwoot:ready` and `chatwoot:error`.
6. Open the native panel only after readiness. Preserve keyboard focus and provide an accessible loading/error status.
7. On failure, leave the site functional and expose the approved direct-contact path.

Chatwoot officially documents `chatwoot:ready`, `chatwoot:error`, locale selection, bubble visibility, custom launchers through `window.$chatwoot.toggle`, and anonymous/identified user APIs in its [Website live chat guide](https://www.chatwoot.com/hc/user-guide/en/categories/website-live-chat) and [SDK visitor-information guide](https://www.chatwoot.com/hc/user-guide/articles/1677587234-how-to-send-additional-user-information-to-chatwoot-using-sdk). The implementation should use only those documented interfaces and must not call `setUser` on this marketing-only site unless a future privacy-reviewed identity source is approved.

### Proposed copy (recommendation, not approved content)

- Launcher accessible label: **“Open OpenRedakt support chat”**
- Expanded launcher text: **“Chat with OpenRedakt”**
- Welcome title: **“How can we help?”**
- Welcome description: **“Ask about supported formats, product evaluation, demos, or an existing OpenRedakt workflow.”**
- Available message: **“Our support team is available.”** only when actual staffing/availability supports it.
- Unavailable message: **“Leave a message and include an email address if you would like a reply.”**
- Suggested remote topics: **Request a demo**, **Supported formats**, **Workflow and setup**, **Existing product support**.

Do not include “secure,” “private,” “confidential,” “always available,” response-time promises, or guaranteed delivery without approved operational evidence.

## 7. Branding and content strategy

1. Approve the exact public brand kit: wordmark/logo, favicon/app icon, palette decision, legal entity, domain, support mailbox and social profiles.
2. Introduce one public-brand configuration for display name, canonical origin and support email. Keep authorization/deployment identifiers separate.
3. Rebrand public navigation, homepage content, contact states, accessibility labels and staff UI while preserving all capability qualifiers.
4. Rebrand metadata, JSON-LD, sitemap, robots, article publisher, CMS labels and approved organizational bylines in the same release as domain cutover.
5. Add old-domain redirects and verify path/query preservation before new canonical tags go live.
6. Recapture product screenshots from the rebranded desktop application. Do not retouch the current approved captures or present edited screenshots as genuine application UI.
7. Update active operational documentation/tests. Preserve historical material through Git rather than duplicating an old site.

## 8. Security, privacy and deployment considerations

- **Dedicated inbox required:** Reusing the Safaridesk token would mix brands, knowledge bases, agents, retention, analytics and potentially anonymous conversation continuity.
- **Public token vs secret:** A website inbox token is necessarily client-visible, but it is still brand/environment-specific. Chatwoot administrative/API tokens remain server-side and are not needed for the widget.
- **Consent:** The recommended click-to-load design avoids any Chatwoot request or storage before intentional activation. Legal review must still decide whether chat storage is necessary, functional, or optional and update privacy/cookie text.
- **Visitor data:** Do not send contact-form values, page content, filenames, query strings, GitHub identity, or desktop-app account data. If identification is added later, use Chatwoot identity validation and explicit privacy review.
- **CSP:** Never replace the current policy with `https:` or wildcard allowances. Exact Chatwoot origins and WebSocket endpoints must be measured in a non-production inbox and contract-tested.
- **Remote content:** Greeting, logo, colors, pre-chat form, business hours, email collection, file uploads, emojis, knowledge-base suggestions, retention and agent availability are inbox/installation settings. Capture their approved configuration in an operational checklist because Git cannot review them.
- **Uploads:** Disable file upload initially unless support has an approved malware handling, retention and sensitive-document policy. Redaction customers are especially likely to upload sensitive source files.
- **Logging:** Do not log message text, email, token, conversation IDs, or SDK payloads in the marketing application.
- **Deployment:** The target remains provider-neutral. Configure public widget coordinates through the selected host environment; no Netlify, Vercel or VPS-specific code is required.
- **Performance:** Load no SDK until activation; then use one asynchronous script. Measure Lighthouse/INP and widget open time separately.

## 9. Implementation sequence

### Task 1: Lock the approved brand contract

**Files:** No code until domain, email and assets are approved.

- [ ] Approve official spelling, logo/wordmark, icon, unchanged-or-new palette, domain, support email, legal entity and social profiles.
- [ ] Decide old-domain redirect duration and whether GitHub repository/package/internal identifiers migrate now or later.
- [ ] Record approved facts in a short brand contract used by tests.

### Task 2: Add rebrand contract tests and centralized public identity

**Files:** Modify `src/content/site.ts`, metadata helpers and existing brand regression tests; add a focused public-brand inventory test.

- [ ] Write failing tests for OpenRedakt rendered text, accessible labels, metadata, JSON-LD, sitemap/robots origin and absence of public SafeRedact variants.
- [ ] Exempt only approved compatibility identifiers and historical fixtures with explicit reasons.
- [ ] Implement centralized display name/origin/support email without coupling them to GitHub, DB, OAuth or release identifiers.
- [ ] Run focused tests, typecheck and lint.

### Task 3: Rebrand active public and staff-visible surfaces

**Files:** Content modules, header/footer, homepage sections, blog/category pages, comments, moderation labels, CMS shell/config, article bylines and related tests.

- [ ] Change public copy in bounded groups with a failing/passing test for each surface.
- [ ] Preserve contact delivery truth, capability qualifiers, marketing-only links and accessibility.
- [ ] Keep inactive legacy download components out of production and avoid reintroducing their CTA.
- [ ] Run the complete regression suite and inspect rendered HTML for old-brand leakage.

### Task 4: Migrate SEO and domain behavior at the approved cutover

**Files:** `src/app/layout.tsx`, `src/lib/blog/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, redirects/deployment configuration and route tests.

- [ ] Test canonical, Open Graph, Twitter, structured data, article publisher, sitemap and robots outputs against the approved origin.
- [ ] Implement old-origin redirects outside application code where appropriate and verify every public route/query.
- [ ] Keep previews/non-production environments non-indexable.

### Task 5: Provision remote OpenRedakt Chatwoot configuration

**Files:** No repository credentials.

- [ ] Create a dedicated website inbox and narrowly authorized staff membership.
- [ ] Approve remote greeting, availability, business hours, pre-chat/email collection, upload policy, knowledge base, retention and branding.
- [ ] Record only the public base origin and website token in the selected non-production environment; keep admin/API credentials outside the website.

### Task 6: Implement the singleton click-to-load integration

**Files:** Create `src/components/support/SupportChat.tsx`, `SupportChatLauncher.tsx`, `src/lib/support/chatwoot-config.ts`, `src/types/chatwoot.d.ts`; modify root layout and CSP middleware.

- [ ] Write failing unit/contract tests for disabled config, exact HTTPS origin, single script/init, click-to-load, ready/error events, keyboard behavior, no `setUser`, and fallback email.
- [ ] Implement the minimal component and SDK loader.
- [ ] Add exact CSP origins verified from non-production network traffic; keep production and admin policies strict.
- [ ] Run typecheck, lint, build, full regression, secret scan and production audit.

### Task 7: Browser and security acceptance

**Files:** Tests and a concise operational checklist only.

- [ ] At 1440×900, 768×1024 and 390×844 verify position, no overlap/overflow, keyboard operation, focus return, close/reopen and reduced motion.
- [ ] Navigate home → Insights → article → home and prove one SDK script, one iframe and continuous conversation state.
- [ ] Verify no network request occurs before activation and no Safaridesk host/token/branding/knowledge content appears.
- [ ] Verify offline/blocked-script behavior and direct-contact fallback.
- [ ] Inspect console, CSP reports, network/WebSocket endpoints, storage/cookies and page performance.

### Task 8: Replace brand assets after application rebrand

**Files:** Approved favicon/logo/social assets and genuine desktop screenshots only.

- [ ] Capture screenshots from the actual OpenRedakt desktop app at the existing aspect ratios/resolutions.
- [ ] Replace both raw and public assets through the approved image workflow without fabricating UI.
- [ ] Update alt text/cache revisions and repeat desktop/mobile visual acceptance.

## 10. Test and browser acceptance plan

### Automated rebrand checks

- Scan built HTML, metadata routes, sitemap, robots, CMS config and public JS for unapproved `SafeRedact`, `Safe Redact`, `Safe-Redact`, `saferedact.io` and old email variants.
- Assert approved exceptions for technical identifiers so the test does not encourage unsafe renames.
- Exercise `/`, `/blog`, a published article, category pages, `/admin`, `/moderation`, contact success/failure and comment staff badges.
- Preserve current content validation, OAuth, comments, lead delivery, security, typecheck, lint, build, regression, dependency-audit and secret-scan gates.

### Automated Chatwoot checks

- No SDK or iframe before activation.
- Missing/invalid configuration fails closed.
- Exact base origin and one public token are used without being logged.
- One script and one initialization across rerenders/navigation.
- Custom launcher has correct role, name, focus treatment and 44px target.
- `chatwoot:ready` opens the widget; `chatwoot:error`, timeout and CSP failure surface an accessible fallback.
- No identity or metadata is sent by default.
- CSP contains only measured origins and does not weaken `default-src`, `object-src`, `base-uri`, `form-action` or `frame-ancestors`.

### Manual matrix

| Viewport | Rebrand | Chatwoot |
|---|---|---|
| 1440×900 | Header/hero/sections/Insights/contact/footer and metadata | Lower-right launcher; open/close; no CTA overlap; navigation continuity |
| 768×1024 | Tablet navigation, cards, forms, article layout | Panel sizing, focus containment/return, orientation resilience |
| 390×844 | Mobile header, tabs, forms, footer, no clipping | Launcher clear of controls; panel usable; keyboard/screen-reader labels; no horizontal overflow |

Test Chrome/Chromium, Firefox, Safari and Edge on the final host because Chatwoot and the target's nonce CSP depend on browser behavior.

## 11. Explicit blockers and business decisions

1. Official OpenRedakt logo, wordmark, favicon and social-preview art do not exist in the inspected repository.
2. Public domain and cutover date are not approved; do not invent `openredakt.*` URLs.
3. OpenRedakt support email, lead sender/destination and legal entity name are not approved/provisioned.
4. Legal/privacy/cookie pages and Chatwoot disclosure/retention basis are absent.
5. A dedicated OpenRedakt Chatwoot website inbox/token, agents, business hours, retention and escalation process do not exist in repository evidence.
6. File-upload policy must be decided; recommendation is disabled initially.
7. Decide whether the GitHub organization/repository, npm packages, health contract, DB names, cookie name and branch naming remain legacy-compatible or migrate in a later operational phase.
8. The desktop application still renders Safe Redact in genuine screenshots; replacement assets depend on its separate rebrand.
9. The reference repository's untracked `.env` is not ignored. Do not add, read, move or commit it during this project; the Safaridesk owner should handle that repository hygiene separately.

## 12. Expected implementation files

### Existing files likely to change

`src/content/site.ts`, homepage content modules, `src/components/layout/Header.tsx`, `Footer.tsx`, relevant section/blog/comment components, `src/app/layout.tsx`, blog metadata/pages, `src/app/sitemap.ts`, `robots.ts`, `src/middleware.ts`, `config/decap-cms.yml`, `public/admin/index.html`, the CMS disabled message, active article bylines, README/acceptance documentation, and their tests.

### New files likely to be added

`src/components/support/SupportChat.tsx`, `src/components/support/SupportChatLauncher.tsx`, `src/lib/support/chatwoot-config.ts`, `src/types/chatwoot.d.ts`, and focused Chatwoot/rebrand tests.

### Files not to copy from Safaridesk

Do not copy `src/app/layout.tsx`, Bootstrap/CSS assets, cookie-consent implementation, localized routing, GTM identifiers, hardcoded Chatwoot token/base values, Safaridesk logo/icon, knowledge-base content, or deployment files.

## Inspection integrity

- No package was installed.
- No application source, asset, environment file, Git branch, remote, Chatwoot setting, desktop application or control-center file was changed.
- No secret-bearing environment file was read.
- The only repository change created by this task is this documentation report.
- No commit, push, merge, rebase or deployment was performed.
