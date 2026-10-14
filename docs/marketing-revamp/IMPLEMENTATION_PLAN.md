# SafeRedact Reference-Driven Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing SafeRedact homepage with the measured visual language of the Elloe TruthChecker reference while preserving SafeRedact's technology stack, working behaviors, original identity, and verified product content.

**Architecture:** Keep the existing Next.js App Router and content/component separation. Introduce a coherent token layer, evolve the current UI primitives, then migrate page sections into a continuous dark platform narrative with original CSS/SVG product visuals. Preserve the current contact endpoint contract and interactive component boundaries.

**Tech stack:** Next.js 15.5.23 (resolved), React 19.2.8 (resolved), TypeScript 5.9.3, Tailwind CSS 3.4.19, plain React state, inline SVG.

**Spec:** `docs/marketing-revamp/REFERENCE_DESIGN_SPEC.md` and `docs/marketing-revamp/CONTENT_MAPPING.md`

## Global constraints

- Do not change the technology stack or install a UI library.
- Do not copy Elloe code, graphics, logos, copy, or quantitative claims.
- Do not ship unverified compliance, security, retention, accuracy, turnaround, or integration claims.
- Preserve existing anchors, form request shape, FAQ behavior, SEO routes, skip navigation, and reduced-motion handling.
- Keep marketing copy in `src/content/`, not embedded in visual components.
- Use original SafeRedact assets and product visuals.
- Avoid ad hoc one-off CSS patches; extend shared tokens and primitives.
- Do not commit, push, merge, or rewrite history without a separate request.

## Review focus

1. At 768–1023px, navigation must not collide with branding or CTAs; verify the exact collapse behavior.
2. At 320–390px, headings, tab rails, forms, and the original product visual must not overflow horizontally.
3. With JavaScript disabled or animations reduced, all essential copy and controls must remain visible and operable.
4. Contact form success must not be shown if the backend has not actually accepted/delivered the lead.
5. Platform and managed-service content must remain clearly distinguished so product claims do not bleed between offers.

---

## File structure and ownership

### Existing files to modify

- `tailwind.config.ts` — canonical colors, type scale, spacing, shadows, radii, and container width.
- `src/app/globals.css` — canvas, focus states, gradients, motion utilities, reduced-motion rules.
- `src/app/layout.tsx` — approved metadata, font configuration, JSON-LD, social image metadata.
- `src/app/page.tsx` — final section order only.
- `src/content/*.ts` — approved copy and structured section data.
- `src/components/ui/*` — shared visual primitives.
- `src/components/layout/*` — header, mobile menu, footer.
- `src/components/sections/*` — redesigned section compositions.

### Likely files to create

- `src/components/ui/Container.tsx` — one 1232px content-frame implementation.
- `src/components/ui/Eyebrow.tsx` — consistent uppercase section label.
- `src/components/ui/SectionHeading.tsx` — title/copy alignment and width variants.
- `src/components/ui/Accordion.tsx` — accessible reusable disclosure behavior for workflow and FAQ.
- `src/components/visuals/RedactionWorkbench.tsx` — original hero visual.
- `src/components/visuals/WorkflowPreview.tsx` — original section visual with document/media states.
- `src/content/platform.ts` — approved platform capability and workflow data.
- `public/og/saferedact-home.png` — original social share image.

File creation is contingent on the implementation preserving existing patterns; do not create abstractions that only serve one static element.

## Task 1: Approve positioning and claims

**Files:**

- Modify: `docs/marketing-revamp/CONTENT_MAPPING.md`
- Modify: `src/content/*.ts` only after approval

**Interfaces:**

- Consumes: product-owner answers from the content approval checklist.
- Produces: an approved claims matrix and final section copy.

- [ ] **Step 1: Resolve the platform-versus-service hierarchy**

Record whether the primary CTA and hero narrative are software-first, service-first, or dual-path.

- [ ] **Step 2: Resolve blocked product claims**

For each claim in the claims register, mark `approved`, `rewrite`, or `remove` and attach the authoritative source.

- [ ] **Step 3: Freeze homepage copy**

Update the structured content modules without changing component markup.

- [ ] **Step 4: Review content for unsupported absolutes**

Run: `rg -n "guarantee|100%|99\\.|compliant|HIPAA|FISMA|GDPR|GLBA|encrypted|no data retention|one business day" src/content src/components`

Expected: no unapproved match remains.

## Task 2: Establish the SafeRedact design system

**Files:**

- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Create: `src/components/ui/Container.tsx`
- Create: `src/components/ui/Eyebrow.tsx`
- Create: `src/components/ui/SectionHeading.tsx`
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/components/ui/Card.tsx`
- Modify: `src/components/ui/Heading.tsx`
- Modify: `src/components/ui/SectionWrapper.tsx`

**Interfaces:**

- Consumes: token values in `REFERENCE_DESIGN_SPEC.md`.
- Produces: shared `Container`, `Eyebrow`, and `SectionHeading` components plus stable button/card/section variants.

- [ ] **Step 1: Add visual-regression fixtures for primitives**

If a component-test harness is approved, add focused states for buttons, cards, headings, and dark/light section variants. Otherwise add a temporary internal review route excluded from production navigation.

- [ ] **Step 2: Implement semantic tokens**

Define canvas, raised surfaces, borders, primary/secondary text, warm/cool accents, 1232px container, 6/8/16px radii, and shared shadows in Tailwind.

- [ ] **Step 3: Implement fluid typography**

Use `clamp()`-based sizes that land on the measured mobile and desktop endpoints; keep heading line lengths below roughly 18–22 words per line.

- [ ] **Step 4: Migrate primitives**

Update component variants to consume semantic tokens rather than raw color scales.

- [ ] **Step 5: Verify focus and reduced-motion behavior**

Keyboard focus must remain visible on every interactive primitive; animations must collapse under `prefers-reduced-motion: reduce`.

- [ ] **Step 6: Run static checks**

Run: `npm run typecheck && npm run lint`

Expected: both pass with no new warnings.

## Task 3: Redesign site navigation and footer

**Files:**

- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/MobileNav.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/content/site.ts`

**Interfaces:**

- Consumes: final section IDs and `Button`/`Container` primitives.
- Produces: fixed desktop header, accessible drop-down mobile menu, and verified footer destinations.

- [ ] **Step 1: Add navigation behavior tests**

Cover open/close, Escape, focus return, body-scroll restoration, anchor selection, and the 992px/1024px breakpoint decision.

- [ ] **Step 2: Implement the desktop header**

Match the continuous dark canvas, 1232px frame, compact links, outlined secondary action, and coral primary action.

- [ ] **Step 3: Implement the mobile drop-down menu**

Use an in-flow-looking absolute panel below the header, focus trap, Escape close, click-away close, and correct `aria-expanded`/dialog semantics.

- [ ] **Step 4: Rebuild the footer from real destinations**

Remove `href="#"` legal placeholders unless real routes are supplied. Keep the support email and download link.

- [ ] **Step 5: Verify at breakpoints**

Capture and inspect 390×844, 768×1024, 1024×768, and 1440×900.

## Task 4: Build the hero and capability strip

**Files:**

- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/TrustBar.tsx`
- Create: `src/components/visuals/RedactionWorkbench.tsx`
- Modify: `src/content/hero.ts`
- Modify: `src/content/trust-bar.ts`

**Interfaces:**

- Consumes: approved hero copy, `Container`, `Eyebrow`, `Button`, and local icons.
- Produces: responsive split hero and original product-format strip.

- [ ] **Step 1: Add hero geometry assertions**

At 1440px assert a two-column layout inside a 1232px frame; at 390px assert one column, 20px gutters, full-width primary CTA, and no horizontal overflow.

- [ ] **Step 2: Build the original redaction workbench visual**

Use local SVG/CSS: a document canvas, detected-entity highlights, review controls, and redacted output. Do not reproduce the reference chart or use its assets.

- [ ] **Step 3: Implement the capability strip**

Use SafeRedact format icons and labels instead of customer/integration logos.

- [ ] **Step 4: Add restrained entry motion**

Use opacity/translate only, keep duration below 700ms, and render fully visible under reduced motion.

- [ ] **Step 5: Verify image and text performance**

No layout shift, no remote image dependency, and no hero visual larger than necessary.

## Task 5: Recompose the product narrative

**Files:**

- Modify: `src/components/sections/Services.tsx`
- Modify: `src/components/sections/HowItWorks.tsx`
- Modify: `src/components/sections/WhySafeRedact.tsx`
- Modify or replace: `src/components/sections/WhyRedaction.tsx`
- Create: `src/components/visuals/WorkflowPreview.tsx`
- Create: `src/components/ui/Accordion.tsx`
- Create: `src/content/platform.ts`

**Interfaces:**

- Consumes: approved capabilities and design primitives.
- Produces: outcome trio, sparse capability grid, workflow preview/accordion, and format tabs.

- [ ] **Step 1: Add accordion behavior tests**

Assert keyboard activation, one-open behavior if selected, `aria-controls`, `aria-expanded`, and content removal from the accessibility tree while collapsed.

- [ ] **Step 2: Implement non-quantitative outcome trio**

Use `Detect`, `Review`, and `Redact` rather than unsupported statistics.

- [ ] **Step 3: Implement sparse capability grid**

Keep cards/borders minimal and use accent text selectively.

- [ ] **Step 4: Implement workflow media plus accordion**

On desktop use a two-column media/accordion composition; on mobile stack media above the accordion.

- [ ] **Step 5: Implement format tabs**

Desktop tabs fit inline; mobile tabs use a labeled horizontal scroll region with visible overflow cue and keyboard access.

- [ ] **Step 6: Verify content distinctions**

Check that service-only claims are never presented as product capabilities.

## Task 6: Rebuild trust, use cases, FAQ, and conversion

**Files:**

- Modify: `src/components/sections/Industries.tsx`
- Modify: `src/components/sections/QualitySecurity.tsx`
- Modify: `src/components/sections/SoftwareAlternative.tsx`
- Modify: `src/components/sections/Faq.tsx`
- Modify: `src/components/sections/FinalCta.tsx`
- Modify: matching files in `src/content/`

**Interfaces:**

- Consumes: approved claims, shared cards/accordion/button primitives.
- Produces: compliant use-case cards, evidence-based privacy section, accessible FAQ, and dual-path CTA/contact form.

- [ ] **Step 1: Rewrite industry copy as use cases**

Remove compliance guarantees while preserving the existing sectors.

- [ ] **Step 2: Build the security/privacy section**

Only include approved, sourced operational statements and link to a real policy if available.

- [ ] **Step 3: Refactor FAQ onto the shared accordion**

Collapsed answers must not remain exposed to assistive technology.

- [ ] **Step 4: Implement the gradient conversion panel**

Use an original mint-to-blue field, SafeRedact coral secondary action, and 8px outer radius; stack CTAs at mobile widths.

- [ ] **Step 5: Preserve and harden the contact form**

Keep existing field names/request body. Add inline error/status semantics and do not claim successful delivery beyond the API response.

- [ ] **Step 6: Decide backend scope**

If a real lead integration is not separately approved, leave backend integration out of this redesign and clearly document the limitation.

## Task 7: Align SEO and metadata

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/sitemap.ts`
- Create: `public/og/saferedact-home.png`
- Optional create: real legal/privacy routes only if content is supplied

