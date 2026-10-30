# Product visual audit and selective-obfuscation plan

Status: **implemented on the working branch (uncommitted, not deployed).** The current decision and placements are in **§K (2026-10-30)**, which supersedes the earlier sequencing in §J. §A–§I remain the original audit; their findings about each screenshot's contents still hold, and §K records how each one is now used truthfully.
Decision 1 resolved 2026-10-29: **product imagery prefers the light theme** (owner choice); revised 2026-10-30 so that a dark capture is no reason to withhold real product evidence (§K).
**Stages 1–2 implemented 2026-10-29 (uncommitted, not deployed):**
- Six unapproved files removed from `public/images/product/`, along with the orphaned showcase components.
- Pipeline masks and allowlist added; masked masters `audio-workspace.png` and `audio-export.png` produced.
- The audio feature hero and effects row now use `audio-workspace.png`. `audio-export.png` is produced and registered but **not yet placed**: How It Works stages 05–06 moved to stage 3 (see §J).
- Mobile crops added to the homepage and document heroes.

Records: `docs/marketing/product-screenshot-manifest.md` and `assets/product-screenshots/README.md`. Decisions 2–7 were applied at their current-plan defaults.
Audited: 2026-10-29, branch `feat/openredakt-stage-b-features` (uncommitted work preserved), dev build of the current working tree.
Sources inspected: `M:\site images` (read-only), `public/images/product/`, `assets/product-screenshots/`, `src/content/media.ts`, `src/components/visuals/showcase-screenshots.ts`, `docs/marketing/capability-evidence-register.md`, `docs/marketing/product-screenshot-manifest.md`, `docs/design/redesign/asset-production-plan.md`, and the desktop repository `M:\Safaridesk\redact` at `be61394` (read-only, to check visible UI against shipped behaviour).

Rendered verification: all 22 public routes captured full-page at 1440px and 390px. Every visual inside `<main>` was recorded with its section, type, source and rendered size. Hero and product-shot crops were also checked at 390px.

---

## A. Executive findings

1. **One document screenshot carries the whole site.** `format-documents.png` (the same synthetic financial statement as the homepage hero) renders **17 times on 14 routes**. It appears on the homepage, Features, both document pages, How It Works, the Industries hub and all nine industry pages, and is the only real product image below the homepage hero.
2. **Audio has no real product image anywhere.** All **16 audio visuals** are the `CAP-AUD-01`/`CAP-AUD-02` illustration slots: the homepage, Features, all three audio-page visuals, the Industries hub and nine industry pages. This is the largest gap, and the supplied `audio interface.png` closes most of it.
3. **The workflow visuals are mostly placeholders.**
   - Homepage steps 1 and 3 use the `CAP-PRJ-01` and `CAP-EXP-01` diagrams.
   - How It Works stages 01–02 and 05–06 use `CAP-PRJ-01` and `CAP-DOC-05`.
   - The document page's export row uses `CAP-DOC-05`.
   - `audio export.png` can fill the export slots honestly. The project-workspace and output-check slots need new captures.
4. **Only two of the six supplied screenshots are publishable after treatment.** These are `audio interface.png` and `audio export.png`. The other four show failure or empty states or unshipped features, or would need masking so heavy that it misrepresents the screen (see §B):
   - **Document interface:** a failed import and a third-party licence-key error in the status bar, and a blank canvas.
   - **Document export:** an export with 0 redactions, a disabled Export button, and "Permanent removal" wording that the claim policy blocks.
   - **AI tools menu:** lists *Video Assistant*, plus *Record* and *Schedule*, which are stubs in the desktop code.
   - **Workspace:** shows local folder paths, test project names, video and image project types, and a filename containing a real public office.
5. **The theme is split.** The approved masters are **dark-theme captures of an older build**. All six new screenshots are **light-theme captures of build 0.3.3**, and the desktop app still ships both themes. Placing light audio images next to dark document images on the same page (Features hero, industry pages, homepage) would look inconsistent. **Resolved: light theme.** The dark document masters become interim and are retired once a light document capture (CAP-DOC-01L) exists. §J covers sequencing.
6. **Unapproved images are publicly reachable.** Six files are still served from `public/images/product/` even though no live page uses them, and two of them are expressly prohibited by the manifest:
   - `format-video.png`: third-party broadcast watermark and identifiable people.
   - `step-open.png`: local paths and legacy branding.
   - `step-export.png`: blocked "Permanent removal" wording.
   - `homepage.png`.
   - `workflow-export-verificationworkflow-export-verification.png`.
   - `step-review.png` (approved content, but used only by the orphaned components).

   They are referenced only by four orphaned showcase components (`FormatPreview`, `WorkflowPreview`, `RedactionWorkbench`, `UseCaseVisual`), which nothing imports. They should be removed from `public/` (§H, P1).
7. **Mobile legibility is the second biggest weakness.** At 390px the wide 16:10 product crops render about 340px wide and their UI text is illegible. Every product image recommended here therefore gets a separately composed mobile crop.
8. **Pages that should stay without screenshots:** Pricing, Book a Demo, Contact and Why OpenRedakt have no product imagery, and none is recommended. The CSS "sector record" cards in the Industries hero visuals are accurate, editorial and sector-specific, so they are retained.

**Bottom line:**
- Replace the audio illustrations with treated `audio interface.png` derivatives.
- Fill the export slots with a treated `audio export.png`.
- Vary the document crops so the same frame stops repeating.
- Remove the unapproved public files.
- Commission four new light-theme captures (project workspace, document review, document export/output check, audio range). The light document review capture is the critical path for theme consistency.

---

## B. Screenshot inventory: `M:\site images`

All six files are PNG, RGBA 8-bit. Metadata check: each contains only `sRGB`, `gAMA` and `pHYs` chunks, with **no text chunks, EXIF, timestamps or author fields**. No subdirectories exist. Originals were not renamed or modified.

| # | Filename (exact) | Absolute path | Pixels | Ratio | SHA-256 (prefix) |
|---|---|---|---|---|---|
| 1 | `ai tools for redaction.png` | `M:\site images\ai tools for redaction.png` | 1410×884 | 1.595 | `a021663e9248` |
| 2 | `audio export.png` | `M:\site images\audio export.png` | 1411×881 | 1.602 | `388c09e10a5f` |
| 3 | `audio interface.png` | `M:\site images\audio interface.png` | 1431×891 | 1.606 | `53a70caec0c1` |
| 4 | `document export.png` | `M:\site images\document export.png` | 1440×889 | 1.620 | `5b20f616ee19` |
| 5 | `document interface.png` | `M:\site images\document interface.png` | 1437×895 | 1.606 | `039cb6d09185` |
| 6 | `home pag workspace.png` | `M:\site images\home pag workspace.png` | 1438×896 | 1.605 | `2c3f12fdc584` |

Every frame is about 1430×890 at 100% scale. That is enough for a desktop showcase up to about 1100 CSS px at 1×. It is **not enough for 2× retina at hero width**: the existing dark masters are 2176×1360 to 3440×1440. Treat these files as approved compositions and request re-captures at 200% Windows scaling for final hero use (§G).

Several elements appear on **every frame**:
- A **`BETA`** badge next to the logo in the title bar.
- The working file **`alright.redact *`** in the title bar (on four frames).
- An **"On this PC" status bar** carrying local paths.

All coordinates below are in **source pixels**, approximate to ±10px, and must be confirmed during production.

### B1. `audio interface.png` (publishable after treatment; strongest file)

- **Subject:** audio editor in Edit mode, the Audio Tools panel, waveform visualiser and timeline overview.
- **Visible capabilities:**
  - Audio Tools effect grid: Mute, Beep, Tone, Silence, White, Pink, Low, High, Reverse, Voice disguise.
  - Reasons field, Pick Segment start and end, Mute action, range navigation and edit icons.
  - Visualisation modes (Waveform, Filled waveform, Bars, Spectrum curve, Radial).
  - dB scale, transport, frame and time readout, playback speed and volume.
  - Timeline overview with a minute ruler.
  - "Audio assistant: Start transcription".
  - Checkpoints and "Export audio".
