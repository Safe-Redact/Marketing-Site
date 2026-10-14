import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

import {
  getPublishedArticleBySlug,
  getRelatedArticles,
  loadPublishedArticles,
  parseArticleSource,
  queryArticles,
  validateMarkdownBody,
} from "../src/lib/blog/content";
import { buildArticleJsonLd, buildArticleMetadata } from "../src/lib/blog/seo";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDirectory = path.join(repositoryRoot, "tests", "fixtures", "blog");
const fixedNow = new Date("2026-10-14T12:00:00.000Z");

test("published loader excludes drafts, archived entries, and future-dated entries", async () => {
  const articles = await loadPublishedArticles({ directory: fixturesDirectory, now: fixedNow });

  assert.deepEqual(
    articles.map((article) => article.slug),
    ["structured-review-workflows", "practical-redaction-review-guide"]
  );
  assert.equal(articles[1]?.readingMinutes, 1);
});

test("slug lookup rejects traversal and returns only eligible articles", async () => {
  const published = await getPublishedArticleBySlug("practical-redaction-review-guide", {
    directory: fixturesDirectory,
    now: fixedNow,
  });
  const traversal = await getPublishedArticleBySlug("../draft-development-article", {
    directory: fixturesDirectory,
    now: fixedNow,
  });
  const draft = await getPublishedArticleBySlug("draft-development-article", {
    directory: fixturesDirectory,
    now: fixedNow,
  });

  assert.equal(published?.title, "A practical guide to reviewing redaction results");
  assert.equal(traversal, null);
  assert.equal(draft, null);
});

test("search, category filters, and pagination operate on public article data", async () => {
  const articles = await loadPublishedArticles({ directory: fixturesDirectory, now: fixedNow });
  const searched = queryArticles(articles, { query: "STRUCTURED", page: 1, pageSize: 6 });
  const category = queryArticles(articles, { category: "education", page: 1, pageSize: 1 });
  const secondPage = queryArticles(articles, { category: "education", page: 2, pageSize: 1 });

  assert.deepEqual(searched.items.map((article) => article.slug), ["structured-review-workflows"]);
  assert.equal(category.totalItems, 2);
  assert.equal(category.totalPages, 2);
  assert.equal(category.items[0]?.slug, "structured-review-workflows");
  assert.equal(secondPage.items[0]?.slug, "practical-redaction-review-guide");
});

test("related articles match category and exclude the current article", async () => {
  const articles = await loadPublishedArticles({ directory: fixturesDirectory, now: fixedNow });
  const current = articles.find((article) => article.slug === "practical-redaction-review-guide");
  assert.ok(current);

  const related = getRelatedArticles(articles, current, 3);
  assert.deepEqual(related.map((article) => article.slug), ["structured-review-workflows"]);
});

test("Markdown validation rejects executable HTML and unsafe or inaccessible images", () => {
  assert.throws(() => validateMarkdownBody("<script>alert('x')</script>"), /raw HTML/i);
  assert.throws(() => validateMarkdownBody("![](/images/blog/example.webp)"), /alt text/i);
  assert.throws(
    () => validateMarkdownBody("![Example](https://example.com/example.webp)"),
    /local blog media/i
  );
  assert.doesNotThrow(() =>
    validateMarkdownBody("![Approved image](/images/blog/example.webp)\n\n[Safe link](https://example.com)")
  );
});

test("frontmatter parsing rejects missing delimiters and duplicate keys", () => {
  assert.throws(() => parseArticleSource("title: no delimiters"), /frontmatter block/i);
  assert.throws(
    () => parseArticleSource("---\ntitle: First\ntitle: Second\n---\nBody"),
    /invalid article frontmatter/i
  );
});

test("article metadata and structured data use verified frontmatter only", async () => {
  const article = await getPublishedArticleBySlug("practical-redaction-review-guide", {
    directory: fixturesDirectory,
    now: fixedNow,
  });
  assert.ok(article);

  const metadata = buildArticleMetadata(article);
  const structuredData = buildArticleJsonLd(article);

  assert.equal(metadata.alternates?.canonical, "/blog/practical-redaction-review-guide");
  assert.equal(metadata.description, article.seoDescription);
  assert.equal(structuredData["@type"], "Article");
  assert.equal(structuredData.headline, article.title);
  assert.equal("ratingValue" in structuredData, false);
});

test("Decap configuration uses the reviewed Git target and pull-request editorial workflow", async () => {
  const configText = await readFile(
    path.join(repositoryRoot, "public", "admin", "config.yml"),
    "utf8"
  );
  const config = YAML.parse(configText);
  const articles = config.collections.find((collection: { name: string }) => collection.name === "articles");

  assert.equal(config.backend.name, "github");
  assert.equal(config.backend.repo, "Safe-Redact/Marketing-Site");
  assert.equal(config.backend.branch, "master");
  assert.equal(config.publish_mode, "editorial_workflow");
  assert.equal(config.media_folder, "public/images/blog");
  assert.equal(config.public_folder, "/images/blog");
  assert.equal(articles.folder, "content/blog");
  assert.equal(articles.format, "frontmatter");
  assert.equal(config.backend.base_url, undefined);
  assert.equal(config.backend.app_id, undefined);
});
