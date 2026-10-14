# SafeRedact Marketing Revamp Visual QA Plan

## QA objective

Confirm that the redesigned SafeRedact page adopts the reference's composition, spacing rhythm, hierarchy, and responsive behavior while remaining an original SafeRedact experience with accessible interactions and no functional regressions.

The reference is a directional benchmark, not a pixel-clone target. A difference is acceptable when it results from SafeRedact's real content, original assets, accessibility needs, or a documented responsive choice.

## Baselines

### Reference captures

- `reference-screenshots/elloe-desktop-1440x900.png`
- `reference-screenshots/elloe-tablet-768x1024.png`
- `reference-screenshots/elloe-mobile-390x844.png`

### Existing SafeRedact captures

- `baseline-screenshots/saferedact-desktop-1440x900.png`
- `baseline-screenshots/saferedact-mobile-390x844.png`

Capture dates and inspection conditions are recorded in `REFERENCE_DESIGN_SPEC.md`.

## Required viewport matrix

| Viewport | Purpose |
| --- | --- |
| 1440×900 | Primary desktop reference comparison |
| 1280×800 | Common laptop and container compression |
| 1024×768 | Navigation collapse boundary and tablet landscape |
| 768×1024 | Primary tablet reference comparison |
| 430×932 | Large mobile |
| 390×844 | Primary mobile reference comparison |
| 375×812 | Common mobile and screenshot parity |
| 320×568 | Minimum supported narrow layout |

Also inspect at 200% browser zoom at 1280px and with text-only zoom where available.

## Capture protocol

1. Use a production build (`npm run build` then `npm run start`) for final captures.
2. Use a clean browser profile and disable extensions that alter layout.
3. Keep device scale factor at 1 unless testing high-DPI assets.
4. Capture both above-the-fold and full-page images.
5. Wait for fonts and images to finish loading.
6. Capture a second set with `prefers-reduced-motion: reduce`.
7. Use deterministic content and avoid timestamps or randomized visual states.
8. Record viewport, commit/ref, browser version, date, and motion preference with each capture.

## Geometry checks

### Global

- Desktop content frame resolves to 1232px at 1440px.
- Mobile gutters resolve to 20px at 390px and never fall below 16px at 320px.
- No section introduces horizontal scrolling except an explicitly labeled tab rail.
- Dark canvas remains visually continuous; section changes are made with spacing and subtle surface contrast.
- Major section spacing is consistent and follows token values rather than local margins.

### Header

- Header stays fixed without jumping when the scrolled style activates.
- Logo, links, and CTA align to the content frame.
- Desktop navigation has no wrap at 1024/1280/1440.
- Collapsed menu starts immediately beneath the header and fits within the viewport.
- Opening the menu does not shift page width.

### Hero

- Desktop is a balanced two-column layout with the product visual aligned to the copy block.
- Hero headline does not exceed three lines at 1440px or four lines at 390px.
- Primary CTA is at least 44px high and becomes full-width on mobile if the final composition calls for it.
- Product visual is legible at mobile size and contains no copied Elloe graphic elements.

### Narrative sections

- Outcome trio aligns evenly on desktop and stacks with clear hierarchy on mobile.
- Sparse feature grid uses consistent icon/title/body alignment.
- Workflow preview and accordion align in two columns on desktop, one column on mobile.
- Tab labels remain reachable by keyboard and readable without clipped text.
- Resource/use-case cards match shared radius, border, and shadow tokens.

### Final CTA and footer

- Gradient CTA remains the strongest saturated element on the page.
- CTA text maintains WCAG contrast against every point in the gradient.
- Footer columns align on desktop, wrap predictably on tablet, and stack in logical reading order on mobile.
- No footer link points to `#` unless it is a real in-page destination.

## Typography checks

- Confirm actual loaded fonts, not fallback fonts, in browser computed styles.
- Verify intended font size, weight, line height, and max width for hero, major H2, section H2, feature titles, body copy, and labels.
- Check line breaks at every viewport; avoid single orphan words where practical.
- Body text is at least 16px for primary reading copy on mobile.
- Do not use color alone to distinguish active tabs, links, errors, or statuses.

