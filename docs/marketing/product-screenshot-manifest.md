# Product screenshot publication manifest

Last reviewed: 2026-10-30

The files under `assets/product-screenshots/raw/` are identified by the existing repository README as approved masters. “Build not recorded” is preserved as an evidence gap rather than replaced with an invented identifier. Stage B is implemented but not deployed; the owner’s requested visual review remains the final publication gate.

| Served asset | Source build / scenario | Ownership and data note | Demonstrated claim IDs | Alt text | Native viewport | Approval state / use |
|---|---|---|---|---|---|---|
| `hero-document-review.png` | Build not recorded; document review | Project-supplied approved master; synthetic document scenario recorded in current marketing use | DOC-CANDIDATES, DOC-REVIEW | Current redaction editor with detected items awaiting review | 3440×1440 | **Not published** (removed from `public/` 2026-10-30: product imagery is light-theme only) |
| `step-open.png` | Build not recorded; project workspace | Project-supplied master; local path and legacy application context are visible | DOC-INPUT | Current project workspace with recent redaction projects | 3440×1440 | **Not published** (removed from `public/` 2026-10-29) |
| `step-review.png` | Build not recorded; document review | Project-supplied approved master; synthetic financial statement | DOC-MANUAL, DOC-REVIEW | Document page with marks, manual tools, and findings | 2176×1360 | **Not published** (removed from `public/` 2026-10-29; orphaned) |
| `step-export.png` | Build not recorded; cropped export dialog | Project-supplied master; legacy path context and “Permanent removal” wording exceed current claim policy | DOC-OUTPUT-CHECK | Export settings and output-check notice | 1048×655 crop | **Not published** (removed from `public/` 2026-10-29) |
| `format-documents.png` | Build not recorded; document workspace | Project-supplied approved master; synthetic financial statement with no real personal data | DOC-MANUAL, DOC-REVIEW, DOC-CANDIDATES | Current document editor with page marks, manual tools, reasons, and findings | 2176×1360 | **Not published** (removed from `public/` 2026-10-30: product imagery is light-theme only) |
| `format-audio.png` | Build not recorded; audio review workspace | Project-supplied approved master; transcript contains no visible names or unique identifiers, but upstream scenario-generation provenance was not retained | AUD-TIMELINE, AUD-EFFECTS, AUD-TRANSCRIPT-CONTEXT | Current audio workspace with waveform, speaker-separated transcript, transport controls, and timeline | 1102×715 crop | **Not published** (removed from `public/` 2026-10-29); provenance still unconfirmed |
| `format-video.png` | Build not recorded; third-party broadcast footage | Contains PBS NewsHour watermark, identifiable people, and third-party filenames | None approved | Current video workspace over third-party footage | 2559×1379 | **Not published** (removed from `public/` 2026-10-29); prohibited |


## Masked masters (2026-10-29, extended 2026-10-30)

Produced by `scripts/build-product-images.mjs` from originals in `M:\site images` (supplied by the team; read in place, never tracked). Masks are baked into the pixels; the served file is the only copy that leaves the machine. Plan: `docs/design/product-visual-audit.md` (§E, §F, §J). Light theme, per owner decision 1 (2026-10-29).

