# D2 — Layout-First Website Redesign

Status: implemented in the working tree of `feat/openredakt-stage-b-features`. Nothing committed, pushed, merged, or deployed.
Date: 2026-10-26

The two animated hero prototypes (A and B) stay isolated under `src/app/prototypes/` as dev-only `page.dev.tsx` routes. No page imports them, and production returns 404 for them (verified against the production build).

## 1. What changed

Every public page now uses one page system on the locked Cinematic Precision palette (Midnight `#080B12`, Graphite `#111723`, Elevated `#1A2332`, Coral `#FF735C`, Soft Coral `#FF9D89`, restrained Cyan `#46C7DC` for focus and audio signal only, text `#F5F6F9` / `#ADB6C6`, Border `#344052`).

**Shared rules applied everywhere**

| Rule | Implementation |
|---|---|
| One type scale | `.type-display`, `.type-h1`, `.type-h2` (two-tone headings via `.type-quiet`), `.type-h3`, `.type-lede`, `.type-body`, `.type-eyebrow` (mono, coral), `.type-meta` (mono, muted) in `globals.css` |
| One vertical rhythm | `.section-y` / `.section-y-sm`; sections are separated by a 50%-opacity hairline instead of alternating panel backgrounds |
| Consistent widths | `Container` for every section; copy capped at 18–24ch for headings and ~36rem for body |
| Minimal borders | Lists use hairline rows; grids use the `gap-px` hairline-grid technique; cards only where something is a link target (industry cards) |
| Media framing | `ProductShot` crops the approved capture in CSS with a stable aspect ratio (no layout shift) and optional edge fade; `MediaSlot` frames a labelled diagram with the same frame |
| Buttons | 10px radius; primary is Midnight on Coral (7.37:1); secondary is a ghost with a muted border |
| Form fields | Border at Secondary Text ≥ 55% opacity, Cyan focus ring (demo form and comment form) |
| Decorative glow overflow | `#main-content { overflow-x: clip }` so frame glows never cause horizontal scroll, without breaking sticky columns |

**Homepage order** (`src/app/page.tsx`): header → centred headline with framed static product capture → capability strip → format storytelling (Documents / Audio / Video tabs, stable-height panel) → review-to-redaction workflow (three steps with a sticky visual) → evidence-backed advantages (register pillars) → industry pathways (published guides by sector) → Insights preview → FAQ → contextual demo request with the enquiry form → footer. The old cyan banner above the form is gone; the form section itself is the CTA. The `ShowcaseThemeProvider` wrapper is no longer used on the homepage.

**Features**: `/features` has a centred hero over a three-format strip, alternating format rows, a numbered workflow rail, and FAQ. Each format page has a centred hero with its primary visual and caption, an at-a-glance strip, a problem statement, the workflow rail, alternating capability rows (each with its own visual), supported inputs beside a capability-boundary note, FAQ, related links, and a CTA.

**Industries**: the hub has a directory panel in the hero, a "why sectors differ" rail, the grouped guide directory (cards), and a by-media row with one visual per format. Industry pages keep their controlled section order (records-led / media-led / mixed). Workflows now sit beside a small format visual, and capability lists use hairline rows with the register wording and conditions unchanged.

**How It Works / Why OpenRedakt / Contact**: How It Works has a stage index in the hero, a three-up illustration (stages 01–02, 03–04, 05–06), and six stage rows, each with a document / audio / video breakdown. Why OpenRedakt and Contact use centred text heroes. Contact's form section is identical in behaviour to the homepage one, because it is the same `DemoEnquiry` component.

**Insights**: same structure and behaviour as before, restyled. The hero is smaller, the featured card is shorter (21:10 on desktop, was 2:1) with a coral CTA instead of white pills, chips are rounded rectangles with an elevated active state, search is a quiet field, and the article page has a 21:9 lead image, a restyled aside CTA, and a closing CTA. Search on Enter, category navigation, the featured layout, scrollspy, the hidden TOC scrollbar, related content, moderated comments, the CMS, and every URL are unchanged.

