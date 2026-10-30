# OpenRedakt Marketing Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task by task. Use `superpowers:test-driven-development` for every behavior change and `superpowers:verification-before-completion` before claiming a stage complete.

**Goal:** Expand the OpenRedakt marketing site into an evidence-backed, editorially strong acquisition system with redesigned Insights, dedicated feature and industry pages, a refined homepage, and coherent SEO—without adding product access, unsupported claims, or regressions to CMS, comments, contact, SafariChat, security, or published URLs.

**Architecture:** Preserve the Next.js App Router marketing architecture and current design tokens. Add typed, allowlisted content registries for feature and industry pages, reusable page-level primitives, and server-derived editorial structures for Insights. Keep Insights in the existing Decap/Markdown pipeline. Reuse the existing demo form and protected integrations. Do not introduce a general page builder, new external service, or new dependency.

**Tech stack:** Next.js 15.5, React 19, TypeScript 5.8, Tailwind CSS 3.4, Decap CMS, React Markdown/remark, Node test runner, `tsx`, and the existing CSP/contact/comments infrastructure.

**Spec:** `docs/superpowers/specs/2026-10-23-openredakt-marketing-revamp-design.md`

## Global constraints

- Do not begin implementation until the design specification and priority decisions are approved.
- Work only on `feat/saferedact-marketing-revamp`, rebased or fast-forwarded from current `origin/master` as agreed with the owner.
- OpenRedakt is always spelled with K in public marketing copy.
- Keep the website marketing-only: no downloads, login, account, free-trial, or application-access CTAs.
- Preserve published article slugs, Markdown rendering, metadata, search, type/category/tag behavior, comments, CMS authentication, moderation, scheduling, SafariChat, contact delivery, CSP, and backend services.
- Do not publish a claim unless it is tied to current application evidence and any required product/legal approval.
- Do not use competitor assets, source, copy, logos, screenshots, or distinctive branding.
- Do not introduce a dependency or third-party embed without a separate decision record and approval.
- Use synthetic or fully owned data in every screenshot. Replace the watermarked video screenshot before publishing the video feature page.
- At the end of every stage, run its focused checks plus the full regression suite and present a review build. Do not roll unapproved stages together.

## Review focus

- **Product:** Capability accuracy, processing-mode language, format caveats, screenshot truthfulness, and verification claims.
- **Legal/security:** Regulatory references, privacy/security statements, sample data, CSP changes, and domain migration.
- **Editorial/SEO:** Unique intent, non-duplicative industry content, titles/descriptions, headings, canonicals, schema, and internal links.
- **Design/accessibility:** Existing token fidelity, responsive hierarchy, keyboard behavior, focus, reduced motion, screen-reader structure, and image legibility.
- **Engineering:** No regression to public routes, CMS lifecycle, comments, contact, SafariChat, build output, or release tests.

---

## Stage 0 — Evidence, information architecture, and shared contracts

### Task 0.1: Create the capability claim register

**Files:**

- Create: `docs/marketing/capability-evidence-register.md`
- Reference: `docs/superpowers/specs/2026-10-23-openredakt-marketing-revamp-design.md`
- Reference read-only: `M:\Safaridesk\redact\README.md`
- Reference read-only: `M:\Safaridesk\redact\src\Core\Redactor.Contracts\DocumentFileFormats.cs`
- Reference read-only: `M:\Safaridesk\redact\src\Core\Redactor.Contracts\MediaFileFormats.cs`

**Steps:**

1. Create a table with stable claim IDs and columns for proposed wording, feature/industry destinations, source-code evidence, reproducible product test, screenshot asset, conditions, owner, legal/product review, and publication status.
2. Seed the register only with claims approved in the design specification: document/image, audio/transcript, video, candidate detection, human review, supported processing modes, output checks, and reports.
3. Mark numeric performance, compliance/certification, universal offline/local-only, generic-object tracking, integrations, collaboration/RBAC, and customer proof as blocked.
4. Link every content registry entry created later to one or more claim IDs.
5. Obtain product and legal sign-off before moving any claim from `draft` to `publishable`.

