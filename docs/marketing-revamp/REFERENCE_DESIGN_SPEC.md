# Elloe TruthChecker Reference Design Specification

Source: `https://www.elloe.ai/platform/truthchecker`
Inspection date: 2026-10-13
Purpose: extract a reusable visual grammar for an original SafeRedact implementation.

## Method and limits

The live page was inspected in a browser at three explicit viewport sizes:

- Desktop: 1440×900
- Tablet: 768×1024
- Mobile: 390×844

Measurements below were taken from rendered DOM geometry and computed styles, then checked against screenshots. The reference is a live third-party site and can change after this audit. Measurements are therefore a dated baseline, not a permanent contract.

The audit does not copy the site's source, artwork, logos, illustrations, product claims, or wording. SafeRedact should reproduce only the general layout rhythm and interaction grammar with original assets and verified SafeRedact content.

## Captures

- [Reference desktop, 1440×900](reference-screenshots/elloe-desktop-1440x900.png)
- [Reference tablet, 768×1024](reference-screenshots/elloe-tablet-768x1024.png)
- [Reference mobile, 390×844](reference-screenshots/elloe-mobile-390x844.png)

The saved files are above-the-fold captures. Full-page browser captures were also reviewed during the audit.

## Page composition

The reference uses one continuous near-black canvas with minimal visible section boundaries. Content density and layout changes create rhythm instead of alternating light/dark bands.

Observed order:

1. Fixed header
2. Split hero: copy left, large product illustration right
3. Centered integration/logo strip within the hero
4. Three-column proof/stat band
5. Feature heading with a sparse two-column capability grid
6. Two-column product media plus vertical accordion/tabs
7. Large platform heading, pill tabs, split descriptive panel
8. Three resource cards
9. Large cyan/blue gradient CTA panel
10. Five-column footer and legal row

For SafeRedact, the section functions may be reused, but the content and imagery must be replaced with redaction-specific material.

## Global layout and color

### Desktop

- Body background: measured `rgb(7, 7, 25)` / approximately `#070719`.
- Main content frame: measured 1232px wide at a 1440px viewport, giving 104px side gutters.
- Header content follows the same frame.
- Most sections use 64px vertical padding; hero uses 208px top and 96px bottom.
- The page height measured approximately 4893px at 1440px wide.

### Tablet

- Content gutter: 24px.
- Main containers retain a declared 1280px max width but resolve to full width minus gutters.
- Page height measured approximately 6834px at 768px wide.
- Header switches to mobile navigation below the desktop breakpoint.

### Mobile

- Content gutter: 20px; rendered content width is approximately 350px at 390px viewport width.
- Hero padding: 160px top and 32px bottom.
- Page height measured approximately 7247px at 390px wide.
- Section padding remains mostly 64px, creating deliberate breathing room even on narrow screens.

### Reference palette

| Role | Measured/observed value | SafeRedact interpretation |
| --- | --- | --- |
| Canvas | `#070719` | Use a SafeRedact navy-black, anchored to current `#0E0E1F` / `#14142A` |
| Raised surface | `#121725` to `#131929` | Use translucent navy panels |
| Border | roughly `#1F2840` | Low-contrast blue-gray hairlines |
| Primary text | `#FFFFFF` | White headings |
| Secondary text | measured `#7C86A1` in hero | Cool gray-blue body text |
| Warm action | measured `#EC6A2B` | Retain SafeRedact coral, tuned from current `#D97757` |
| Cool accent | measured around `#04AFFF` | Use sparingly for detection/AI states |
| CTA gradient | mint/cyan to saturated blue | Rebuild as an original SafeRedact gradient field |

## Header

### Desktop

- Fixed positioning.
- Measured width/height: 1440×94px; 20px vertical padding.
- Logo aligned to the 104px content gutter.
- Four centered dropdown navigation items.
- Secondary outlined action approximately 99×42px.
- Primary orange action approximately 154×45px with 4.8px radius and an orange glow.
- Background matches the page canvas, so the header appears integrated rather than floating.