## 2. Screenshots

All captured with headless Chrome against the running dev server at 1920×1080, 1440×900, 1024×900, 768×1024 and 390×844, under `docs/superpowers/screenshots/2026-10-26-d2-redesign/`:

| Folder | Pages | Files |
|---|---|---|
| `home/` | `/` | `home-<width>-fullpage.jpg` at all five widths; `home-<width>-sNN.jpg` per section at every width |
| `features/` | `/features`, document, audio, video | full page at all widths; section shots at 1440 and 390 |
| `industries/` | hub, Legal (records-led), Media & Journalism (media-led), Healthcare | full page at all widths (Healthcare at 1440/390); section shots at 1440 and 390 |
| `pages/` | How It Works, Why OpenRedakt, Contact | full page at all widths; section shots for How It Works at 1440/390 |
| `insights/` | `/blog`, category, article, search results | full page at all widths; section shots at 1440 and 390 |

Desktop/mobile comparison: pair any `-1440-` file with its `-390-` counterpart (for example `home/home-1440-s02.jpg` and `home/home-390-s02.jpg` show the same section). The D1 and Stage B folders hold the "before" captures.

## 3. Reused assets

Only approved captures are published; no new images or video were generated.

| Asset | Status | Used as |
|---|---|---|
| `/images/product/hero-document-review.png` | Approved for homepage | Homepage hero, crop `pageWithFindings` (title bar and "Permanent export" status bar cropped out) |
| `/images/product/format-documents.png` | Approved for Stage B reuse (synthetic financial statement) | Crops `pageWithFindings`, `pageCloseup`, `toolsWide`, and two new 4:3 crops `findingsBeside` (page plus findings list) and `manualBeside` (manual panel plus page). All stop above the status bar. |
| `/images/product/hero-document-review.png` (blog fallback) | Pre-existing behaviour | Featured/lead image for articles without their own image; unchanged logic |

Still excluded (registry comment in `src/content/media.ts`): `format-audio.png` (provenance, local path), `format-video.png` (broadcast watermark, identifiable people), `step-open.png` (legacy branding, test file names, paths), `step-export.png` ("Permanent removal" wording). `/features/audio-redaction` previously showed `format-audio.png`; it now shows a labelled diagram, and its content caption was rewritten to describe the diagram.

## 4. Media replacement slots

Each diagram renders inside a `MediaSlot` with `data-media-slot`, `data-media-status="diagram"`, a visible "Illustration" label, and a fixed aspect ratio. An approved capture can replace it without changing layout.

| Slot | Needed capture | Where it currently appears |
|---|---|---|
| CAP-AUD-01 | Audio range on the waveform with transcript context (synthetic recording) | Homepage format tab "Audio"; `/features` strip and overview; audio hero and first capability row; industries hub; industry audio workflows |
| CAP-AUD-02 | Audio effect choice and preview | Audio "Effect choice" row; second audio workflow on industry pages |
| CAP-VID-01 | Video frame with a region effect over owned footage | Homepage tab "Video"; `/features` strip; video "Timeline control" row; industries hub; industry video workflows |
| CAP-VID-02 | Video candidate list with confirmed and rejected items | `/features` overview video row; video "Visual review" row |
| CAP-VID-03 | Video timeline with visual and audio ranges | Video feature hero |
| CAP-PRJ-01 | Project workspace with synthetic mixed-format projects | Homepage workflow step 1; How It Works stages 01–02 |
| CAP-EXP-01 | Export dialog with output options | Homepage workflow step 3 |
| CAP-DOC-05 | Re-opened output with the output-check result | Document "Output evidence" row; How It Works stages 05–06 |

**Sections that still need approved product media** (highest impact first): the audio and video feature heroes (CAP-AUD-01, CAP-VID-03); the homepage Audio and Video tabs; the homepage workflow steps 1 and 3; the document output-check row; and the How It Works stage illustrations. The industry hero panels and the Insights featured image are deliberately non-product (sector profile motif and article imagery) and need no capture.