**Acceptance:** No feature or industry page can render a capability bullet whose claim ID is absent or non-publishable in the approved data snapshot.

### Task 0.2: Add typed marketing-page contracts and validation

**Files:**

- Create: `src/content/features.ts`
- Create: `src/content/industry-pages.ts`
- Create: `src/lib/marketing/content.ts`
- Create: `tests/marketing-content.test.ts`
- Modify: `package.json`

**Data contracts:**

```ts
type ClaimId = string;

type SeoFields = {
  title: string;
  description: string;
  canonicalPath: `/${string}`;
};

type FeaturePageContent = {
  slug: "document-redaction" | "audio-redaction" | "video-redaction";
  eyebrow: string;
  h1: string;
  summary: string;
  seo: SeoFields;
  claimIds: readonly ClaimId[];
  sections: readonly MarketingSection[];
  faq: readonly FaqItem[];
  relatedIndustries: readonly IndustrySlug[];
};

type IndustryPageContent = {
  slug: IndustrySlug;
  publicationStatus: "draft" | "published";
  audience: string;
  h1: string;
  summary: string;
  seo: SeoFields;
  workflows: readonly WorkflowItem[];
  protectedInformation: readonly string[];
  claimIds: readonly ClaimId[];
  relatedFeatures: readonly FeatureSlug[];
  faq: readonly FaqItem[];
};
```

**TDD steps:**

1. Add failing tests for unique slugs, canonical paths matching slugs, one H1 per page record, title/description length guardrails, nonempty workflow-specific copy, valid related-page references, published/draft separation, and allowlisted claim IDs.
2. Add the smallest validators and registries to make the tests pass.
3. Register the new test in `test:content`.
4. Keep healthcare, finance, insurance, and education records in `draft` or omit them until approved; published route generation must read only published records.
5. Refactor repeated validation into `src/lib/marketing/content.ts` without turning the registry into a generic CMS.

**Focused check:**

```powershell
npx tsx --test tests/marketing-content.test.ts
```

### Task 0.3: Establish screenshot provenance and replace unsafe inputs

**Files:**

- Create: `docs/marketing/product-screenshot-manifest.md`
- Modify: `assets/product-screenshots/README.md`
- Future approved assets: `public/images/product/*`

**Steps:**

1. Inventory every active screenshot with source build, scenario, ownership/license, synthetic-data note, demonstrated claim IDs, alt text, viewport, and approval state.
2. Mark `public/images/product/format-video.png` as prohibited for new marketing use because it contains third-party broadcast material.
3. Define synthetic scenarios for document, audio, video, review, report, and output-verification captures.
4. Capture new assets only after design approval; do not modify the desktop application.
5. Run the existing image pipeline and visually inspect compression, legibility, and color treatment.

**Acceptance:** Every rendered product image has a manifest record; no prohibited asset appears in a new page.

### Stage 0 verification and review gate

```powershell
npm run content:validate
npm run typecheck
npm test
```

Stop for approval of claim language, published route inventory, and screenshot direction.

---

## Stage 1 — Insights editorial redesign

### Task 1.1: Add month grouping and heading extraction as pure server utilities

**Files:**

- Modify: `src/lib/blog/types.ts`
- Modify: `src/lib/blog/content.ts`
- Create: `src/lib/blog/headings.ts`
- Create: `tests/insights-editorial.test.ts`
- Modify: `package.json`

**Interfaces:**

```ts
type ArticleMonthGroup = {
  key: `${number}-${string}`;
  year: number;
  month: number;
  label: string;
  articles: readonly BlogArticle[];
};

type ArticleHeading = {
  id: string;
  depth: 2 | 3;
  text: string;
};

export function groupArticlesByMonth(
  articles: readonly BlogArticle[],
): readonly ArticleMonthGroup[];

export function extractArticleHeadings(markdown: string): readonly ArticleHeading[];
```

