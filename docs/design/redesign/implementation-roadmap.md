# Implementation roadmap

Phase D0 · 2026-10-26 · for approval before any production UI change

## 1. Technical feasibility

| Effect | Recommended approach | Why | Risks and mitigations |
|---|---|---|---|
| Animated hero environment | CSS redaction-bar layers (gradients, blur, grain SVG) with slow `transform` drift | Raycast uses a WebGL canvas; a CSS composition reaches the same mood at a fraction of the cost and works under the CSP | Blur on large layers costs GPU on low-end mobile: use fewer layers below 768px, `will-change` only while animating, pause when off-screen |
| Gradient lighting | Radial gradients in `::before`/`::after` with `aria-hidden` | Zero JS, crisp at any DPR | Banding: grain overlay |
| Product-window compositions | ProductFrame (server) wrapping `next/image`; FocusLens via `mask-image` | No client JS; masks are well supported | Masks hide nothing from the DOM or image file, so source captures must be clean |
| Scroll reveals | Extend `AnimateOnScroll` (IntersectionObserver) | Existing, tested, reduced-motion aware | Avoid hiding LCP content behind reveals: never reveal the hero |
| Sticky storytelling | CSS `position: sticky` figure plus IntersectionObserver to set the active stage | No scroll-jacking, accessible, cheap | Disable below 1024px |
| Capability index | Small client tablist (state plus ARIA), crops preloaded lazily | Keyboard parity; a few hundred bytes | Preload only the next crop to protect mobile data |
| Lightweight video | `<video muted playsInline loop preload="none" poster>`, MP4 (H.264) and WebM, ≤3 MB, 6–12s; play via IntersectionObserver; pause control | No dependency; CSP-safe (`media-src` defaults to `'self'`) | Autoplay policies: always muted; reduced motion shows the poster |
| Responsive imagery | `next/image` with `getImageProps` and `<picture>` for art-directed mobile crops; AVIF/WebP | Already configured (`formats`, `qualities`) | Add the new crop paths to `images.localPatterns` |
| Image loading | Hero crop `priority` with `fetchPriority="high"`; everything else lazy | Protects LCP | Hero crop at most 200 KB AVIF at 1600w |
| Reduced motion | Global CSS gate (`@media (prefers-reduced-motion: reduce)`), plus checks in JS components | Required | Test with Chrome's emulation in the route suite |
| Fonts | Keep `next/font` (Poppins, Inter); system monospace | No new downloads | Trim Poppins weights to the ones used (600 or 600/700) |

**No new dependencies are required.** No animation library, no WebGL, no CSS-in-JS (it would also conflict with `style-src 'self'`).

### Expected performance impact
| Metric | Risk | Control |
|---|---|---|
| LCP | Heavier hero media | H1 stays server-rendered text; hero crop ≤200 KB; decorative layers pure CSS |
| CLS | Media without dimensions, late fonts | Fixed aspect-ratio frames; `next/font` with size-adjust (already used) |
| INP | Client tablists, video | Small components; no work on scroll beyond IntersectionObserver |
| Mobile loading | Blur layers, video | Fewer layers; `preload="none"`; poster-only on save-data or reduced motion |
| Accessibility | Contrast in light compositions, motion | Tokens chosen for AA; motion gate; decorative layers `aria-hidden` |
| SEO crawling | Text inside images | All copy remains HTML; captures carry alt text; no route, heading or metadata changes |

## 2. Phases

Complexity: **L**, **M**, **H**. Phases are ordered by dependency. Time estimates are not given because capture availability, not engineering, governs the schedule.

### D1 · Foundations (M) · no new assets needed
1. Fix `cn()` with `extendTailwindMerge` for the custom font sizes, plus a unit test. Review screenshots: the primary-button label colour changes back to dark (fixing the 2.8:1 contrast defect), and nine call sites regain their size or colour.
2. Token update: depth ramp, `hairline`, `highlight`, `ink-subtle`, section rhythm, radius, motion tokens. Remove the legacy palettes (`primary`, `surface`, `accent`, `muted`, `editorial`) after a usage check.
3. Delete dead components (`QualitySecurity`, `SoftwareAlternative`, `WhyRedaction`, `Card`, `Badge`, `SectionWrapper`, `useActiveSection`) and update the tests that read them.
4. Primitives: ProductFrame, FocusLens, AmbientLight/RedactionBars, CSS-GRAIN, the two-tone SectionIntro, Button and Eyebrow restyle, extended AnimateOnScroll.
5. Header, dropdowns, mobile menu and footer restyle (behaviour frozen).

**Exit criteria:** all suites green; contrast AA verified on every text token; reduced-motion snapshot; no route, H1 or metadata diff.

