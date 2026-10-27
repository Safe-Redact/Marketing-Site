# OpenRedakt current-state audit

Phase D0 · 2026-10-26 · branch `feat/openredakt-stage-b-features` (uncommitted multipage work included)

Baseline screenshots are in `references/openredakt-current/` (dev server, 1440 and 390). Complexity labels: **L** low, **M** medium, **H** high.

## 1. Headline findings

1. **Structure is sound; presentation is flat.** The multipage architecture, registries, SEO and gating are solid. Visually, every page is the same stack of equal-weight dark sections at 96px padding with similar headings, cards and border boxes. Nothing is lit, cropped or prioritised.
2. **The same editor screenshot is everywhere.** The full document-editor frame appears in the homepage hero, workflow step 2, the Documents tab, the Document feature hero, the Insights featured card and the article hero. A full editor at 300–700px is illegible and exposes internal detail.
3. **Primary CTA labels fail contrast (existing defect).** `cn()` drops `text-canvas` from every Button (see §5). Primary buttons render #F7F8FC on #E47755: **2.8:1**, or 2.3:1 on hover. The intended dark label is 6.7:1. Affects every page.
4. **Homepage copy predates the evidence register.** The TrustBar's "Offline on Windows… on-device processing" conflicts with the register rule that OpenRedakt is "not described as universally offline". The audio tab's "sensitive-category analysis" conflicts with BLOCK-AUDIO-AUTO. Both are asserted by existing tests (`phase1-homepage.test.mjs` checks "Offline on Windows"), so changing them needs owner approval and test updates.
5. **Two colour systems coexist.** The live dark tokens (`canvas`, `surface-*`, `ink`, `accent-warm/cool/mint`) sit beside unused legacy palettes (`primary`, `surface`, `accent`, `muted`, `editorial`, `success`, `warning`).
6. **Dead components**: `QualitySecurity`, `SoftwareAlternative` (contains a download URL), `WhyRedaction`, `Card`, `Badge`, `SectionWrapper`, `useActiveSection` (zero importers).
7. **The asset library is small and partly unusable.** Of 7 served screenshots, 1 is prohibited (video), 2 are restricted to existing homepage use, 1 shows the legacy "Safe Redact" brand, and the audio master's provenance is unconfirmed (§4).

## 2. Route inventory