**TDD steps:**

1. Write failing tests for reverse-chronological year/month grouping, stable labels, year boundaries, filter-result grouping, empty arrays, and deterministic ordering for equal dates.
2. Implement `groupArticlesByMonth` without changing publication filtering.
3. Write failing heading tests for H2/H3 extraction, duplicate IDs, inline formatting, punctuation, non-Latin text, skipped H1/H4, and headings inside fenced code.
4. Implement heading extraction with the already-installed `unified`, `remark-parse`, and `unist-util-visit`; do not add a dependency.
5. Reuse the same slug function when rendering heading IDs and TOC links so they cannot diverge.
6. Register the focused test in `test:content`.

**Focused check:**

```powershell
npx tsx --test tests/insights-editorial.test.ts
```

### Task 1.2: Build the editorial listing primitives

**Files:**

- Create: `src/components/blog/EditorialHero.tsx`
- Refactor: `src/components/blog/FeaturedArticle.tsx`
- Create: `src/components/blog/ArticleArchive.tsx`
- Create: `src/components/blog/ArchiveMonth.tsx`
- Create: `src/components/blog/ArchiveRow.tsx`
- Refine: `src/components/blog/ArticleSearch.tsx`
- Refine: `src/components/blog/ContentTypeFilter.tsx`
- Refine: `src/components/blog/CategoryNavigation.tsx`
- Refine: `src/components/blog/TagNavigation.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/phase4a-routes.test.mjs`
- Modify: `tests/phase4a-content.test.ts`

**TDD steps:**

1. Add failing static/route assertions for a single Insights H1, semantic month H2s, existing search/type/category/tag controls, canonical/filter behavior, only published article data, and no placeholder cards.
2. Implement the editorial hero and month archive using `groupArticlesByMonth`.
3. Refactor the featured story to support either an approved image or a typographic fallback. Keep the current featured selection logic.
4. Preserve search, content type, category, tag, and page query parameters. Do not replace server filtering with client-only filtering.
5. Keep pagination deterministic; grouping occurs after the selected filtered page is resolved unless product review explicitly approves cross-page month continuity.
6. Add result-specific empty state and reset link.
7. Apply current tokens with larger editorial type and whitespace. Do not copy the Cluely palette or geometry exactly.

**Manual checks:**

- One currently visible article yields one real featured/archive outcome with no invented filler.
- Search with no matches gives a resettable empty state.
- Back/forward navigation preserves query state.
- Controls work with keyboard and at 390px without page overflow.

### Task 1.3: Build article metadata, table of contents, and side CTA

**Files:**

- Create: `src/components/blog/ArticleMeta.tsx`
- Create: `src/components/blog/ArticleTableOfContents.tsx`
- Create: `src/components/blog/ArticleAsideCta.tsx`
- Modify: `src/components/blog/ArticleBody.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/phase4a-routes.test.mjs`
- Modify: `tests/insights-editorial.test.ts`

**TDD steps:**

1. Add failing tests that heading IDs match TOC IDs, duplicate headings are unique, short articles omit the TOC, and H1 never appears in the TOC.
2. Render article metadata without inventing avatars or author profiles.
3. Add breadcrumbs, optional approved hero image, and the desktop reading grid.
4. Make the TOC a server-generated list. If active-section enhancement is added, keep links functional without JavaScript and use the existing observer pattern.
5. Add a side CTA that links only to `/#demo-enquiry` and uses article-context wording.
6. Collapse TOC and CTA into normal document flow below desktop width; prevent sticky content from colliding with footer/related content.
7. Preserve React Markdown, GFM, `skipHtml`, safe image paths, safe external links, and existing nonce-aware schema behavior.

### Task 1.4: Complete related stories, comments, and editorial finish

**Files:**

