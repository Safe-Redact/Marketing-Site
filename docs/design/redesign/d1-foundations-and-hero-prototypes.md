# D1 foundations and hero prototypes

Phase D1 · 2026-10-26 · branch `feat/openredakt-stage-b-features` · nothing committed

Checkpoint: **visual approval of the homepage hero direction.** Production pages were not redesigned. The only production-visible change is the `cn()` fix (§2), which restores intended styles.

## 1. What changed

| Area | Change | Production effect |
|---|---|---|
| `src/lib/utils.ts` | `cn()` now uses `extendTailwindMerge` with the project's custom font sizes (`customFontSizes`) | Restores dropped classes site-wide (§2) |
| `src/app/globals.css` | Locked palette as `--or-*` RGB channels; `--or-ease-standard`, `--or-ease-spring` (CSS `linear()` spring with a cubic-bezier fallback) | None: tokens only |
| `tailwind.config.ts` | Semantic colours `midnight`, `graphite`, `elevated`, `coral`, `coral-soft`, `signal`, `fg`, `fg-muted`, `line`; easing `ease-standard`, `ease-spring` | None: existing tokens untouched |
| `src/components/cinematic/*` | New primitives (§4) | None: not used by published routes yet |
| `next.config.ts` | `pageExtensions` adds `dev.tsx` only when `NODE_ENV === "development"` | None: production builds never compile `*.dev.tsx` |
| `src/app/prototypes/**` | Dev-only routes `/prototypes`, `/prototypes/hero-a`, `/prototypes/hero-b` | 404 in production (tested) |
| Nav and industry components | Removed the per-component workarounds (`"text-body-sm " + cn(...)`) now that the helper is fixed | Identical rendered classes |
| Tests | `tests/cn-merge.test.ts` (new, in `test:content`); production-isolation test in `tests/site-routes.test.mjs` | — |
| `docs/design/redesign/visual-design-specification.md` | Colour section replaced with the locked palette and its contrast rules | — |

## 2. Typography-merge defect: evidence and fix

**Reproduced first.** With the token list exported but not yet wired into the merge, `tests/cn-merge.test.ts` failed 3 of 4 tests:

```
not ok 1 - custom font-size tokens and text colours both survive a merge, in either order
not ok 2 - genuine conflicts still resolve to the last class      (expected 'text-body', got 'text-sm text-body')
ok 3 - every custom font size in tailwind.config.ts is registered with the merge helper
not ok 4 - every Button variant and size keeps both its label colour and its font size   ('primary/sm lost text-canvas')
```

**Fix.** `extendTailwindMerge({ extend: { classGroups: { "font-size": [{ text: [...customFontSizes] }] } } })` in the one shared helper. Test 3 fails if a font size is added to `tailwind.config.ts` without registering it. After the fix all four pass; the suite runs in `npm run test:content`.

**Affected rendered elements.** Classes were snapshotted from every published route before and after, on the same dev build:

| Element | Before | After | Routes |
|---|---|---|---|
| Primary `Button` (every "Request a Demo", "Submit Demo Enquiry"…) | `text-canvas` dropped, so the label inherited near-white (2.80:1 on coral) | `text-canvas` restored: 6.67:1, 8.05:1 on hover | all 23 |
| Ghost and secondary `Button` | `text-ink` dropped (inherited the same colour, so invisible change) | restored | 17 |
| `SectionIntro` eyebrows (multipage pages) | `text-caption` dropped: rendered at inherited body size | 12px caption as designed; pages 6–24px shorter | 10 (industries hub, 9 industry pages, How It Works, Why) |
| Insights filter pills, tags, type badges | size or active-label colour dropped | restored | Insights routes |
| Comment form status and fields | size dropped | restored | article |

**Visual regression.** Every published route plus the 404 page, at 1440 and 390, before and after (`d1/regression/`):
- Feature pages, homepage and contact change only in button labels (0.02–0.15% of pixels).
- Pages with `SectionIntro` change by 6–13% of pixels, because content moves up when the eyebrow shrinks.
- No other differences. See `home-hero-cta-1440.jpg`, `industry-section-eyebrows-1440.jpg`, `industry-eyebrows-390.jpg` and `insights-filters-1440.jpg`.

