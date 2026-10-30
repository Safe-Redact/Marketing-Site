import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Builds the served product visuals.
 *
 *   npm run images:product
 *
 * Two kinds of master feed public/images/product/:
 *
 * - raw/      approved art, served unchanged (byte-for-byte copies).
 * - derived/  masked masters. Each is produced here from an unmasked original. The
 *             crop and every mask region are declared below, so the treatment is
 *             reviewable as code and reproducible.
 *
 * Unmasked originals are never tracked or served. They are read from
 * PRODUCT_SCREENSHOTS_SOURCE (default: the git-ignored assets/product-screenshots/source/),
 * checked against the SHA-256 recorded for them, masked, cropped and flattened. Masks
 * are baked into the pixels: ProductShot crops with CSS, so the whole master reaches
 * the browser and nothing sensitive may survive anywhere in it. When an original is
 * absent, the committed derived master is published as it is.
 *
 * Only the files listed in `published` reach public/. Anything else there is deleted,
 * so an unapproved capture cannot linger in a deploy. The list must match
 * `captures` in src/content/media.ts (enforced by tests/product-media.test.ts).
 */

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(repositoryRoot, "assets", "product-screenshots");
const RAW = path.join(ASSETS, "raw");
const DERIVED = path.join(ASSETS, "derived");
const SOURCE = process.env.PRODUCT_SCREENSHOTS_SOURCE ?? path.join(ASSETS, "source");
const OUT = path.join(repositoryRoot, "public", "images", "product");

/**
 * Mask kinds, applied in source pixels before the crop:
 * - text:  pixelate in 14px blocks, then Gaussian blur. Pixelating first destroys the
 *          glyph structure, so a blur cannot be reversed to recover the text.
 * - soft:  light blur plus a veil in the panel's own colour: still reads as a panel,
 *          no longer reads as content.
 * - frost: heavy blur plus a strong veil, for a control that is not connected yet.
 * `colour` is the veil colour (the panel's own background). Without it, the colour is
 * sampled from a ring just outside the region.
 * `feather` softens the edge outward from the region, so the region itself is covered
 * at full strength.
 *
 * `dir: RAW` reads the original from the tracked approved masters instead of the
 * unmasked source folder. `finish` applies after the crop: an overall softening and a
 * brand tint, used only for editorial covers (never for product evidence).
 */