| Served asset | Original (SHA-256) | Source build / scenario | Crop (source px) | Masks (source px) | Demonstrated claim IDs | Placements | Approval state |
|---|---|---|---|---|---|---|---|
| `audio-workspace.png` (1431×832, revision `6ab06c9ada24`) | `audio interface.png` (`53a70caec0c1…`) | 0.3.3, light; audio editor, no range selected, not playing | 0,34,1431,832 (no title or status bar) | text 1122,228,240,104 (project file names); soft 1072,85,318,781 (Project Files panel); frost 1394,85,37,781 (icon rail incl. image-format entry) | AUD-INPUT, AUD-EFFECTS (caption limited to mute, tone, silence, noise) | Audio page hero (`workspace`) and effects row (`effectsBeside`); homepage audio row, `/features` audio tile and industry rows (`workspaceFourThree`); `/features` audio overview, Industries hub and industry rows (`effectsBeside`); phones `waveformSquare` / `effectsPanel` | Implemented, not deployed; owner visual approval pending. Provenance of the recording to be confirmed (§I). |
| `audio-export.png` (1100×688, revision `72c0e91b5274`) | `audio export.png` (`388c09e10a5f…`) | 0.3.3, light; audio export dialog | 160,130,1100,688 (dialog on the plain editor surface, clear of the "opened" toast) | text 606,240,476,20 (file name); text 606,388,428,20 (location); frost 868,432,258,60 ("Schedule optional": not connected in the app) | AUD-EXPORT | Homepage step 3 (`stepWide`); How It Works 05–06 and industry audio rows (`dialogFourThree`); phones `summary` | Implemented, not deployed; owner visual approval pending. Decision 5 (hide Schedule in the app and re-capture) still open. |
| `project-workspace.png` (1438×832, revision `c6a8707ed118`) | `home pag workspace.png` (`2c3f12fdc584…`) | 0.3.3, light; project library ("Recent") | 0,34,1438,832 | text: Locations paths, continue-card name and file chips, nine card names; frost: file-type icons on every thumbnail alike (some showed video or image files) | DOC-INPUT, AUD-INPUT | Homepage step 1 (`hubStep`); How It Works 01–02 (`hubFourThree`); Why OpenRedakt (`hub`); phones `hubMobile` | Implemented, not deployed; owner visual approval pending |
| `document-workspace.png` (1437×824, revision `7b6464add20f`) | `document interface.png` (`039cb6d09185…`) | 0.3.3, light; document workspace, **no document open** | 0,34,1437,824 (status bar with a test file name and a refused licence key is outside the crop) | text: project name ×2, three file names (statuses kept) | DOC-MANUAL (tools only; alt text says no document is open) | Homepage document row and industry rows (`manualTools`); `/features` tile and Document page tools row (`toolsCanvas`); Industries hub and industry rows (`filesPanel`); phones `manualMobile` / `filesMobile` | Implemented, not deployed; owner visual approval pending |
| `document-export.png` (598×620, revision `2426131cd4ab`) | `document export.png` (`5b20f616ee19…`) | 0.3.3, light; document export settings, **nothing marked** (export unavailable) | 584,180,598,620 (settings column; the "Permanent removal" column is outside the crop) | text: document name, export folder, export name | DOC-REPORT (option shown), DOC-OUTPUT-CHECK section context | Document page "Treat export as another review step" (`settings`) | Implemented, not deployed; owner visual approval pending |
| `editorial-document-cover.png` (950×534, revision `f9944220fa4e`) | `document interface.png` (`039cb6d09185…`) | 0.3.3, light; manual redaction tools beside the page | 0,80,950,534 (no names in this region) | none; finish: 1.2 blur, 35% coral soft-light tint | Editorial only (no claim) | Blog fallback cover for articles without their own image | Implemented, not deployed (re-sourced 2026-10-30 from the light capture) |

Verification: masked regions keep 1.4–2.2% of their original edge energy (Laplacian standard deviation), so no glyph structure survives; unmasked regions are byte-identical to the original; the masters carry no EXIF, XMP, IPTC or ICC data.

Not published from the same set: `ai tools for redaction.png`. Its distinctive content is the Tools menu, which lists Video Assistant, the Record and Schedule stubs, and audio "Run AI Detection", which is not in the register. The other three, first held back on 2026-10-29, are published as of 2026-10-30 with the crops, masks and truthful alt text recorded above.

## Stage B non-screenshot visual

The video feature route uses an original HTML/CSS diagram representing only VID-MANUAL, VID-TIMELINE, VID-EFFECTS, and VID-AUDIO concepts. It contains no third-party asset or captured personal data. Replace it only with an owned, synthetic-data capture that records source build, scenario, claim IDs, native viewport, alt text, and owner approval here.

## Required future captures

- Owned synthetic video footage covering a manual region, bounded timeline, supported visual effect, audio lane, preview, and rendered-output inspection.
- Reproducible output-verification/report capture whose wording does not promise permanent, irreversible, certified, or complete removal.
- A refreshed audio capture if the owner cannot confirm the source-data provenance of the current approved master.

## Light-theme only (2026-10-30)

The dark captures of the earlier build are no longer published anywhere on the site. Every product image now comes from the masked light-theme masters above. Changes:

- **Homepage hero.** Now the project library (`project-workspace.png`, `hub`, starting at x 3 to drop a window-snap line), framed as an application window.
- **Homepage document and audio stories.** Both use the full window width, so their toolbars stay whole: `document-workspace.png` `story` 1437×824 and `audio-workspace.png` `story` 1431×821. The two ratios match to within 0.05%, so the frames render at the same size.
- **Workspace files crop.** `document-workspace.png` `filesPanel` is recomposed around the project panel (577×433 at 860,96).
- **Findings row.** The Document page "Start with evidence" row is text only until a light capture of the findings list exists.
