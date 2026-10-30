import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import nextConfig from "../next.config";
import { captures } from "../src/content/media";

const root = path.resolve(__dirname, "..");
const served = path.join(root, "public", "images", "product");
const pipeline = readFileSync(path.join(root, "scripts", "build-product-images.mjs"), "utf8");

test("public/images/product serves exactly the registered captures", () => {
  const registered = Object.values(captures).map((capture) => path.basename(capture.src)).sort();
  assert.deepEqual(readdirSync(served).sort(), registered);
  // The pipeline's allowlist is the same set, so a rebuild cannot republish anything else.
  for (const file of registered) assert.match(pipeline, new RegExp(`out: "${file.replace(".", "\\.")}"`), file);
});

test("each capture's revision, size and crops match the served file", async () => {
  for (const [id, capture] of Object.entries(captures)) {
    const file = path.join(served, path.basename(capture.src));
    const bytes = readFileSync(file);
    assert.equal(createHash("sha256").update(bytes).digest("hex").slice(0, 12), capture.revision, `${id} revision`);
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, capture.width, `${id} width`);
    assert.equal(meta.height, capture.height, `${id} height`);
    for (const [name, crop] of Object.entries(capture.crops)) {
      assert.ok(crop.x >= 0 && crop.y >= 0 && crop.x + crop.w <= capture.width && crop.y + crop.h <= capture.height, `${id}.${name} is inside the capture`);
    }
  }
});

test("masked masters carry no metadata and come from hash-checked originals", async () => {
  const derived = readdirSync(path.join(root, "assets", "product-screenshots", "derived")).sort();
  assert.deepEqual(derived, [
    "audio-export.png",
    "audio-workspace.png",
    "document-export.png",
    "document-workspace.png",
    "editorial-document-cover.png",
    "project-workspace.png",
  ]);
  for (const file of derived) {
    // The served copy is the masked master itself.
    assert.ok(readFileSync(path.join(served, file)).equals(readFileSync(path.join(root, "assets", "product-screenshots", "derived", file))), `${file} is served as built`);
    const meta = await sharp(readFileSync(path.join(served, file))).metadata();
    assert.equal(meta.channels, 3, `${file} is flattened`);
    assert.ok(!meta.exif && !meta.xmp && !meta.iptc && !meta.icc, `${file} has no metadata`);
  }
  // Every original is pinned by hash; unmasked ones are read from outside the tracked tree.
  for (const original of ["audio interface.png", "audio export.png", "home pag workspace.png", "document interface.png", "document export.png"]) {
    const name = original.replace(/\./g, "\\.");
    assert.match(pipeline, new RegExp(`from: "${name}",(?:\\s+dir: RAW,)?\\s+sha256: "[0-9a-f]{64}"`), original);
  }
  // The excluded screenshot is never processed or published.
  assert.doesNotMatch(pipeline, /ai tools for redaction/);
  // Product imagery is light-theme only: the dark masters are not published.
  assert.ok(!readdirSync(served).some((file) => /hero-document-review|format-documents/.test(file)));
  assert.match(readFileSync(path.join(root, ".gitignore"), "utf8"), /^assets\/product-screenshots\/source\/$/m);
});

test("Next image optimization accepts versioned product captures at the showcase quality", () => {
  assert.deepEqual(nextConfig.images?.qualities, [92]);
  assert.deepEqual(nextConfig.images?.localPatterns, [{ pathname: "/images/product/**" }]);
});
