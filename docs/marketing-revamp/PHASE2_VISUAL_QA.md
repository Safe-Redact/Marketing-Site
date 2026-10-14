# SafeRedact Marketing Revamp — Phase 2 Visual QA

Date: 2026-10-14

## Reference basis

The implementation used the captured Elloe TruthChecker screenshots in `reference-screenshots/` plus the earlier live-browser measurements documented in `PHASE2_SECTION_MAPPING.md`.

Measured reference desktop section rhythm at 1440×900:

| Region | Approximate height |
| --- | ---: |
| Hero | 902px |
| Proof strip | 264px |
| Sparse capability section | 573px |
| Media plus accordion | 539px |
| Platform tabs | 1019px |
| Resource cards | 657px |
| CTA and footer region | 572px |

The reference uses a continuous dark canvas, restrained internal borders, left-aligned display typography, broad horizontal whitespace, and a single saturated pre-footer conversion surface.

## Critique and correction pass 1

The first implemented 1440px render measured 7272px overall with no horizontal overflow. The main section geometry was:

| SafeRedact region | Initial height |
| --- | ---: |
| Hero | 636px |
| Capability strip | 189px |
| Capabilities | 1158px |
| Workflow | 937px |
| Format tabs | 955px |
| Use cases | 857px |
| FAQ | 882px |
| CTA/contact | 1239px |

The five largest discrepancies and corrections were:

1. **Capability section density:** reduced the gap before its heading from 112px to 80px on desktop and tightened the capability grid rhythm.
2. **Workflow preview height:** reduced the desktop preview from 480px to 440px and the inner page from 350px to 310px.
3. **Use-case card height:** reduced original visual headers from 160px to 144px and tightened small-screen card padding.
4. **Fixed-header anchor occlusion:** added a 7rem section scroll margin so anchored headings clear the navigation.
5. **Format-tab semantics:** made every tab reference one stable panel ID; the active tab remains the panel label.

These changes preserve the approved 1232px container and type scale while removing unnecessary vertical drift.

## Critique and correction pass 2

The second pass covered source-level visual consistency and production behavior:

- All migrated sections use the shared dark canvas and `Container` primitive.
- No opaque legacy light-section token remains in the Phase 2 section sources.
- Saturated color is concentrated in the final conversion panel.
- Original product illustrations share the same surface, border, radius, grid, and accent vocabulary.
- Exactly one H1 is emitted by the production page.
- Every navigation target exists and no `href="#"` destination is emitted.
- Poppins/Inter remain supplied by the Phase 1 layout and tokens.
- Reduced-motion CSS disables animation loops and smooth scrolling.
- Outcome-grid divider and edge selectors are applied to actual grid siblings, avoiding the wrapper-scoping error found in final review.
- The format panel is keyboard focusable and uses the global visible focus treatment.

## Screenshot status

Required output directory: `docs/marketing-revamp/phase-2-screenshots/`.

Final post-build captures at 1440×900, 768×1024, 390×844, 320px width, and full-page desktop/mobile could not be produced in this continuation. The computer-control layer rejected both existing localhost tabs with: “browser URL policy blocks this action,” even though the optimized production server was healthy and returned HTTP 200. The restriction also prohibited using an alternate browser-control surface as a workaround.

Because no trustworthy final pixels were available after correction pass 2, this report does not claim that those screenshots were captured. The exact acceptance step still needed is documented in `phase-2-screenshots/README.md`.

## Visual differences intentionally retained

- SafeRedact product workbenches are original React/CSS compositions.
- SafeRedact copy is longer where caveats are needed to remain product-accurate.
- The existing contact form remains below the bright CTA, increasing the conversion region height relative to the reference.
- SafeRedact uses coral for action emphasis and cyan/mint for detection/status, rather than copying Elloe's proprietary illustration palette.

## Acceptance threshold

Visual acceptance requires the missing production captures to confirm:

- zero horizontal overflow at all four widths;
- no clipped tab rail, workbench, card, or footer content;
- section headings clear the fixed header after anchor navigation;
- desktop card alignment and mobile stacking remain balanced;
- no layout shift after fonts and image assets settle.