const derivedMasters = [
  {
    out: "audio-workspace.png",
    from: "audio interface.png",
    sha256: "53a70caec0c163a2fcc3e8970cb160ef3c0949fafe9f746ea97e6fa740e918f9",
    masks: [
      // Project file names (a personal name and real-looking document titles).
      { kind: "text", x: 1122, y: 228, w: 240, h: 104, feather: 4 },
      // The Project Files panel is secondary to the waveform.
      { kind: "soft", x: 1072, y: 85, w: 318, h: 781, feather: 8, sigma: 3, veil: 0.3, colour: "#ffffff" },
      // The right icon rail includes an entry for image files, a format that is not promoted.
      { kind: "frost", x: 1394, y: 85, w: 37, h: 781, feather: 4, sigma: 8, veil: 0.7, colour: "#ffffff" },
    ],
    // Drops the title bar (BETA badge, working file name) and the status bar (local job
    // path); keeps the full toolbar, including Export audio.
    crop: { left: 0, top: 34, width: 1431, height: 832 },
  },
  {
    out: "audio-export.png",
    from: "audio export.png",
    sha256: "388c09e10a5f6541032fe37ab7b0b30a4726b9d01a43eb99a0c4d0652a0b073c",
    masks: [
      // Output file name (contains a personal name). Kept inside the field border.
      { kind: "text", x: 606, y: 240, w: 476, h: 20, feather: 2 },
      // Export location (a local user path). Kept inside the field border.
      { kind: "text", x: 606, y: 388, w: 428, h: 20, feather: 2 },
      // "Schedule optional" and its date picker: scheduled export is not connected in
      // the application yet, so the control is not shown as if it worked.
      { kind: "frost", x: 868, y: 432, w: 258, h: 60, feather: 4, sigma: 10, veil: 0.75, colour: "#ffffff" },
    ],
    // The dialog with some of the plain editor surface around it (room for a 16:10
    // crop), clear of the "…opened" toast above it.
    crop: { left: 160, top: 130, width: 1100, height: 688 },
  },
  {
    out: "project-workspace.png",
    from: "home pag workspace.png",
    sha256: "2c3f12fdc584508e67d46dd72070700f367f7892d450cd60c5980a14b08e8242",
    masks: [
      // Locations: local folder paths. The counts beside them stay.
      { kind: "text", x: 44, y: 304, w: 152, h: 272, feather: 3 },
      // "Continue where you left off": the project name and its file chips (a file name
      // naming a real public office, and internal file ids).
      { kind: "text", x: 606, y: 172, w: 46, h: 26, feather: 2 },
      { kind: "text", x: 604, y: 202, w: 656, h: 44, feather: 2 },
      // Project names on the cards.
      ...[497, 668, 840].flatMap((y) => [290, 668, 1046].map((x) => ({ kind: "text", x, y, w: 92, h: 19, feather: 1 }))),
      // File-type icons on every thumbnail, softened alike. Some projects hold video or
      // image files, formats that are not promoted; treating every card the same avoids
      // implying any project holds only one type.
      { kind: "frost", x: 375, y: 200, w: 112, h: 66, feather: 6, sigma: 8, veil: 0.6 },
      // Kept (with their feather) inside each thumbnail, so no white from the card body bleeds in.
      ...[430, 601, 772].flatMap((y) => [402, 780, 1158].map((x) => ({ kind: "frost", x, y, w: 120, h: 44, feather: 5, sigma: 8, veil: 0.6 }))),
    ],
    // Drops the title bar (BETA badge) and the status bar (local path, version).
    crop: { left: 0, top: 34, width: 1438, height: 832 },
  },
  {
    out: "document-workspace.png",
    from: "document interface.png",
    sha256: "039cb6d0918515af314fdffe8fb571e15395d60faee8879d3fb2bade292aa6e5",
    masks: [
      // Project name, in the panel header and above the file list.
      { kind: "text", x: 972, y: 137, w: 48, h: 20, feather: 2 },
      { kind: "text", x: 972, y: 243, w: 44, h: 18, feather: 2 },
      // File names (a personal name and real-looking titles). Their statuses stay.
      { kind: "text", x: 1032, y: 279, w: 226, h: 18, feather: 1 },
      { kind: "text", x: 1032, y: 316, w: 116, h: 17, feather: 1 },
      { kind: "text", x: 1032, y: 351, w: 222, h: 18, feather: 1 },
    ],
    // Drops the title bar (BETA badge, working file name) and the status bar, which
    // names a test file and reports an import refused for a third-party licence key.
    // No document is open: the canvas stays visible as it is.
    crop: { left: 0, top: 34, width: 1437, height: 824 },
  },
  {
    out: "document-export.png",
    from: "document export.png",
    sha256: "5b20f616ee191ea63863aeb12c633551fb8f54f7206ca22e2310d9fe7c8bf8d6",
    masks: [
      // Document name, export folder (a local path) and export name.
      { kind: "text", x: 622, y: 242, w: 200, h: 22, feather: 2 },
      { kind: "text", x: 622, y: 316, w: 264, h: 22, feather: 2 },
      { kind: "text", x: 622, y: 412, w: 178, h: 22, feather: 2 },
    ],
    // The settings column of the dialog only. Its state is kept: nothing is marked yet,
    // so "Export secure PDF" is unavailable. The left column (whose "Permanent removal"
    // wording the claim policy does not use) is outside the crop.
    crop: { left: 584, top: 180, width: 598, height: 620 },
  },
  {
    out: "editorial-document-cover.png",
    from: "document interface.png",
    sha256: "039cb6d0918515af314fdffe8fb571e15395d60faee8879d3fb2bade292aa6e5",
    // Tool rail, manual redaction panel and page tools: nothing to mask in this region.
    masks: [],
    crop: { left: 0, top: 80, width: 950, height: 534 },
    finish: { blur: 1.2, tint: { colour: "#ff735c", alpha: 0.35, blend: "soft-light" } },
  },
];

// Product imagery is light-theme only (2026-10-30). The dark masters in raw/
// (hero-document-review.png, format-documents.png) are kept but no longer published.
const published = [
  { out: "audio-workspace.png", from: path.join(DERIVED, "audio-workspace.png") },
  { out: "audio-export.png", from: path.join(DERIVED, "audio-export.png") },
  { out: "project-workspace.png", from: path.join(DERIVED, "project-workspace.png") },
  { out: "document-workspace.png", from: path.join(DERIVED, "document-workspace.png") },
  { out: "document-export.png", from: path.join(DERIVED, "document-export.png") },
  { out: "editorial-document-cover.png", from: path.join(DERIVED, "editorial-document-cover.png") },
];

const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

/** Mean colour of a one-pixel ring just outside the region: the surface a veil should match. */
async function surroundColour(input, box, width, height) {
  const ring = { left: Math.max(0, box.left - 2), top: Math.max(0, box.top - 2) };
  ring.width = Math.min(width - ring.left, box.width + 4);
  ring.height = Math.min(height - ring.top, box.height + 4);
  // Materialise the ring first: stats() on an extract pipeline measures the whole image.
  const pixels = await sharp(input).extract(ring).removeAlpha().png().toBuffer();
  const { channels } = await sharp(pixels).stats();
  return { r: Math.round(channels[0].mean), g: Math.round(channels[1].mean), b: Math.round(channels[2].mean) };
}

