# D3 — Approved Homepage Redesign

Status: implemented in the working tree of `feat/openredakt-stage-b-features`. Nothing committed, pushed, merged, or deployed. Only the homepage changed; other pages keep their D2 design.
Date: 2026-10-26

## References used

No separate OpenRedakt concept image was attached in this conversation, so the build follows the written D3 brief. These references set composition and atmosphere:

- **Warm-gradient hero screenshot:** headline set as a sequence of muted lines ending in one white line, a gradient running from deep red into orange and then white, and a white product card straddling that change.
- **MindCloud screenshot:** a saturated gradient hero falling into a light trust band, then a hard change to a dark section.
- **Clarify recording** (frames extracted at 1 fps): the product frame grows as it rises, a calm band sits below it, and a centred statement follows.
- **Second recording:** alternating dark and light blocks of large split content.

No competitor code, branding, or assets were used.

## 1. Implementation summary

Section rhythm, top to bottom:

| # | Section | Theme | Notes |
|---|---|---|---|
| 1 | Hero | Graphite → ember gradient | Eyebrow, headline as four lines (three muted steps, one white), lede, warm-white **Request a Demo** and translucent **How It Works**. Mono margin notes in the gutters at ≥1400px only (decorative, `aria-hidden`). |
| 2 | Product showcase | Gradient continues into warm white behind the card | Large rounded warm-white card titled "Review in context" holding the approved editor capture. The card straddles the hand-over to `#F7F3EE` and grows with scroll. |
| 3 | Capability strip | Light | The four existing capability facts, set where logos usually sit. No logos or counts. |
| 4 | Review statement | Light | "Sensitive information deserves careful review before it's shared." OpenRedakt's own copy with no attribution, followed by three principles (human review, transparent decisions, verified output). |
| 5 | Format storytelling `#why-saferedact` | Dark sheet | One large split row per format, alternating sides. Copy comes from the evidence-checked feature pages, so audio stays manual-first. |
| 6 | Review workflow `#how-it-works` | Dark | Existing three-step accordion with sticky visual. |
| 7 | Advantages `#services` | Light sheet | Outcome strip and register pillars. |
| 8 | Industry pathways `#industries` | Light | Published guides by sector. |
| 9 | Insights preview | Dark sheet | Latest published article. |
| 10 | FAQ, closing enquiry `#contact` | Dark, ember glow at the foot | The same `DemoEnquiry` form as /contact, unchanged in behaviour. |

**Sheets:** each change between light and dark is a rounded "sheet" (`.sheet`): the incoming section's rounded top slides over the previous colour. This makes the transitions read as one system rather than stitched themes.

**Light theme without forking components:** `.theme-light` re-scopes the palette channels (`--or-*`), so existing components render on warm white unchanged. On light, Coral darkens to `#C44026` (4.63:1) because `#FF735C` cannot carry text there.

**Scroll animation:** a CSS scroll-driven animation (`view-timeline` on `.showcase-track`, `scale(0.86) → none` on `.showcase-scale`) runs on the compositor and changes only `transform`. No JS library was added.
- Active at ≥768px, when `prefers-reduced-motion: no-preference`, and where `animation-timeline` is supported.
- Otherwise the card is static at full size: phones, reduced motion, and browsers without scroll timelines (such as Firefox today).
- The timeline subject never transforms, so document flow is identical at every scroll position.

**Chat launcher:** on homepage phones (<640px) the chat launcher shrinks to its icon with CSS only. Its `aria-label` and behaviour are unchanged, and it no longer covers the CTAs or showcase.

## 2. Files

Created: `src/components/sections/ReviewStatement.tsx`, this report, and `docs/superpowers/screenshots/2026-10-26-d3-homepage/`.

Modified:
- `src/app/page.tsx`: new order, `data-home-page` on `main`.
- `src/app/globals.css`: `.theme-light`, `.sheet`, `.hero-ember`, `.showcase-stage`, the showcase timeline, hero note fade, and the phone launcher rule.
- `src/content/hero.ts`: headline sequence, How It Works CTA, showcase copy. The `headline` string is unchanged.
- `src/components/sections/Hero.tsx`: rewritten.
- `src/components/sections/TrustBar.tsx`: light strip.
- `src/components/sections/WhySafeRedact.tsx`: tabs replaced by alternating rows; now a server component.
- `src/components/sections/Services.tsx`, `Industries.tsx`, `InsightsPreview.tsx`, `FinalCta.tsx`: section theme or sheet classes only. Form logic is untouched.
- `tests/phase1-homepage.test.mjs`: the headline is asserted inside the `h1` as a sequence.
- `tests/phase2-homepage.test.mjs`: the format-tabs test is replaced by one that checks a linked row per published format.

