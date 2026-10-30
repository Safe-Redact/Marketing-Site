# Page-by-page blueprint

Phase D0 · 2026-10-26 · Asset IDs refer to `asset-production-plan.md`; components to `component-reuse-matrix.md`.

**Constraints on every page:** H1, title, description, canonical, breadcrumbs and JSON-LD come from the existing registries and must not change. Section anchors listed below stay. Cinematic treatment is concentrated in heroes and one or two narrative moments per page. Reading-heavy sections stay plain and legible.

---

## 1. Homepage `/`

| # | Section (anchor) | Purpose | Visual concept | Raycast pattern | Components | Assets |
|---|---|---|---|---|---|---|
| 1 | Hero | One promise: prepare documents, audio and video for safer sharing, under review | Navy-deep backdrop; CSS-HERO-BARS; H1 left-aligned over light; a focused document crop in a ProductFrame on the right; primary CTA "Request a Demo" (`#demo-enquiry`), secondary "Explore features" | Canvas light hero (ours is CSS) | PageHero `cinematic`, AmbientLight, ProductFrame, FocusLens | CSS-HERO-BARS, CAP-DOC-01 (interim: crop of `format-documents`) |
| 2 | Format strip (replaces TrustBar) | Route to the three feature pages | Three compact tiles with format-tinted bars | — | New, light | CSS |
| 3 | One review discipline (`#services`) | Three media, one workflow | Triptych: Document, Audio, Video focused crops, each lit in its format colour, linking to its feature page | "Take shortcuts" product frame | ProductFrame ×3 | CAP-DOC-01, CAP-AUD-01, CAP-VID-01 (interims: crop / CSS waveform / Stage B diagram) |
| 4 | Review decisions (`#why-saferedact`) | The core differentiator: humans decide | CapabilityIndex (Candidates → Manual marks → Reasons → Output check) driving FocusLens crops | "What else" index | CapabilityIndex, FocusLens | CAP-DOC-02, CAP-DOC-03, CAP-DOC-05 |
| 5 | Lifecycle (`#how-it-works`) | Six stages at a glance, link to `/how-it-works` | CSS-LIFECYCLE diagram with three lanes; existing step switching | FIG_01 blueprint | FigureDiagram, existing accordion logic | CSS-LIFECYCLE, CAP-PRJ-01, CAP-EXP-01 |
| 6 | Sectors (`#industries`) | Bridge to the Industries hub | Four group cards with CSS-SECTOR-RECORD miniatures | Extension rail (static grid, not a carousel) | IndustryCard (restyled) | CSS-SECTOR-RECORD |
| 7 | Honest boundaries | Trust through stated limits | Calm two-column "What it does / What it does not do", sourced from register wording | — | ProofByProcess (restyled) | None |
| 8 | FAQ (`#faq`) | Objection handling | Plain accordion | — | Faq | None |
| 9 | Closing CTA (`#contact`) and enquiry (`#demo-enquiry`) | Convert | A single redaction bar covering a line of placeholder text, then the existing DemoEnquiry form | Keyboard CTA | ContextualCta (refactored), DemoEnquiry | CSS-HERO-BARS variant |

- **Interaction:** CapabilityIndex as a keyboard tablist; reveal-on-scroll; no autoplay.
- **Mobile:** hero visual moves below the copy as a 4:5 crop; the triptych becomes a vertical stack with bleed crops; the index becomes an accordion with an inline image.
- **Conversion:** hero CTA, triptych cards to feature pages, sectors to `/industries`, closing CTA and form.
- **SEO and content:** the homepage hero, TrustBar and Services copy must be rewritten against the evidence register (see the audit, §6); homepage tests change with them.

## 2. Features overview `/features`

1. **Hero** (`product` variant): centred H1 and summary; below it CSS-FORMAT-MAP or the triptych frame.
2. **Proof by process** strip (restyled).
3. **Three workflow panels**: alternating left/right, each with a focused crop and 3 capability bullets, each linking to its page.
4. **Shared workflow** (`#feature-workflow`): four steps in a horizontal hairline row.
5. **FAQ**, then **CTA**.

- **Reference:** the Raycast AI page (centred hero, window directly below).
- **Assets:** CSS-FORMAT-MAP, CAP-DOC-01, CAP-AUD-01, CAP-VID-01.
- **Mobile:** panels stack, crop first. **Complexity:** M.

## 3–5. Feature pages (Document, Audio, Video)

Keep the Stage B section order; change presentation.

| # | Section | Treatment |
|---|---|---|
| 1 | Hero (`product`) | Centred H1; ProductFrame with the format's hero capture, lit in its format colour |
| 2 | At a glance | Three hairline cells |
| 3 | Problem | Display H2 moment (one per page) |
| 4 | Workflow | Four steps; a range-sweep accent in the format colour |
| 5 | Capability sections ×3 | Alternating text and **one focused crop per section** (the media slot is new) |
| 6 | Formats and capability boundary | Two columns; the boundary card keeps its warm border |
| 7 | FAQ, related features, industries that use this format, CTA | Restyled |

| Page | Hero | Section crops | Motion | Notes |
|---|---|---|---|---|
| Document | CAP-DOC-01 | CAP-DOC-02 · CAP-DOC-03 · CAP-DOC-05 | None | OCR crop (CAP-DOC-04) can join the workflow step |
| Audio | CAP-AUD-01 | CAP-AUD-02 · MOT-AUD-01 · transcript-context crop from CAP-AUD-01 | MOT-AUD-01 (poster first) | The manual-first notice stays prominent; never imply exact transcript alignment |
| Video | CAP-VID-01 (interim: Stage B diagram) | CAP-VID-02 · MOT-VID-01 · CAP-VID-03 | MOT-VID-01 | The no-tracking wording stays; no motion of regions across frames |