## 5. Files

**Added in D2**: `src/content/media.ts`, `src/components/media/{ProductShot,MediaSlot,Diagrams}.tsx`, `src/components/features/FeatureVisual.tsx`, `src/components/sections/InsightsPreview.tsx`, this report, and the screenshot folder.

**Modified in D2**:
- Foundations: `tailwind.config.ts`, `src/app/globals.css`, `src/components/layout/{SiteHeader,NavDropdown,MobileNav,Footer}.tsx`, `src/components/ui/{Button,Eyebrow,Accordion,SectionHeading}.tsx`, `src/components/marketing/{PageHero,SectionIntro,Breadcrumbs,ContextualCta,FaqSection,ProofByProcess,WorkflowSteps}.tsx`
- Homepage: `src/app/page.tsx`, `src/components/sections/{Hero,TrustBar,WhySafeRedact,HowItWorks,Services,Industries,Faq,FinalCta}.tsx`
- Features: `src/lib/marketing/content.ts` (the `FeatureMedia` type now allows only the approved document capture or an audio/video diagram), `src/content/features.ts` (audio media entry), `src/app/features/page.tsx`, `src/components/features/{FeatureMedia,FeatureOverviewGrid,FeaturePage,CapabilitySections,FormatWorkflow,SupportedFormats}.tsx`
- Industries: `src/app/industries/page.tsx`, `src/components/industries/{IndustryPage,IndustryParts}.tsx`
- Supporting pages: `src/app/{how-it-works,why-openredakt,contact}/page.tsx`
- Insights (styling only): `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, and all of `src/components/blog/*` except `ArchiveMonth` and `ArticleTypeBadge`

Not changed: CMS, SEO metadata/canonicals/structured data builders, the contact API and form logic (validation, honeypot, delivery reporting, focus management), comment logic and moderation, SafariChat, middleware/CSP, draft gating, and the desktop application. No tests were edited in D2.

## 6. Verification

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | clean |
| ESLint (`next lint`) | no warnings or errors |
| Static tests | 44/44 |
| Content tests | 153/153 |
| Route tests (production build) | 44/44 |
| OAuth broker tests | 37/37 |
| Content validation | 11 industry entries (9 live, 2 draft), 18 indexable routes |
| Production build | succeeded, in an isolated same-drive copy (removed afterwards) |
| Secret-pattern scan | passed (929 files) |
| `git diff --check` | clean |
| Horizontal overflow | none at any of the five widths on any captured page |
| One `h1` per page, all images with `alt` | yes |
| Behaviour checks (real input events, production server) | 21/21: no console errors on 14 pages, Insights search submits on Enter, TOC scrollspy updates, TOC scrollbar hidden, homepage tabs move with arrow keys and keep a constant panel height, Features dropdown opens on Enter and closes on Escape, `#demo-enquiry` lands below the fixed header |
| Prototypes in production | 404 |

On the dev server the only console errors come from Next.js's own dev overlay, which the site's strict `style-src 'self'` CSP blocks. This is dev-only and absent in production.

## 7. Remaining limitations

- Five slot types still use illustrations instead of product captures (section 4). The page layouts are final, so captures can be swapped in without layout changes.
- Only one Insights article is published. The homepage preview handles one to three articles and the hub's single-item state, but a fuller archive has not been seen with real content. Articles without their own image fall back to the product capture under a scrim; on narrow screens the faint app title bar is visible through it.
- The SafariChat launcher still floats over content at the bottom right on narrow screens. It was not changed, per the restriction.
- `src/components/visuals/*` (the Stage B showcase components) are no longer rendered by any page but are kept, because `tests/showcase-theme.test.ts` exercises them. They can be removed with that test in a later cleanup.
- Screenshots come from headless Chrome emulation, not physical devices, and only the dark theme exists.
- Git reports LF→CRLF notices on some files; these come from the repository's line-ending settings, not from content changes.
