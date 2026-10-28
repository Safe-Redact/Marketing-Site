# OpenRedakt Pricing and Product Scope Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Market only document and audio redaction and add a clear annual per-license `/pricing` experience with reusable package data and lead context.

**Architecture:** A typed `src/content/pricing.ts` module is the single source of truth for package facts and evidence-backed, package-neutral licensing details. A server-rendered pricing route composes cards, comparison, an accurate Control Center workflow, FAQs, and the existing enquiry section; shared content, navigation, metadata, and the lead schema are aligned with the same two supported workflows.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Node test runner, Zod.

**Spec:** `docs/superpowers/specs/2026-10-28-openredakt-pricing-product-scope-design.md`

## Global Constraints

- Public capability claims are limited to document redaction and audio redaction.
- Package names are exactly Essential, Advanced, and Complete Suite.
- Prices are USD per license, billed annually; monthly values are equivalents only.
- Essential and Advanced are capability-specific and non-cumulative.
- Complete Suite’s `$3,500` amount is proposed and must not look approved.
- Treat one public licence as a named-user seat identified by email inside an organisation.
- Do not publish exact device counts, tier-specific seat counts, support levels, cloud quotas, automatic commercial renewal, checkout, or instant provisioning.
- The Control Center and desktop repositories are read-only references and must remain unchanged.
- Preserve the existing design system, blog/CMS, lead delivery, security headers, responsive behavior, and reduced-motion support.
- Do not commit, push, open a pull request, merge, or deploy.

## Review Focus

- A visitor must not infer that Advanced includes document redaction.
- Proposed Complete Suite pricing must be visible only with an explicit pending-confirmation label and Contact Sales action.
- Direct visits to `/pricing` must have correct canonical metadata and appear in the sitemap.
- Pricing CTA package context and optional license count must survive frontend validation and backend delivery formatting.
- No active public source may advertise image/video redaction, while inactive internal assets can remain unlinked.
- Public copy must not imply that local desktop per-format entitlement enforcement is already complete; the gap belongs in the audit and launch checklist.

---

### Task 0: Control Center licensing and entitlement evidence gate

**Files:**
- Create: `docs/openredakt-control-center-licensing-audit.md`
- Modify: `docs/superpowers/specs/2026-10-28-openredakt-pricing-product-scope-design.md`
- Modify: `docs/superpowers/plans/2026-10-28-openredakt-pricing-product-scope.md`

**Interfaces:**
- Consumes: read-only Control Center domain, services, APIs, UI, tests, documentation, and the desktop licensing consumer.
- Produces: an evidence matrix separating implemented behavior, incomplete enforcement, approved packaging, and launch gaps; a bounded set of public licensing claims.

- [ ] Record the Admin Panel and desktop Git HEAD/status before inspection and keep both repositories unchanged.
- [ ] Trace licence types, entitlements, seats, devices, roles, activation, subscription terms, and lifecycle behavior through implementation and tests.
- [ ] Trace `Document` and `Audio` flags from catalogue to seat, token, server enforcement, and desktop workflow entry points.
- [ ] Write the evidence matrix, public exclusions, proposed package mapping, and Control Center/desktop launch work with file-and-line references.
- [ ] Add source/route assertions for the allowed licensing claims and disallowed unsupported promises before changing page copy.

### Task 1: Product and pricing contract tests

**Files:**
- Create: `tests/pricing-product-scope.test.mjs`
- Modify: `scripts/run-route-tests.mjs`

**Interfaces:**
- Consumes: rendered homepage, `/pricing`, `/sitemap.xml`, and active source modules.
- Produces: acceptance coverage for the two-format product scope, pricing facts, route behavior, and CTA context.

- [ ] Write static assertions for centralized package data, exact annual/monthly figures, non-cumulative capabilities, proposed Complete price status, navigation, sitemap source, and disallowed public claims.
- [ ] Add route assertions for the pricing hero, three packages, comparison table, annual billing disclosure, proposed-price disclosure, enquiry form, and sitemap URL.
- [ ] Run `node --test tests/pricing-product-scope.test.mjs` and confirm it fails because the pricing module/route and scope changes are absent.

### Task 2: Central pricing data and page

**Files:**
- Create: `src/content/pricing.ts`
- Create: `src/app/pricing/page.tsx`
- Create: `src/components/pricing/PricingCards.tsx`
- Create: `src/components/pricing/PricingComparison.tsx`
- Create: `src/components/pricing/PricingFaq.tsx`