- Create or refactor: `src/components/blog/RelatedStories.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Preserve: `src/components/blog/CommentThread.tsx`
- Modify: `tests/phase4a-content.test.ts`
- Modify: `tests/comments-routes.test.ts` only if route markup assumptions require it

**TDD steps:**

1. Add failing tests for deterministic related-story selection from published content only, excluding the current slug.
2. Prefer same category/type and overlapping tags, with stable date fallback.
3. Hide the module when there are no eligible stories; do not render empty cards.
4. Keep comments after related stories and confirm fail-closed behavior is unchanged.
5. Add the closing demo CTA after editorial content, before the footer.

### Stage 1 verification and review gate

```powershell
npm run content:validate
npm run typecheck
npm run build
npm test
```

Manual review at 390, 768, 1024, and 1440px:

- Listing hierarchy, filtering, empty state, month archive, focus, and scroll behavior.
- Article with and without hero image, with and without TOC, and with no related stories.
- Markdown headings, lists, tables, blockquotes, images, long words, comments, reduced motion, and 200% zoom.
- Existing published article slug, metadata, canonical, and comments API.

Stop for editorial/design approval before feature pages.

---

## Stage 2 — Features overview and core feature pages

### Task 2.1: Add shared marketing page primitives and schema helpers

**Files:**

- Create: `src/components/marketing/PageHero.tsx`
- Create: `src/components/marketing/Breadcrumbs.tsx`
- Create: `src/components/marketing/ProofByProcess.tsx`
- Create: `src/components/marketing/WorkflowSteps.tsx`
- Create: `src/components/marketing/ContextualCta.tsx`
- Create: `src/lib/seo/structured-data.ts`
- Create: `tests/marketing-page-components.test.mjs`
- Create: `tests/structured-data.test.ts`
- Modify: `package.json`

**TDD steps:**

1. Add failing tests for one H1, valid breadcrumb links, demo-only CTAs, optional media, and keyboard-safe semantics.
2. Add failing structured-data tests for canonical absolute URLs, ordered breadcrumb positions, JSON serialization, and absence of unapproved FAQ schema.
3. Implement minimal primitives using existing `Container`, `Eyebrow`, `Button`, `AnimateOnScroll`, and design tokens.
4. Reuse the existing CSP nonce pattern for JSON-LD.
5. Register focused tests in the appropriate existing test scripts.

### Task 2.2: Implement the features overview

**Files:**

- Create: `src/app/features/page.tsx`
- Create: `src/components/features/FeatureOverviewGrid.tsx`
- Create: `src/components/features/FormatWorkflow.tsx`
- Modify: `src/app/sitemap.ts`
- Create: `tests/features-routes.test.mjs`
- Modify: `package.json`

**TDD steps:**

1. Add a failing route test for `/features`, unique metadata, canonical, one H1, links to all three feature pages, demo CTA, and absence of access/download language.
2. Render content from the validated feature registry; do not duplicate page copy in components.
3. Use approved screenshot records only.
4. Add breadcrumbs and matching structured data.
5. Add `/features` to the sitemap and verify unpublished/draft content cannot leak.
6. Register the route test with `scripts/run-route-tests.mjs` or the project’s route-test manifest.

### Task 2.3: Implement document, audio, and video pages through an allowlisted route

**Files:**

- Create: `src/app/features/[slug]/page.tsx`
- Create: `src/components/features/FeaturePage.tsx`
- Create: `src/components/features/CapabilitySections.tsx`
- Create: `src/components/features/SupportedFormats.tsx`
- Modify: `src/content/features.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/features-routes.test.mjs`
- Modify: `tests/marketing-content.test.ts`

**TDD steps:**

1. Add failing tests for the three exact slugs, `notFound()` on unknown slugs, static params from the allowlist, unique title/description/H1, breadcrumbs, relevant feature/industry links, FAQ visibility, and demo-only CTA.
2. Implement `generateStaticParams` and `generateMetadata` from the content registry.
3. Render sections from typed content but keep format-specific visuals concrete; do not make a fully generic page-builder.
4. Render FAQ schema only after content/legal eligibility is approved and only from visible FAQ items.
5. Add only the three approved detail routes to the sitemap.
6. Verify all screenshot alt text and dimensions through the manifest.
7. Ensure the video page cannot reference the prohibited watermarked asset.

### Task 2.4: Add feature-page conversion attribution without changing the backend contract unnecessarily

**Files:**

- Modify only if approved: `src/components/sections/FinalCta.tsx`
- Modify only if approved: `src/lib/leads/types.ts`
- Modify only if approved: `src/lib/leads/contact.ts`
- Modify only if approved: `src/app/api/contact/route.ts`
- Modify only if approved: `tests/contact-route.test.ts`

**Decision:** Default implementation links to `/#demo-enquiry` and makes no backend change. If the owner requires source attribution, add an allowlisted `context` value such as `feature-document`, validate it server-side, and preserve all current abuse controls. Never accept arbitrary hidden metadata.