These two tests changed only because the brief changed those requirements.

## 3. Screenshots

All under `docs/superpowers/screenshots/2026-10-26-d3-homepage/`, captured with headless Chrome at 1920×1080, 1440×900, 1024×900, 768×1024 and 390×844:

- `home/home-<width>-fullpage.jpg` and `home/home-<width>-sNN.jpg`: full page and every section at each width.
- `showcase/showcase-<width>-{top,middle,end}-frame1.jpg`: the scroll animation at 0, 450 and 900px of scroll (1920, 1440, 768).
- `compare/first-viewport-<width>-before-after.jpg`: D2 (left) against D3 (right) at all five widths.
- `compare/fullpage-1440-before-after.jpg`: whole-page rhythm, D2 against D3.
- `compare/showcase-scroll-<width>-top-middle-end.jpg`: the three animation states side by side.

Measured showcase scale:

| Width | Top | Middle | End |
|---|---|---|---|
| 1440 | 0.887 | 0.967 | 1.0 |
| 1920 | 0.913 | 0.986 | 1.0 |
| 768 | 0.933 | 1.0 | 1.0 |
| 390 | static | static | static |

On first load the card's top edge sits at about 748px at 1440×900, so it is visible in the first viewport.

## 4. Assets

**Reused:** `/images/product/hero-document-review.png` (approved for the homepage) is used in the showcase, crop `pageWithFindings`, with the title bar and status bar excluded. The format rows reuse the D2 crops of `format-documents.png` and the labelled audio and video diagrams (slots CAP-AUD-01 and CAP-VID-01).

**Still needed:**
- An approved audio capture (CAP-AUD-01) and video capture (CAP-VID-01) for the format rows.
- CAP-PRJ-01 and CAP-EXP-01 for the workflow steps.
- Optionally, a wider capture made for the showcase card, so it can show the full window (title bar included) without crops. That needs an approved, sanitised window title.

No new images or video were generated.

## 5. Performance and accessibility

| Check | Result |
|---|---|
| Cumulative layout shift while scrolling through the showcase (production) | 0 |
| Showcase document position before and after scrolling | identical (transform only) |
| Homepage route JS | 5.72 kB (was 9.12 kB; the format section no longer ships client code) |
| Horizontal overflow at all five widths | none |
| One `h1`; all images have `alt` | yes |
| Text on the hero gradient | the lede sits over the darker 78% band (about 6.6:1); CTAs at about 90% (about 5.4:1); the brightest coral sits behind the card where no text crosses it |
| Light-theme contrast | body text 16.4:1, muted text 6.4:1, coral text 4.63:1, showcase card copy 6.6:1 |
| Hero primary CTA | `#14161C` on `#FFF7F3`, 17.1:1 |
| Reduced motion | showcase animation and hero note fade disabled (verified) |
| Phones | static showcase, compact chat launcher (verified at 390px) |
| Keyboard | header dropdown Enter/Escape, focus rings on all CTAs and rows |

## 6. Verification

| Check | Result |
|---|---|
| TypeScript, ESLint | clean |
| Static / content / route (production) / OAuth tests | 44/44, 153/153, 44/44, 37/37 |
| Content validation | 3 feature pages against the register; 9 live / 2 draft industries; 18 indexable routes |
| Production build (isolated copy, removed afterwards) | succeeded |
| Production behaviour checks | 24/24: no console errors on 14 pages; Insights search on Enter; TOC scrollspy; hidden TOC scrollbar; dropdown keyboard; anchor offset; showcase scaling; CLS; hero CTA destinations; reduced motion; phone layout |
| Prototypes in production | 404 |
| Secret scan | passed (994 files) |
| `git diff --check` | clean |

During the isolated build, Next printed one warning: it could not symlink `node_modules` into its standalone output, because the copy's `node_modules` is a Windows junction. This comes from the verification setup, not the application.

## 7. Limitations and follow-ups

- No approved concept image was available, so fidelity was judged against the brief and the third-party references. A side-by-side review against the concept image is still owed.
- The showcase animation needs CSS scroll timelines (Chromium; Safari 26). Other browsers get the static full-size card by design.
- The hero margin notes appear only at ≥1400px. Narrower gutters would crowd the headline.
- Other pages still use the all-dark D2 system; extending the light/dark rhythm to them is a later stage.

## 8. Git status

89 changed or untracked paths in the working tree (all phases to date). For D3, the files listed in section 2 are modified or added. Nothing is staged, committed, pushed, or deployed.
