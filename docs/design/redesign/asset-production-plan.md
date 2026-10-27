# Asset production plan

Phase D0 · 2026-10-26 · nothing in this plan has been produced yet

## 1. Principles

1. **Inventory first.** Existing masters are reused as interim crops where the manifest allows (see the current-state audit, §4). Everything else is new.
2. **Product truth.** Every image that looks like OpenRedakt *is* OpenRedakt: a capture of the shipped app with synthetic data. Conceptual art never imitates the UI.
3. **Classes:** **REAL** real product capture · **ENH** enhanced product capture (lighting, background, framing, masking, perspective under 6°; no added or altered UI) · **GEN** generated illustration · **MOT** motion asset · **CSS** CSS/SVG composition rendered by the site.
4. **Sensitive data never reaches a capture.** Masks and overlays are presentation, not protection.
5. **Provenance per asset:** source build, scenario, data origin, claim IDs, native size, alt text, approver and date go into `docs/marketing/product-screenshot-manifest.md` before publication.

## 2. Asset requirement matrix (summary)

Priority: **P1** blocks the homepage and feature pages · **P2** completes core pages · **P3** enhancement.

| ID | Page · section | Class | Shows (one capability) | Delivery size | Mobile variant | Priority | Depends on |
|---|---|---|---|---|---|---|---|
| CAP-DOC-01 | Home hero; Document hero; home format triptych | ENH | A document page with several reviewed marks and the matching findings rows | 2400×1500 master → 1600×1000 (16:10) | 1080×1350 (4:5) crop of the page area | P1 | DATA-DOC-1, capture env |
| CAP-DOC-02 | Document · Candidate review; home capability index | ENH | One candidate finding selected: approve and reject controls plus a recorded reason | 1600×1000 | 1080×1080 | P1 | DATA-DOC-1, configured engine |
| CAP-DOC-03 | Document · Manual control; Local Government | ENH | An area mark being drawn over a signature or handwriting on a scan | 1600×1000 | 1080×1080 | P2 | DATA-DOC-2 |
| CAP-DOC-04 | Document · OCR; Healthcare | ENH | A scanned page with recognised text selectable or highlighted | 1600×1000 | 1080×1080 | P2 | DATA-DOC-2, OCR configured |
| CAP-DOC-05 | Document · Output evidence; How It Works stage 6 | REAL | The rendered export re-opened, with the output-check result. Wording must not say permanent or irreversible removal | 1600×1000 | 1080×1350 | P1 | Owner check of current dialog wording |
| CAP-DOC-06 | How It Works stage 6; Legal (optional) | REAL | First page of a generated redaction report | 1200×1500 (4:5) | same | P3 | DOC-REPORT export |
| CAP-AUD-01 | Audio hero; home triptych | ENH | Waveform with one selected range and a mute or tone effect, transcript passage visible alongside | 2400×1500 → 1600×1000 | 1080×1350 (waveform only) | P1 | DATA-AUD, FFmpeg |
| CAP-AUD-02 | Audio · Effect choice | ENH | Effect panel (Mute, Tone, Silence, Noise) with a range selected and preview playing | 1600×1000 | 1080×1080 | P2 | DATA-AUD |
| MOT-AUD-01 | Audio · Manual-first section | MOT | 8–10s: drag a range, choose Tone, playhead previews it | 1600×1000 MP4 (H.264) and WebM; ≤2.5 MB; poster | 1080×1080 loop | P2 | CAP-AUD set-up |
| CAP-VID-01 | Video hero; home triptych | ENH | A frame of owned footage with one pixelate or blur region applied, timeline lane showing the region's range | 2400×1500 → 1600×1000 | 1080×1350 | P1 | DATA-VID, FFmpeg |
| CAP-VID-02 | Video · Visual review | ENH | Candidate list (face, plate, visible text) with one confirmed and one rejected | 1600×1000 | 1080×1080 | P2 | Configured detection engines |
| CAP-VID-03 | Video · Picture and sound | ENH | Timeline with a visual-region range and a separate audio-effect range | 1600×1000 | 1080×1080 | P2 | DATA-VID with an audio track |
| MOT-VID-01 | Video · Timeline control | MOT | 10–12s: draw region, set start and end, toggle the effect preview | 1600×1000 MP4/WebM ≤3 MB; poster | 1080×1080 | P2 | CAP-VID set-up |
| CAP-PRJ-01 | Home workflow step 1; How It Works stage 1 | REAL | Project workspace listing synthetic projects of mixed formats; OpenRedakt branding; no local paths | 1600×1000 | 1080×1080 | P1 | Clean capture profile |
| CAP-EXP-01 | How It Works stage 5; home workflow step 3 | REAL | Export dialog with output options (replaces `step-export.png`) | 1400×900 | 1080×1080 | P1 | Owner check of dialog wording |
| CAP-*-LIGHT | Showcase light variants | REAL | Light-theme versions of P1 captures | as P1 | as P1 | P3 | Only if the theme toggle is kept |
| CSS-HERO-BARS | Home hero; closing CTA | CSS | Redaction-bar ambient composition | Responsive | Simplified, one bar group | P1 | None |
| CSS-GRAIN | Global ambient | CSS (SVG asset) | Film grain tile | 256×256 SVG, ≤3 KB | — | P1 | None |
| CSS-BAR-DIVIDER | Section transitions | CSS | One bar sweeping across a hairline | Responsive | — | P2 | None |
| CSS-LIFECYCLE | How It Works hero; home workflow | CSS | FIG. 1: six-stage review lifecycle, three format lanes | Responsive SVG and HTML | Vertical variant | P1 | None |
| CSS-FORMAT-MAP | Features overview; Why | CSS | Three formats feeding one review discipline | Responsive | Vertical | P2 | None |
| CSS-SECTOR-RECORD | Industry heroes; hub cards | CSS | Abstract "record" with format-tinted redaction bars per sensitive category | Responsive | — | P1 | Registry data (exists) |
| CSS-DIRECTORY | Industries hub hero | CSS | Sector groups as lit index | Responsive | — | P2 | None |
| GEN-INSIGHT-COVER | Insights cards, featured, article hero, OG | GEN | Category-keyed abstract cover series | 1600×900 and 1200×630 | 1080×1080 | P2 | Owner approval of generated art |
| GEN-SECTOR-PLATE | Industry heroes (optional) | GEN | Four group-level object still-lifes (no people, no institutions) | 1600×1200 | 1080×1080 | P3 | CSS-SECTOR-RECORD evaluated first |
| OG-DEFAULT | All pages without their own image | CSS → PNG | Wordmark plus redaction bars on navy | 1200×630 | — | P2 | LOGO-01 |
| LOGO-01 | Header, footer, OG | Owner asset | Official OpenRedakt wordmark and mark | SVG | — | P1 | Owner |