| Route | Layout now | Main components | Visual weaknesses | Assets | Dependencies to preserve | Required change | Cx |
|---|---|---|---|---|---|---|---|
| `/` | Hero (text and workbench screenshot) → TrustBar → Services (4 cards) → HowItWorks (accordion and screenshot) → WhySafeRedact (format tabs) → Industries (3 drawn cards) → FAQ → FinalCta (gradient banner) → DemoEnquiry form. 7,751px | `Hero`, `RedactionWorkbench`, `TrustBar`, `Services`, `HowItWorks`, `WorkflowPreview`, `WhySafeRedact`, `FormatPreview`, `Industries`, `UseCaseVisual`, `Faq`, `FinalCta`/`DemoEnquiry`, `ShowcaseThemeToggle` | Full editor in hero; screenshot reused three times; equal section weight; the bright cyan gradient banner breaks the palette; dead light toggle; two near-duplicate CTAs | hero-document-review, step-open (legacy brand), step-review, step-export (restricted), format-documents/audio/video (video prohibited) | Section anchors `#services`, `#how-it-works`, `#why-saferedact`, `#industries`, `#faq`, `#demo-enquiry`, `#contact`; form semantics and honeypot; tests on hero text | Rebuild composition and copy audit; keep anchors and form | H |
| `/features` | PageHero with CSS signal → ProofByProcess → overview grid → workflow steps → FAQ → CTA | `PageHero`, `ProofByProcess`, `FeatureOverviewGrid`, `FormatWorkflow`, `Accordion`, `ContextualCta` | Text-heavy; the signal panel is a list, not product | None | Feature registry, canonical, breadcrumbs JSON-LD | Restyle; new triptych visual | M |
| `/features/document-redaction` | PageHero with screenshot → at-a-glance → problem → workflow → capability sections → formats and boundary → FAQ → related → industries → CTA | `FeaturePage`, `FeatureMedia`, `CapabilitySections`, `SupportedFormats` | Full editor screenshot; capability sections are text only | format-documents | Claim IDs, boundary note, Insights link | Restyle and focused captures per capability | M |
| `/features/audio-redaction` | Same template | Same | Full audio workspace with local path in status bar; no visual per capability | format-audio (provenance pending) | AUD claims, manual-first note | Same; new range and preview captures | M |
| `/features/video-redaction` | Same template; CSS diagram instead of screenshot | `FeatureMedia` (diagram) | Diagram is honest but generic | None usable | VID claims, no-tracking wording | Needs owned-footage captures | M–H |
| `/industries` | PageHero with directory signal → dimensions → grouped directory → by-media cards → FAQ → CTA | `IndustryCard`, `FormatBadge`, `SectionIntro`, `FaqSection` | Card grid is clean but undifferentiated | None | Registry, groups, live-only gating | Restyle; keep structure | L–M |
| `/industries/*` (9 live) | Hero with sector signal → audience → 3 sections in layout-specific order → considerations → related → FAQ → CTA | `IndustryPage`, `IndustryParts` | Long pages with similar box treatments; no imagery | None | Registry, layout variants, claim lists, breadcrumbs, similarity guard | Restyle; readability first; optional sector art | M |
| `/industries/real-estate`, `/ai-data-teams` | Draft (404) | — | — | — | Draft gating | Design coverage only when promoted | — |
| `/how-it-works` | Hero with stage list → six stages × three formats → responsibilities and boundaries → format links → FAQ → CTA | Page-local markup | Dense table-like stages, no visuals | None | Stage claim IDs | Restyle; stage visuals from focused crops | M |
| `/why-openredakt` | Hero → ProofByProcess → pillars → fit / not fit → evidence → sector chips → FAQ → CTA | Page-local markup | All text | None | Evidence statement | Restyle; diagram | L–M |
| `/blog` | EditorialHero → featured card → search, filters, tags → archive → pagination | `EditorialHero`, `FeaturedArticle`, `ArticleSearch`, `ContentTypeFilter`, `CategoryNavigation`, `TagNavigation`, `ArticleArchive`, `Pagination` | One published article makes it feel empty; featured card reuses the editor screenshot | Article hero (editor screenshot) | CMS loader, search, filters, scheduling, sitemap views | Restyle; cover-image system | L–M |
| `/blog/[slug]` | Breadcrumb, H1, meta, hero image → body with sticky TOC and aside CTA → tags → comments → closing CTA | `ArticleBody`, `ArticleTableOfContents` (scrollspy), `ArticleAsideCta`, `CommentThread`, `CommentForm`, `RelatedStories` | Solid reading layout; hero image is the full editor | CMS media | Scrollspy, heading anchors, comments moderation, CSP nonce | Restyle typography and cover; keep layout | L |
| `/blog/category/[slug]` | Archive variant | Same as `/blog` | — | — | Category routing | Restyle | L |
| `/contact` | Hero → "what to include" strip → DemoEnquiry | `PageHero`, `DemoEnquiry` | Plain | None | `/api/contact`, validation, honeypot, delivery honesty, focus management | Restyle | L |
| `/not-found` | Centred message | `Header`, `Footer` | Plain | None | noindex, no inline styles (CSP) | Restyle | L |
| `/admin`, `/moderation` | Staff tools | Decap CMS, `ModerationPanel` | Out of scope | — | Separate CSP, noindex | **No redesign** | — |

## 3. Technical foundations

| Area | Current state | Assessment |
|---|---|---|
| Tokens (`tailwind.config.ts`) | Dark tokens plus legacy palettes; custom font sizes `display-lg … caption`; radius `panel 16 / card 8 / control 6 / chip 4`; `max-w-content 77rem` (1232px); `py-section 6rem` | Good base; remove legacy palettes; add depth, hairline, glow and format tokens |
| `globals.css` | 315 lines: base, components, utilities, float and pulse keyframes, reveal rules, anchor offsets | Keep reveal and anchor rules; consolidate decorative keyframes |
| Typography | Poppins (headings) + Inter (body) via `next/font` | Keep the pair; restrict Poppins to display sizes; add a system monospace for technical labels |
| Buttons | `Button` with three variants and three sizes, `asChild` | Logic fine; affected by the `cn()` defect |
| Header and nav | `Header` (server) → `SiteHeader` + `NavDropdown` + `MobileNav`; disclosure menus, focus management, inert, scroll lock | Behaviour is better than Raycast's; restyle only |
| Footer | Registry-driven link groups | Restyle |
| Hero | `PageHero` (default and compact title sizes) and homepage `Hero` | Refactor into variants |
| Feature components | `FeaturePage` and small parts | Restyle and add media slots |
| Industry renderer | `IndustryPage` with layout-order variation, `IndustryParts` | Restyle; keep data contract |
| Insights | CMS-driven, scrollspy TOC, search, filters, moderated comments | Restyle only |
| Forms | `DemoEnquiry` (inside `FinalCta.tsx`), `CommentForm` | Restyle; do not touch logic |
| Animation | `AnimateOnScroll` (IntersectionObserver, reduced-motion aware), Tailwind keyframes | Extend with variants; keep the reduced-motion contract |
| Images | `next/image` for product PNGs (1–1.6 MB masters, served through AVIF/WebP); fixed aspect ratios in containers | Good; add art-directed mobile crops |
| Accessibility | Skip link, landmarks, focus rings, menu semantics, form live regions | Strong, apart from CTA contrast |
| SEO | Registries, canonicals, OG, breadcrumbs JSON-LD, gated sitemap, validation | Must remain untouched by the redesign |
| CSP | Per-request nonce, `force-dynamic`, `style-src 'self'` with `style-src-attr 'unsafe-inline'` | Constrains effects: no inline `<style>` blocks; CSS-in-JS is not an option; style attributes are allowed |
| Support chat | Chatwoot ("SafariChat") launcher | Restyle the launcher only |

