# Phase 1 QA Results

Date: 2026-10-13  
Branch: `feat/saferedact-marketing-revamp`  
Build under test: clean `next build` followed by `next start`

## Automated checks

- `npm run typecheck`: pass.
- `npm run lint`: pass with no ESLint warnings or errors. Next.js reports its existing multi-lockfile workspace-root advisory.
- `npm run build`: pass; `/` is statically generated and `/api/contact` remains dynamic.
- `node --test tests/phase1-components.test.mjs tests/phase1-homepage.test.mjs`: 5/5 pass against the production server.
- `git diff --check`: recorded in the final handoff after documentation updates.

## Viewport and geometry checks

Scrollbar width accounts for the difference between the requested viewport and the document client width. At every viewport, document scroll width matched client width; no horizontal page overflow was present.

| Requested viewport | Hero | H1 | Navigation |
| --- | --- | --- | --- |
| 1440×900 | 1425×636 | x 97, y 284, 608×115 | Desktop |
| 768×1024 | 753×1084 | x 24, y 266, 705×130 | Mobile/tablet |
| 390×844 | 375×901 | x 20, y 220, 305×111 | Mobile |
| 320×844 | 305 px document width | x 20, y 220, 265×111 | Mobile |

- Exactly one `h1` is rendered.
- Computed heading stack starts with Poppins; computed body stack starts with Inter.
- The navigation changes from the mobile trigger at 991 px to the desktop navigation at 992 px. It remains desktop navigation at 1024 px.
- Settled production captures are stored in `docs/marketing-revamp/phase-1-screenshots/`.

## Interaction and accessibility checks

- Opening mobile navigation moves focus to the in-dialog close control.
- `Shift+Tab` from the first control wraps to the last `Download for Windows` control.
- `Escape` closes the dialog and restores focus to `Open menu`.
- Activating the in-dialog close control also closes the dialog and restores trigger focus.
- The FAQ control `What information can be redacted?` changes `aria-expanded` to `true` when opened.
- Focus styles remain globally visible, a skip link is present, and the mobile navigation locks background scrolling while open.
- Reduced-motion CSS collapses animation/transition durations and the hero uses `motion-safe` animation utilities, so content remains present without motion.

## Contrast checks

- Canvas text `#080914` on coral `#E47755`: 6.67:1.
- Canvas text `#080914` on coral hover `#F08A66`: 8.05:1.
- Preserved light-section heading `#0E2A47` on white: 14.57:1.

## Form behavior

- Empty contact payload: HTTP 400 with `Missing required fields`.
- Complete local QA payload: HTTP 200 with `{ "success": true }`.
- The endpoint still logs the accepted submission; it does not deliver email or write to a CRM. The rendered confirmation copy explicitly preserves that limitation.

## Content verification boundary

Marketing capability copy is limited to evidence recorded in `APP_CAPABILITY_AUDIT.md` from the application repository at `M:\Safaridesk\redact`. This pass does not certify detector accuracy, export completeness for every possible source file, external download availability, performance, certifications, or compliance guarantees.

## Remaining visual scope

The header, hero, capability strip, and shared primitives are the only redesigned sections in this phase. Downstream sections retain their existing layouts, now using safer shared typography and sanitized app-backed copy, and remain the recommended next visual migration.