## 3. Asset detail cards

Each card covers the 15 required fields: (1) ID · (2) page and section · (3) narrative purpose · (4) what viewers should understand · (5) subject · (6) composition · (7) class · (8) production method · (9) dimensions · (10) overlay and cropping · (11) motion · (12) variants · (13) alt-text direction · (14) provenance and approval · (15) priority and dependencies.

### CAP-DOC-01: reviewed document page
2. Home hero (right of the headline, overlapping the redaction-bar light); Document feature hero; home Documents tile.
3. Prove in one glance that OpenRedakt marks sensitive content on real pages, under a reviewer's control.
4. "A person reviewed these marks; the findings list shows what was found and why."
5. Synthetic financial statement (DATA-DOC-1), 6–10 marks of mixed origin (candidate-accepted and manual), the findings panel showing 3–4 rows with categories and one reason.
6. Page fills about 65% of the frame on the left; findings panel cropped to its first rows on the right; top toolbar and left tool rail cropped out.
7. ENH.
8. Window capture of the dark theme at 200% scaling (see §4), cropped at native pixels. Lighting and mask applied in CSS, not baked into the image.
9. Master 2400×1500; served 1600×1000; hero `priority` load, `sizes` matched to the layout.
10. FocusLens: fade left, bottom and right edges; spotlight on the page; findings panel at 70% brightness. Crop out the status bar (it currently shows "Permanent export").
11. Static. An optional range-sweep accent sits beside the frame, not on it.
12. Desktop 16:10; mobile 4:5 crop of the page only (findings hidden).
13. "OpenRedakt document review: a synthetic bank statement with reviewed redaction marks and the matching findings list."
14. Synthetic data only; build number and scenario recorded in the manifest; claims DOC-MANUAL, DOC-REVIEW, DOC-CANDIDATES; owner approval.
15. P1 · needs DATA-DOC-1 and the capture environment. **Interim**: a focused crop of `format-documents.png` (approved for reuse).