## 4. Asset inventory

| File | Native size | Status (per manifest) | Problems found in this audit | Verdict |
|---|---|---|---|---|
| `hero-document-review.png` | 1438×859 (the manifest says 3440×1440; mismatch) | Existing homepage use | Full editor; "Permanent export" label in the status bar (wording the claim policy avoids); "AI-assisted" badges | **Interim** only, as a focused crop of the page area |
| `format-documents.png` | 1451×853 | Approved for Stage B reuse | Same frame as the hero; "Permanent export" label | **Reuse** as a source for focused crops until new captures exist |
| `format-audio.png` | 1634×910 | Provenance unconfirmed | Status bar shows a local path (`C:\Users\User\AppData\Local\OfflineRedactor\jobs\…`); transcript reads like a police interview | **Hold** until provenance is confirmed; recapture preferred |
| `format-video.png` | 1327×808 | **Prohibited** | Third-party broadcast watermark, identifiable people | **Do not use** |
| `step-open.png` / `homepage.png` | 1305×857 | Homepage only | Shows the legacy "Safe Redact" brand (the app is now OpenRedakt), test project names (`dlptest-name-ssn-ccn.pdf`) and a OneDrive path | **Replace** |
| `step-review.png` | 1439×855 | Homepage only | Same document frame again | Reuse as a crop source only |
| `step-export.png` | 1048×655 crop | Prohibited for new use | "Permanent removal" wording; failed-export state in the uncropped master | **Replace** |
| `favicon.svg` | vector | In use as logo mark | No full wordmark file; the header composes mark plus text | Need the official logo |
| `public/images/blog/` | empty | — | Article uses a product screenshot as its cover | Needs a cover system |
| `figma-design/screens/*.png` (desktop app repo) | design mockups | Not marketing assets | Mockups, not captures; may not match shipped UI | **Never present as product** |

The app exposes `Theme.Light.xaml` and `Theme.Dark.xaml`. Light captures would make the dormant showcase toggle meaningful, but they double the capture work; see the asset plan.

## 5. The `cn()` / tailwind-merge defect

**Cause.** `cn()` is `twMerge(clsx(...))` with the default tailwind-merge configuration. The project's custom font-size tokens are not registered, so tailwind-merge treats `text-body-sm`, `text-caption`, `text-display` and the rest as **text colours**. Within one `cn()` call, only the last "text colour" survives.

**Reproduced** with the installed package:

| Input | Output |
|---|---|
| `text-body-sm text-white` | `text-white` (size lost) |
| `text-white text-body-sm` | `text-body-sm` (colour lost) |
| `text-display-sm text-display` | `text-display` (expected: also a size-vs-size conflict) |
| `text-sm text-white` | both kept (built-in sizes are recognised) |

**Scope.**
- `Button`: variants supply the colour and sizes supply `text-body*` later, so **every Button loses its text colour**. Confirmed in rendered HTML: primary CTAs ship `bg-accent-warm … text-body-sm` with no `text-canvas`. That is the 2.8:1 contrast defect above.
- Nine static call sites mix a size token with a colour: `ArticleTypeBadge:18`, `CategoryNavigation:29,44`, `CommentForm:96,170`, `ContentTypeFilter:56`, `TagNavigation:35`, `ModerationPanel:226`, `Card:48` (unused).
- The multipage nav and industry components already work around it by keeping sizes outside `cn()`.

**Fix (Phase D1, not now).** Register the tokens once:

```ts
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["display-lg", "display", "display-sm", "heading-xl", "heading-lg", "heading", "heading-sm", "body-xl", "body-lg", "body", "body-sm", "caption"] }] } },
});
```

Verified: `text-body-sm text-white` then keeps both classes. Because this restores colours that currently drop, it changes rendering. Primary buttons get their dark labels back, and the nine call sites regain their sizes or colours. Treat it as a deliberate, screenshot-reviewed change at the start of D1, with a unit test.

## 6. Content and claim notes for the redesign

- The homepage hero, Services, TrustBar and format tabs predate the evidence register. Rewrite them against the register during the homepage rebuild ("Offline on Windows", "sensitive-category analysis", "Detect sensitive information. Redact with confidence.").
- The industry, feature, How It Works and Why pages are register-backed. Redesign must not alter their copy except through the registries.
- The existing tests encode some of this copy; update them in the same change as the copy.
