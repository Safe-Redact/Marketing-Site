# Product screenshots

Where the SafeRedact application screenshots used on the marketing site live, and how
to change them.

## Layout

```
assets/product-screenshots/
├── raw/          source of truth — the approved masters (tracked)
└── README.md

public/images/product/   what the site serves (tracked, generated)
```

**`raw/` is the source of truth.** It holds the finished art as delivered. Nothing in
this repository resamples, sharpens, upscales or colour-grades it — the served files
are either byte-for-byte copies or native-pixel crops.

There is no staging directory. An earlier `optimized/` folder was removed once the
enhancement pipeline was dropped: it had become a third copy of the same bytes.

## Changing a screenshot

1. Replace the file in `raw/`, keeping the filename.
2. Run:

   ```bash
   npm run images:product
   ```

3. Hard-reload the browser (**Ctrl+Shift+R**). This matters — see *Caching* below.

`scripts/build-product-images.mjs` is the only thing that writes
`public/images/product/`. It also deletes anything there it did not produce, so stale
assets cannot survive a rename.

## What each visual uses

| Served file | Master | Operation | Used by |
|---|---|---|---|
| `hero-document-review.png` | `hero-document-review.png` | copied unchanged | Hero |
| `step-open.png` | `homepage.png` | copied unchanged | Workflow step 1 |
| `step-review.png` | `format-documents.png` | copied unchanged | Workflow step 2 |
| `step-export.png` | `workflow-export-...png` | crop 1048×655 at (250,0) | Workflow step 3 |
| `format-documents.png` | `format-documents.png` | copied unchanged | Documents & images tab |
| `format-audio.png` | `format-audio.png` | crop 1102×715 at (338,95) | Audio & transcripts tab |
| `format-video.png` | `format-video.png` | copied unchanged | Video tab |

**Why the two crops exist:**

- **`step-export`** — the full frame shows `Export failed` in the dialog and
  `Export failed: A file this export needs is no longer where it was` in the status
  bar. A failed export under "Create the Output" would say the opposite of what that
  section claims. The crop stops above it and keeps the output settings and the
  "Permanent removal" verification notice.
- **`format-audio`** — waveform and transcript without the tool rails, which is what
  makes that panel readable at its display size.

Each container in `src/components/visuals/` carries its screenshot's own aspect ratio,
so the full-frame visuals are shown uncropped.

## Caching

Next serves these through `/_next/image?url=/images/product/<name>.png&w=…`. That URL
is built from the **filename**, not the contents. Replacing a file without renaming it
leaves the URL unchanged, so browsers keep showing the old picture until a hard reload.

If images are going to be swapped often, putting a content hash in the filenames would
remove this class of confusion for good.

## Known limitations

The current publication decision for each asset is recorded in
`docs/marketing/product-screenshot-manifest.md`. That manifest governs new page use;
an asset remaining in this directory does not by itself make it approved for a new
marketing surface.

- **Mobile legibility.** The full-window visuals render 200–350px wide at 320–390px
  viewports. They stay recognisable, but UI text is not readable there. That is the
  cost of full frames over tight crops. A mobile-specific crop through `<picture>`
  would fix it.
- **`format-video.png` carries a PBS NewsHour watermark** over footage of a real
  Senate hearing with identifiable faces, and its Project Files panel lists
  third-party media. This was raised before the image was used and the owner chose to
  use it as-is on 2026-10-16. Recorded here so the decision is not lost; replacing it
  with a capture over owned footage remains the stronger option.
- **The industry cards** (`src/components/visuals/UseCaseVisual.tsx`) are still a
  drawing, not a screenshot. They are `aria-hidden` decorative texture at 144px tall,
  where a screenshot would be an illegible thumbnail.
