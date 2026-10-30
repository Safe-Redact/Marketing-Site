# Redesign reference captures

**Internal analysis material only.** Nothing in this folder may be copied into `public/`, used on the OpenRedakt website, shared publicly, or used as a design source to trace. Raycast screenshots belong to Raycast; they are kept to support the observations in `../raycast-reference-analysis.md`.

## Provenance

| Folder | Source | Viewport | Observed | Method | Analytical use |
|---|---|---|---|---|---|
| `raycast/desktop-1440/` | raycast.com: `/`, `/core-features/ai`, `/pro`, `/windows`, `/teams`, `/blog`, `/blog/a-technical-deep-dive-into-the-new-raycast` | 1440×900, DPR 1 | 2026-10-26 | Headless Chrome via the DevTools protocol. Each page was scrolled top to bottom to trigger lazy media and reveals, then captured per section (`-sNN`) and as a 0.5-scale full page (`-fullpage`) | Section anatomy, spacing, product framing, typography |
| `raycast/wide-1920/` | `/` | 1920×1080 | 2026-10-26 | As above, full page at 0.4 scale | Confirms the fixed 1204px content frame on wide screens |
| `raycast/tablet-768/` | `/`, blog article | 768×1024 | 2026-10-26 | As above | Tablet adaptation |
| `raycast/mobile-390/` | `/`, `/core-features/ai`, `/blog`, blog article | 390×844, Android Chrome UA, touch emulation | 2026-10-26 | As above, full page at 0.6 scale | Mobile hero, product-window cropping, article measure |
| `raycast/interactions/` | `/` | 1440×900, 390×844, 768×1024 | 2026-10-26 | Hero frames at 500ms intervals with and without `prefers-reduced-motion: reduce`, nav hover states, mobile and tablet menu open | Motion and reduced-motion behaviour, navigation states |
| `openredakt-current/` | Local dev server `https://localhost:3000`, branch `feat/openredakt-stage-b-features` | 1440×900, 390×844 | 2026-10-26 | Same headless method | Current-state baseline for the audit |

The `capture-log-*.json` files hold the raw measurements recorded during capture: section offsets, heading sizes, nav geometry, canvas counts and page heights.

## Limits

- Headless rendering matches desktop Chrome, but GPU-dependent effects can differ slightly from a real display.
- Raycast serves Windows-specific copy to a Windows user agent ("Download for Windows"). Content seen on macOS may differ.
- Full-page images are downscaled; use the per-section shots for detail.
- The folder is roughly 14 MB. If repository size matters, move it to shared storage and keep this README.