### CAP-DOC-02: candidate decision
2. Document feature "Candidate review"; home capability index item "Review decisions".
3. Show that detection produces candidates, not verdicts.
4. "A finding can be approved or rejected, and a reason is recorded."
5. One finding selected in the list; its mark highlighted on the page; reason field filled from the reason library.
6. Tight crop around the selected finding and the corresponding page region (two-pane crop).
7. ENH · 8. As CAP-DOC-01 · 9. 1600×1000 · 10. Spotlight on the selected row and its mark; everything else at 40% · 11. Static; the lens cross-fades between items in CapabilityIndex · 12. Mobile 1:1 crop of the list row and mark · 13. "Reviewing a detected account number: the finding is selected, its mark is highlighted, and a reason is recorded." · 14. Claims DOC-CANDIDATES, DOC-REVIEW; state the engine configuration in the manifest · 15. P1 · needs a configured detection engine.

### CAP-DOC-03: manual area mark
3. Show human judgement for content detection cannot know. 4. "Reviewers can draw marks over signatures, photos and handwriting." 5. A scanned application form (DATA-DOC-2) with an area selection being drawn over a signature. 6. Page detail plus the manual tool palette; no findings panel. 7. ENH · 9. 1600×1000 · 10. Edge fades; spotlight on the selection · 11. Static (a P3 loop is possible later) · 12. Mobile 1:1 · 13. "Drawing an area redaction over a handwritten signature on a synthetic scanned form." · 14. DOC-MANUAL · 15. P2.

### CAP-DOC-04: OCR on a scan
3. Show that scans become reviewable text. 4. "Text on image-only pages can be recognised, then reviewed." 5. Scanned referral letter (DATA-DOC-3) with recognised words highlighted or selectable. 6. Half page, slight zoom. 7. ENH · 9. 1600×1000 · 10. Spotlight on recognised lines · 13. "Configured OCR recognising text on a synthetic scanned letter." The page caption must repeat that OCR quality depends on the source. · 14. DOC-OCR (Conditional) · 15. P2 · needs OCR tooling configured.

### CAP-DOC-05: output check
3. Make "inspect the output" tangible. 4. "The exported file is re-opened and checked before release." 5. The re-opened output with the verifier result visible. **Precondition:** the owner confirms the current dialog wording does not promise permanent or irreversible removal; if it does, the capture waits for an app copy change. 6. Dialog plus partial page. 7. REAL (crop only) · 9. 1600×1000 · 10. Crop only · 13. "Re-opening an exported document and reviewing the output check result." · 14. DOC-OUTPUT-CHECK · 15. P1.

### CAP-DOC-06: report page
3–4. "Decisions can be documented." 5. First page of a generated report for DATA-DOC-1. 7. REAL · 9. 1200×1500 · 10. Bottom fade · 13. "First page of a redaction report describing reviewed actions." · 14. DOC-REPORT; the caption must not say it certifies compliance · 15. P3.

