# Component reuse and change matrix

Phase D0 · 2026-10-26

**Classifications:** **REUSE** stays as is · **RESTYLE** visual treatment only · **REFACTOR** restructure while keeping behaviour · **REPLACE** conflicts with the direction · **NEW** does not exist yet.

**Ground rule:** business logic, data contracts, SEO output and accessibility behaviour are frozen. The redesign changes classes, markup structure inside components, and adds presentation components.

## Data, content and SEO (all REUSE)

| System | Files | Why it must not change |
|---|---|---|
| Feature registry and claims | `src/content/features.ts`, `src/lib/marketing/content.ts` | Evidence-linked copy; validated at prebuild |
| Industry registry, groups, gating, similarity guard | `src/content/industries.ts`, `src/lib/marketing/industries.ts` | Publication control and content-quality guards |
| Supporting pages content | `src/content/pages.ts` | Register-backed copy |
| Navigation data | `src/content/navigation.ts` | Single source for header, footer and tests |
| Route registry, sitemap | `src/lib/marketing/site-routes.ts`, `src/app/sitemap.ts`, `robots.ts` | Indexing correctness |
| Metadata, canonicals, OG, JSON-LD | `src/lib/seo/*`, `StructuredData.tsx`, per-route `generateMetadata` | SEO investment; CSP nonce on JSON-LD |
| Insights CMS loader, scheduling, search, filters | `src/lib/blog/*`, `src/app/blog/**` data code | CMS pipeline and publication gating |
| Comments and moderation | `src/lib/comments/*`, API routes, `ModerationPanel` | Moderated workflow; staff surface out of scope |
| Lead capture | `src/lib/leads/*`, `/api/contact`, `DemoEnquiry` logic | Validation, honeypot, delivery honesty |
| CSP and middleware | `src/middleware.ts`, `src/lib/csp.ts` | Security; constrains styling (no inline `<style>`) |
| Support chat | `src/components/support/*`, Chatwoot config | Third-party integration; launcher may be restyled later |

## UI primitives

| Component | Class | Notes |
|---|---|---|
| `lib/utils.ts` `cn()` | **REFACTOR** | Register custom font sizes with `extendTailwindMerge` (see the audit, §5). First task of D1, with unit tests and screenshot review. Fixes the CTA contrast defect. |
| `Button` | **RESTYLE** | API stays (`variant`, `size`, `asChild`). New radius, highlight, glow; dark label restored by the `cn()` fix. |
| `Container` | **REUSE** | Width token unchanged. |
| `Eyebrow` | **RESTYLE** | Switch to mono 12px tracking for technical labels; colour by context. |
| `Icon` | **REUSE** | Inline SVG set; add icons only as needed. |
| `Accordion` | **RESTYLE** | Behaviour and ARIA unchanged; hairline rows, larger hit area. |
| `AnimateOnScroll` | **REFACTOR** | Keep the IntersectionObserver and reduced-motion contract; add `variant` (fade, lift, sweep) and `stagger` props. Existing tests assert its source; update them alongside. |
| `Heading`, `SectionHeading` | **REPLACE** | Legacy light-theme styles (`text-primary-800`). Superseded by the two-tone `SectionIntro`. Remove once unused; one test asserts `Heading.tsx`, so update it in the same change. |
| `Card`, `Badge`, `SectionWrapper` | **REPLACE (delete)** | Zero importers. |
| `hooks/useActiveSection` | **REPLACE (delete)** | Zero importers since the multipage nav; its test assertion must move with it. |

## Layout

| Component | Class | Notes |
|---|---|---|
| `Header` (server) → `SiteHeader` | **RESTYLE** | Floating glass bar; keep the server/client split that keeps registries out of the bundle. |
| `NavDropdown` | **RESTYLE** | Disclosure semantics, hover intent, keyboard and Escape behaviour stay. New panel recipe; optional format-tinted icons. |
| `MobileNav` | **RESTYLE** | Inert, focus trap, scroll lock and grouped disclosure stay. Frosted panel styling. |
| `Footer` | **RESTYLE** | Ambient bar bleed; columns from `footerGroups`. |
| `Breadcrumbs` | **RESTYLE** | Mono 12px, `ink-subtle`. |

## Marketing building blocks