## Color and effects checks

- Compare sampled values against the approved SafeRedact tokens, not directly against Elloe's proprietary palette.
- Verify consistent border alpha and surface elevation.
- Confirm glow effects are limited to primary CTA and the final gradient panel.
- Confirm muted text passes at least 4.5:1 contrast for normal-size copy.
- Confirm focus indicators pass 3:1 against adjacent colors.

## Motion checks

- Inspect initial load, first scroll reveal, accordion expansion, tab change, header state change, and mobile menu opening.
- Standard transitions should remain approximately 200–400ms.
- Scroll reveals should be subtle opacity/translate changes and should not replay excessively.
- No animation should block reading or input.
- Under reduced motion, content appears immediately and controls change state without travel/scale effects.

## Accessibility checks

### Keyboard

- Skip link is first and visible on focus.
- Header links, CTAs, menu, tabs, accordion, form, and footer follow logical focus order.
- Mobile menu traps focus while open and restores focus to the opener when closed.
- Escape closes the mobile menu and any disclosure pattern where appropriate.
- Horizontal tab rail is keyboard-scrollable.

### Semantics

- Exactly one H1.
- H2/H3 levels reflect section nesting.
- Tabs use the ARIA tab pattern only if they behave as tabs; otherwise use disclosure/buttons.
- Accordion buttons expose `aria-expanded` and `aria-controls`; collapsed panels are not exposed as active content.
- Form errors and submission status use an `aria-live` region.
- Decorative SVGs are hidden from assistive technology; meaningful visuals have accessible text.

### Resilience

- Test 200% zoom.
- Test increased text size.
- Test high-contrast/forced-colors mode where available.
- Test reduced motion.
- Confirm touch targets are at least 44×44px.

## Functional regression checklist

- All header and footer anchors reach the correct section without content hiding under the fixed header.
- Mobile menu opens, closes via control, closes via Escape, and restores body scroll.
- FAQ and workflow accordions open with mouse, touch, Enter, and Space.
- Desktop/mobile tabs activate correctly and announce selection.
- Download CTA resolves to the approved SafeRedact destination.
- Mailto CTA uses the approved support address.
- Contact form enforces required fields and valid email input.
- Submit loading state prevents duplicate requests.
- API error displays a non-blocking accessible message.
- API success reflects the actual server result and does not over-promise a response time.
- Robots, sitemap, metadata, and JSON-LD still render.

## Performance checks

Run Lighthouse or equivalent against a production build on desktop and simulated mobile.

Targets:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+
- LCP: below 2.5s on the test profile
- CLS: below 0.1
- INP: below 200ms where measurable
- No increase in first-load JavaScript without a documented reason
- Hero artwork has explicit dimensions and no layout shift
- No runtime dependency on third-party reference assets

## Comparison method

Use three complementary reviews:

1. **Reference comparison:** Compare section order, content density, column proportions, whitespace rhythm, typography hierarchy, button geometry, and breakpoint behavior.
2. **Baseline regression:** Compare against the current SafeRedact captures to ensure functionality and brand cues were not accidentally lost.
3. **Token consistency:** Inspect the implementation for shared classes/tokens and flag magic values that should be centralized.

For image-diff tooling, use overlays only to identify geometry drift. Do not optimize toward copying Elloe artwork or exact proprietary compositions.

## Defect severity

| Severity | Examples |
| --- | --- |
| Blocker | Broken build, inaccessible primary navigation, form falsely reports success, copied third-party asset, unapproved compliance claim |
| High | Horizontal overflow, unreadable CTA, missing focus state, major section geometry broken at a required viewport |
| Medium | Token inconsistency, awkward line breaks, spacing drift over 16px, animation not honoring reduced motion |
| Low | Minor icon alignment, sub-4px spacing variance, subtle shadow mismatch |

## Sign-off evidence

The implementation is ready only when the handoff includes:

- Passing build, typecheck, and lint output
- Required viewport screenshots
- Functional regression results
- Keyboard and reduced-motion notes
- Accessibility scan results plus manual findings
- Performance results
- Final claims review with approver and date
- A list of any accepted visual differences from the reference and why they were chosen