### CAP-AUD-01: range on the waveform
2. Audio hero; home Audio tile. 3. Show precise, manual control over spoken content. 4. "A reviewer marks a span and chooses how it is masked; the transcript gives context." 5. DATA-AUD loaded; one 2–4s range selected; Mute applied; the transcript passage covering the same words visible beside it. 6. Waveform centre-left; transcript column cropped to 2–3 passages; transport bar kept; tool rail cropped out. 7. ENH · 9. 2400×1500 → 1600×1000 · 10. FocusLens on the range; transcript at 75%. Crop out the status bar (it shows a local path in the current master). · 11. Static; MOT-AUD-01 covers motion · 12. Mobile: waveform and range only (4:5) · 13. "OpenRedakt audio review: a muted range on the waveform beside the transcript passage it covers." Do not say "synchronised". · 14. AUD-TIMELINE, AUD-EFFECTS, AUD-TRANSCRIPT-CONTEXT; **the caption must not imply exact alignment** · 15. P1 · **Interim**: none until the provenance of `format-audio.png` is confirmed.

### CAP-AUD-02: effect choice · MOT-AUD-01: range demo
- CAP-AUD-02: the effect panel with Mute, Tone, Silence and Noise options and preview playing. Alt: "Choosing a tone effect for a selected range and previewing it." AUD-EFFECTS, AUD-PREVIEW. P2.
- MOT-AUD-01: an 8–10s screen recording at 60fps captured, exported at 30fps. Drag to create a range, pick Tone, preview. Muted by default; the visual playhead carries the meaning; optional unmuted version behind a control. Poster is the final frame. Loop only when in view; reduced motion shows the poster. Alt and caption: "Marking a range, choosing a tone effect and previewing it." P2.

### CAP-VID-01: region on a frame
2. Video hero; home Video tile. 3. Show visual redaction applied to real footage. 4. "A region is concealed with a supported effect for a defined time range." 5. Owned footage (DATA-VID): a consenting person or a fictional licence plate; pixelate region over it; the region's span visible on the timeline lane. 6. Preview pane dominant; timeline strip cropped to the relevant lane; file panel cropped out (the current master exposes third-party filenames). 7. ENH · 9. 2400×1500 → 1600×1000 · 10. Spotlight on the frame; timeline at 70% · 11. Static · 12. Mobile: frame only (4:5) · 13. "OpenRedakt video review: a pixelated region over owned sample footage, with its time range on the timeline." · 14. VID-MANUAL, VID-TIMELINE, VID-EFFECTS. **Never suggest automatic tracking.** · 15. P1 · needs DATA-VID. The CSS diagram remains the interim.

### CAP-VID-02 · CAP-VID-03 · MOT-VID-01
- CAP-VID-02: the candidate list after detection on DATA-VID, one confirmed and one rejected. The caption repeats "when the required engines are configured". VID-DETECTION. P2.
- CAP-VID-03: a timeline with one visual-region range and one audio-effect range on separate lanes. VID-AUDIO. P2.
- MOT-VID-01: 10–12s. Draw a region, set start and end, toggle the effect preview. No movement of the region across frames (avoids implying tracking). P2.

### CAP-PRJ-01 · CAP-EXP-01
- CAP-PRJ-01: project workspace in a clean Windows profile. Synthetic project names ("Disclosure set: Case 0417 (synthetic)"), mixed Document, Audio and Video types, current OpenRedakt branding, no local paths. Replaces `step-open.png`. DOC-INPUT, AUD-INPUT, VID-INPUT. P1.
- CAP-EXP-01: the export dialog showing output options. The precondition on wording is the same as CAP-DOC-05. Replaces `step-export.png`. P1.

