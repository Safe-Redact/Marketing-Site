import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

async function resolveLocalImport(specifier) {
  const relative = specifier.replace(/^@\//, "src/");
  const candidates = [
    relative,
    `${relative}.ts`,
    `${relative}.tsx`,
    path.join(relative, "index.ts"),
    path.join(relative, "index.tsx"),
  ];

  for (const candidate of candidates) {
    const absolute = path.join(repositoryRoot, candidate);
    try {
      const details = await stat(absolute);
      if (details.isFile()) return candidate.replaceAll("\\", "/");
    } catch {
      // Continue until a matching TypeScript module is found.
    }
  }

  return null;
}

async function collectActiveSources(entrypoints) {
  const pending = [...entrypoints];
  const sources = new Map();

  while (pending.length) {
    const relativePath = pending.pop();
    if (!relativePath || sources.has(relativePath)) continue;

    const source = await readFile(path.join(repositoryRoot, relativePath), "utf8");
    sources.set(relativePath, source);

    for (const match of source.matchAll(/from\s+["'](@\/[^"']+)["']/g)) {
      const resolved = await resolveLocalImport(match[1]);
      if (resolved && !sources.has(resolved)) pending.push(resolved);
    }
  }

  return sources;
}

test("active marketing modules do not expose software distribution destinations", async () => {
  const sources = await collectActiveSources([
    "src/app/page.tsx",
    "src/app/layout.tsx",
    "src/app/sitemap.ts",
    "src/app/robots.ts",
  ]);
  const activeSource = [...sources.entries()]
    .map(([file, source]) => `\n/* ${file} */\n${source}`)
    .join("\n");

  assert.doesNotMatch(activeSource, /https?:\/\/[^\s"']+\/download\b/i);
  assert.doesNotMatch(activeSource, /\bdownloadUrl\b/);
  assert.doesNotMatch(activeSource, /Download SafeRedact|Download for Windows/i);
});

test("rendered homepage exposes only marketing conversion destinations", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /href="#demo-enquiry"/);
  assert.match(html, /href="#services"/);
  assert.match(html, /href="mailto:support@saferedact\.io"/);
  assert.doesNotMatch(html, /href="[^"]*(?:download|installer|login|portal|dashboard)[^"]*"/i);
  assert.doesNotMatch(html, /Download SafeRedact|Download for Windows/i);
});

test("demo enquiry anchor identifies an accessibly labelled form", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /id="demo-enquiry"/);
  assert.match(html, /id="demo-enquiry-heading"/);
  assert.match(html, /<form[^>]+aria-labelledby="demo-enquiry-heading"/);
});

test("every rendered internal navigation target exists and sitemap stays marketing-only", async () => {
  const [homeResponse, sitemapResponse] = await Promise.all([
    fetch(baseUrl),
    fetch(`${baseUrl}/sitemap.xml`),
  ]);
  assert.equal(homeResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);

  const html = await homeResponse.text();
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const targets = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]))];
  assert.deepEqual(targets.filter((target) => !ids.has(target)), []);

  const sitemap = await sitemapResponse.text();
  assert.doesNotMatch(sitemap, /download|installer|login|portal|dashboard/i);
  assert.match(sitemap, /https:\/\/saferedact\.io<\/loc>/);
});