### Stage 2 verification and review gate

```powershell
npm run content:validate
npm run typecheck
npm run build
npm test
```

Manual product review must reproduce every promoted workflow against the screenshot manifest. Stop for copy, evidence, and visual approval before publishing industry pages.

---

## Stage 3A — Industries overview and first-wave pages

### Task 3.1: Implement the industries overview

**Files:**

- Create: `src/app/industries/page.tsx`
- Create: `src/components/industries/IndustryOverviewGrid.tsx`
- Create: `src/components/industries/FormatIndustryMatrix.tsx`
- Modify/refactor: `src/components/sections/Industries.tsx`
- Modify: `src/app/sitemap.ts`
- Create: `tests/industries-routes.test.mjs`
- Modify: `package.json`

**TDD steps:**

1. Add failing tests for unique metadata/H1, published industry links only, no dead links to draft pages, format matrix semantics, and demo-only CTA.
2. Render the overview from the validated industry registry.
3. Mention second-wave/deferred use cases only as honest overview content without linking to unpublished routes.
4. Refactor the homepage `Industries` section to consume the same display metadata without changing homepage layout yet.
5. Add `/industries` to the sitemap.

### Task 3.2: Implement legal, government/public records, and media/investigations pages

**Files:**

- Create: `src/app/industries/[slug]/page.tsx`
- Create: `src/components/industries/IndustryPage.tsx`
- Create: `src/components/industries/WorkflowProblems.tsx`
- Create: `src/components/industries/ProtectedInformation.tsx`
- Modify: `src/content/industry-pages.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/industries-routes.test.mjs`
- Modify: `tests/marketing-content.test.ts`

**Approved initial slugs:**

- `legal-services`
- `government-public-records`
- `media-journalism-investigations`

**TDD steps:**

1. Add failing tests for exact allowlisted slugs, unknown-slug 404, unique workflow copy, distinct protected-information lists, relevant feature links, unique FAQs, breadcrumbs, and no prohibited claims.
2. Generate params and metadata only from `publicationStatus: "published"` records.
3. Render each page with workflow-specific sections and owned synthetic visuals; avoid identical section copy with noun substitution.
4. Add only these published detail pages to the sitemap.
5. Require product/legal/editorial sign-off in the claim register before changing publication status.

### Task 3.3: Prepare but do not publish second-wave pages

**Files:**

- Modify: `src/content/industry-pages.ts`
- Modify: `docs/marketing/capability-evidence-register.md`
- Create briefs under: `docs/marketing/industry-briefs/`

**Briefs:**

- `healthcare.md`
- `financial-services.md`
- `insurance.md`
- `education-and-research.md`

**Steps:**

1. Record target workflows, search intent, evidence gaps, legal-review questions, and required screenshots from the specification.
2. Keep all records `draft`; route generation, navigation, schema, and sitemap must exclude them.
3. Publish healthcare/finance/insurance only through a future approval stage after evidence and legal review.
4. Do not create an education route until demand and differentiation are demonstrated.

### Stage 3A verification and review gate

