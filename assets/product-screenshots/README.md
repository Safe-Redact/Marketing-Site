# Product screenshots

Where the OpenRedakt application screenshots used on the marketing site live, and how
to change them.

## Layout

```
assets/product-screenshots/
├── raw/       approved art, published unchanged (tracked)
├── derived/   masked masters produced by the pipeline (tracked)
├── source/    unmasked originals from the team (git-ignored, never tracked)
└── README.md

public/images/product/   what the site serves (generated; registry allowlist only)
```

- **`raw/`** holds approved art as delivered. It is published byte-for-byte, never
  resampled or graded. Some files here are kept as history but are **not published**
  (see the manifest): only files the pipeline lists reach `public/`.
- **`derived/`** holds masked masters. Each one is produced from an unmasked original
  by `scripts/build-product-images.mjs`, which declares the crop and every mask region
  in code. The masks are baked into the pixels, because `ProductShot` crops with CSS
  and the whole file reaches the browser.
- **`source/`** is where unmasked originals go if you keep them in the repository
  folder. It is git-ignored, because the originals carry local paths and file names.
  You can instead point `PRODUCT_SCREENSHOTS_SOURCE` at the folder they live in.

## Building

```bash
npm run images:product
```

To regenerate the masked masters from the originals, run it with
`PRODUCT_SCREENSHOTS_SOURCE` set to the folder holding them (for example
`M:\site images`). Each original is checked against the SHA-256 recorded in the
script, so a changed screenshot cannot be published without a fresh review. Without
the originals, the committed masked masters are published as they are.

The script deletes anything in `public/images/product/` that it did not produce.
`tests/product-media.test.ts` checks that the served files, the pipeline list and
`captures` in `src/content/media.ts` are the same set, and that every revision,
dimension and crop matches the served file.

After a rebuild, update the `revision` of any changed capture in `src/content/media.ts`
(the script prints it), then hard-reload the browser (**Ctrl+Shift+R**).

## What is published

| Served file | Master | Operation | Used by |
|---|---|---|---|
| `audio-workspace.png` | `derived/audio-workspace.png` from `audio interface.png` | masks: project file names (text), Project Files panel (soft), icon rail (frost); crop removes title and status bars | Audio page hero and effects row, homepage audio row, `/features`, Industries |
| `audio-export.png` | `derived/audio-export.png` from `audio export.png` | masks: file name and location (text), Schedule control (frost); crop to the dialog on the plain editor surface | Homepage step 3, How It Works 05–06, industry audio rows |
| `project-workspace.png` | `derived/project-workspace.png` from `home pag workspace.png` | masks: folder paths, project names, file chips (text); file-type icons on every thumbnail (frost); crop removes title and status bars | Homepage step 1, How It Works 01–02, Why OpenRedakt |
| `document-workspace.png` | `derived/document-workspace.png` from `document interface.png` | masks: project and file names (text); crop removes title and status bars; no document open, shown as it is | Homepage document row, `/features`, Document page tools row, Industries |
| `document-export.png` | `derived/document-export.png` from `document export.png` | masks: document name, export folder, export name (text); crop to the settings column; nothing marked, shown as it is | Document page export row |
| `editorial-document-cover.png` | `derived/editorial-document-cover.png` from `document interface.png` | crop to the tools and page; finish: blur and coral soft-light tint | Blog fallback cover |

Mask techniques (defined in the script):

- **text**: pixelated in 14px blocks, then blurred. Pixelating first destroys the
  glyphs, so the blur cannot be reversed.
- **soft**: light blur plus a veil in the panel's own colour.
- **frost**: heavy blur plus a strong veil, for a control that is not connected yet.

Masks remove identifying or unconnected content only. They are never used to make an
empty or failed state look complete; such captures are replaced instead.

## Caching

Next serves these through `/_next/image?url=/images/product/<name>.png&v=<revision>`.
The `revision` query (a content hash prefix) changes whenever the file changes, so a
replaced capture is not served from a stale URL.

## Known limitations

The publication decision for each asset is recorded in
`docs/marketing/product-screenshot-manifest.md`, and the wider plan in
`docs/design/product-visual-audit.md`.

- **Light theme only.** Since 2026-10-30 no dark capture is published. The dark masters
  in `raw/` (`hero-document-review.png`, `format-documents.png`) are kept as history but
  are not in the pipeline's published list. A light capture of a document under review
  (marks and findings) is the main missing image.
- **Mobile.** Wide window crops are illegible below 768px. `ProductShot` takes a
  `mobileCrop` from the same file for phones.
