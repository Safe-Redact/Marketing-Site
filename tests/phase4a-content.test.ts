import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import YAML from "yaml";

import { TagNavigation } from "../src/components/blog/TagNavigation";
import {
  getArticleTags,
  getPublishedArticleBySlug,
  getRelatedArticles,
  loadPublishedArticles,
  parseArticleFrontmatter,
  parseArticleSource,
  queryArticles,
  validateMarkdownBody,
} from "../src/lib/blog/content";
import { buildArticleJsonLd, buildArticleMetadata } from "../src/lib/blog/seo";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDirectory = path.join(repositoryRoot, "tests", "fixtures", "blog");
const fixedNow = new Date("2026-10-14T12:00:00.000Z");

test("published loader excludes archived entries and future scheduled entries", async () => {
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
  const { buildCmsConfig } = await import("../scripts/render-cms-config.mjs");
  const configText = buildCmsConfig({ CMS_ENABLED: "false" });
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
  assert.equal(articles.fields.some((field: { name: string }) => field.name === "status"), false);
  assert.ok(articles.fields.some((field: { name: string }) => field.name === "publication"));
  assert.equal(config.backend.base_url, "https://cms-auth.invalid");
  assert.equal(config.backend.auth_endpoint, "auth");
  assert.equal(config.backend.auth_scope, "public_repo");
  assert.equal(config.backend.app_id, undefined);
});

test("articles carry a content type that defaults to the editorial article", async () => {
  const articles = await loadPublishedArticles({ directory: fixturesDirectory, now: fixedNow });

  // Every existing fixture predates the field, so the default has to keep them loading.
  for (const article of articles) {
    assert.equal(article.type, "article");
    assert.deepEqual(article.tags, []);
    assert.deepEqual(article.tagSlugs, []);
  }
});

test("the content type is constrained to the four approved kinds", () => {
  const base = {
    title: "A valid development fixture title",
    slug: "type-validation-fixture",
    excerpt: "A development fixture used to verify that the content type field accepts only approved kinds.",
    author: "SafeRedact Editorial",
    category: "Education",
    date: "2026-01-10T09:00:00.000Z",
    publication: "immediate",
    seoDescription: "Development fixture verifying that the article content type accepts only approved kinds.",
  };

  for (const type of ["article", "news", "product-update", "guide"]) {
    assert.equal(parseArticleFrontmatter({ ...base, type }).type, type);
  }
  for (const type of ["announcement", "", "ARTICLE", 7]) {
    assert.throws(() => parseArticleFrontmatter({ ...base, type }), /type/i);
  }
});

test("tags are bounded, de-duplicated, and carry URL slugs", () => {
  const base = {
    title: "A valid development fixture title",
    slug: "tag-validation-fixture",
    excerpt: "A development fixture used to verify that article tags are bounded and produce safe URL slugs.",
    author: "SafeRedact Editorial",
    category: "Education",
    date: "2026-01-10T09:00:00.000Z",
    publication: "immediate",
    seoDescription: "Development fixture verifying that article tags are bounded and produce safe URL slugs.",
  };

  const parsed = parseArticleFrontmatter({ ...base, tags: ["Redaction", "Video Review", "redaction"] });
  assert.deepEqual(parsed.tags, ["Redaction", "Video Review"]);
  assert.deepEqual(parsed.tagSlugs, ["redaction", "video-review"]);

  // A tag that cannot produce a slug, and more tags than an article may carry.
  assert.throws(() => parseArticleFrontmatter({ ...base, tags: ["***"] }), /tag/i);
  assert.throws(
    () => parseArticleFrontmatter({ ...base, tags: ["a1", "b2", "c3", "d4", "e5", "f6", "g7"] }),
    /tag/i
  );
});

test("queries filter by content type and by tag", () => {
  const article = (slug: string, type: string, tagSlugs: string[]) =>
    ({
      title: slug,
      slug,
      excerpt: "",
      author: "SafeRedact Editorial",
      category: "Education",
      categorySlug: "education",
      date: "2026-01-10T09:00:00.000Z",
      publication: "immediate",
      featured: false,
      seoDescription: "",
      body: "",
      readingMinutes: 1,
      type,
      tags: tagSlugs,
      tagSlugs,
    }) as never;

  const articles = [
    article("one", "article", ["redaction"]),
    article("two", "news", ["company"]),
    article("three", "product-update", ["redaction"]),
    article("four", "guide", []),
  ];

  assert.deepEqual(
    queryArticles(articles, { type: "news" }).items.map((a) => a.slug),
    ["two"]
  );
  assert.deepEqual(
    queryArticles(articles, { type: ["news", "product-update"] }).items.map((a) => a.slug),
    ["two", "three"]
  );
  assert.deepEqual(
    queryArticles(articles, { tag: "redaction" }).items.map((a) => a.slug),
    ["one", "three"]
  );
  assert.equal(queryArticles(articles, {}).totalItems, 4);
});

test("tag navigation exposes usable filtered links and a single active state", () => {
  const tags = getArticleTags([
    {
      title: "First",
      slug: "first",
      excerpt: "",
      author: "SafeRedact Editorial",
      category: "Education",
      categorySlug: "education",
      date: "2026-01-10T09:00:00.000Z",
      publication: "immediate",
      featured: false,
      seoDescription: "",
      body: "",
      readingMinutes: 1,
      type: "guide",
      tags: ["Privacy", "Review"],
      tagSlugs: ["privacy", "review"],
    },
    {
      title: "Second",
      slug: "second",
      excerpt: "",
      author: "SafeRedact Editorial",
      category: "Education",
      categorySlug: "education",
      date: "2026-01-09T09:00:00.000Z",
      publication: "immediate",
      featured: false,
      seoDescription: "",
      body: "",
      readingMinutes: 1,
      type: "article",
      tags: ["Privacy"],
      tagSlugs: ["privacy"],
    },
  ]);

  assert.deepEqual(tags, [
    { name: "Privacy", slug: "privacy", count: 2 },
    { name: "Review", slug: "review", count: 1 },
  ]);

  const html = renderToStaticMarkup(createElement(TagNavigation, {
    tags,
    activeSlug: "privacy",
    query: "careful review",
    type: "guide",
  }));
  assert.match(html, /aria-label="Filter content by tag"/);
  assert.match(html, /href="\/blog\?type=guide&amp;tag=privacy&amp;query=careful\+review"/);
  assert.match(html, /aria-current="page"[^>]*>Privacy <span[^>]*>2<\/span>/);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
});