### D2 · Shared page system and low-risk pages (M) · no new assets needed
1. PageHero variants (`cinematic`, `product`, `editorial`); ContextualCta closing composition; FaqSection, Breadcrumbs, cards.
2. Apply to Contact, Why OpenRedakt, How It Works (with CSS-LIFECYCLE and the sticky figure), the Industries hub (CSS-DIRECTORY) and industry pages (CSS-SECTOR-RECORD).
3. Decision gate: is GEN-SECTOR-PLATE needed?

**Exit criteria:** industry pages pass readability review (70ch, AA, 16px+ body); the similarity and validation guards are unchanged.

### D3 · Homepage rebuild (H) · interim assets acceptable
1. Copy rewrite against the evidence register (owner approval), with the affected tests updated in the same change.
2. New section sequence (blueprint §1) using interim crops of `format-documents.png`, a CSS audio composition, and the Stage B video diagram.
3. Remove the showcase theme toggle unless light captures are commissioned.
4. Replace the FinalCta banner; keep `DemoEnquiry` and every anchor.

**Exit criteria:** anchors resolve (existing test); form tests green; LCP at or below today's on mobile emulation.

### D4 · Feature pages (M–H) · needs P1 captures
1. Features overview and the three feature pages with the `product` hero and per-capability media slots.
2. Swap interim visuals for CAP-DOC-*, CAP-AUD-*, CAP-VID-* as they arrive; update the manifest per asset.

**Exit criteria:** every capture has a manifest row with claim IDs and approval; no prohibited asset in use.

### D5 · Insights (L–M) · GEN-INSIGHT-COVER optional
1. Restyle the hub, cards, filters and article typography; keep scrollspy and comments untouched.
2. Cover system: CMS field for a cover image, with a branded fallback composition when absent.

**Exit criteria:** article route tests (TOC, anchors, breadcrumbs, CTA) green.

### D6 · Motion assets and polish (M) · needs MOT-AUD-01 and MOT-VID-01
MediaLoop component, posters, reduced-motion fallbacks, OG-DEFAULT and per-article OG.

### D7 · Verification and rollout (M)
- Visual baseline at 1440, 1024, 768 and 390 for every route (extend the existing headless capture approach).
- Accessibility: keyboard pass of menus, tablists and the form; contrast audit; reduced-motion audit; screen-reader smoke test.
- Performance: Lighthouse mobile on the homepage, a feature page, an industry page and an article; compare with the D0 baseline.
- SEO parity: route tests already assert H1s, canonicals, JSON-LD and the sitemap; add a metadata snapshot diff.
- Rollout: one PR per phase (D1 to D3 are reviewable alone), owner visual approval before merge, no deployment without the existing acceptance gates.

## 3. Dependency map

```
Owner inputs ──► Capture environment ──► P1 captures ──► D4 feature pages
     │                                         └──────► D3 homepage (final visuals)
     ├─► Logo ──► D1 header/footer, OG-DEFAULT
     └─► Copy approval ──► D3 homepage copy and tests
D1 foundations ──► D2 page system ──► D3 homepage ──► D4 ──► D6
                         └──────────► D5 insights
D7 runs after each phase and in full before release
```

## 4. What can be done with existing material

| Ready now | Needs new material |
|---|---|
| D1 entirely, D2 entirely (CSS compositions), D3 with interim crops, D5 restyle | Final homepage and feature visuals (captures), the audio and video demos (DATA-AUD, DATA-VID), Insights covers (generated art), logo-dependent pieces |

## 5. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Captures delayed (synthetic footage and recording) | Video and Audio pages stay on interim visuals | Interims are honest (diagrammatic); ship D1–D3 first |
| `cn()` fix changes many components at once | Unexpected visual shifts | Isolated commit, screenshot diff across all routes |
| Copy changes break tests encoding old homepage claims | CI failures | Update tests in the same change; owner approval recorded |
| Cinematic styling reduces readability on long pages | SEO and UX loss | Light budget; editorial variant for industry and article pages |
| Blur-heavy CSS on low-end phones | Jank | Fewer layers on mobile; pause off-screen; reduced-motion path |
| Masks mistaken for redaction of sensitive data | Data exposure | Clean captures only; checklist in the asset plan |
| Over-borrowing from Raycast | Derivative look | Redaction-bar motif, navy and coral identity, no copied assets; design review against `raycast-reference-analysis.md` §7 |
| Light toggle kept without captures | Dead UI | Remove unless commissioned |

## 6. Verification criteria (definition of done for the redesign)

- Every published route keeps its H1, title, description, canonical, breadcrumbs, JSON-LD and sitemap entry. Draft gating is unchanged.
- All test suites pass; new tests cover the `cn()` merge, reduced motion, and media fallbacks.
- WCAG 2.2 AA contrast for all text; keyboard parity for all interactive demos.
- No asset in use without a manifest row; no prohibited asset; no fabricated UI.
- LCP on mobile emulation no worse than the D0 baseline; CLS under 0.05.