```powershell
npm run content:validate
npm run typecheck
npm run build
npm test
```

Compare the three pages side by side. Reject the stage if their workflow, protected data, feature mix, FAQs, and imagery are not substantively distinct.

---

## Stage 3B — Optional regulated-industry expansion

This stage is not part of the initial implementation approval. It begins only after separate approval for each page.

### Task 3B.1: Publish healthcare, finance, or insurance individually

For each candidate:

1. Complete the evidence register and synthetic workflow test.
2. Obtain legal approval for every regulatory reference and security/privacy statement.
3. Change only that content record from `draft` to `published`.
4. Add unique owned media, metadata, FAQ, feature links, and at least one relevant educational link if real content exists.
5. Run content, route, schema, sitemap, accessibility, and full regression checks.
6. Review the page against existing industries for duplication before release.

---

## Stage 4 — Homepage, header, and footer refinement

### Task 4.1: Convert navigation from anchor-first to route-first

**Files:**

- Modify: `src/lib/nav.ts`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/MobileNav.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/hooks/useActiveSection.ts`
- Create or modify: `tests/navigation.test.ts`
- Modify: `tests/phase1-components.test.mjs`
- Modify: `tests/openredakt-routes.test.mjs`

**TDD steps:**

1. Add failing tests for Features, Industries, Insights, How it works, and Request a demo; published child routes only; correct active state across pages; and no app-access destinations.
2. Implement keyboard-accessible desktop dropdowns with button semantics, Escape, focus management, outside-click behavior, and no hover-only dependency.
3. Implement mobile disclosure groups inside the existing focus-trapped dialog.
4. Preserve skip link, mobile inert landmarks, active section behavior on the homepage, and route active states elsewhere.
5. Update footer links from the same published route inventory.

### Task 4.2: Refine homepage message and sequence

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/content/hero.ts`
- Modify: `src/components/sections/Hero.tsx`
- Refactor: `src/components/sections/Services.tsx`
- Refactor: `src/components/sections/WhySafeRedact.tsx`
- Modify: `src/components/sections/HowItWorks.tsx`
- Create: `src/components/sections/FeaturePreview.tsx`
- Refactor: `src/components/sections/Industries.tsx`
- Create: `src/components/sections/InsightsPreview.tsx`
- Create or refactor: `src/components/sections/QualitySecurity.tsx`
- Modify: `src/components/sections/FinalCta.tsx`
- Modify: `tests/phase2-homepage.test.mjs`
- Modify: `tests/phase3-production.test.mjs`

**TDD steps:**

1. Add failing tests for the approved H1, primary demo CTA, secondary features CTA, section order, three formats, four review steps, proof-by-process points, published feature/industry links, and real Insights content only.
2. Update the hero with approved wording and an approved current screenshot.
3. Consolidate overlapping Services/format copy while reusing their components and preserving useful interactions.
4. Present detect → review → export → verify/report as a transparent process, not a guarantee.
5. Add feature and industry previews that link to substantive pages.
6. Add an Insights preview only from actual published content; hide extra slots when unavailable.
7. Keep the existing FAQ and demo form behavior.
8. Limit motion to current observer/CSS patterns and verify reduced motion.

### Task 4.3: Resolve product-image configuration warnings

**Files:**

- Modify: `next.config.*` (whichever current file owns image configuration)
- Modify: `src/components/visuals/showcase-screenshots.ts`
- Modify: `tests/showcase-theme.test.ts`
- Modify: `tests/phase3-production.test.mjs`

**TDD steps:**

1. Add a failing check for the image quality actually used and approved local image patterns, including version-query behavior if retained.
2. Add quality `92` to the Next configuration or normalize images to an existing configured quality.
3. Define versioned local patterns explicitly or remove unnecessary query strings.
4. Confirm build warnings are resolved and light-theme options remain disabled unless approved light screenshots exist.

### Stage 4 verification and review gate

```powershell
npm run content:validate
npm run typecheck
npm run build
npm test
```

