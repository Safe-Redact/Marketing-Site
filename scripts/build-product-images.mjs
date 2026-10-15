import { copyFile, mkdir, readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Builds the served product visuals from the approved masters.
 *
 * `assets/product-screenshots/raw/` is the source of truth: finished art, used as
 * delivered. This script never resamples, sharpens or grades it. Five visuals are
 * copied byte-for-byte; two are cropped, for reasons recorded against each one below.
 *
 *   npm run images:product
 *
 * Re-run it whenever a master is replaced, so the crop coordinates live in code
 * rather than in someone's memory.
 */

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW = path.join(repositoryRoot, "assets", "product-screenshots", "raw");
const OUT = path.join(repositoryRoot, "public", "images", "product");

const visuals = [
  { out: "hero-document-review.png", from: "hero-document-review.png" },
  { out: "step-open.png", from: "homepage.png" },
  { out: "step-review.png", from: "format-documents.png" },
  { out: "format-documents.png", from: "format-documents.png" },
  { out: "format-video.png", from: "format-video.png" },
  {
    out: "step-export.png",
    from: "workflow-export-verificationworkflow-export-verification.png",
    // Stops above the "Export failed" row and the failure line in the status bar,
    // keeping the output settings and the "Permanent removal" notice.
    crop: { left: 250, top: 0, width: 1048, height: 655 },
  },
  {
    out: "format-audio.png",
    from: "format-audio.png",
    // Waveform and transcript without the tool rails, which is what makes this panel
    // readable at its display size.
    crop: { left: 338, top: 95, width: 1102, height: 715 },
  },
];

await mkdir(OUT, { recursive: true });

// Anything not produced below is stale and would otherwise linger in the deploy.
const expected = new Set(visuals.map((visual) => visual.out));
for (const file of await readdir(OUT).catch(() => [])) {
  if (file.endsWith(".png") && !expected.has(file)) {
    await unlink(path.join(OUT, file));
    console.log(`  removed stale ${file}`);
  }
}

for (const visual of visuals) {
  const from = path.join(RAW, visual.from);
  const to = path.join(OUT, visual.out);

  if (visual.crop) {
    await sharp(from).extract(visual.crop).png({ compressionLevel: 9 }).toFile(to);
  } else {
    await copyFile(from, to);
  }

  const meta = await sharp(to).metadata();
  console.log(
    `  ${visual.out.padEnd(26)} ${String(meta.width).padStart(4)}x${meta.height}  ` +
      (visual.crop ? "crop only" : "copied unchanged")
  );
}