**Interfaces:**
- Produces: `pricingPackages`, `pricingComparison`, `pricingLicensingSteps`, `pricingFaqs`, and `PricingPackageSlug`; a server-rendered `/pricing` route.

- [ ] Define typed immutable package data with exact prices, monthly equivalents, capabilities, CTA labels, and proposed status.
- [ ] Implement pricing metadata, hero, card grid, comparison table, verified Control Center licensing workflow, FAQ, and final enquiry section using existing UI primitives.
- [ ] Add package-neutral rows for one-year term, named-user assignment, customer owner/admin licence management, and quote-confirmed device allowances without inventing tier differences.
- [ ] Ensure Complete Suite uses Contact Sales and labels `$3,500`/`$291.67` as proposed, pending confirmation.
- [ ] Run the focused test and make the pricing assertions pass.

### Task 3: Public product-scope alignment

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/content/site.ts`
- Modify: `src/content/hero.ts`
- Modify: `src/content/trust-bar.ts`
- Modify: `src/content/platform.ts`
- Modify: `src/content/faq.ts`
- Modify: `src/content/final-cta.ts`
- Modify: `src/content/services.ts`
- Modify: `src/content/how-it-works.ts`
- Modify: `src/content/quality.ts`
- Modify: `src/content/software.ts`
- Modify: `src/content/why-saferedact.ts`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `tests/phase1-homepage.test.mjs`

**Interfaces:**
- Consumes: existing home sections and shared layout.
- Produces: document/audio-only public marketing copy and a Pricing route link on desktop/mobile/footer.

- [ ] Rewrite active metadata, JSON-LD, homepage, FAQ, and footer copy to document/audio only.
- [ ] Reduce format tabs to Documents and Audio while retaining keyboard behavior and existing screenshots.
- [ ] Add Pricing to shared navigation/footer and align inactive marketing content modules to prevent later regression.
- [ ] Update the existing homepage acceptance assertions and run focused tests to green.

### Task 4: Lead package and license context

**Files:**
- Modify: `src/components/sections/FinalCta.tsx`
- Modify: `src/content/final-cta.ts`
- Modify: `src/lib/leads/contact.ts`
- Modify: `src/lib/leads/types.ts`
- Modify: `src/lib/leads/transports/https-email.ts`
- Modify: `tests/contact-route.test.ts`
- Modify: `tests/lead-delivery.test.ts`

**Interfaces:**
- Consumes: optional `package` query parameter and form fields.
- Produces: validated `packageInterest` plus optional integer `licenseCount` in the existing lead enquiry payload and email body.

- [ ] Write failing route/domain tests for accepted package values, license bounds, invalid values, and transport formatting.
- [ ] Add package and license controls to the existing form, preselecting from a safe pricing query parameter.
- [ ] Extend strict Zod validation and delivery types without weakening abuse, size, or fail-closed behavior.
- [ ] Run contact and delivery tests to green, then run the full content test group.

### Task 5: SEO, sitemap, and route acceptance

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `scripts/run-route-tests.mjs`
- Modify: `tests/marketing-only.test.mjs`

**Interfaces:**
- Consumes: `/pricing` route and existing dynamic sitemap.
- Produces: canonical searchable pricing URL and route-level regression coverage.

- [ ] Add `/pricing` with appropriate priority/change frequency without disturbing blog entries.
- [ ] Add the pricing test to production route test execution and update navigation-target expectations.
- [ ] Build, run route tests, and confirm homepage, pricing, blog, and sitemap behavior.

### Task 6: Full verification and visual QA

**Files:**
- Create: `docs/openredakt-pricing-audit.md`
- Create: `docs/openredakt-control-center-licensing-audit.md`
- Create: pricing screenshots under `docs/openredakt-pricing-acceptance-screenshots/`.

**Interfaces:**
- Produces: concise final audit, desktop/mobile screenshots, and fresh automated evidence.

- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run check:secrets`, and `npm run build` with full outputs checked.
- [ ] Run the production app and inspect `/`, `/pricing`, mobile navigation, CTA package context, and horizontal overflow at desktop, tablet, and mobile sizes.
- [ ] Capture desktop and mobile pricing screenshots and record the remove/rewrite/retain/redirect audit.
- [ ] Re-check `git status --short` and HEAD in `M:\Safaridesk\Admin-panel` and `M:\Safaridesk\redact` to prove the reference repositories stayed unchanged.
- [ ] Inspect `git diff --check`, `git diff --stat`, and `git status --short --branch`; do not commit.