### Tablet and mobile

- Desktop navigation collapses by the reference's 991px breakpoint.
- Tablet retains the primary CTA beside a hamburger.
- Mobile hides the header CTA and shows logo plus hamburger.
- Open mobile menu is an absolute full-width panel below the header, measured about 424px high with 24px padding, dark raised background, stacked navigation, outlined secondary action, and solid primary action.
- The menu is a drop-down panel, not a right-side drawer.

SafeRedact should preserve its existing fixed-header behavior but adopt this calmer dark treatment and drop-down mobile model. The final menu must include focus trapping/restoration and Escape handling.

## Hero

### Desktop measurements

- Section: 902px high; padding `208px 0 96px`.
- Two equal columns inside the 1232px content frame; each is about 608px.
- H1: 52px Poppins, weight 400, approximately 68.4px line height; measured box 608×137px.
- Eyebrow: uppercase, 13px/700, blue.
- Supporting copy: muted cool gray, constrained to the left column.
- Primary CTA: 182×44px, 16px medium, warm orange, ~5px radius, orange glow.
- Product visual: 608×372px, aligned to the right column.
- Logo/integration heading and row sit below the two-column hero within the same section.

### Tablet

- Hero becomes a single-column sequence: copy, product visual, integration row.
- H1 remains very large at 49.6px/65.3px and spans the 720px content width.
- Product visual spans the content width.

### Mobile

- H1: 25.6px/33.7px, weight 500.
- Body: 16px/24px.
- Primary CTA becomes the full 350px content width.
- Product visual measures about 350×214px and follows the CTA.
- Integration logos wrap into a compact two-row arrangement.

SafeRedact should replace the proprietary illustration with an original document-analysis/redaction workbench visual built from CSS/SVG and, if approved, real product screenshots.

## Typography

The reference uses a geometric, rounded hierarchy:

| Role | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Hero H1 | 52/68px, 400 | 49.6/65px, 400 | 25.6/33.7px, 500 |
| Major H2 | 48/62px, 700 | 48/62px, 700 | 25.6–28.8/33–37px, 700 |
| Section H2 | 42/54px, 700 | 32/41px, 700 | 22.4/29px, 700 |
| Feature title | 19/27px, 700 | approximately 18–19px | 16–18px |
| Eyebrow | 13px, 700, uppercase | same | same |
| Body | 16–18px, relaxed | 16–18px | 16/24px |
| Stat | 64/64px, 600 | 64/64px, 500 | 41.6/41.6px, 500 |

Poppins is the dominant visible family. Satoshi Variable appears on selected controls, and Roboto appears as a base/fallback. SafeRedact should use one heading family and one body family at most; Poppins plus Inter is the closest licensed/open combination if a two-family system is approved.

## Grid and spacing

- Desktop content frame: 1232px.
- Desktop side gutter at 1440px: 104px.
- Desktop hero grid: two approximately 608px columns with a 16px implicit gap.
- Feature rows: two columns with large negative space rather than boxed cards.
- Proof band: three equal 400px columns with 16px gaps.
- Resource cards: three equal columns, approximately 389px each.
- Tablet: content stacks broadly, but proof metrics stay in three columns.
- Mobile: most grids collapse to one column; tab pills remain horizontally scrollable.
- Common section rhythm: 64px vertical padding; larger gaps appear before major narrative transitions.

## Buttons and interactive surfaces

### Primary buttons

- Warm orange fill.
- Approximately 44–50px high.
- Small radius around 5px, not pill-shaped.
- White text in normal use.
- Orange glow: measured around `0 2px 10px rgba(236,106,43,.82)`.

### Secondary buttons

- Transparent/dark fill.
- 1px cool-gray border.
- 6px radius.
- No prominent shadow.

### Cards