**Complexity:** M each; Video is M–H because of its capture dependency.

## 6. Industries hub `/industries`

1. **Hero** (`editorial`): H1 left; CSS-DIRECTORY on the right (sector groups as a lit index).
2. **How needs vary**: four dimensions as a hairline row (exists).
3. **Directory** (`#industry-directory`): group headings plus IndustryCards with CSS-SECTOR-RECORD miniatures and format badges.
4. **By media**: three cards linking to feature pages.
5. **FAQ**, then **CTA**.

- **Readability:** no ambient light below the hero.
- **Mobile:** single column; group headers sticky within their group (CSS `position: sticky`).
- **Complexity:** L–M.

## 7. Industry pages `/industries/[slug]`

Preserve the registry-driven order (`records-led`, `media-led`, `mixed`). The design must make each sector feel specific through **content and signal**, not decoration.

| # | Section | Treatment |
|---|---|---|
| 1 | Hero (`editorial`) | H1 and summary left; CSS-SECTOR-RECORD on the right: the sector's four sensitive categories as rows with bars tinted by the sector's primary media. Optional GEN-SECTOR-PLATE behind it (P3) |
| 2 | Who this is for | Two columns; roles as a hairline list |
| 3–5 | Sensitive / Challenges / Workflows (order by layout) | Sensitive: four plain cards. Challenges: numbered list at reading width. Workflows: per format, a **small focused crop reused from the feature captures** next to the register capability list |
| 6 | Considerations | Warm-bordered panel (exists) |
| 7 | Related, FAQ, CTA | Restyled |

- **Never** add imagery implying customers, institutions or deployments.
- **Reading width:** at most 70ch for paragraphs.
- **Mobile:** workflows show the capability list first and the crop second.
- **Drafts** (`real-estate`, `ai-data-teams`) inherit the same template when promoted.
- **Complexity:** M (one renderer, nine pages).

## 8. How It Works `/how-it-works`

1. **Hero** (`editorial`): H1; CSS-LIFECYCLE as the hero figure (FIG. 1).
2. **Six stages** (`#review-lifecycle`): each stage keeps its three-format comparison (`dl`). Add a sticky FIG. 1 on desktop that highlights the current stage. This is pure CSS sticky plus IntersectionObserver; no scroll-jacking.
3. **Responsibilities / boundaries**: two columns.
4. **Format detail links**, **FAQ**, **CTA**.

- **Assets:** CSS-LIFECYCLE; optionally CAP-PRJ-01 (stage 1), CAP-EXP-01 (stage 5) and CAP-DOC-05 (stage 6) as small crops.
- **Mobile:** sticky figure disabled; small inline stage icons instead.
- **Complexity:** M.

## 9. Why OpenRedakt `/why-openredakt`

1. **Hero** (`editorial`) with CSS-FORMAT-MAP.
2. Proof by process.
3. **Four pillars** as a 2×2 grid with format-tinted top bars.
4. **Fit / not fit**: two columns; the not-fit column is calm, not alarming.
5. **Evidence statement**: display H2 moment, mono "register" detailing.
6. Sector chips, **FAQ**, **CTA**.

- **Assets:** CSS only.
- **Complexity:** L–M.

## 10. Insights `/blog` (and category archives)

1. **Editorial hero**: compact; a visible H1 that names the page (keep the current text H1, unlike Raycast).
2. **Featured article**: split card with GEN-INSIGHT-COVER (left) and title, excerpt and meta (right). Replaces the screenshot cover.
3. **Search, type filter, categories, tags**: one hairline toolbar.
4. **Archive**: three-column cards with covers; mono dates.
5. **Pagination**.

- **Empty-state design:** with one article, show the featured card plus a short "topics we cover" panel linking to features and industries instead of a blank grid.
- **Mobile:** single column.
- **SEO:** filter views remain canonical as today.
- **Complexity:** L–M (plus covers).

## 11. Article `/blog/[slug]`

Keep the layout: breadcrumb, H1, meta, cover, body with sticky TOC and aside CTA, tags, comments, closing CTA.

- **Typography:** 17/30 body, 70ch measure, Poppins H1 (48/56 desktop, 32/40 mobile), Inter H2 and H3.
- **Media:** cover GEN-INSIGHT-COVER; in-body media may break out to 960px with captions (Raycast article pattern).
- **TOC and scrollspy:** behaviour unchanged; restyle the active indicator with a cyan bar.
- **Comments:** field restyle only.
- **Complexity:** L.

## 12. Contact `/contact`

1. **Hero** (`editorial`, compact): H1, summary; CTAs to the form and email.
2. **What to include**: three hairline cells.
3. **DemoEnquiry**: the form on `surface-raised` with a faint coral light at its top edge; field focus in cyan.

- Delivery-status messaging unchanged.
- No ambient motion near the form.
- **Complexity:** L.

---

## Cross-page systems

- **Header and footer:** restyled once (D1) and inherited everywhere.
- **Closing CTA:** one shared composition; its copy varies per page from the registries.
- **Light budget:** at most one AmbientLight per viewport; none on article body or form sections.
- **Performance budget per page:** LCP element is the H1 or the hero crop (≤200 KB AVIF); no layout shift from media (fixed aspect ratios); JavaScript for effects ≤10 KB beyond current client components.
