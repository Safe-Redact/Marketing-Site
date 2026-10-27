# Visual design specification: Cinematic Precision

Phase D0 · proposal for approval · 2026-10-26

This defines the visual language for the whole marketing site. It extends the current OpenRedakt identity (dark navy, coral, cyan, mint; Poppins and Inter). It introduces **no new hues**: every colour below is an existing token or a tint of one. Raycast is a reference for craft (lighting, masking, framing, restraint), not for the look.

## 1. Direction

**Cinematic Precision.** Calm, dark, deliberately lit. Each screen has one lit subject: a document mark, a waveform range, a frame region, a sentence of copy. Everything else recedes into navy. The site should feel like a well-run review room, not a security operations centre or a compliance brochure.

| Feel | Achieved by | Avoid |
|---|---|---|
| Premium, calm | Generous space, few elements per view, slow motion | Busy grids, badges everywhere, neon |
| Precise | Hairline borders, exact alignment, monospace annotations, real product detail in focus | Rounded "bubbly" cards, vague icons |
| Trustworthy | Real captures, stated limits, consistent behaviour | Fake dashboards, shield and lock clichés, unverified numbers |
| Technically sophisticated | Masked product crops, annotated diagrams, timelines | 3D renders, AI sparkles, glowing brains |

## 2. Signature motif: the redaction bar

Raycast owns a diagonal light band. OpenRedakt's equivalent comes from its own product: **the redaction bar**. It is one horizontal, softly lit bar with a crisp leading edge, the shape all three workflows share:

- in documents, a mark over a line of text;
- in audio, a selected time range on a waveform;
- in video, the time span of a region on a timeline.

**Uses:** an ambient hero composition (several coral and cyan bars at different depths, blurred by distance), section dividers (one bar sweeping across a hairline), focus highlights inside product crops, and the closing CTA (a single bar that "covers" a line of grey placeholder text).

**Construction:** CSS `linear-gradient` bars with `filter: blur()` layers, plus one sharp layer and a subtle grain overlay (a small tiled SVG noise asset, about 2 KB). There is no canvas or WebGL. Ambient drift is a slow `transform: translateX()` loop (24–40s) and stops entirely under reduced motion.

**Rule:** at most one bar composition per viewport, and never over body text.

## 3. Colour

**Locked palette (approved for D1, 2026-10-26).** This replaces the D0 colour proposal. Values live once in `src/app/globals.css` as `--or-*` RGB channels; Tailwind exposes them under the semantic names in the table. Components use the names, never hex values. Existing pages keep the earlier `canvas`/`accent-*` tokens until their redesign checkpoint.

| Role | Token (Tailwind) | CSS variable | Value | Purpose |
|---|---|---|---|---|
| Midnight | `midnight` | `--or-midnight` | `#080B12` | Global background |
| Graphite | `graphite` | `--or-graphite` | `#111723` | Primary surfaces |
| Elevated | `elevated` | `--or-elevated` | `#1A2332` | Layered surfaces |
| Coral | `coral` | `--or-coral` | `#FF735C` | Primary brand and CTA fill (dominant accent) |
| Soft Coral | `coral-soft` | `--or-coral-soft` | `#FF9D89` | Controlled lighting; CTA hover fill |
| Cyan | `signal` | `--or-signal` | `#46C7DC` | Technical and audio accent, focus rings (restrained) |
| Primary Text | `fg` | `--or-fg` | `#F5F6F9` | Headings and primary content |
| Secondary Text | `fg-muted` | `--or-fg-muted` | `#ADB6C6` | Supporting text, two-tone continuations |
| Border | `line` | `--or-line` | `#344052` | Decorative separation |

### Contrast audit (WCAG 2.2)

| Foreground | on Midnight | on Graphite | on Elevated |
|---|---|---|---|
| Primary Text | 18.21 | 16.60 | 14.61 |
| Secondary Text | 9.64 | 8.78 | 7.73 |
| Coral (as text) | 7.37 | 6.71 | 5.91 |
| Soft Coral | 9.78 | 8.91 | 7.84 |
| Cyan | 9.81 | 8.94 | 7.86 |
| Border | 1.88 | 1.71 | 1.50 |