Manual regression:

- Header on homepage, article, feature, and industry routes.
- Desktop keyboard menus and mobile focus trap/escape/inert behavior.
- Homepage at target viewports, slow network, disabled JavaScript where appropriate, reduced motion, and long localized-like text.
- Demo form success, validation, rate limit, failure fallback, and SafariChat launcher.

---

## Stage 5 — SEO, schema, internal linking, and editorial integration

### Task 5.1: Add breadcrumbs and controlled FAQ schema

**Files:**

- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/blog/category/[slug]/page.tsx`
- Modify: `src/app/features/page.tsx`
- Modify: `src/app/features/[slug]/page.tsx`
- Modify: `src/app/industries/page.tsx`
- Modify: `src/app/industries/[slug]/page.tsx`
- Modify: `src/lib/seo/structured-data.ts`
- Modify: `tests/structured-data.test.ts`

**TDD steps:**

1. Add failing tests that every breadcrumb schema item maps to a visible breadcrumb and canonical URL.
2. Add failing tests that FAQ schema is absent unless eligibility is explicitly enabled, and that enabled schema exactly matches visible questions/answers.
3. Implement nonce-aware schema output.
4. Recheck existing Article and SoftwareApplication data for visible-content consistency; do not expand claims during this task.

### Task 5.2: Harden canonical, pagination, robots, and sitemap behavior

**Files:**

- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts` only if required
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/category/[slug]/page.tsx`
- Modify: `src/lib/blog/seo.ts`
- Create: `tests/seo-architecture.test.ts`
- Modify: `tests/openredakt-routes.test.mjs`
- Modify: `package.json`

**TDD steps:**

1. Add failing tests for one canonical per indexable route, no query-filter URLs in sitemap, no draft/archived/future content, unique metadata, `noindex` for internal search/tag/pagination states as approved, and unchanged admin/API exclusions.
2. Make blog filter and pagination rules explicit rather than relying on incidental metadata behavior.
3. Keep category landing pages indexable only when approved; mark deeper pagination as `noindex,follow` if adopted.
4. Add only clean, published feature/industry/article/category URLs to the sitemap.
5. Preserve the currently approved canonical host until the domain migration stage.

### Task 5.3: Implement the internal-linking map

**Files:**

- Modify: `src/content/features.ts`
- Modify: `src/content/industry-pages.ts`
- Modify: `src/lib/blog/content.ts`
- Create: `src/components/marketing/RelatedResources.tsx`
- Modify: page templates from Stages 1–3
- Modify: `tests/marketing-content.test.ts`
- Modify: `tests/insights-editorial.test.ts`

**TDD steps:**

1. Add failing tests for valid, reciprocal feature↔industry references and published-only article links.
2. Add related resources only when real published articles qualify; hide empty modules.
3. Add one contextual feature/industry link to each relevant existing article only through an editorially appropriate mechanism; do not rewrite article bodies automatically.
4. Prevent circular card dumps and cap each module to the most relevant destinations.

### Task 5.4: Prepare, but do not execute, the legacy domain migration

**Files:**

- Create: `docs/marketing/domain-migration-runbook.md`
- Modify later only with approval: `src/content/site.ts`, environment templates, metadata configuration, CMS configuration, deployment configuration

**Steps:**

1. Inventory all `saferedact.io`, SafeRedact, support-address, canonical, Open Graph, schema, sitemap, CMS, OAuth, email, and deployment references with `rg`.
2. Record the approved new host, path-preserving redirects, ownership verification, Search Console/Bing verification, certificate/DNS steps, rollback, and monitoring.
3. Do not change any production host in this stage.
4. Execute migration only as a separately approved operational task.

### Task 5.5: Create editorial briefs, not fabricated production articles

**Files:**

- Create: `docs/marketing/editorial-calendar.md`
- Create briefs under: `docs/marketing/editorial-briefs/`

**Steps:**

1. Turn the twelve proposed topics in the specification into briefs with target intent, owning cluster, outline, unique angle, product evidence, legal/product review, internal links, CTA, and status.
2. Do not invent publication dates, authors, customers, research, or finished prose.
3. Evaluate updating `understanding-document-redaction.md` before approving any overlapping definition article.
4. Publish through the existing Decap workflow only after normal review.

### Stage 5 verification and review gate

```powershell
npm run content:validate
npm run typecheck
npm run build
npm test
```

Additionally crawl the local production build and verify status, canonical, robots, H1, title, description, breadcrumb, schema, and internal links for every public route.

---

## Stage 6 — Release-quality verification

### Task 6.1: Functional regression

Verify:

- Homepage section links, feature routes, industry routes, Insights listing, search/type/category/tag/pagination, article pages, comments, and 404s.
- Decap config rendering, editorial workflow, validation, immediate/scheduled/archived lifecycle, image paths, and existing slugs.
- Contact success/failure/rate limiting and email fallback.
- SafariChat enabled and disabled configurations, lazy loading, launcher behavior, and no file uploads.
- Moderation authentication/routes and fail-closed comments.
- CSP/security headers and nonce-bearing JSON-LD.

### Task 6.2: Accessibility and responsive review

At 390, 768, 1024, and 1440px:

- Keyboard-only navigation and visible focus.
- Screen-reader landmarks, page titles, heading hierarchy, breadcrumb labels, forms, status messages, and TOC.
- Mobile menu focus trap, Escape, disclosure state, and inert background.
- 200% and 400% zoom/reflow where applicable.
- Reduced motion, high contrast, image alt text, touch targets, and long titles.
- Sticky rail entry/exit and footer collision.

Fix failures in the owning stage’s components and add regression tests before proceeding.

### Task 6.3: Performance review

- Compare route JavaScript and first-load output with the baseline build recorded during inspection.
- Record LCP/CLS/INP and image transfer at mobile and desktop test profiles.
- Verify responsive image sizes, lazy loading below the fold, font use, and no autoplay media.
- Set an explicit acceptance threshold before implementation begins; any material regression requires a documented reason and approval.

### Task 6.4: Security and content-claim review

- Run `npm run check:secrets` and the full security/static suites.
- Verify no real PII or third-party protected material exists in assets, Markdown, fixtures, or generated output.
- Compare all rendered capability/regulatory statements with the evidence register.
- Verify no download/login/trial/application route or CTA has appeared.
- Verify no new external origin was added to CSP without review.

### Final verification commands

```powershell
npm run check:secrets
npm run content:validate
npm run typecheck
npm run build
npm test
git diff --check
git status --short --branch
```

Do not claim completion from partial output. Record command exit codes and the count of passing tests.

## Release and rollback strategy

1. Keep each major stage independently reviewable. Do not combine Insights, features, industries, and homepage changes into one undifferentiated release.
2. Feature and industry publication is controlled by typed allowlists/publication status so a page can be withheld without deleting components.
3. Preserve old article routes and homepage section anchors during transition.
4. If a new marketing page must be withdrawn, remove it from published content/navigation/sitemap while preserving the rest of the release; add a redirect only if the URL was externally released.
5. Database migrations are not expected. Any discovered need for CMS, comments, contact, or auth migration stops the stage for a separate plan.
6. Domain migration is explicitly outside the normal page release and follows its own runbook.

## Definition of done

- All approved routes and no unapproved routes are public.
- All visible claims are evidence-linked and approved.
- All screenshots are owned/synthetic and provenance-recorded.
- Existing published content, filters, CMS lifecycle, comments, contact, SafariChat, security, and SEO behavior remain functional.
- Feature and industry pages are differentiated, accessible, responsive, and internally linked.
- Homepage routes visitors to the new architecture without repetitive or unsupported copy.
- Full build and regression suite pass, manual target-viewport review is signed off, and release risks are documented.
- No implementation is merged, pushed, or deployed until the owner separately approves that action.