**CTA accessibility after the fix (existing palette):**
- Label 6.67:1, hover 8.05:1.
- Focus ring (cyan, 2px offset onto the page) 8.83:1 against the background.
- All AA.

## 3. Locked palette

The palette is implemented as specified. Contrast audit and usage rules are in `visual-design-specification.md` §3. In short:
- Every text pair passes AA.
- **CTA label must be Midnight on Coral** (7.37:1). White on Coral is 2.47:1.
- The Border token is decorative only (1.5–1.9:1). Form-field outlines use Secondary Text at ≥55% (3.35:1 or better).
- Cyan is limited to the audio motif, focus rings and technical labels.

The new palette is used only by the prototypes and primitives. Existing pages keep their tokens until their redesign checkpoint.

## 4. Design primitives (`src/components/cinematic/`)

All are server components except where noted. CSS is in one module (`cinematic.module.css`, 3.9 KB gzipped together with the prototype styles), so it loads only on routes that use it.

| Primitive | Purpose | Notes |
|---|---|---|
| `CinematicSection` | Section rhythm (`hero`, `lg`, `md`, `editorial`) and surface | Separation by space and light, not borders |
| `AtmosphericGlow` | Decorative radial light (coral or signal), optional grain | `aria-hidden`; static |
| `EdgeFade` | Masks chosen edges into the background | Presentation only; documented as not a privacy control |
| `ProductFrame` | Lit hairline frame with content-tinted glow and a fixed aspect ratio | Reserves space, so no layout shift; adds no fake window controls |
| `RedactionBar` | The signature horizontal mark; optional one-off sweep | Sweep disabled under reduced motion |
| `SectionEyebrow` | Monospace technical label | — |
| `CinematicHeading` | Heading with optional muted continuation (two-tone) | Both parts in the accessible name |
| `MotionControl` (client) | Pause, play and replay for animation longer than 5s | WCAG 2.2.2 |
| `useMotionGate` (client hook) | Off-screen and hidden-tab gating, reduced-motion preference | Shared by both prototypes |

## 5. Hero prototypes

**Run them (development only):**

```bash
npm run dev
```

Then open `/prototypes` (index), `/prototypes/hero-a` and `/prototypes/hero-b`.

Both share the same proposed copy and actions, so they are compared on the visual alone:
- **H1:** "Precise redaction for documents, audio, and video."
- **Lede:** "Mark the passage, the time range, or the frame region. A reviewer confirms every decision, and the output is inspected before it is shared."
- **Primary CTA:** Request a Demo, to `/contact`. Midnight on Coral.
- **Secondary CTA:** Explore Features, to `/features`.

H1 and CTAs are server-rendered HTML. Copy claims map to DOC-MANUAL, AUD-TIMELINE, VID-MANUAL, DOC/VID-OUTPUT-CHECK and DOC-REVIEW.

**Isolation.**
- The routes are `page.dev.tsx` files, which `next.config.ts` recognises only in development.
- The production build lists no prototype routes.
- `tests/site-routes.test.mjs` asserts that `/prototypes`, `/prototypes/hero-a` and `/prototypes/hero-b` return 404 in production and that the sitemap never mentions them.
- They also carry `noindex` as a second layer.

### Prototype A: native canvas (`/prototypes/hero-a`)

One coral redaction bar travels between three verified workflows in a single 13.4s sequence, then settles and stops:

1. **Entrance:** placeholder text lines draw in. No legible text.
2. **Document:** a two-line passage is outlined, then covered by the bar (DOC-MANUAL, DOC-REVIEW).
3. **Audio:** the bar becomes a selected range on a cyan waveform. Bars inside the range flatten (mute), and a playhead previews it (AUD-TIMELINE, AUD-EFFECTS, AUD-PREVIEW).
4. **Video:** the waveform settles onto a timeline and the bar becomes a time interval. A region is outlined on an abstract street scene and its content is genuinely pixelated by down-sampling (VID-MANUAL, VID-TIMELINE, VID-EFFECTS). **The region never moves, so nothing implies tracking.** The playhead stays inside the interval.
5. **Settle:** back to the document state; the render loop stops.