async function applyMask(input, mask) {
  const { width, height } = await sharp(input).metadata();
  const pad = mask.feather * 2;
  const box = {
    left: Math.max(0, mask.x - pad),
    top: Math.max(0, mask.y - pad),
  };
  box.width = Math.min(width, mask.x + mask.w + pad) - box.left;
  box.height = Math.min(height, mask.y + mask.h + pad) - box.top;
  const region = await sharp(input).extract(box).removeAlpha().png().toBuffer();

  let treated;
  if (mask.kind === "text") {
    const block = 14;
    treated = await sharp(region)
      .resize(Math.max(1, Math.ceil(box.width / block)), Math.max(1, Math.ceil(box.height / block)), { kernel: "cubic" })
      .resize(box.width, box.height, { kernel: "nearest" })
      .blur(8)
      .png()
      .toBuffer();
  } else {
    const colour = mask.colour
      ? { r: parseInt(mask.colour.slice(1, 3), 16), g: parseInt(mask.colour.slice(3, 5), 16), b: parseInt(mask.colour.slice(5, 7), 16) }
      : await surroundColour(input, { left: mask.x, top: mask.y, width: mask.w, height: mask.h }, width, height);
    treated = await sharp(region)
      .blur(mask.sigma)
      .composite([{ input: { create: { width: box.width, height: box.height, channels: 4, background: { ...colour, alpha: mask.veil } } } }])
      .png()
      .toBuffer();
  }

  // Full strength over the region and its feather band; fades out beyond it.
  const f = mask.feather;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}">
    <filter id="f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f / 2}"/></filter>
    <rect x="${mask.x - f - box.left}" y="${mask.y - f - box.top}" width="${mask.w + 2 * f}" height="${mask.h + 2 * f}" fill="#fff" filter="url(#f)"/>
  </svg>`;
  const alpha = await sharp(Buffer.from(svg)).ensureAlpha().extractChannel(3).png().toBuffer();
  const layer = await sharp(treated).removeAlpha().joinChannel(alpha).png().toBuffer();
  return sharp(input).composite([{ input: layer, left: box.left, top: box.top }]).png().toBuffer();
}

await mkdir(DERIVED, { recursive: true });
for (const master of derivedMasters) {
  const from = path.join(master.dir ?? SOURCE, master.from);
  const to = path.join(DERIVED, master.out);
  if (!existsSync(from)) {
    if (!existsSync(to)) throw new Error(`No original for ${master.out}: set PRODUCT_SCREENSHOTS_SOURCE.`);
    console.log(`  ${master.out.padEnd(26)} original not present; publishing the committed derived master`);
    continue;
  }
  const original = await readFile(from);
  if (sha256(original) !== master.sha256) {
    throw new Error(`${master.from} does not match its recorded SHA-256. Re-review the capture before updating the hash.`);
  }
  let image = original;
  for (const mask of master.masks) image = await applyMask(image, mask);
  let cropped = await sharp(image).extract(master.crop).flatten({ background: "#ffffff" }).removeAlpha().png().toBuffer();
  if (master.finish) {
    const { width, height } = master.crop;
    const { colour, alpha, blend } = master.finish.tint;
    const rgb = { r: parseInt(colour.slice(1, 3), 16), g: parseInt(colour.slice(3, 5), 16), b: parseInt(colour.slice(5, 7), 16) };
    cropped = await sharp(cropped)
      .blur(master.finish.blur)
      .composite([{ input: { create: { width, height, channels: 4, background: { ...rgb, alpha } } }, blend }])
      .png()
      .toBuffer();
  }
  // Flattened RGB with no ancillary metadata: nothing of the original travels with it.
  await sharp(cropped).removeAlpha().png({ compressionLevel: 9 }).toFile(to);
  console.log(`  ${master.out.padEnd(26)} ${master.crop.width}x${master.crop.height}  ${master.masks.length} masks from "${master.from}"`);
}

await mkdir(OUT, { recursive: true });
const expected = new Set(published.map((visual) => visual.out));
for (const file of await readdir(OUT).catch(() => [])) {
  if (!expected.has(file)) {
    await unlink(path.join(OUT, file));
    console.log(`  removed unlisted ${file}`);
  }
}
for (const visual of published) {
  const to = path.join(OUT, visual.out);
  await copyFile(visual.from, to);
  const meta = await sharp(to).metadata();
  const revision = sha256(await readFile(to)).slice(0, 12);
  console.log(`  ${visual.out.padEnd(26)} ${String(meta.width).padStart(4)}x${meta.height}  revision ${revision}`);
}