- Resource card background: measured `rgb(18, 23, 37)`.
- Border: 1px `rgb(31, 40, 64)`.
- Radius: 8px.
- Shadow: subtle blue-gray glow, measured around `0 2px 15px rgba(57,70,105,.38)`.
- Card padding: 24px desktop/mobile.

### Accordion/tabs

- Dark raised rows, typically 5px radius and 16px padding.
- Selected row expands to show descriptive copy.
- Small cyan line icon anchors the title.
- Chevron communicates expansion.
- A separate pill-tab family uses ~20px radius, 1px border, 9×20px padding, and an 8px internal gap.

## Backgrounds and transitions

- Most of the page stays on one flat near-black background.
- Depth is created through low-contrast panels, subtle blue borders, and small glows.
- The large pre-footer CTA is the only high-saturation field; it uses an original-looking mint/cyan/blue background, 8px radius, and ~20px blue glow.
- Accent words within paragraphs use orange; one large heading uses a cyan-to-blue text gradient.

## Motion and scroll behavior

- Header remains fixed during scroll.
- Dropdown menus and the mobile navigation use approximately 300–400ms transitions.
- Buttons and navigation links expose approximately 300ms color, transform, border, or shadow transitions.
- Accordion/tabs change visible content rather than navigating.
- The live DOM includes Webflow interaction identifiers on hero and tab elements, but no continuous CSS keyframe animation was measured in the resting state.
- Motion is supportive, not constant. The SafeRedact implementation should use short reveal/fade transitions only and fully honor `prefers-reduced-motion`.

## Footer

- Desktop: logo column plus four navigation columns, then a separated legal row.
- Tablet: columns wrap into two rows.
- Mobile: columns stack vertically with large gaps; legal links and copyright stack beneath a divider.
- The footer remains on the same near-black canvas and uses white headings plus muted blue-gray links.

SafeRedact should not fabricate a deep sitemap. Use only real destinations; omit or mark future pages in planning rather than shipping `#` links.

## Responsive breakpoints

Reference CSS exposed these width conditions:

- `max-width: 991px`
- `max-width: 767px`
- `max-width: 479px`
- `min-width: 768px`
- `min-width: 1440px`
- `min-width: 1920px`

Recommended SafeRedact mapping within the existing Tailwind setup:

- Base: 0–639px
- `sm`: 640px
- `md`: 768px
- Custom navigation collapse: 992px, or use existing `lg` (1024px) if consistency is more important than a 33px fidelity difference
- `xl`: 1280px
- Optional `2xl`: 1536px

The implementation should add a 992px navigation token only if the 768–1023px tablet header cannot be matched cleanly with current breakpoints.

## Proposed SafeRedact design tokens

| Token | Proposed value | Rationale |
| --- | --- | --- |
| `canvas` | `#080914` | Near-black with slightly bluer SafeRedact cast |
| `surface-1` | `#101525` | Raised cards/accordion rows |
| `surface-2` | `#151B2F` | Active panels and form controls |
| `border-subtle` | `#222B44` | Quiet separation on dark canvas |
| `text-primary` | `#F7F8FC` | Softer than pure white for long pages |
| `text-secondary` | `#929BB6` | Cool-muted body copy |
| `accent-warm` | `#E47755` | Refined version of the current SafeRedact coral |
| `accent-warm-hover` | `#F08A66` | Hover state |
| `accent-cool` | `#33B7FF` | AI/detection status and links |
| `accent-mint` | `#55E6D0` | Limited to final CTA and verified success states |
| `radius-control` | `6px` | Reference-like buttons and fields |
| `radius-card` | `8px` | Reference-like cards |
| `radius-panel` | `16px` | Original product visual and major forms |
| `container` | `1232px` | Matches measured reference frame |
| `gutter-mobile` | `20px` | Matches measured mobile geometry |
| `section-y` | `64px` mobile, `96px` desktop | Preserves spacious rhythm while improving desktop pacing |

These are proposed implementation values, not changes made during this phase.
