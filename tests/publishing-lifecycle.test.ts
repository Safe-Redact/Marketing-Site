import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

import {
  isPublishedArticle,
  loadArticlesFromDirectory,
  loadPublishedArticles,
  parseArticleFrontmatter,
  validateMarkdownBody,
} from "../src/lib/blog/content";
import * as blogContent from "../src/lib/blog/content";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function frontmatter(overrides: Record<string, unknown> = {}) {
  return {
    title: "A validated publishing lifecycle article",
    slug: "validated-publishing-lifecycle",
    excerpt: "A complete development article used to verify the reviewed publishing lifecycle behavior.",
    author: "SafeRedact Team",
    type: "article",
    category: "Publishing",
    tags: ["Editorial workflow"],
    date: "2026-10-17T08:00:00.000Z",
    publication: "immediate",
    featured: false,
    seoDescription: "A complete development article that verifies SafeRedact's reviewed publishing lifecycle behavior.",
    ...overrides,
  };
}

function article(overrides: Record<string, unknown> = {}) {
  return {
    ...parseArticleFrontmatter(frontmatter(overrides)),
    body: "A complete article body for lifecycle validation.",
    readingMinutes: 1,
  };
}

async function writeArticle(
  directory: string,
  filename: string,
  overrides: Record<string, unknown> = {},
  body = "A complete article body for lifecycle validation."
) {
  const data = frontmatter({ slug: path.basename(filename, path.extname(filename)), ...overrides });
  await writeFile(path.join(directory, filename), `---\n${YAML.stringify(data)}---\n${body}\n`, "utf8");
}

test("Git editorial state and post-merge publication intent cannot conflict", () => {
  assert.equal(parseArticleFrontmatter(frontmatter()).publication, "immediate");
  assert.equal(
    parseArticleFrontmatter(frontmatter({ publication: "scheduled" })).publication,
    "scheduled"
  );
  assert.equal(
    parseArticleFrontmatter(frontmatter({ publication: "archived" })).publication,
    "archived"
  );

  assert.throws(
    () => parseArticleFrontmatter({ ...frontmatter(), publication: undefined, status: "draft" }),
    /publication|unrecognized/i
  );
});

test("immediate articles are public now while scheduled and archived visibility is deliberate", () => {
  const now = new Date("2026-10-17T09:00:00.000Z");

  assert.equal(
    isPublishedArticle(article({ publication: "immediate", date: "2026-10-17T09:03:00.000Z" }), now),
    true,
    "an immediate article must not be accidentally scheduled by a small UTC clock difference"
  );
  assert.equal(
    isPublishedArticle(article({ publication: "scheduled", date: "2026-10-17T10:00:00.000Z" }), now),
    false
  );
  assert.equal(
    isPublishedArticle(
      article({ publication: "scheduled", date: "2026-10-17T10:00:00.000Z" }),
      new Date("2026-10-17T10:00:00.000Z")
    ),
    true
  );
  assert.equal(isPublishedArticle(article({ publication: "archived" }), now), false);
});

test("build validation distinguishes immediate clock tolerance from deliberate scheduling", () => {
  const validatePublicationTiming = (blogContent as typeof blogContent & {
    validatePublicationTiming?: (entry: ReturnType<typeof article>, now: Date) => void;
  }).validatePublicationTiming;
  assert.equal(typeof validatePublicationTiming, "function");
  if (!validatePublicationTiming) return;

  const now = new Date("2026-10-17T09:00:00.000Z");
  assert.doesNotThrow(() =>
    validatePublicationTiming(
      article({ publication: "immediate", date: "2026-10-17T09:05:00.000Z" }),
      now
    )
  );
  assert.throws(
    () =>
      validatePublicationTiming(
        article({ publication: "immediate", date: "2026-10-17T10:00:00.000Z" }),
        now
      ),
    /immediate.*future|future.*scheduled/i
  );
  assert.doesNotThrow(() =>
    validatePublicationTiming(
      article({ publication: "scheduled", date: "2026-10-17T10:00:00.000Z" }),
      now
    )
  );
});

test("repeated titles, repeated tags, and duplicate body headings are rejected", () => {
  assert.throws(
    () =>
      parseArticleFrontmatter(
        frontmatter({ title: "Understanding redactionUnderstanding redaction" })
      ),
    /repeated/i
  );
  assert.throws(
    () =>
      parseArticleFrontmatter(
        frontmatter({ title: "Understanding redaction Understanding redaction" })
      ),
    /repeated/i
  );
  assert.throws(
    () => parseArticleFrontmatter(frontmatter({ tags: ["Data PrivacyData Privacy"] })),
    /repeated/i
  );
  assert.throws(
    () => validateMarkdownBody("# A validated publishing lifecycle article\n\nBody copy."),
    /heading|title/i
  );
});

test("a collection rejects duplicate slugs even across Markdown extensions", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "saferedact-duplicate-slug-"));
  try {
    await writeArticle(directory, "duplicate-article.md");
    await writeArticle(directory, "duplicate-article.markdown");
    await assert.rejects(loadArticlesFromDirectory(directory), /duplicate.*slug/i);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("repository validation rejects missing featured images", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "saferedact-missing-image-"));
  const directory = path.join(root, "content", "blog");
  const mediaDirectory = path.join(root, "public", "images", "blog");
  try {
    await mkdir(directory, { recursive: true });
    await mkdir(mediaDirectory, { recursive: true });
    await writeArticle(directory, "missing-image-article.md", {
      featuredImage: "/images/blog/not-uploaded.webp",
      imageAlt: "A descriptive alternative for the missing development image",
    });

    await assert.rejects(
      loadPublishedArticles({ directory, mediaDirectory }),
      /featured image.*does not exist/i
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("the CMS form blocks invalid entries before the editorial branch is saved", async () => {
  const validationPath = path.join(repositoryRoot, "public", "admin", "editor-validation.js");
  assert.ok(existsSync(validationPath), "the CMS editor validation module must exist");

  const source = await readFile(validationPath, "utf8");
  assert.match(source, /preSave/);
  assert.match(source, /prePublish/);
  assert.match(source, /normalizeTags/);
  assert.match(source, /publication/);

  const validation = require(validationPath) as {
    normalizeEntryData(data: Record<string, unknown>): Record<string, unknown>;
    validateEntryData(data: Record<string, unknown>): void;
  };
  const normalized = validation.normalizeEntryData(frontmatter({
    title: "Understanding redactionUnderstanding redaction",
    tags: [" Data PrivacyData Privacy ", "data privacy"],
  }));
  assert.equal(normalized.title, "Understanding redaction");
  assert.deepEqual(normalized.tags, ["Data Privacy"]);
  assert.equal(
    validation.normalizeEntryData(frontmatter({
      title: "Understanding redaction Understanding redaction",
    })).title,
    "Understanding redaction"
  );
  assert.throws(
    () => validation.validateEntryData(frontmatter({ slug: "x" })),
    /slug.*3/i
  );

  const shell = await readFile(path.join(repositoryRoot, "public", "admin", "index.html"), "utf8");
  assert.match(shell, /src="\/admin\/editor-validation\.js"/);
});

test("the current checked-out content repository passes the same validation used by builds", async () => {
  const articles = await loadArticlesFromDirectory(path.join(repositoryRoot, "content", "blog"));
  assert.ok(articles.some((entry) => entry.slug === "understanding-document-redaction"));
});