**Implementation:**
- Canvas 2D drawing from deterministic geometry in design units (`redaction-scene.ts`).
- Colours are read from the `--or-*` tokens.
- Device-pixel ratio is capped at 2, and the canvas is resized with a ResizeObserver.
- A wide layout (16:7) and a compact layout (5:4 below 768px).
- The server-rendered SVG of the settled frame shows before hydration and whenever canvas or JavaScript is unavailable; it cross-fades to the canvas without a layout change.
- Pauses off-screen or in a hidden tab.
- Reduced motion renders the final frame only.
- The motion control pauses, plays or replays.

### Prototype B: layered media (`/prototypes/hero-b`)

Three plates in a finite 13s CSS carousel, settling with the document in front:
- **Front plate:** the **real, approved** `format-documents.png` capture (synthetic statement). It is cropped to the page and the first findings rows, with the status bar and file name excluded. Only framing and a moving spotlight are applied; **no marks are added**.
- **Back plates:** audio and video **diagrams** in SVG, because no approved audio or video captures exist yet. They are labelled "Diagram" in the legend.
- JavaScript only pauses or replays. Reduced motion shows the final layout.

**No video was produced for B.** No owned footage or legitimately generated media exists, and fabricating one was out of scope. If a cinematic hero video is wanted later, the best source is Prototype A itself: rendered offline at 60fps to MP4/WebM, it needs no generated artwork and stays truthful. Brief: 1920×840 and 1080×864 renders of `drawScene` over `AtmosphericGlow`, H.264 and VP9, 12–14s, under 2.5 MB, muted, poster = settled frame. The asset plan's DATA-VID footage remains the route to real video captures.

### Captures

All produced with headless Chrome against a production build of the temporary copy:
- Stills per viewport and state: `d1/prototype-a/`, `d1/prototype-b/`. Named by seconds after load, e.g. `A-1440-t6_4s.jpg`.
- Side-by-sides at every viewport (settled and audio phase), plus sequence contact sheets: `d1/comparison/`.
- Recordings: `d1/recordings/prototype-{a,b}-{1440,390}.mp4`. Real-time screencasts encoded with ffmpeg, 0.2–0.33 MB each.
- Reduced-motion stills: `*-reduced-motion.jpg`.

## 6. Performance and accessibility comparison

**Measurement.** Production build, headless Chrome, CPU rendering, 1× device-pixel ratio. Frame pacing is from `requestAnimationFrame` intervals over 16.5s. Headless runs at about 75Hz, so 13.3ms is the ceiling. Full data is in `d1/prototype-metrics.json`.

| Run | Viewport | Reduced motion | Mean frame | p95 frame | Frames >33ms | CLS | LCP element | Main-thread work after settle (3 s) |
|---|---|---|---|---|---|---|---|---|
| A | 1440x900 | no | 13.5 ms | 13.5 ms | 3 | 0.0005 | H1 | 0 ms |
| B | 1440x900 | no | 13.4 ms | 13.5 ms | 1 | 0.0000 | Capture image | 0 ms |
| A | 390x844 | no | 13.3 ms | 13.5 ms | 0 | 0.0000 | H1 | 0 ms |
| B | 390x844 | no | 13.4 ms | 13.6 ms | 0 | 0.0000 | H1 | 1 ms |
| A | 1920x1080 | no | 13.3 ms | 13.5 ms | 0 | 0.0000 | H1 | 0 ms |
| B | 1920x1080 | no | 13.4 ms | 13.5 ms | 0 | 0.0000 | H1 | 0 ms |
| A | 768x1024 | no | 13.7 ms | 13.5 ms | 3 | 0.0000 | H1 | 0 ms |
| B | 768x1024 | no | 13.4 ms | 13.5 ms | 0 | 0.0000 | H1 | 0 ms |
| A | 1440x900 | yes | 13.4 ms | 13.5 ms | 0 | 0.0000 | H1 | 31 ms* |
| B | 1440x900 | yes | 13.5 ms | 13.5 ms | 1 | 0.0000 | Capture image | 32 ms* |
| A | 390x844 | yes | 13.6 ms | 13.6 ms | 0 | 0.0000 | H1 | 47 ms* |
| B | 390x844 | yes | 13.5 ms | 13.6 ms | 0 | 0.0000 | Capture image | 35 ms* |

\* Reduced-motion runs were shorter, so the measurement probe's own loop was still running; the prototypes themselves do no work.

The only CLS (0.0005) is a font swap on the very first cold load, shared by the whole site.