### CSS compositions
| ID | Purpose | Construction | Motion | Reduced motion |
|---|---|---|---|---|
| CSS-HERO-BARS | Signature atmosphere behind the hero copy and frame | 5–7 absolutely positioned bars (coral 2–3, cyan 1–2, mint 0–1), blur 0/12/32px by depth, grain overlay, radial navy vignette | 30s `translateX` drift ±3% on two layers | Static |
| CSS-GRAIN | Removes gradient banding | `feTurbulence` SVG tile at 4–6% opacity, `mix-blend-mode: overlay` | None | — |
| CSS-BAR-DIVIDER | Section transition | Hairline plus one bar that scales X from 0 to 1 on reveal | 600ms on reveal | Bar shown at full width |
| CSS-LIFECYCLE | FIG. 1 lifecycle | SVG lanes (Documents, Audio, Video) × six stages; mono labels and leader lines; stage names from `howItWorksPage.stages` | Stage highlight follows the selected tab | Static |
| CSS-FORMAT-MAP | Three formats, one review | Three input cards converging on a "Review" node, then Output | Reveal only | Static |
| CSS-SECTOR-RECORD | Industry hero signal | Stylised record card: rows for each `sensitiveInformation` label with format-tinted bars covering placeholder "text" | Bar sweep once | Static |
| CSS-DIRECTORY | Industries hub hero | Groups as a lit index; hover lights the sector | Hover only | — |
| OG-DEFAULT | Social cards | Designed once in SVG and exported to PNG; no runtime generation (keeps CSP simple) | — | — |

## 4. Product capture briefs (shared set-up)

**Environment (owner-authorised, isolated):** a dedicated Windows user profile or VM with only the OpenRedakt build under test, synthetic data in `C:\OpenRedakt-Demo\`, and display scaling at 200% (or a 2560×1600 virtual display). OCR, LibreOffice, FFmpeg and the detection engines configured as for a demo. No OneDrive, no personal folders, notifications off.

**Method:** window-only capture with the OS screenshot tool or OBS (window source), run by the owner or an operator. No desktop automation on the owner's working machine and no synthetic mouse movement there. Record the app build and commit, theme, scaling and data file for every capture.

**Theme:** dark (matches the site and the existing masters). Light only if the showcase toggle is kept (CAP-*-LIGHT).

**Must remain visible:** the capability being claimed, its immediate controls, and enough document, waveform or frame to read the result.

**Crop out:** title bar file names unless synthetic, status bars (paths, "Permanent export" label), project-file panels listing other media, account and sign-in surfaces, and settings with keys or paths.

**Transform rules:** crop, scale, place in ProductFrame, apply CSS lighting and masks, perspective under 6°. Never add, delete or retouch UI, values or marks. Never composite a mark or effect that was not rendered by the app.

**Per-capture checklist:** synthetic data only · no personal paths · current branding · wording consistent with the register · claim IDs noted · alt text drafted · manifest row added · owner approval recorded.

### Synthetic data the owner must provide or approve
| ID | Content | Notes |
|---|---|---|
| DATA-DOC-1 | Fictional bank statement, 3–5 pages (names, account numbers, addresses, transactions) | The existing synthetic statement may be reused if its origin is recorded |
| DATA-DOC-2 | Scanned fictional application form with a handwritten signature and a photo box | Print, sign with an invented name, scan at 300 dpi |
| DATA-DOC-3 | Scanned fictional medical referral letter | No real clinic names |
| DATA-AUD | 60–90s scripted fictional interview, two consenting speakers, mentioning an invented name, address and account number | Signed consent; the script is kept with the file |
| DATA-VID | 15–30s owned footage: a consenting person walking past, a vehicle with a fictional or prop plate, a sign with readable text | Model and location releases; no bystanders |

## 5. Generated-illustration briefs

Generated art is used only where it adds something captures and CSS cannot, and it is always decorative or editorial. It is never captioned as product.

### GEN-INSIGHT-COVER: Insights cover series
- **Subject:** abstract editorial still-lifes about reviewing information. Category keys: *Data privacy* (stacked paper sheets with horizontal coral bars resting on lines of illegible text); *Audio* (a waveform drawn as a thin light line with one segment covered by a soft cyan bar); *Video* (a strip of blank film frames, one frame veiled by a mint translucent panel); *News* (a single sheet with one bright bar, a lot of negative space).
- **Composition:** the subject in the lower-right two thirds; top-left third left empty for the title overlay on the featured card; horizon low.
- **Art direction:** precise, quiet, tactile; matte paper and frosted glass; no people, faces, hands, logos, screens or UI; no legible text (all "text" is soft grey blocks).
- **Lighting:** a single soft key light from the upper left; deep navy shadows; subtle film grain.
- **Palette:** navy `#05060D`–`#151B2F`; accents only coral `#E47755`, cyan `#33B7FF`, mint `#55E6D0`; paper in desaturated grey-blue, never pure white.
- **Background:** seamless navy gradient, no environment.
- **Aspect ratios:** 16:9 master at 1600×900, safe crops at 1200×630 (OG) and 1:1 (mobile cards).
- **Placement:** Insights featured card, article cards, article hero (above the H1 area, not behind text), Open Graph.
- **Avoid:** locks, shields, padlocks, binary code, hooded figures, "AI brain" imagery, glowing circuitry, fake UI, legible words, brand marks, stock-photo realism.
- **Relation to copy:** echoes the article's medium (document, audio, video), never its claims.
- **Approval:** owner sign-off per image; record the generator, prompt, date and licence terms in the manifest.