**Rules that follow from the audit:**
- **CTA label is Midnight on Coral (7.37:1)**, or 9.78:1 on the Soft Coral hover. Primary Text on Coral is only 2.47:1 and is not allowed.
- **Focus ring is Cyan** (9.81:1 against Midnight). Do not place the ring directly against Coral (1.33:1); keep the 2–3px offset onto the page background.
- **Border is decorative only.** Its 1.5–1.9:1 does not identify an interactive boundary (WCAG 1.4.11 needs 3:1). Form fields use Secondary Text at **55% or more opacity** for their outline (3.35:1 or better on every surface).
- Every text pair above passes AA for normal text.

### Media mapping

Coral is Documents and the brand; Cyan (`signal`) is Audio. Video uses Coral marks on neutral footage rather than a third hue, which keeps Cyan restrained. The D0 mint idea is withdrawn for new work, and mint stays only in the existing pages' tokens.

### Gradients and light

- **Ambient light**: radial gradients only, at most 22% opacity, placed off-centre behind the lit subject (for example `radial-gradient(55% 45% at 50% 30%, rgb(var(--or-coral) / .16), transparent 70%)`). Implemented as `AtmosphericGlow`.
- **Frame tint**: a warm or cool 6–10% radial gradient at the top centre inside product frames.
- **Banned**: full-bleed bright gradients, such as the current cyan FinalCta banner.

## 4. Typography

Poppins stays for display (H1 and display H2, 600, tight tracking). Inter for everything else. Technical annotations (timecodes, figure labels, format names, dates) use the system monospace stack (`ui-monospace, SFMono-Regular, Consolas, monospace`), so no new font download.

| Role | Desktop | Mobile | Notes |
|---|---|---|---|
| H1 home | Poppins 64/68, 600, -0.035em | 38/42 | One line of promise, up to 2 lines |
| H1 pages | Poppins 52/58, 600 | 34/40 | Industry and feature H1s are longer; allow 2–3 lines at 20–22ch |
| Display H2 (narrative moments) | Poppins 44/50, 600 | 30/36 | At most 2–3 per page |
| Section header pair | Inter 22/30, 600 in `ink`, followed by the same size in `ink-muted` | 19/27 | The default H2: compact, two-tone |
| H3 | Inter 18/26, 600 | 17/25 | |
| Body large | Inter 18/30 | 17/28 | Lede paragraphs |
| Body | Inter 16/26 | 16/26 | Raised from 15px for readability |
| Meta and mono | Mono 12–13/18, uppercase optional | same | Labels, timecodes |
| Article body | Inter 17/30, 70ch max | 16/27 | Editorial pages |

Fluid sizes use `clamp()` between the mobile and desktop values. Map these onto the existing `fontSize` tokens; do not add parallel ones.

## 5. Layout

- **Content frame**: keep `max-w-content` (77rem, 1232px) for continuity; product frames may break out to 1280px. Wide screens add margin only.
- **Gutters**: 20px mobile, 24px tablet, 32px desktop (current values).
- **Section rhythm**: `section-lg` 160px desktop / 96px mobile for marketing narrative; `section` 112 / 80 for standard; `section-editorial` 80 / 64 for industry, article and FAQ pages. These replace the single 96px.
- **Separation by light, not boxes**: fewer bordered panels; sections separate through space, darkness and the occasional hairline with a redaction-bar sweep.
- **Grids**: 12 columns; text columns at most 640px; reading measure 65–70ch.

## 6. Components

