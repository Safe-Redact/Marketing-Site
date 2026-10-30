# Raycast reference analysis

Phase D0 · observed 2026-10-26 · internal reference only

This document records what raycast.com actually does, measured in a browser, so the OpenRedakt redesign borrows principles rather than surface styling. **Observed** facts come from computed styles, DOM inspection and captured frames. **Estimate** marks anything inferred from screenshots. Screenshots are in `references/raycast/` (see its README for provenance). Raycast's assets, copy and illustrations must not be reused.

## 1. Summary: why it works

1. **The product is the hero, not the headline.** Section headings are small (20px/500). The visual weight sits in product windows that are framed, lit and cropped.
2. **One brand motif recurs.** Blurred diagonal red light bands appear in the hero canvas, behind product windows, in the snippet card and above the footer. One idea, used with discipline.
3. **Darkness is used as a mask.** Edges of windows, keyboards and lists fade into the near-black background with CSS `mask-image` gradients. Only what matters stays lit.
4. **Physical metaphors carry abstract benefits.** Speed, ergonomics and reliability are shown as keycaps on a fading keyboard; the closing CTA is a glowing ⌘ + space bar.
5. **Restraint in colour.** Grey ramp (#07080A → #E6E6E6) plus one brand red. Feature accents (blue, green, yellow) appear only inside product content.
6. **Consistent frame, variable content.** A 1204px container, 224px section padding and a repeated frame recipe hold together very different visuals.

## 2. Global design system (observed)

### Tokens exposed on `:root`

| Group | Values |
|---|---|
| Greys | `--grey-900 #07080A` (page) · 800 `#0C0D0F` · 700 `#111214` · 600 `#1B1C1E` · 500 `#2F3031` · 400 `#434345` · 300 `#6A6B6C` · 200 `#9C9C9D` · 100 `#CDCECE` · 50 `#E6E6E6` |
| Foreground | `--color-fg #F4F4F6`, fg-200 `#C2C7CA`, fg-300 `#78787C`, fg-400 `#5E6366` |
| Accents | red `#FF6161` / `#FF6363`, blue `#57C1FF`, green `#59D499`, yellow `#FFC533`, each with a 15% "transparent" variant |
| Border | `--color-border #242728`; most frames use `rgba(255,255,255,0.06–0.08)` instead |
| Radius | 4 / 6 / 8 / 12 / 16 / 20 / 24px |
| Spacing | 4–224px scale; `--spacing-13: 224px` is the section padding |
| Containers | xs 746 · sm 1064 · default 1204 · lg 1280 |
| Motion | `--spring-1`, a CSS `linear()` easing that overshoots to about 1.043 and settles. A spring without JavaScript |
| Fonts | Inter (all text) and JetBrains Mono (technical labels, version strings, dates) |

### Layout geometry

| Measure | 1440 | 1920 | 768 | 390 |
|---|---|---|---|---|
| Content frame | 1204px, centred | 1204px (wide screens add margin only) | 736px (16px gutters) | 358px (16px gutters) |
| Nav bar | floating, 16px from top, 1204×76 | same | 736×58 | 358×58 |
| Hero height | 967px | 967px | 967px | ≈711px |
| H1 | Inter 64/70.4, weight 600 | 64px | 64px | 36/39.6 |
| Section padding | 224px top and bottom | same | same | reduced (offsets compress about 40%) |
| Page height | 15,983px | 15,983px | 16,661px | 15,948px |

### Typography pattern

- **Section header pair**: a white H2 at 20px/500 directly followed by a grey (#6A6B6C) continuation sentence at the same size, e.g. "Take shortcuts, not detours. / One interface, everything you need." It reads as one two-tone sentence.
- **Display exceptions**: the AI section uses a 32px/500 H2 with -0.8px tracking; "Build the perfect tools." is a 56px/400 H3 with a monospace body. Feature pages vary widely: Windows uses a 168px/400 serif H1, Teams 72px/700, Pro 48/600.
- **Body**: 14–18px; secondary text at `rgba(255,255,255,0.5)` or #9C9C9D.
- **Accessibility note**: #6A6B6C on #07080A is **3.75:1**, below WCAG AA for 20px/500 text. OpenRedakt must not copy that grey at body sizes.

### Surfaces, borders, light

| Element | Recipe |
|---|---|
| Nav bar | transparent fill, `backdrop-filter: blur(5px)`, 1px `rgba(255,255,255,.06)` border, 16px radius, `inset 0 1px 1px rgba(255,255,255,.15)` top highlight |
| Product frame (outer) | 1204×740, radius 19px, 1px `rgba(255,255,255,.08)` border, `0 0 40px 20px rgba(255,255,255,.03)` halo, `inset 0 .5px 0 rgba(255,255,255,.3)` top edge, fill `rgba(0,0,0,.44)` + radial warm tint at top centre |
| Product frame (inner screen) | radius 12px, `#07080A`, 1px white-8% border, 2px soft white glow |
| Primary button | light (#E6E6E6) on dark, 8px radius, 36px tall, 14px/500 dark label, four-layer shadow (2px black ring, 14px white glow, inset bottom shade, inset top white): reads as a physical key |
| Edge fades | `mask-image: linear-gradient(to right, transparent, #000 64px, #000 calc(100% - 224px), transparent)`; vertical fades `linear-gradient(#000 55%, transparent)`; radial masks for keyboards |

## 3. Homepage anatomy (1440×900)

Offsets are measured document positions. Screenshot references are `desktop-1440/home-1440-sNN.jpg`.

| # | Section | y / height | Narrative purpose | Composition | Visual / motion | Mobile (390) |
|---|---|---|---|---|---|---|
| — | Nav (s01) | fixed, 16px from top | Orientation, download | Floating glass bar inside the 1204 frame; 9 text links, Log in, light Download button | Hover brightens grey links; 0.2–0.3s colour transitions | Same card; hamburger opens it into a frosted full-height panel |
| 1 | Hero (s01) | 0 / 967 | Brand promise | Centred H1 (540px wide), 18px subline, light CTA, mono platform note | **Canvas, 1200×967 at 2× DPR**: animated blurred red diagonal bands with grain. Frames change continuously, and **keep animating with `prefers-reduced-motion: reduce`** | H1 36px; canvas 390×615; CTA becomes "The Raycast Keyboard" |
| 2 | Take shortcuts (s03) | 1191 / 1375 | One interface for many tools | Two-tone header; a 1204×740 "desktop" frame holding a live HTML launcher window over a wallpaper image (1793×1011) | A dock of feature icons switches the window content (Clipboard, Emoji, AI…). No auto-advance seen in 6s; 37 Web Animations active | Window bleeds off the right edge; dock below |
| 3 | Not about saving time (s04) | 2566 / 720 | Values: fast, ergonomic, personal, reliable | Left text and CTA; right a keyboard whose keys become benefit tiles | Keycaps fade out radially (mask) | Keyboard scaled and cropped |
| 4 | Extension for that (s05) | 3286 / 1257 | Ecosystem breadth | Header left, category tabs right; horizontal card rail | Cards tinted per brand (Linear purple, Spotify green); rail overflows the frame | Rail scrolls |
| 5 | AI assistant (s06) | 4724 / 1389 | Flagship AI | Centred 32px H2; a large chat window card plus two smaller cards | Live-typed prompt; glow behind window | Cards stack |
| 6 | Professionals (s07) | 6292 / 1100 | Social proof | Testimonial rail with a lit active card; detail panel below | Neighbouring cards fade to dark | Single card |
| 7 | Don't repeat yourself (s08) | 7392 / 1144 | Automation features | Bento grid: one wide card plus two half cards | Product snippets in card corners; brand light bands behind | Stacked |
| 8 | What else (s09) | 8536 / 986 | Breadth index | Large run-on sentence where only the active capability is white and the rest grey; a product card on the right | Active phrase changes the card | Stacked |
| 9 | Stay in the loop (—) | 9522 / 795 | Community | Avatars and links | — | — |
| 10 | Build the perfect tools (s11) | 10317 / 3182 | Developer API | Blueprint grid lines; 56px H3; mono body; isometric exploded diagram labelled "FIG_01" with callouts | Diagram layers | Simplified |
| 11 | Take the short way (s12) | 13499 / 1244 | Final CTA | Full keyboard fading into darkness; ⌘ + space keys glow red | Key glow | Cropped keyboard |
| 12 | Footer (s13) | 14744 / 1239 | Site map | Red light bands bleed over a hairline; six link columns | — | Columns stack |

**Transitions between sections** come from the pure #07080A background plus large padding. There are no section background changes; separation comes from darkness and space. Hairlines appear only at the footer and blueprint section.

## 4. Product presentation principles (observed)

1. **Rebuilt UI, not screenshots.** Launcher, clipboard and chat windows are live HTML. Text is selectable, crisp at any DPR and animatable. Only wallpapers and media are bitmaps.
2. **Selective focus by masking.** Lists, keyboards and windows fade into darkness at one or more edges, so attention lands on the selected row or active key.
3. **Lighting tied to content.** The glow behind a window takes the colour of what is shown (red for the brand, blue for snippets, a warm tint at the top of frames).
4. **Cropping as storytelling.** Windows are cut at the bottom or the right edge, especially on mobile, which implies a larger product without showing every control.
5. **Environment, then window.** Windows sit inside a desktop-like frame (menu bar, wallpaper) that gives context without detail.
6. **Abstract visuals are clearly abstract.** The isometric "FIG_01" diagram and keycap tiles never pretend to be screenshots.

**Proposed for OpenRedakt (not observed):** these principles map to focused crops of the real OpenRedakt editor (a document page, a waveform range, a video frame region), lit by format colour and masked to hide unrelated panels. See `visual-design-specification.md`.

## 5. Motion and interaction notes

| Behaviour | Observation | Implementation class |
|---|---|---|
| Hero light bands | Continuous canvas animation; slow drift and grain (estimate: under 1 cycle per 10s) | WebGL/canvas. **Not needed for OpenRedakt**: CSS gradients plus `transform` drift achieves a comparable effect statically or slowly |
| Reduced motion | Hero keeps animating under `prefers-reduced-motion: reduce` | OpenRedakt must stop or freeze ambient motion |
| Nav hover | Text colour 0.2–0.3s; no underline | CSS |
| Product demo dock | User-driven content switching; spring easing via `linear()` | CSS + small client state |
| Reveals | Content fades and lifts on scroll (estimate from DOM animation count) | CSS + IntersectionObserver |
| Mobile menu | `<div>` toggle (no role, label, `aria-expanded`, or tab stop); nav height transitions 0.3s; body scroll locked | CSS + JS. **The accessibility is weaker than OpenRedakt's current menu; do not copy** |
| Video | No `<video>` on the homepage, AI, Pro or Teams pages; Windows uses a click-to-play poster | Prefer poster plus on-demand video |

## 6. Other pages

| Page | Observed pattern | Relevance |
|---|---|---|
| `/core-features/ai` | Centred 48px H1, product window directly under the CTA, brand light bands framing it; H3 feature list at 16px | Template for OpenRedakt feature pages |
| `/pro` | 48px H1; mixed bento sections with 20–24px headers | Section-header pair reused |
| `/windows` | 168px serif H1 overlaid on a grainy B&W video poster, launcher window intersecting the headline | Example of per-page art direction; too stylised for OpenRedakt's serious tone |
| `/teams` | 72px/700 H1, 36px H2s, bright gradient cards | Shows Raycast's own inconsistency between product lines |
| `/blog` | Visible "Blog" title is not the H1 (the H1 is a 15px "All Posts"); featured post as a split card; three-column cards at 10px radius on #111214; mono dates | Layout worth borrowing; heading structure not |
| Blog article | 48px/600 H1 (32px on mobile); body 16/25.6 at 85% white; 714px measure; media breaks out to 1200px with captions | Matches OpenRedakt's reading needs; keep our TOC and scrollspy |

## 7. Do not copy

- Raycast's assets, illustrations, wallpapers, keyboard imagery, light-band artwork or copy.
- The red diagonal motif. OpenRedakt needs its own signature (see the specification: the *redaction bar*).
- Grey continuation text below AA contrast.
- Non-semantic mobile menu toggle.
- Ambient animation that ignores reduced-motion preferences.
- A blog page whose H1 does not describe the page.
- Download and log-in CTAs. OpenRedakt's conversion is a demo enquiry.
- Productivity tone ("magic", playful emoji). OpenRedakt's audience handles sensitive records.

## 8. Screenshot index

| File | Shows |
|---|---|
| `desktop-1440/home-1440-s01.jpg` | Hero, nav |
| `desktop-1440/home-1440-s03.jpg` | Product frame and window composition |
| `desktop-1440/home-1440-s04.jpg` | Keycap benefit tiles with radial fade |
| `desktop-1440/home-1440-s05.jpg` | Extension card rail with brand-tinted cards |
| `desktop-1440/home-1440-s06.jpg` | AI section, chat window card |
| `desktop-1440/home-1440-s07.jpg` | Testimonial rail with focus lighting |
| `desktop-1440/home-1440-s08.jpg` | Bento grid with product snippets |
| `desktop-1440/home-1440-s09.jpg` | Capability index plus product card |
| `desktop-1440/home-1440-s11.jpg` | Blueprint grid and FIG_01 diagram |
| `desktop-1440/home-1440-s12.jpg` | Keyboard CTA |
| `desktop-1440/home-1440-s13.jpg` | Footer with light bleed |
| `desktop-1440/ai-1440-s01.jpg` | Feature-page hero with product window |
| `desktop-1440/windows-1440-s01.jpg` | Art-directed hero |
| `desktop-1440/blog-1440-s01.jpg` | Blog index |
| `desktop-1440/blog-article-1440-s01.jpg` | Article media breakout |
| `mobile-390/home-390-s01.jpg`, `-s03.jpg`, `-s06.jpg` | Mobile hero, bleeding window, stacked cards |
| `tablet-768/home-768-s03.jpg` | Tablet product frame |
| `interactions/home-1440-hero-motion-frame1–6.jpg` | Hero motion at 500ms intervals |
| `interactions/home-1440-hero-reduced-motion-frame1–3.jpg` | Same under reduced motion (still animating) |
| `interactions/home-390-menu-open-frame1.jpg` | Mobile menu panel |