### GEN-SECTOR-PLATE (P3, optional)
- **Subject:** four group plates matching the registry groups. *Law and the public record*: a ribbon-tied bundle of blank folders with one coral bar across a tab. *Patients, students and employees*: index cards in a tray, two partly veiled. *Financial and claims records*: ledger-style ruled sheets with columns of soft grey blocks, two blocks under coral bars. *Media and data reuse*: a reel of film and a waveform line sharing one mint veil.
- **Composition:** object centred-right, generous negative space left for the H1 on wide screens; cropped to the object on mobile.
- **Avoid:** buildings, courtrooms, hospitals, uniforms, flags, people, institution-like seals. Anything that could imply a customer, partner or deployment.
- **Decision gate:** produce only if CSS-SECTOR-RECORD is judged insufficient at the D2 review.

## 6. Priorities and dependencies

1. **Owner inputs (blocking):** LOGO-01, the capture environment, DATA-DOC-1/2/3, DATA-AUD and DATA-VID with consents, confirmation of export-dialog wording, provenance of `format-audio.png`.
2. **P1 captures:** CAP-DOC-01, CAP-DOC-02, CAP-DOC-05, CAP-AUD-01, CAP-VID-01, CAP-PRJ-01, CAP-EXP-01.
3. **P1 CSS** (no dependencies; can start with D1): CSS-HERO-BARS, CSS-GRAIN, CSS-LIFECYCLE, CSS-SECTOR-RECORD.
4. **P2:** remaining captures, MOT-AUD-01, MOT-VID-01, GEN-INSIGHT-COVER, OG-DEFAULT, CSS-FORMAT-MAP, CSS-DIRECTORY, CSS-BAR-DIVIDER.
5. **P3:** CAP-DOC-06, light variants, GEN-SECTOR-PLATE.

**Interim strategy:** the homepage and Document pages can ship the new design with focused crops of `format-documents.png`. Audio uses a CSS waveform composition (clearly diagrammatic) until CAP-AUD-01 exists. Video keeps the Stage B diagram until CAP-VID-01 exists.

## 7. Owner action checklist (prioritised)

- [ ] **1.** Supply the official OpenRedakt logo files (SVG wordmark and mark, plus usage notes).
- [ ] **2.** Confirm the export and output-check dialog wording in the current app build; flag any "permanent" or "irreversible" text.
- [ ] **3.** Confirm the source data provenance of `format-audio.png`, or approve its retirement.
- [ ] **4.** Approve the synthetic documents DATA-DOC-1/2/3 (or let us draft them for your approval).
- [ ] **5.** Arrange DATA-AUD: a scripted recording with two consenting speakers.
- [ ] **6.** Arrange DATA-VID: owned footage with model and location releases and a prop plate.
- [ ] **7.** Provide or approve an isolated capture environment (separate Windows profile or VM) and name the build to capture.
- [ ] **8.** Decide on the showcase light theme: remove the toggle (recommended) or commission light captures.
- [ ] **9.** Approve the use of generated art for Insights covers, and the generator and licence to use.
- [ ] **10.** Approve rewording of the homepage claims that predate the register ("Offline on Windows", "sensitive-category analysis").