| Component | Recipe |
|---|---|
| **ProductFrame** | 16px radius, 1px hairline, top highlight, `0 30px 80px rgba(0,0,0,.45)` shadow, format-tinted radial glow behind it (`::before`, 12–18% opacity), optional window chrome strip (title only, no fake controls). Inner image radius 10px. |
| **FocusLens** | Applied to a real capture: `mask-image` edge fades (left, right, bottom), plus an optional spotlight. A dark overlay at 55–70% everywhere except the region of interest, done with a `radial-gradient` or rectangular mask. The lit region must contain the capability being described. |
| **AmbientLight** | Absolutely positioned decorative layer (`aria-hidden`); 1–3 radial gradients and an optional redaction-bar composition. |
| **Primary button** | Coral fill, dark label, 10px radius, 44px minimum height, inner top highlight, coral glow on hover (the existing `shadow-action`). |
| **Secondary button** | Transparent, hairline border, `ink` label, `surface-active` on hover. |
| **Text link** | `ink`; arrow shifts 2px on hover; underline on focus. |
| **Card** | `surface-raised` at 60–80% opacity over canvas, hairline, top highlight, 14px radius; the hover lifts the border to 12% and adds a faint format glow. |
| **Two-tone header** | H2 plus muted continuation (see Typography). |
| **Capability index** | Vertical list where the active item is `ink` and the rest `ink-subtle`; drives the adjacent visual (Raycast's "What else" pattern, rebuilt AA-compliant and keyboard-operable as a tablist). |
| **Figure annotation** | Mono labels with 1px leader lines on technical diagrams ("FIG. 1 · REVIEW LIFECYCLE"). Only on conceptual diagrams, never on captures. |
| **Nav** | Floating bar inside the content frame: 12px from top, 16px radius, hairline, highlight, `backdrop-filter: blur(12px)` over `canvas` at 70%. Dropdown panels use the same recipe. Behaviour unchanged. |
| **Footer** | Hairline top, one ambient bar bleeding over it, registry-driven columns. |

## 7. Controlled product exposure

The product should be understandable without exposing every internal panel.

1. **One capability per crop.** Each visual answers one question ("what does a reviewed mark look like?"). Crop to the page and the findings for that mark, not the whole editor.
2. **Mask the rest.** Edge fades and spotlight overlays push unrelated chrome into darkness. They are presentation only, **not protection**: anything sensitive must be absent from the source capture.
3. **Never add or alter UI.** Lighting, background, framing, masking, scale and perspective under 6° are allowed. Added buttons, edited labels, fabricated results or composited marks are not.
4. **Label honestly.** Captures carry captions in the house style ("OpenRedakt document review, synthetic statement"). Conceptual art is never captioned as product.
5. **Mobile gets its own crop.** Use art direction (`<picture>` or `getImageProps`) rather than shrinking the desktop frame.

## 8. Motion system

| Token | Value | Use |
|---|---|---|
| `duration-fast` | 150ms | Hover colour, focus |
| `duration-base` | 250ms | Menus, tabs |
| `duration-reveal` | 500ms | Scroll reveals |
| `duration-ambient` | 24–40s | Light drift |
| `ease-standard` | `cubic-bezier(.2,.7,.2,1)` | Default |
| `ease-spring` | CSS `linear()` spring (overshoot about 3%) with a `cubic-bezier(.34,1.3,.64,1)` fallback | Tabs, toggles, panel open |

**Patterns:**
- **Reveal**: opacity 0 → 1 plus 12px lift, stagger 60ms, once. Extends the existing `AnimateOnScroll` contract.
- **Focus shift**: in a capability index, the lens and glow cross-fade between crops in 250ms.
- **Range sweep**: a redaction bar grows across its target in 600ms when the section enters view, which demonstrates "marking".
- **Video loops**: only for audio and video demonstrations, 6–12s, muted, poster first.

**Reduced motion** (`prefers-reduced-motion: reduce`): no ambient drift, no lift, no sweeps, no autoplay. Content appears immediately and video shows its poster with a play control. This is a requirement, not an enhancement.

## 9. Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| ≥1280 | Full compositions; product frames up to 1280px |
| 1024–1279 | Same layout with tighter type; dropdown nav remains |
| 768–1023 | Two-column becomes stacked text then visual; product crops switch to their tablet variant; mobile nav |
| <768 | Single column; product crops bleed off the right edge (deliberate, as on Raycast); ambient light reduced to one gradient; section padding about 60% |

## 10. Accessibility requirements

- Contrast: body text at least 4.5:1 and large text at least 3:1, using the tokens above. CTA labels dark on coral.
- Every effect is decorative and `aria-hidden`. No text baked into images except inside genuine captures, which carry alt text describing the shown capability.
- Focus visible on every interactive element: the 2px cyan ring stays.
- Keyboard parity for any hover-driven demo: tabs or buttons, never hover-only.
- Motion as in §8; no flashing above 3Hz.