- **Sensitive or distracting content:**

  | Content | Location (x, y, w, h) | Treatment |
  |---|---|---|
  | `BETA` badge and title `alright.redact *` | 0, 0, 1431, 32 | Crop out |
  | Status bar: `C:\Users\User\AppData\Local\OfflineRedactor\jobs\1337f…` (local path and internal product name) | 0, 866, 1431, 25 | Crop out |
  | Project Files list: `Mock Interview - Ms. Willow Waverly.m4a`, `Bank-statements.pdf`, `PROPOSED INTERGRATED PIG-FARM.pdf` (personal-name-style and real-looking titles; misspelling) | 1078, 228, 300, 100 | Mask |
  | Right icon rail, including an **image-format icon** (unapproved format) | 1390, 85, 41, 200 | Crop out |

- **State concerns:**
  - "No range selected" appears twice, so no redaction range is shown.
  - Playhead at 00:00, not playing. This is truthful, but it doesn't show a decision being made.
- **Claim concerns:**
  - The effect grid shows seven effects beyond the register's AUD-EFFECTS wording (mute, tone, silence, noise): Beep, Pink, Low, High, Reverse, Voice disguise and White. All are implemented in the desktop render pipeline (`RedactionEffect` enum; `FfmpegAudioRangeRenderer`), so showing them is truthful. Captions must not promote them until the register is extended (§I).
  - "Start transcription" relates to AUD-TRANSCRIPT-CONTEXT, which is Conditional. Keep it visible but secondary, and never caption it as automatic analysis.
- **Uses:** audio hero, homepage and Features audio rows, audio effect section, Industries audio rows, audio blog cover.
- **Public suitability:** **Yes, after cropping and masking.**

### B2. `audio export.png` (publishable after treatment)

- **Subject:** the audio Export dialog over the editor.
- **Visible capabilities:**
  - "Writes the redacted copy. Your original is not changed."
  - "Exported on this PC… Nothing is uploaded to export it."
  - "Original untouched."
  - File name; File type `.wav`; Audio output "Audio only"; Location with a Change… button; Export mode "Redacted Audio Copy"; Cancel and Export.
