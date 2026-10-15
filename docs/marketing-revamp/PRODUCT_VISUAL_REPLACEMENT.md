# Product visual replacement — audit, mapping and capture brief

Replacing the stylized product representations on the marketing site with authentic
Safe Redact screenshots.

**Status: the capture step is blocked.** The audit and mapping below are complete and
are what a capture session needs. No visual has been replaced yet, and no substitute
has been put in place — see "Why nothing was replaced".

---

## Why nothing was replaced

Three things were checked before touching any component.

**1. There are no Safe Redact screenshots anywhere.** `M:\Safaridesk\redact` holds 35
images. Every one is either a brand icon, a Figma design export under
`figma-design/screens/`, or the same exports mirrored as visual-regression baselines
under `tests/Redactor.App.Tests/Baselines/Figma/`. None is a capture of the running
application.

**2. The Figma screens are a different product.** `figma-design/screens/Editor.png`
is 1908×1098 and well composed, so it looked like a candidate. Its title bar reads:

> **Bug Reportt** — CaseGuard Studio\*

with the status bar showing `C:\CG Videos\Bug Reportt\CCTV in Prison (1).mp4`. The app
source references CaseGuard in `Features/Editor/`, and Safe Redact ships its own brand
assets (`Assets/Brand/safe-redact-icon.png`). So these are **CaseGuard Studio** screens
held as a design reference, not Safe Redact's interface.

Putting them on the Safe Redact site would present another company's product UI as
Safe Redact's own, under Safe Redact branding. That is misrepresentation regardless of
the relationship between the two products, so they are not usable here and I have not
used them. It would also fail the brief's own rule against fake product representation
— it is simply a different fake from the current one.

**3. Capturing real screenshots is not possible from this session.** Safe Redact is a
.NET 10 WPF desktop application. `artifacts/` holds no built binary, so it would need
building and running, loading sample files, and capturing the Windows desktop. This
session has no desktop-capture capability — only a web browser pane, which cannot see
a native window. Even with the app built and running, I could not photograph it.

The honest conclusion is that this task needs a human at the machine with the app
running. Everything below exists to make that session short.

---

## Audit: current product visuals

All four are hand-built JSX/CSS abstractions. There are no raster assets to swap — each
replacement means putting an `<Image>` inside the existing frame, keeping the frame.

| # | Component | Used by | Frame / aspect | What it communicates |
|---|---|---|---|---|
| 1 | `src/components/visuals/RedactionWorkbench.tsx` | `sections/Hero.tsx` | `aspect-[608/372]`, max-width 608px, `rounded-panel`, dark `#0d1220` | The workbench: a document page with candidate detections beside a review list (Person name / Email address / Reference ID, each Pending or Approved) |
| 2 | `src/components/visuals/WorkflowPreview.tsx` | `sections/HowItWorks.tsx` | min-height 390px (440px ≥sm), `rounded-panel`, inner light panel `#eef2f7` | The three-step flow: Open a supported file → Detect and review → Export and inspect |
| 3 | `src/components/visuals/FormatPreview.tsx` | `sections/WhySafeRedact.tsx` | min-height 310px (390px ≥sm); inner panel 235px (290px ≥sm), max-width 380px | Tabbed per format: **Documents & images**, **Audio & transcripts**, **Video** |
| 4 | `src/components/visuals/UseCaseVisual.tsx` | `sections/Industries.tsx` | fixed `h-36` card header, decorative, `aria-hidden` | Texture on industry cards. Decorative only — **not** a product claim |

---

## Mapping: what to capture for each

Priority order as given. Each row is one capture.

### 1. Hero workbench → **document review with detections**

- **Screen:** main editor, a document or image loaded, detection complete, the review
  list showing several accepted and pending items.
- **Why:** the hero visual's whole message is "candidates found, operator decides".
  The review list must be visible or the screenshot says less than the drawing it
  replaces.
- **Target:** 1216×744 (2× of 608×372) PNG. Crop to the app window, excluding desktop.
- **Content:** a synthetic document with invented names and addresses. No real case
  material, no customer data, no real file paths in the title or status bar.

### 2. Workflow / export-review → **the export and verification pass**

- **Screen:** the export dialog or the verification result, showing a job completing
  and the output being re-checked.
- **Why:** this is the one step with no equivalent in the current drawing. The README
  calls verification a separate pass over the *output*; a screenshot of that is the
  strongest authenticity gain on the site.
- **Target:** ~1400×1000 PNG; the frame is min-height driven, so height is flexible.

### 3. Documents & images → **page view with a redaction applied**

- **Screen:** a document page, at least one region redacted, the page/thumbnail list
  visible so it reads as a multi-page document.
- **Target:** 760×580 PNG (2× of the 380×290 inner panel).

### 4. Audio & transcripts → **transcript review with the waveform**

- **Screen:** an audio file open, waveform and transcript side by side, a detected
  span selected.
- **Why:** audio redaction is the least self-evident capability on the site; a real
  transcript view does more work than any drawing.
- **Target:** 760×580 PNG.

### 5. Video → **frame review with tracking**

- **Screen:** video loaded, a tracked box on a face or plate, timeline with marked
  segments.
- **Why:** the README calls out manual object tracking — draw once, followed forward.
  A timeline showing that is a genuine differentiator.
- **Target:** 760×580 PNG.

### 6. Industry cards

No capture. These are `aria-hidden` texture, not product claims, and replacing them
with screenshots at `h-36` would produce four illegible thumbnails.

---

## Capture rules

- The app's own title bar and status bar must read **Safe Redact**, with no other
  product name and no real file path.
- Synthetic content only: invented names, addresses and reference numbers. No customer
  material, no real case files, nothing from a real mailbox.
- Window only — no desktop, taskbar, notifications or other applications.
- Dark theme, to sit with the site's `#0c111f` panels without re-colouring.
- Capture at 2× (or on a HiDPI display) so the asset stays sharp in a `rounded-panel`.
- PNG for capture. Conversion to AVIF/WebP happens here; `next.config.ts` already
  serves both.

## Once the captures exist

Assets land in `public/images/product/`. Each component keeps its existing `<figure>`,
border, radius, shadow and responsive heights; only the inner drawing is replaced by
`next/image` with `fill` and `object-cover`, plus a real `alt` describing the screen.
The frames already carry fixed aspect ratios or min-heights, so no spacing changes.

Then: responsive QA at 1440, 768, 390 and 320, checking for overflow, distortion and
legibility at the smallest size — a screenshot that is unreadable at 390px is worse
than the drawing it replaced, and that is the most likely place this runs into trouble.