| Component | Class | Notes |
|---|---|---|
| `PageHero` | **REFACTOR** | Becomes variants: `cinematic` (home), `product` (features: centred H1 and a ProductFrame below, after the Raycast AI-page structure), `editorial` (industries, how, why, contact: left-aligned, compact, signal panel optional). Props stay compatible; `titleSize` folds into variants. |
| `SectionIntro` | **RESTYLE** | Becomes the two-tone header (H2 plus muted continuation); keeps `id` for `aria-labelledby`. |
| `ContextualCta` | **REFACTOR** | Closing CTA with the redaction-bar composition; keep the `href` default (`/contact`). |
| `FaqSection` | **RESTYLE** | No FAQPage JSON-LD (unchanged decision). |
| `ProofByProcess` | **RESTYLE** | Three-point strip in hairline style. |
| `WorkflowSteps` | **RESTYLE** | Ordered list semantics stay. |
| `StructuredData` | **REUSE** | |
| ProductFrame | **NEW** | §6 of the specification. Server component; wraps `next/image` with art-directed sources. |
| FocusLens | **NEW** | CSS masks and spotlight overlay; pure CSS, server component. |
| AmbientLight / RedactionBars | **NEW** | Decorative layer; CSS only; reduced-motion aware. |
| CapabilityIndex | **NEW** | Client tablist driving a focused crop; keyboard-operable. Used on the homepage and feature pages. |
| MediaLoop | **NEW** | `<video muted playsInline loop preload="none" poster>`, plays only when in view and reduced motion is off; visible pause control. Needed only once motion assets exist. |
| FigureDiagram | **NEW** | Annotated conceptual diagrams (lifecycle, format map) in SVG and HTML. |

## Homepage sections

| Component | Class | Notes |
|---|---|---|
| `Hero` + `RedactionWorkbench` | **REPLACE** | Full-editor hero conflicts with controlled exposure. New cinematic hero with redaction bars and a focused document crop. Hero copy needs register review (tests assert the current H1). |
| `TrustBar` | **REPLACE** | "Offline on Windows" conflicts with the register. Becomes a format strip linking to feature pages. |
| `Services` | **REFACTOR** | Becomes the format triptych (Documents, Audio, Video), each a focused crop. |
| `HowItWorks` + `WorkflowPreview` | **REFACTOR** | Keep the accordion-driven step switching; replace screenshots (step-open and step-export are unusable). Anchor `#how-it-works` stays. |
| `WhySafeRedact` + `FormatPreview` | **REFACTOR** | Tablist behaviour reused for CapabilityIndex; video tab must not use `format-video.png`. Anchor `#why-saferedact` stays. |
| `ShowcaseThemeProvider` / `ShowcaseThemeToggle` | **REPLACE (remove) or REUSE** | The toggle offers "light" with no light captures. Remove it unless the owner commissions light-theme captures. |
| `Industries` + `UseCaseVisual` | **RESTYLE** | Sector group cards linking to `/industries`; the drawn visual becomes a CSS composition. Anchor stays. |
| `Faq` | **RESTYLE** | Anchor `#faq` stays. |
| `FinalCta` (banner) | **REPLACE** | The bright cyan gradient banner breaks the palette. Replace with the redaction-bar closing composition. |
| `DemoEnquiry` | **RESTYLE** | Field styling only; IDs, labels, honeypot, live regions, focus management unchanged (tests assert them). |

## Feature, industry and support pages

| Component | Class | Notes |
|---|---|---|
| `FeaturePage` | **REFACTOR** | Section order stays; add per-capability media slots (focused crops); hero becomes the `product` variant. |
| `FeatureMedia` | **REFACTOR** | Becomes a ProductFrame plus FocusLens consumer; the video diagram stays until owned footage exists. |
| `CapabilitySections`, `SupportedFormats`, `FormatWorkflow`, `FeatureOverviewGrid` | **RESTYLE** | |
| `IndustryPage` | **RESTYLE** | Keep the layout-order variation and data contract; readability-first editorial styling. |
| `IndustryParts` (`IndustrySignal`, `CapabilityList`, `IndustryCard`, `FormatBadge`) | **RESTYLE** | `IndustrySignal` becomes the sector "record" composition with format-tinted bars. |
| How It Works, Why, Contact page markup | **RESTYLE** | Page-local; add FigureDiagram where specified in the blueprint. |
| `not-found` | **RESTYLE** | Keep CSP-safe markup. |

## Insights

| Component | Class | Notes |
|---|---|---|
| `EditorialHero`, `FeaturedArticle`, `ArticleCard`, `ArchiveRow/Month`, `ArticleArchive`, `Pagination` | **RESTYLE** | Card recipe and cover-art system. |
| `ArticleSearch`, `ContentTypeFilter`, `CategoryNavigation`, `TagNavigation`, `ArticleTypeBadge` | **RESTYLE** | Several hit the `cn()` defect; verify after the fix. |
| `ArticleBody`, `ArticleMeta`, `ArticleAsideCta`, `RelatedStories` | **RESTYLE** | Article typography (17/30, 70ch). |
| `ArticleTableOfContents` (scrollspy) | **REUSE** | Behaviour asserted by tests (scroll-owner boundary); style tokens only. |
| `CommentThread`, `CommentForm` | **RESTYLE** | Field styling only. |