- **Sensitive or distracting content:**

  | Content | Location (x, y, w, h) | Treatment |
  |---|---|---|
  | File name `Mock Interview - Ms. Willow Waverly_Redacted` | 598, 233, 492, 34 | Mask |
  | Location `C:\Users\User\OneDrive\Documentos\alright\` | 598, 381, 440, 34 | Mask |
  | Toast `Mock Interview - Ms. Willow Waverly.m4a opened` | 1118, 98, 293, 28 | Crop out |
  | Title-bar `BETA` and `alright.redact *` | — | Crop out |

- **Functional concern:** **"Schedule optional"** plus a calendar picker (868, 432, 264, 60). In the desktop code, scheduled export is a stub: `CalendarCommand` reports "Scheduled export/review is not connected yet". Showing an unconnected field implies a capability.
  - **Recommended:** hide the field in the app and re-capture.
  - **Interim:** a frosted mask with no replacement content, recorded in the manifest.
- **Claim concerns:**
  - "Nothing is uploaded to export it" is narrower than the blocked "universal offline processing" claim, and true as UI text. It must not be paraphrased into an offline-processing claim.
  - The dialog also has a large empty lower area (566, 500, 597, 235). That is acceptable; don't splice the dialog to remove it.
- **Uses:** homepage workflow step 3, How It Works stages 05–06, optional audio "render and listen" support.
- **Public suitability:** **Yes, after masking. Preferably re-captured with the Schedule field hidden.**

### B3. `ai tools for redaction.png` (not suitable; reference only)

- **Subject:** the same audio editor as B1 with the **Tools menu open**.
- **Menu items:** Video Assistant…, Audio Assistant…, Run AI Detection, Run Review Checks, Record, Share, Download, Schedule, Comments and activity.
- **Why it isn't suitable:**
  - It names **Video Assistant** (video is not an approved capability).
  - **Record** and **Schedule** are stubs: "Recording needs the capture backend before it can start" and "Scheduled export/review is not connected yet".
  - **Share** and **Download** only open the Export dialog. Publishing the menu would advertise four capabilities that don't exist as labelled.
  - Masking individual items would alter the menu's meaning. The menu also covers the left of the waveform.
- **Other issues:**
  - The status bar shows the same local `OfflineRedactor\jobs` path.
  - The effects panel is truncated by the menu (no Tone, Pink, Reverse).
- **Superseded by** `audio interface.png`, which shows the same state without the menu.
- **Public suitability:** **No.** For an "AI tools" visual, see §G (CAP-AUD-AI).

### B4. `document interface.png` (not suitable as a frame; one detail crop on hold)

- **Subject:** document editor with the Manual redaction panel, tool rail, an empty canvas, and the Workspace / Files panel.
- **Visible capabilities:**
  - Tool rail: Tools, Search, Pattern, OCR, Assistant, Templates, Watermark, Stamps, Organize.
  - Selection modes: Select marks, Select text, Free-form area, Pan page.
  - Redaction appearance; reason search; "29 reasons offered"; Manage reasons; Selected redaction mark.
  - Canvas tools: select, draw, crop, pan.
  - Checkpoints; "Export redacted PDF"; Add files, Close project, Delete project.
- **Blocking state concerns:**
  - **Status bar (0, 866, 1437, 29):** "No documents imported — 1 failed — The Iron Suite licence key…" is a **failed import caused by a third-party licence error**.
  - **The canvas is blank.** No document is open, so the image cannot show document redaction.
  - The Files list shows two PDFs as "Not prepared".
- **Sensitive content:**

  | Content | Location (x, y, w, h) |
  |---|---|
  | `Mock Interview - Ms. Willow Waverly.m4a`, `Bank-statements.pdf`, `PROPOSED INTERGRATED PIG-FARM.pdf` | 1000, 280, 260, 105 |
  | `PII_Redaction_Test_Document.pdf` | in the status bar |
  | `alright` project name | 975, 140, 120, 60 |

- **Claim concerns:** Templates, Watermark, Stamps and Assistant on the rail are not in the capability register.
- **Possible detail crop:** the Manual redaction panel alone (80, 85, 282, 745). It is **on hold** pending decisions 1 and 3 (§I). The existing dark `manualBeside` crop is stronger because it shows the panel beside a marked page.
- **Public suitability:** **No as a frame**; detail crop on hold.

### B5. `document export.png` (not suitable now)

- **Subject:** the document Export dialog over the editor.
- **Visible capabilities:**
  - Document name, export folder, export name.
  - Output format PDF ("Searchable. Can be password protected.").
  - **Audit report** toggle (off by default).
  - "This export will carry…" summary; Close; "Export secure PDF".
- **Blocking concerns:**
  - **"0 redactions"** and **"Nothing is marked for redaction yet"**, with **Export secure PDF disabled**. Presented as an export, this misrepresents the workflow.
  - **"Permanent removal… cannot be recovered from beneath the covers"** is the wording the manifest already prohibits ("guaranteed/irreversible output" is a blocked claim).
  - **"Checked by a second engine… the file is refused rather than delivered"** relates to DOC-OUTPUT-CHECK, which is Conditional ("A check cannot prove every sensitive item was discovered"). An absolute "refused" promise needs owner and legal sign-off.
  - The status bar shows the same failed import and licence error.
  - The export folder `C:\Users\User\OneDrive\Documentos\alright` is visible.
  - Background panel file names are partly visible (1176, 280, 260, 130).
- **Not recommended:** masking only the "Permanent removal" block. Hiding overclaiming product copy hides a real product problem. Fix the wording in the app, then re-capture with real redactions (§G).
- **Public suitability:** **No.** Needs a new capture.

### B6. `home pag workspace.png` (not suitable; new capture needed)

- **Subject:** the project hub ("Recent").
- **Visible capabilities:**
  - Library: Recent, All projects, Needs review, Exported, Archived.
  - Locations list; Merge files; search; New project.
  - "Continue where you left off" card; project cards with status; sort; Settings.
- **Sensitive content:**

  | Content | Location (x, y, w, h) |
  |---|---|
  | **Locations listing personal folders** (`OfflineRedactor\jobs`, `User\Downloads`, `User\OneDrive`, `Desktop\Safe Redact` (legacy brand), `OneDrive\Documentos`, `Documentos\sfrd-test`, `M:\Safaridesk`) | 12, 278, 228, 300 |
  | Status bar `New projects are created in C:\Users\User\OneDrive\Desktop\OpenRedakt` | — |
  | Version `0.3.3` | — |
  | **File chip `Dallas Police Chief_Redacted.mp4`** (a real public office, in a video file) | 608, 205, 650, 40 |
  | Hash-like file IDs (`cc5faf9002bb`…) | — |
  | Test project names: Test, alright, dede, desktop, d-ede, hee, nws, new | throughout |
  | Counts (446 projects, 113 in Downloads) | — |

- **Unapproved formats:** **film-strip and image icons** on most project cards and in the hero card, which promote video and image redaction.
- **Empty states:** "Not started" and "No files yet" on most cards.
- **Why masking doesn't fix it:** masking would have to cover almost every meaningful element (names, icons, locations, status bar). The result would no longer show a project workspace.
- **Public suitability:** **No.** It is a good composition reference for CAP-PRJ-01 (§G).

### B7. Existing site masters (context)

| File | Theme / build | State | Current use | Assessment |
|---|---|---|---|---|
| `hero-document-review.png` (1438×859 served) | Dark, older build | Synthetic statement; 89 marks; findings with "AI-assisted" tags | Homepage hero; **blog cover fallback** | Strong. Retain for the hero; stop using it as a blog cover. |
| `format-documents.png` (1451×853) | Dark, older build | Same scenario | 17 placements | Strong but over-used; vary crops (§D). |
| `format-audio.png` | Dark, older build | Waveform plus speaker transcript about a police interaction | Unused (excluded) | Keep excluded: provenance unconfirmed, sensitive-sounding transcript, local path in the status bar. |
| `step-review.png` | Dark | Document review | Orphaned component only | Remove from `public/`. |
| `step-export.png` | Dark | Export dialog with "Permanent removal" | Orphaned component only | **Remove from `public/`** (prohibited wording). |
| `step-open.png`, `homepage.png` | Dark, legacy | Workspace with local paths and legacy brand | Orphaned or unreferenced | **Remove from `public/`.** |
| `format-video.png` | Dark | Third-party broadcast footage | Orphaned component only | **Remove from `public/` now** (prohibited). |
| `workflow-export-verification…png` | — | Source of `step-export` (full frame shows "Export failed") | Unreferenced | **Remove from `public/`.** |

---

## C. Page-by-page audit

The tables use these classification codes:
- **A**: replace with a real screenshot.
- **B**: enhance existing real imagery.
- **C**: retain.
- **D**: remove without replacement.
- **E**: new screenshot required.

Positions are from the 1440px render.

### Homepage `/`

| Section | Existing visual | Code | Finding |
|---|---|---|---|
| Hero showcase (scroll-zoom) | `hero-document-review.png`, crop `pageWithFindings`, 810×573 | **C** (desktop) / **B** (mobile) | Strongest real image on the site; keep the scroll zoom. At 390px it renders 340px wide and is illegible, so it needs a page-only 4:5 mobile crop. Replace with CAP-DOC-01L (light, 2×) when delivered; the dark master is interim. |
| Trust bar, review statement | Icons and text | C | No imagery needed. |
| "Review content in the right context": document row | `format-documents.png` in a dark band, 648×490 | **B** | Same synthetic page as the hero two screens earlier. Use a different focal crop (`manualBeside`: manual panel beside the page) so the homepage shows two distinct moments. |
| Same band: audio row | `CAP-AUD-01` illustration, 432×328 | **A** | Replace with `audio interface.png` → `aud-workspace-story`. |
| "From source file to reviewed output": step 1 Open | `CAP-PRJ-01` diagram | **E** | `home pag workspace.png` is unusable (§B6). Keep the diagram until CAP-PRJ-01 exists. |
| Step 2 Review | `format-documents.png` `toolsWide` | B | Keep; it becomes distinct once the band above uses `manualBeside`. |
| Step 3 Create the output | `CAP-EXP-01` diagram | **A** | `audio export.png` → `aud-export-dialog`. This is the exact moment the step describes. |
| Platform, Industries cards | Text and icons | C | — |
| Blog | Coral `blog-row-visual` tile (no CMS image) | C → **B** | Tile is acceptable. Once covers exist, use `edt-document-cover` when an article has no CMS image. |
| FAQ, footer | — | C | — |

### Features `/features`

| Section | Existing visual | Code | Finding |
|---|---|---|---|
| Hero: two format tiles | Document `format-documents.png` and audio `CAP-AUD-01` slot, side by side at 438×332 | **A** (audio tile) | Audio tile → `aud-workspace-story`. This is the page where **mixed themes are most visible** (two tiles side by side), so the audio tile switches in the same release as the document tile moves to CAP-DOC-01L (§J). |
| Document overview row | `format-documents.png` 630×450 | B | Use the `pageCloseup` crop so it differs from the hero tile. |
| Audio overview row | `CAP-AUD-01` slot 466×296 | **A** | → `aud-fx-detail` (effects panel beside the waveform), so the two audio images on this page differ. |

### Document Redaction `/features/document-redaction`

| Section | Existing visual | Code | Finding |
|---|---|---|---|
| Hero | `doc-overview` (`pageWithFindings`) 1088×773 | C / **E** | Strong, but dark. Replace with CAP-DOC-01L (light, 2×). Mobile: 4:5 page crop. |
| "Start with evidence…" | `doc-findings` (`findingsBeside`) | C | Distinct focal area. Keep. |
| "Handle what a detector cannot know." | `doc-manual` (`manualBeside`) | C | Keep. The B4 light detail crop is weaker. |
| "Treat export as another review step." | `CAP-DOC-05` output-check diagram | **E** | No supplied file shows a re-opened output check; `document export.png` is unusable (§B5). Keep the diagram until the CAP-DOC-05 capture exists. |

### Audio Redaction `/features/audio-redaction`

| Section | Existing visual | Code | Finding |
|---|---|---|---|
| Hero | `CAP-AUD-01` illustration 1088×685 | **A** | → `aud-workspace-hero` (Hero Showcase). This is the single highest-value replacement on the site. |
| "Put the reviewer on the waveform." (manual ranges) | `CAP-AUD-01` illustration | **E** (interim C) | The section is about drawing ranges, but `audio interface.png` shows "No range selected". Re-using the hero would repeat it on one page. Keep the diagram until CAP-AUD-01 (range selected) exists. |
| "Match the treatment to the disclosure risk." | `CAP-AUD-02` illustration | **A** | → `aud-fx-detail`. The effect grid is exactly this section's subject. |
| Transcript context | None | C | Keep it without a visual. The claim is Conditional, and the only transcript capture (`format-audio.png`) is excluded. |
| Supported inputs, boundary, FAQ | Text | C | — |

### How It Works `/how-it-works`

| Section | Existing visual | Code | Finding |
|---|---|---|---|
| Hero | CSS "Review lifecycle" list, 640×392 | C | Accurate and text-based. Keep. |
| Stages 01–02 "Import and prepare" | `CAP-PRJ-01` + `SourcesDiagram` | **E** | Needs CAP-PRJ-01. |
| Stages 03–04 "Find and review" | `format-documents.png` | B | Use the `findingsBeside` crop, so this page doesn't repeat the homepage step-2 frame. |
| Stages 05–06 "Export and verify" | `CAP-DOC-05` diagram | **A** (05) / **E** (06) | → `aud-export-dialog` for stage 05 "Render a new output". Caption it as an export, not an inspection. Stage 06 inspection still needs CAP-DOC-05. |
| Stage list, boundaries, deeper links, FAQ | Cards and text | C | — |

### Why OpenRedakt `/why-openredakt`

No product imagery. **Retain (C).** This is an argument page, and a screenshot would repeat what the feature pages show.

### Industries hub `/industries`

| Section | Existing visual | Code | Finding |
|---|---|---|---|
| Hero | CSS directory card (published guides) | C | Editorial and accurate. |
| "By media": document card | `format-documents.png` 371×281 | B | Use the `page` crop (a small card needs one focal area). |
| "By media": audio card | `CAP-AUD-01` slot | **A** | → `aud-fx-detail` (small cards need the compact effects-and-waveform composition). |

### Industry detail pages (9 published)

Every page repeats the same layout:
- **Hero:** a CSS "sector records" card (C). These are sector-specific and accurate, and are the right place for industry character rather than screenshots.
- **Document workflow row:** the same `format-documents.png` crop (**B**).
- **Audio workflow row:** the same `CAP-AUD-01` slot (**A**).

To stop the identical repetition across nine pages, rotate between approved variants:

| Page | Document row crop | Audio row asset |
|---|---|---|
| Legal | `findingsBeside` | `aud-workspace-story` |
| Government | `manualBeside` | `aud-fx-detail` |
| Local Government | `page` | `aud-workspace-story` |
| Healthcare | `pageCloseup` | `aud-fx-detail` |
| Finance | `pageWithFindings` (statement suits the sector) | `aud-workspace-story` |
| Insurance | `findingsBeside` | `aud-fx-detail` |
| Education | `manualBeside` | `aud-workspace-story` |
| Human Resources | `page` | `aud-fx-detail` |
| Media & Journalism (audio row first) | `pageCloseup` | `aud-workspace-story` |

Two pages will still share each pairing, because only one document scenario and one audio scenario exist. Industry-specific editorial imagery (for example a scanned form for Healthcare) needs new synthetic captures (§G, optional P3). It must not be faked with re-labelled crops.

### Pricing `/pricing`

No product imagery. **Retain (C).** Pricing clarity is the priority, and the page already has cards, a comparison table and licensing steps.

### Blog

| Surface | Existing visual | Code | Finding |
|---|---|---|---|
| `/blog` featured article | Code fallback `hero-document-review.png`, 1022×486 | **B** | The homepage hero frame doubles as an article cover. Replace the *fallback* with `edt-document-cover`. |
| Category cards (`/blog/category/*`) | CSS `blog-card-visual` (dark graphite gradient) | **B** | Inconsistent with the coral homepage tile. Use the same editorial cover fallback (or coral tile) system-wide. |
| Article detail lead image | Same `hero-document-review.png` fallback, 1158×495 | **B** | → `edt-document-cover`. A raw product screen as an article illustration reads as a product ad and duplicates the hero. |
| Homepage Blog row | Coral tile | C | — |
| CMS featured images | None currently set | C | Never override a CMS-provided image. The fallback applies only when `featuredImage` is empty. Preferably the owner sets covers per article in the CMS. |

### Book a Demo `/book-a-demo` and Contact `/contact`

No product imagery. **Retain (C).** These pages convert; a screenshot would compete with the form.

### Shared components

| Component | Role | Finding |
|---|---|---|
| `src/content/media.ts` (`captures`, crops, `mediaSlots`) | Registry of approved captures and placeholder slot IDs | **Reuse.** Add the new captures and crops here. Each slot ID maps directly to a replacement in §D. |
| `ProductShot` (`data-capture`) | Renders a registry crop through `next/image` at the crop's own ratio | **Reuse** for all new product images. Add per-breakpoint crop support (mobile crop), which it currently lacks. |
| `MediaSlot` (`data-media-slot`) + `Diagrams.tsx` | Placeholder frames with truthful diagrams | **Keep** for every slot still marked E. |
| `FeatureVisual` / `featureVisuals` | Maps feature-page sections to visuals, "chosen so no page repeats one" | **Reuse.** Update the mapping per §D. |
| `.media-frame` / `.media-glow` / `.showcase-stage` | Framing and atmosphere | **Reuse.** Already the site's language for screenshots. |
| `FormatPreview`, `WorkflowPreview`, `RedactionWorkbench`, `UseCaseVisual`, `ShowcaseTheme*`, `showcase-screenshots.ts` | Earlier dark-showcase system; **imported by nothing** | **D: delete**, then delete the files only they reference. |
| `scripts/build-product-images.mjs` + `assets/product-screenshots/` | sharp pipeline: raw masters → `public/images/product/` | **Reuse and extend** with declarative mask regions (§F). Its README is stale (SafeRedact naming, outdated table). |
| Navigation dropdowns, footer | Icons and text only | C. No imagery recommended. |
| `src/app/prototypes/*` (`page.dev.tsx`, dev-only) | Uses `format-documents.png` | C. Not built for production. |

---

## D. Screenshot placement matrix

Each derived asset ID (prefixes `aud-`, `edt-`) is defined in §F. Crop names refer to `captures["document-editor"]` in `src/content/media.ts`.

| Page / route | Section | Existing visual | Code | Recommended source image | Proposed treatment | Pri |
|---|---|---|---|---|---|---|
| `/features/audio-redaction` | Hero | `CAP-AUD-01` illustration | A | `audio interface.png` | `aud-workspace-hero`: Hero Showcase, right panel soft-focused, file names masked | **P1** |
| `/` | Formats band: audio row | `CAP-AUD-01` | A | `audio interface.png` | `aud-workspace-story` | **P1** |
| `/` | Workflow step 3 | `CAP-EXP-01` | A | `audio export.png` | `aud-export-dialog`; path and file name masked, Schedule field masked or re-captured | **P1** |
| `/` | Hero | `hero-document-review.png` | C/B | *(existing master)* | Add a 4:5 mobile crop of the page | **P1** |
| `/` | Formats band: document row | `format-documents.png` | B | *(existing master)* | Switch crop to `manualBeside` | P1 |
| `/features/document-redaction` | Hero | `doc-overview` | C/B | *(existing master)* | Add a 4:5 mobile crop | P1 |
| `/features/audio-redaction` | "Match the treatment…" | `CAP-AUD-02` | A | `audio interface.png` | `aud-fx-detail` | **P1** |
| `/features/audio-redaction` | "Put the reviewer on the waveform." | `CAP-AUD-01` | E | — (needs CAP-AUD-01 range capture) | Keep the diagram meanwhile | P1 (capture) |
| `/features/document-redaction` | "Treat export as another review step." | `CAP-DOC-05` | E | — (needs CAP-DOC-05) | Keep the diagram meanwhile | P1 (capture) |
| `/features` | Hero audio tile | `CAP-AUD-01` | A | `audio interface.png` | `aud-workspace-story`, placed together with CAP-DOC-01L (§J) | P2 |
| `/features` | Audio overview row | `CAP-AUD-01` | A | `audio interface.png` | `aud-fx-detail` | P2 |
| `/features` | Document overview row | `format-documents.png` | B | *(existing master)* | `pageCloseup` crop | P2 |
| `/how-it-works` | Stages 03–04 | `format-documents.png` | B | *(existing master)* | `findingsBeside` crop | P2 |
| `/how-it-works` | Stages 05–06 | `CAP-DOC-05` | A/E | `audio export.png` | `aud-export-dialog`, captioned "Export a redacted copy"; stage 06 stays text | P2 |
| `/how-it-works`, `/` step 1 | Import / open | `CAP-PRJ-01` | E | — (needs CAP-PRJ-01) | Keep the diagram meanwhile | P2 (capture) |
| `/industries` | "By media": audio card | `CAP-AUD-01` | A | `audio interface.png` | `aud-fx-detail` | P2 |
| `/industries` | "By media": document card | `format-documents.png` | B | *(existing master)* | `page` crop | P3 |
| `/industries/*` (9) | Audio workflow row | `CAP-AUD-01` | A | `audio interface.png` | Alternate `aud-workspace-story` / `aud-fx-detail` per §C | P2 |
| `/industries/*` (9) | Document workflow row | `format-documents.png` | B | *(existing master)* | Rotate crops per §C | P3 |
| `/blog`, `/blog/[slug]` | Featured and lead-image fallback | `hero-document-review.png` | B | `hero-document-review.png` (existing) | `edt-document-cover` | P3 |
| `/blog/category/*` | Card fallback | CSS graphite | B | — | Same fallback as above, or the coral tile | P3 |
| Audio-topic articles (future) | Cover fallback | — | — | `audio interface.png` | `edt-audio-cover` | P3 |
| `public/images/product/` | Unreferenced files | 6 files | **D** | — | Remove `format-video`, `step-open`, `step-export`, `homepage`, `workflow-export-…`, `step-review`, plus the orphaned components | **P1** |
| `/pricing`, `/why-openredakt`, `/book-a-demo`, `/contact` | — | none | C | — | No screenshots | — |

**Reuse rationale for `audio interface.png`.** It is the only publishable audio frame, so it feeds four variants, each with a different focal area:
- **`aud-workspace-hero`:** whole working surface at large size.
- **`aud-workspace-story`:** same composition, tighter, for 400–650px rows.
- **`aud-fx-detail`:** effects grid beside the start of the waveform.
- **`edt-audio-cover`:** waveform only, tinted.

No page shows two variants with the same focal area. On `/features/audio-redaction` the hero is the workspace and the effects section is the detail. On `/features`, the hero tile is the workspace and the overview row is the detail.

---

## E. Selective-blurring specification

### Technique definitions (applied to flattened pixels, never in CSS)

Applied to the source pixels before resizing; scale linearly if a 2× re-capture is used.

- **Text mask (`MASK-TEXT`).** For names, paths and identifiers.
  1. Replace the region with its median background colour plus a 1px rounded-rectangle hint of the field. Alternatively, pixelate at 14px blocks.
  2. Apply a Gaussian blur, σ = 8px.
  3. Feather the edge over 6px.

  Pixelating or filling **before** blurring removes recoverable glyph structure. Blur alone on short UI strings can be partially reversed.
- **Peripheral soft-focus (`SOFT`).** For secondary panels: Gaussian σ = 3–4px, plus a 28–35% veil in the panel's own background colour. The panel remains legible as "a panel" but not readable. Feather 24px along the boundary with the sharp area.
- **Frosted mask (`FROST`).** For unconnected controls (Schedule):
  1. Gaussian σ = 10px.
  2. 55% veil in the dialog background colour.
  3. No replacement text, icon or label.
- **Spotlight (`SPOT`).** For focal emphasis: 15–20% dim of everything outside the focal rectangle, with a 40px feather. Use sparingly: hero and storytelling only, never on editorial covers.
- **Brand tint (`TINT`).** For editorial covers only: a coral `#FF735C` overlay at 14–18% (multiply in light covers, screen in dark), plus σ = 2px overall softening, so a cover reads as illustration, not as a product claim.
- **Crop (`CROP`).** Remove title bars (BETA, working filename), status bars (paths, failures) and the right icon rail (image-format icon). Cropping chrome is acceptable; cropping must never splice non-adjacent areas.

**What must never be masked:** the waveform, transport, effect controls, export options relevant to the section, and any warning or limitation that applies to the shown state. Masks remove *identifying* or *unconnected* content only. They are never used to make an empty or failed state look complete.

### E1. `aud-workspace-hero`, from `audio interface.png`

- **Mode:** Hero Showcase.
- **Crop:** x 0, y 34, w 1390, h 832 (≈1.67:1). This removes the title bar, status bar and right icon rail.
- **Sharp:**
  - toolbar (Mode: Edit, Checkpoints, Export audio)
  - Audio Tools panel
  - visualisation tabs
  - waveform and dB scale
  - transport and readouts
  - timeline overview
- **Mask:**
  - Project Files list (1078, 228, 300, 100): `MASK-TEXT`.
  - Whole right panel (1070, 85, 320, 781): `SOFT` σ 3px, 30% veil.
- **Secondary:** Audio assistant card (93, 705, 247, 125): leave sharp but un-emphasised. No caption about transcription.
- **Emphasis:** `SPOT` around the waveform and transport (365, 85, 700, 735) at 15%.
- **Output:** 2 masters, 1600×958 (desktop) and 1080×1080 (mobile).
- **Mobile:** 1:1 crop x 360, y 85, w 705, h 705 (waveform, transport, start of timeline). The effects grid is dropped; the waveform stays meaningful at 350 CSS px.
- **Behaviour:** keep the frame at the crop's own ratio (as `ProductShot` already does). Mobile uses the 1:1 file via `<picture>`/`sizes`, not by CSS-shifting a desktop file.

### E2. `aud-workspace-story`, from `audio interface.png`

- **Mode:** Product Storytelling.
- **Crop:** x 77, y 80, w 990, h 785 (≈1.26, tools panel plus waveform and timeline). The right panel is cropped out entirely, so no file-name mask is needed.
- **Sharp:** everything in the crop.
- **Mask:** none required.
- **Treatment:** 12% `SPOT` on the waveform; 18px radius frame.
- **Mobile:** reuse the E1 mobile 1:1.

### E3. `aud-fx-detail`, from `audio interface.png`

- **Mode:** Product Storytelling (detail).
- **Crop:** x 77, y 85, w 760, h 570 (4:3). This shows the effects grid, Reasons, Pick Segment, the Mute action and the left third of the waveform.
- **Sharp:** effects grid and the Pick Segment controls.
- **Soft:** the waveform portion, using `SOFT` σ 2px on its right 30% with a 60px gradient fade toward the right edge.
- **Mobile:** 4:5 crop x 85, y 140, w 260, h 325 (effects grid only). It stays legible at 300 CSS px.
- **Caption rule:** name only register effects ("mute, tone, silence or noise") until decision 4 extends the register.

### E4. `aud-export-dialog`, from `audio export.png`

- **Mode:** Product Storytelling.
- **Crop:** dialog plus shadow, x 250, y 165, w 930, h 650 (≈1.43).
- **Sharp:**
  - Export title and description
  - "Exported on this PC" and "Original untouched"
  - File type, Audio output, Export mode
  - Change… button
  - Cancel and Export
- **Mask:**
  - File name text (598, 233, 492, 34): `MASK-TEXT`, keeping the empty field outline.
  - Location text (598, 381, 440, 34): `MASK-TEXT`.
  - Schedule optional plus calendar (868, 432, 264, 60): `FROST`. **Preferred instead:** hide the field in the app and re-capture (decision 5).
- **Mobile:** 4:5 crop of the info column, x 264, y 178, w 300, h 375. It shows "Export / Exported on this PC / Original untouched" at legible size. This is honest: it states what export does, without implying output inspection.

### E5. `edt-document-cover`, from existing `hero-document-review.png`

- **Mode:** Editorial Thumbnail.
- **Crop:** x 360, y 140, w 1040, h 585 (16:9; page plus the top of the findings list).
- **Mask:** finding values (synthetic, but data-like) at (1000, 330, 380, 400) with `MASK-TEXT`.
- **Treatment:** whole-image `TINT` (screen, 16%, on the dark source) plus σ 2px. No spotlight.
- **Mobile:** same 16:9 file; the card frame handles it (≥300 CSS px).
- **Text rule:** no added text, logos or controls.

### E6. `edt-audio-cover`, from `audio interface.png`

- **Mode:** Editorial Thumbnail.
- **Crop:** waveform viewer, x 367, y 135, w 693, h 390 (16:9).
- **Treatment:** `TINT` (multiply, 14%) plus σ 1.5px. No masks needed.

### Not produced: `doc-manual-light`, from `document interface.png`

- **Crop:** Manual redaction panel, x 80, y 85, w 282, h 745 (≈0.38).
- **Status after decision 1 (light):** superseded. CAP-DOC-01L reproduces the `manualBeside` crop in light with a marked page beside the panel, which is the stronger composition. This crop is not needed as an interim either, because it would place a light panel beside dark document imagery.
- **Why it's weak:** the panel has no page beside it.
- **Rail labels:** cropping excludes the rail labels that need register review (Templates, Watermark, Stamps, Assistant).

### Responsive summary

| Asset | 1920 / 1440 | 1024 | 768 | 390 / 375 |
|---|---|---|---|---|
| `aud-workspace-hero` | Desktop file, about 1088 CSS px, 1× sharp at ≤1100px | Desktop file | Desktop file (about 720px) | **1:1 mobile file** |
| `aud-workspace-story` | Desktop file in 430–650px rows | Desktop | Desktop | E1 mobile 1:1 |
| `aud-fx-detail` | Desktop 4:3 | 4:3 | 4:3 | **4:5 effects-only** |
| `aud-export-dialog` | Desktop file | Desktop | Desktop | **4:5 info column** |
| Existing hero / `doc-overview` | Unchanged | Unchanged | Unchanged | **New 4:5 page crop** (x 396, y 142, w 548, h 663, already defined as `page`) |
| `edt-*` covers | 16:9 | 16:9 | 16:9 | 16:9 |

Below 768px, masks are baked into **separate files**, so mask alignment can never shift.

---

## F. Asset production manifest

**Production method.** All processing is local, with the repository's own `sharp` dependency, by extending `scripts/build-product-images.mjs`:
- **Declarative masks.** Each derived asset is declared with its crop, mask rectangles, technique and output sizes. Masks are reproducible and reviewable as code.
- **Flattening.** Output is flattened RGB WebP (quality 86) plus PNG fallback where needed, with metadata stripped (no `pHYs`, ICC normalised to sRGB).
- **No external services.** Nothing is uploaded to an external service.

**Provenance and storage.**
- **Originals stay out of git.** The supplied originals stay in `M:\site images` (or a **git-ignored** `assets/product-screenshots/source/`). Do not copy them into the tracked `assets/product-screenshots/raw/`, because their unmasked local paths and names would enter repository history.
- **Masked masters.** Only masked masters are committed, under a new tracked `assets/product-screenshots/derived/`.
- **Public files.** Only processed outputs go to `public/images/product/`.
- **Allowlist.** The pipeline should write only files listed in `src/content/media.ts` (an allowlist), so unapproved files can't reappear in `public/`.

| Derived asset (served name) | Source (exact) | Masks / ops | Sizes out | Target placements | Approval |
|---|---|---|---|---|---|
| `aud-workspace-hero.webp` | `audio interface.png` | CROP 0,34,1390,832; MASK-TEXT 1078,228,300,100; SOFT right panel; SPOT waveform | 1600×958; 1088 w | `/features/audio-redaction` hero | Pending (decision 4) |
| `aud-workspace-hero-mobile.webp` | `audio interface.png` | CROP 360,85,705,705 | 1080×1080 | Same, below 768px | Pending |
| `aud-workspace-story.webp` | `audio interface.png` | CROP 77,80,990,785; SPOT 12% | 1300×1031 | `/` audio row, `/features` hero tile, 5 industry pages | Pending; place with CAP-DOC-01L (§J) |
| `aud-fx-detail.webp` | `audio interface.png` | CROP 77,85,760,570; SOFT waveform right 30% | 1200×900 | Audio "Match the treatment", `/features` audio row, `/industries` audio card, 4 industry pages | Pending (decision 4) |
| `aud-fx-detail-mobile.webp` | `audio interface.png` | CROP 85,140,260,325 | 800×1000 | Same, below 768px | Pending |
| `aud-export-dialog.webp` | `audio export.png` | CROP 250,165,930,650; MASK-TEXT ×2; FROST Schedule | 1400×979 | `/` step 3; `/how-it-works` 05–06 | Pending (decision 5) |
| `aud-export-dialog-mobile.webp` | `audio export.png` | CROP 264,178,300,375 | 800×1000 | Same, below 768px | Pending |
| `doc-hero-page-mobile.webp` | Interim: `hero-document-review.png` (dark master). Final: CAP-DOC-01L | CROP page 396,142,548,663 (re-measure on CAP-DOC-01L) | 1080×1307 | `/` hero, `/features/document-redaction` hero, below 768px | Pending; interim allowed because the hero stays dark until CAP-DOC-01L |
| `edt-document-cover.webp` | CAP-DOC-01L (light). Not produced from the dark master | Same composition as before: page plus top of findings, 16:9; MASK-TEXT findings values; TINT (multiply) | 1600×900; 800×450 | Blog featured, article lead and card fallbacks. **Interim:** the coral tile, not the hero screenshot | Waits for CAP-DOC-01L |
| `edt-audio-cover.webp` | `audio interface.png` | CROP 367,135,693,390; TINT | 1600×900; 800×450 | Future audio articles (fallback) | Pending |

**Record kept per asset** (in `docs/marketing/product-screenshot-manifest.md`):
- original filename and SHA-256
- derived name
- crop and mask regions
- technique
- claim IDs shown
- target pages
- approval state and approver
- date

Add the new captures to `captures` in `src/content/media.ts` with a content-derived `revision` (the existing cache-busting pattern).

**Not produced from the supplied set:** anything from `ai tools for redaction.png`, `document export.png` and `home pag workspace.png`, and full frames of `document interface.png`.

---

## G. Missing screenshots

Shared capture setup applies to every item below:
- **Profile:** a clean Windows profile, so no personal Locations and the status-bar path is a neutral folder such as `C:\Redaction\Projects`.
- **Scaling:** 200% Windows scaling, so masters are about 2880×1780.
- **Version:** current build, with a valid Iron Suite licence (so no failure status).
- **Data:** synthetic data only, with provenance recorded.
- **Theme:** **Light** (decision 1), in the default light palette shown in the supplied files.
- **BETA badge:** per decision 2.

| ID | Replaces | Exact application state required | Claims | Pri |
|---|---|---|---|---|
| **CAP-PRJ-01** | `home pag workspace.png`; `/` step 1; How It Works 01–02 | Project hub "Recent" with 4–6 synthetic projects, **document and audio types only** (no film or image icons), realistic statuses (one In review, one Exported, one Not started), synthetic names ("Records request 0417 (synthetic)"), Locations list empty or one neutral folder | DOC-INPUT, AUD-INPUT | P1 |
| **CAP-DOC-01L** | `hero-document-review.png` and `format-documents.png` (both dark), and therefore every document placement on the site | **Same composition as the dark `format-documents.png`**, so every registry crop (`page`, `pageWithFindings`, `findings`, `manualPanel`, `toolsAndPage`, `pageCloseup`, `toolsWide`, `findingsBeside`, `manualBeside`) can be re-measured 1:1. Manual redaction panel open on the left, Findings tab open on the right. A multi-page synthetic document loaded, 15–30 reviewed marks, one finding selected. Status bar idle (no failed import, valid licence). | DOC-MANUAL, DOC-REVIEW, DOC-CANDIDATES | **P1 (critical path)** |
| **CAP-DOC-05 / EXP-DOC** | `document export.png`; document export row; How It Works 06 | **After the app's "Permanent removal" wording is revised:** (a) the document Export dialog with N > 0 redactions and Export enabled; (b) the re-opened output with the output-check result | DOC-OUTPUT-CHECK, DOC-REPORT | P1 |
| **CAP-AUD-01** | "Put the reviewer on the waveform"; long-term audio hero | Audio editor with **one selected range** on the waveform and timeline, effect = Tone or Mute applied, playhead inside the range during preview, reason entered; transcript panel optional (only with a synthetic recording of recorded provenance) | AUD-TIMELINE, AUD-EFFECTS, AUD-PREVIEW | P1 |
| **CAP-AUD-AI** *(optional)* | Would replace `ai tools for redaction.png` | Audio Review → Findings tab after Run AI Detection on a synthetic recording, showing candidate ranges awaiting decision. **No Tools menu open.** Publish only once the AUD AI/transcript claims move from Conditional. | AUD-TRANSCRIPT-CONTEXT (conditional) | P3 |
| **Sector scans** *(optional)* | Industry document-row repetition | Two or three synthetic sector documents (a scanned form for Healthcare, a claim form for Insurance) in the same editor state as CAP-DOC-01L | DOC-OCR, DOC-MANUAL | P3 |

---

## H. Implementation priorities

**Priority 1: homepage and core product pages**
1. **Remove unapproved files from `public/images/product/`:**
   - `format-video.png`, `step-open.png`, `step-export.png`, `homepage.png`, `step-review.png`, `workflow-export-verification…png`
   - the orphaned showcase components and `showcase-screenshots.ts`

   Restrict `images:product` to a registry allowlist. *(No new assets needed; do this first.)*
2. Extend `scripts/build-product-images.mjs` with declarative masks and flattening. Add a mobile-crop variant to `ProductShot`.
3. Produce and place `aud-workspace-hero` (audio hero), `aud-fx-detail` (audio effects section), `aud-workspace-story` (homepage audio row) and `aud-export-dialog` (homepage step 3).
4. Add the 4:5 mobile hero crops for the homepage and document hero. Switch the homepage document row to `manualBeside`.
5. Commission **CAP-DOC-01L first**, then CAP-PRJ-01, CAP-DOC-05/EXP-DOC and CAP-AUD-01, all in the light theme.
6. Place the light audio assets per the §J sequencing, so no viewport shows a light and a dark capture side by side.

**Priority 2: Features overview, How It Works and supporting content**
1. `/features`: audio hero tile and overview row; document row crop.
2. `/how-it-works`: stages 03–04 crop; 05–06 `aud-export-dialog`; 01–02 once CAP-PRJ-01 lands.
3. `/industries` audio card; nine industry audio rows (alternating variants).
4. Place CAP-DOC-05 and CAP-AUD-01 captures when delivered, replacing the remaining slots.

**Priority 3: blog, secondary pages and consistency**
1. `edt-document-cover` (after CAP-DOC-01L) / `edt-audio-cover` as CMS-empty fallbacks on `/blog`, the article lead image and category cards. Retire the graphite `blog-card-visual`. Until the document cover exists, the fallback is the coral tile rather than the hero screenshot.
2. Rotate the document crops across the nine industry pages.
3. Optional sector scans; optional CAP-AUD-AI.
4. Update `assets/product-screenshots/README.md` (stale naming and table) and the publication manifest.

---

## I. Approval checklist

### Decisions

1. **Theme for product imagery.** ✅ **Resolved 2026-10-29: light.** The supplied light captures are used directly; the dark document masters are interim until CAP-DOC-01L; no dark re-captures are commissioned. See §J.
2. **The `BETA` badge.** Crop it out (current plan), or show it truthfully in re-captures? Recommended: crop the title bar. Product maturity is stated in copy, not implied by chrome.
3. **Tool-rail features not in the register.** Templates, Watermark, Stamps and Assistant: approve as visible-but-uncaptioned, or keep them cropped out (current plan).
4. **Audio effects beyond the register.** Beep, White/Pink noise, Low/High pass, Reverse, Voice disguise are implemented in the render pipeline. Extend AUD-EFFECTS, or keep captions to "mute, tone, silence or noise" while the UI shows all (current plan).
5. **The Schedule field in audio export.** It is not connected. Hide it in the app and re-capture (recommended), or approve the `FROST` mask.
6. **Export wording in the app.** "Permanent removal… cannot be recovered" conflicts with the blocked irreversible-output claim; "file is refused rather than delivered" needs sign-off. Revise before CAP-DOC-05/EXP-DOC is captured.
7. **"Nothing is uploaded to export it"** (audio export UI text). Approve as shown, with no offline-processing paraphrase in captions.

### Asset approvals (per row of §F)

- [ ] `aud-workspace-hero` and its mobile file
- [ ] `aud-workspace-story`
- [ ] `aud-fx-detail` and its mobile file
- [ ] `aud-export-dialog` and its mobile file
- [ ] `doc-hero-page-mobile`
- [ ] `edt-document-cover`, `edt-audio-cover`

### Source and provenance confirmations

- [ ] Confirm `Mock Interview - Ms. Willow Waverly.m4a` is a synthetic recording (the derivatives mask the name regardless). Record its provenance.
- [ ] Confirm the masked file names in `audio interface.png` are not customer material.
- [ ] Confirm removal of the six unreferenced files from `public/images/product/` and the orphaned components.
- [ ] Confirm the originals stay out of git (`M:\site images` or a git-ignored folder).

### Captures to commission

- [ ] **CAP-DOC-01L** (light document review; critical path)
- [ ] CAP-PRJ-01, CAP-AUD-01, CAP-DOC-05/EXP-DOC (all light)
- [ ] (optional) CAP-AUD-AI, sector scans

---

### Answers to the four acceptance questions

1. **Where are visuals generic, weak or unnecessary?**
   - All 16 audio illustrations (homepage, Features ×2, audio page ×3, Industries ×10).
   - The project-workspace, export and output-check diagram slots.
   - The 17-fold repetition of one document frame.
   - Blog covers that reuse the homepage hero.
   - Six unapproved files still publicly served.
2. **Which real screenshot replaces each?**
   - `audio interface.png` feeds four audio variants.
   - `audio export.png` feeds the export slots.
   - Existing document masters are re-cropped for variety and mobile.
   - The other four supplied files are not publishable; new captures are specified in §G.
3. **What stays visible, blurred or masked?** See §E. In short:
   - **Sharp:** waveform, transport, effects, export options.
   - **Masked:** file names, paths and the unconnected Schedule field.
   - **Soft-focused:** secondary panels.
   - **Cropped out:** title bars, status bars and the image-format rail.
4. **How are they incorporated safely?**
   - Masks are flattened locally into separate derived files (desktop and mobile), produced by the existing sharp pipeline.
   - The pipeline publishes from a registry allowlist; originals stay out of git and out of `public/`.
   - No external services, no CSS-only blur.
   - Every asset is recorded in the manifest with claim IDs, so nothing implies a capability the register doesn't support.

---

## J. Light-theme rollout (decision 1) — superseded by §K

**What the decision changes**
- **Audio:** `audio interface.png` and `audio export.png` are used as supplied; no dark re-capture.
- **Documents:** all document imagery moves to light. `hero-document-review.png` and `format-documents.png` (dark, older build) are **interim** and are retired from `public/` and `raw/` once CAP-DOC-01L is approved.
- **Covers:** `edt-document-cover` is made from CAP-DOC-01L, not the dark master.
- **Not needed:** the `doc-manual-light` detail crop and the dark audio set.

**Sequencing, so no viewport mixes themes**

| Stage | Trigger | Places | Pages it touches |
|---|---|---|---|
| 1 | Now (after asset approval) | `aud-workspace-hero`, `aud-fx-detail` on `/features/audio-redaction` | The only page with no dark document capture in the same view. (How It Works was listed here first, but its stage row puts the export beside the dark 03–04 capture, so it moved to stage 3.) |
| 2 | Now | Public-folder clean-up, pipeline masks, `doc-hero-page-mobile` (interim from the dark hero, which stays dark until stage 3) | Homepage and document hero on mobile |
| 3 | CAP-DOC-01L approved | Re-measure every registry crop on the light master; swap hero, document rows and How It Works 03–04 in one release; place `aud-workspace-story` on `/`, `/features` and the industry audio rows; place `aud-export-dialog` (4:3 crop, ready) on homepage step 3 and How It Works 05–06; produce `edt-document-cover` | `/`, `/features`, `/features/document-redaction`, `/how-it-works`, `/industries`, all industry pages, blog fallbacks |
| 4 | CAP-PRJ-01, CAP-DOC-05, CAP-AUD-01 approved | Replace the remaining diagram slots | Step 1 / stages 01–02, document export row, "Put the reviewer on the waveform" |

Homepage step 3 waits for stage 3 even though its asset is ready. The workflow accordion shows step 2 (dark document) and step 3 (light export) within a few hundred pixels of each other.

**Presenting light captures on this site**
- **Frame contrast.** Light UI on the off-white lower field of the hero stage, and on white sections, loses its edge. Every light capture keeps the existing `.media-frame` with a 1px `rgb(28 25 23 / 0.08)` border and the current soft shadow. The audit captures confirm the dark homepage formats band gives light captures strong contrast without extra treatment.
- **Hero stage.** The homepage hero card already sits on the coral-to-off-white gradient with its own white "Review in context" header, so the light capture continues that card instead of contrasting with it. Keep the inner 1px border so the app window still reads as a window.
- **Spotlight strength.** On light captures, the `SPOT` dim is 10–12% rather than 15–20%, because dimming a light UI greys it quickly.
- **Editorial tint.** On light sources, `TINT` uses multiply at 12–16% (as already specified for `edt-audio-cover`).
- **Mask colours.** `MASK-TEXT` fills and `SOFT`/`FROST` veils sample the light panel colours (about `#F5F3F1` panels, `#FFFFFF` fields), so masks read as quiet empty fields, not grey blocks.

---

## K. Revised decision and full integration (2026-10-30)

### Decision

The owner revised the plan on 2026-10-30:

- **The supplied screenshots are approved source material** for marketing uses that match what they actually show.
- **Each screenshot is paired with a truthful message.** An empty editor is presented as the workspace and its tools; an export dialog with nothing marked is presented as export settings. Neither is presented as a finished redaction or export.
- **Selective obfuscation protects unnecessary detail only:** names, paths, file lists, identifiers, and content for formats that are not promoted. It is never used to hide a failure or a disabled control in a way that would change the meaning of the view.
- **New captures are optional improvements, not prerequisites.** CAP-DOC-01L (a light document review) and the other §G captures no longer block any placement.
- **Mixed themes are acceptable** where needed. Real evidence beats theme consistency. Dark captures of a finished review sit in separate sections from the light workspace views, inside the same frames.

### What each supplied screenshot is used for

| Screenshot | Masked master (served) | Message it supports | Placements |
|---|---|---|---|
| `audio interface.png` | `audio-workspace.png` (unchanged from stage 1) | The audio editor: waveform, transport, timeline, masking effects | Audio hero; audio effects row; homepage audio row; `/features` audio tile and audio overview row; Industries hub audio card; industry audio rows (rotating) |
| `audio export.png` | `audio-export.png` (re-cut wider for a 16:10 crop) | Exporting a redacted audio copy as a new file | Homepage step 3 "Create the Output"; How It Works 05–06 "Export a redacted copy"; industry audio rows (rotating) |
| `home pag workspace.png` | `project-workspace.png` | Project organisation: library views, statuses, a project to continue | Homepage step 1 "Open Your File"; How It Works 01–02 "Organise and open projects"; Why OpenRedakt evidence section |
| `document interface.png` | `document-workspace.png` | The document workspace and its tools. No document is open, and the alt text says so | Homepage document row; `/features` document tile; Document page "Handle what a detector cannot know"; Industries hub document card; industry document rows (rotating) |
| `document export.png` | `document-export.png` | Document export settings: output format, optional audit report, what the export carries. Nothing is marked yet, so the export button is unavailable, and the alt text says so | Document page "Treat export as another review step" |
| `ai tools for redaction.png` | none | **Excluded.** Its only content not already in `audio interface.png` is the open Tools menu: *Video Assistant* (video is not promoted), *Record* and *Schedule* (stubs in the desktop code), and *Run AI Detection* for audio (not in the capability register). The menu cannot be shown truthfully without masking most of it. | — |
| `hero-document-review.png` (approved raw master) | `editorial-document-cover.png` | Editorial fallback cover: tinted and softened, with finding values masked | Blog featured article, article lead image, article cards and the homepage Blog row, only for articles without their own image |

The dark captures of a finished review (`hero-document-review.png`, `format-documents.png`) remain where only they can show completed work: the homepage hero, the homepage workflow step 2, the Document page hero and findings row, How It Works 03–04, and some industry document rows.

### Treatments (all baked into the pixels; source coordinates)

- **`project-workspace.png`** from `home pag workspace.png`.
  - Crop: 0,34,1438,832 (title bar and status bar removed).
  - Text masks: Locations paths 44,304,152,272 (counts kept); continue-card project name 606,172,46,26; file chips 604,202,656,44; nine card names, each 92×19 at x 290/668/1046, y 497/668/840.
  - Frost: file-type icons on the continue card (375,200,112,66) and on all nine card thumbnails alike (120×44 each). Some thumbnails showed video or image icons; softening every card the same avoids implying any project holds only one type.
- **`document-workspace.png`** from `document interface.png`.
  - Crop: 0,34,1437,824. The status bar is outside the crop; it named a test file and reported an import refused for a third-party licence key.
  - Text masks: project name 972,137,48,20 and 972,243,44,18; three file names (1032,279,226,18; 1032,316,116,17; 1032,351,222,18). The "Ready" and "Not prepared" statuses stay visible.
  - The empty canvas is shown as it is.
- **`document-export.png`** from `document export.png`.
  - Crop: the settings column, 584,180,598,620.
  - Text masks: document name 622,242,200,22; export folder 622,316,264,22; export name 622,412,178,22.
  - The state is kept, including "Nothing is marked for redaction yet" and the unavailable "Export secure PDF" button. The left column is outside the crop; its "Permanent removal" wording is language the claim policy does not use.
- **`audio-export.png`** from `audio export.png`.
  - Crop widened to 160,130,1100,688, giving plain editor surface around the dialog. The masks are unchanged.
- **`editorial-document-cover.png`** from raw `hero-document-review.png`.
  - Crop: 380,140,1020,574.
  - Text masks: five finding values, each 182×22 at x 1036, y 327/411/493/576/658.
  - Finish: 1.2 blur, coral `#FF735C` screen tint at 16%.

Verification: masked regions keep 1.8–2.0% of their original edge energy, so no glyph structure survives. Unmasked pixels are unchanged. No master carries EXIF, XMP, IPTC or ICC metadata. Pipeline fix: the veil-colour sampler now measures the ring it extracts, not the whole image.

### Responsive crops

| Visual | Desktop crop | Below 768px |
|---|---|---|
| Project library (homepage step 1) | `hubStep` 16:10 (plain crop edge; a fade showed the frame's dark screen colour) | `hubMobile` 0.8 (library and continue card) |
| Project library (How It Works) | `hubFourThree` 4:3 | `hubMobile` |
| Project library (Why OpenRedakt) | `hub` full window | `hubMobile` |
| Document tools (`/features`, Document page) | `toolsCanvas` 4:3 | `manualMobile` 0.8 (tool rail and manual panel) |
| Manual panel (homepage, industries) | `manualTools` 4:3 | `manualMobile` |
| Workspace files (Industries hub, industries) | `filesPanel` 4:3 | `filesMobile` 0.8 |
| Document export settings | `settings` ≈1:1 | same (already near-square) |
| Audio workspace story (homepage, `/features`, industries) | `workspaceFourThree` 4:3 | `waveformSquare` 1:1 |
| Audio export (homepage step 3) | `stepWide` 16:10 | `summary` 0.8 |
| Audio export (How It Works, industries) | `dialogFourThree` 4:3 | `summary` |

### Diagrams retained

- **Audio page "Put the reviewer on the waveform":** keeps its labelled diagram. That section is about drawing a range, and no supplied capture shows a selected range. Re-using the audio workspace would also repeat the hero on the same page.

### Optional future captures (no longer blocking)

1. **CAP-DOC-01L.** A light-theme document review with marks and findings. It would let the dark captures retire.
2. **CAP-AUD-01.** A selected audio range with an effect applied. It would replace the last audio diagram.
3. **CAP-DOC-05.** A document export with redactions and the re-opened output check, after the app's "Permanent removal" wording is revised.
4. **Re-captures in a clean profile.** These would need fewer masks: no BETA badge, synthetic project names, no Schedule field.
5. **An audio editorial cover,** for future audio articles.