| Criterion | Prototype A | Prototype B |
|---|---|---|
| Client JS beyond an ordinary page | **+6.1 KB gz** (the whole engine is one chunk) | +3.5 KB gz |
| Media weight | 0 (canvas and inline SVG) | +72 KB AVIF at 1920w, +27 KB at 750w |
| LCP | Always the H1 text | The capture image at 1440 and 1920 |
| Smoothness | Steady; no dropped frames after warm-up | Steady (compositor transforms) |
| CPU and memory | Draws only while playing, visible and on-screen; 0 ms after settle; JS heap 5–8 MB on fresh load | CSS only; 0 ms after settle |
| Layout stability | Fixed aspect stage; SVG fallback matches the final frame | Fixed aspect plates |
| Reduced motion | Static settled frame, pixel-identical over time (verified) | Static final layout, pixel-identical (verified) |
| Pause (WCAG 2.2.2) | Yes | Yes |
| Contrast | CTA 7.37:1, secondary 18.2:1, lede 9.6:1 | Same |
| Keyboard | Tab order: Request a Demo, Explore Features, motion control | Same |
| Screen readers | Canvas and SVG hidden; one text description | Capture has alt text; diagrams hidden; one description |
| Honesty | Every motif is a verified capability; no fake UI | Real capture is honest, but diagrams beside a real screenshot can read as real product |
| Asset dependency | None | Needs approved captures for all three formats to be complete |
| Browser concerns | Canvas 2D, `ResizeObserver`, `IntersectionObserver`: universal. `roundRect` drawn manually; no `ctx.filter` (unsupported in older Safari) | `mask-image` and `filter: brightness()` on transforms: fine in current browsers; CSS `linear()` easing falls back to cubic-bezier |

Accessibility checks were scripted DOM and ARIA inspection plus computed contrast. axe-core is not installed, and I did not add it.

## 7. Recommendation

**Use Prototype A for the homepage hero, and B's framing pattern for the product-proof section directly below it.**

1. A is the only option that shows all three formats truthfully today. B can't, until real audio and video captures exist.
2. It owns a signature: one bar that is a passage mark, a range and an interval. It is recognisably OpenRedakt and nothing like Raycast's diagonal bands.
3. The H1 stays the LCP element, there are no media bytes, and it costs about 6 KB of JS.
4. B's strength, a real capture lit and framed, belongs in the section below the hero (the format triptych in the blueprint), where it can be honest and specific once CAP-DOC-01, CAP-AUD-01 and CAP-VID-01 are produced.

**Before A is homepage-ready (not done in D1):**
- Raise its polish: a deeper atmospheric layer behind the stage (graphite plate with a soft coral key light), subtle depth parallax between the placeholder text lines and the bar, and slightly larger scale on 1920+.
- Its settled frame is currently sparse.
- Then test it with the real header restyled to the new palette.

## 8. Remaining asset requirements

Unchanged from `asset-production-plan.md` §7. The ones that unblock the next steps:
1. **CAP-DOC-01, CAP-AUD-01, CAP-VID-01**: the product-proof section under the hero.
2. **DATA-AUD and DATA-VID** synthetic recordings with consent, to make those captures possible.
3. **Logo SVG**, for the restyled header and OG image.
4. **Confirmation of export-dialog wording**, for CAP-DOC-05 and CAP-EXP-01.

The hero itself (Prototype A) needs **no** new assets.

## 9. Verification results

| Check | Result |
|---|---|
| TypeScript (`npm run typecheck`) | Pass |
| ESLint (`npm run lint`) | Pass, no warnings |
| Production build (temporary copy, prototypes excluded) | Pass; no prototype routes in the route list |
| Route tests (`npm run test:routes`, production server) | 44/44, including prototype 404s |
| Static tests | 44/44 |
| Content tests (including `cn-merge`) | 153/153 |
| OAuth broker tests | 37/37 |
| Content validation | Pass (11 industry entries, 18 indexable routes) |
| Secret-pattern scan | Pass |
| `git diff --check` | Clean; new files also free of trailing whitespace |

Builds and route tests ran in a same-drive temporary copy (`M:\Safaridesk\.openredakt-verify`), so the running `dev:https` server's `.next` was not touched. The copy is removed at the end of this phase.
