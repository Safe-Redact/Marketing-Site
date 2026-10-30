import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("shared headings remain readable on preserved light sections", async () => {
  const source = await readSource("src/components/ui/Heading.tsx");

  assert.match(source, /text-primary-800/);
  assert.doesNotMatch(source, /font-bold text-ink text-balance/);
});

test("coral action surfaces use dark high-contrast labels", async () => {
  const [button, globals, process, why] = await Promise.all([
    readSource("src/components/ui/Button.tsx"),
    readSource("src/app/globals.css"),
    readSource("src/components/sections/HowItWorks.tsx"),
    readSource("src/components/sections/WhySafeRedact.tsx"),
  ]);

  // The canvas is light, so orange fills use the fixed dark on-accent label (6.5:1).
  assert.match(button, /bg-accent-warm text-on-accent/);
  assert.match(globals, /bg-accent-warm[^;\n]*text-on-accent/);
  assert.doesNotMatch(process, /bg-accent[^"\n]*text-white/);
  assert.doesNotMatch(why, /bg-accent[^"\n]*text-white/);
});

test("mobile navigation provides an in-dialog close control", async () => {
  const [source, header] = await Promise.all([
    readSource("src/components/layout/MobileNav.tsx"),
    readSource("src/components/layout/SiteHeader.tsx"),
  ]);

  assert.match(source, /aria-label="Close mobile menu"/);
  assert.match(source, /onClick=\{\(\) => onClose\(true\)\}/);
  assert.match(header, /window\.setTimeout\(\(\) => menuButtonRef\.current\?\.focus\(\), 0\)/);
});