**Interfaces:**

- Consumes: approved positioning and final page copy.
- Produces: consistent platform/service metadata, social preview, and valid structured data.

- [ ] **Step 1: Update title and description**

Use the approved SafeRedact positioning without unsupported guarantees.

- [ ] **Step 2: Align structured data**

Choose `SoftwareApplication`, `Service`, or both only after business-model approval.

- [ ] **Step 3: Add original Open Graph artwork**

Use SafeRedact colors, wordmark, and redaction motif; do not include reference assets.

- [ ] **Step 4: Validate metadata output**

Inspect rendered head, robots, sitemap, JSON-LD validity, social image dimensions, and canonical behavior.

## Task 8: Functional and visual QA

**Files:**

- Modify/create: test files according to the approved harness
- Follow: `docs/marketing-revamp/VISUAL_QA_PLAN.md`

**Interfaces:**

- Consumes: complete redesigned page.
- Produces: signed-off screenshots, regression results, accessibility report, and performance results.

- [ ] **Step 1: Run static verification**

Run: `npm run typecheck && npm run lint && npm run build`

Expected: all pass; document the existing workspace-root and `next lint` warnings until separately resolved.

- [ ] **Step 2: Run functional regression checks**

Verify navigation, anchors, mobile menu, FAQ, download link, mailto link, form validation, API failure state, and API success state.

- [ ] **Step 3: Run accessibility checks**

Test keyboard-only flow, focus order, focus visibility, reduced motion, 200% zoom, semantic headings, form announcements, and contrast.

- [ ] **Step 4: Capture visual baselines**

Capture full-page and above-the-fold shots at 1440×900, 768×1024, 390×844, and 320×568.

- [ ] **Step 5: Compare geometry**

Use the reference for composition/rhythm and the old SafeRedact captures for regression scope. Do not use pixel-perfect overlay as a cloning target.

- [ ] **Step 6: Check performance**

Measure Core Web Vitals/Lighthouse in production mode. Investigate regressions in LCP, CLS, INP, total JS, and image weight.

## Dependencies and risks

| Risk/dependency | Impact | Mitigation |
| --- | --- | --- |
| Product/service positioning is unresolved | Hero, CTA, SEO, and JSON-LD may contradict each other | Approval gate before copy work |
| Product screenshots are absent | Visual fidelity could rely too heavily on decorative mockups | Request current screenshots or build clearly illustrative original UI |
| Strong compliance/security claims are unverified | Legal and trust risk | Claims register and legal/product approval |
| Contact endpoint does not deliver leads | Conversion form can create false confidence | Approve a backend integration separately or make email primary |
| No automated test harness | Interaction regressions can escape | Add the smallest appropriate test setup during implementation, with approval for new dev dependencies |
| Multiple-lockfile workspace warning | Build tracing may include wrong root | Confirm monorepo intent before changing `outputFileTracingRoot` |
| `next lint` deprecation | Future Next.js upgrade will break lint script | Migrate to ESLint CLI as a separate maintenance task or bundle only if approved |
| Long one-page composition | Mobile page can become excessively tall | Consolidate redundant sections and use accordions/tabs intentionally |

## Recommended execution strategy

Use a native, task-by-task implementation in the current repository with one independent review after the complete visual system and page are integrated. The tasks share tokens and section interfaces heavily, so keeping implementation in one continuous context reduces drift. Require explicit approval of content and assets before Task 1 completes.

