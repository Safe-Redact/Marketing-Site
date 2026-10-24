import assert from "node:assert/strict";
import test from "node:test";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import * as blogContent from "../src/lib/blog/content";
import { extractArticleHeadings } from "../src/lib/blog/headings";
import type { BlogArticle } from "../src/lib/blog/types";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

function article(slug: string, date: string, overrides: Partial<BlogArticle> = {}): BlogArticle {
  return {
    title: slug,
    slug,
    excerpt: `Editorial summary for ${slug}`,
    author: "OpenRedakt Team",
    type: "article",
    category: "Data Privacy",
    categorySlug: "data-privacy",
    tags: [],
    tagSlugs: [],
    date,
    publication: "immediate",
    featured: false,
    seoDescription: `Editorial search description for ${slug}`,
    body: `## ${slug}`,
    readingMinutes: 1,
    ...overrides,
  };
}

test("month groups are reverse chronological across year boundaries with deterministic article order", () => {
  const groupArticlesByMonth = (
    blogContent as typeof blogContent & {
      groupArticlesByMonth: (articles: readonly BlogArticle[]) => ReadonlyArray<{
        key: string;
        year: number;
        month: number;
        label: string;
        articles: readonly BlogArticle[];
      }>;
    }
  ).groupArticlesByMonth;

  assert.equal(typeof groupArticlesByMonth, "function");

  const groups = groupArticlesByMonth([
    article("february-story", "2026-02-01T09:00:00.000Z"),
    article("same-day-zulu", "2026-01-20T12:00:00.000Z"),
    article("december-story", "2025-12-31T23:30:00.000Z"),
    article("same-day-alpha", "2026-01-20T12:00:00.000Z"),
    article("newer-january-story", "2026-01-30T08:00:00.000Z"),
  ]);

  assert.deepEqual(
    groups.map((group) => ({
      key: group.key,
      year: group.year,
      month: group.month,
      label: group.label,
      slugs: group.articles.map((entry) => entry.slug),
    })),
    [
      {
        key: "2026-02",
        year: 2026,
        month: 2,
        label: "February 2026",
        slugs: ["february-story"],
      },
      {
        key: "2026-01",
        year: 2026,
        month: 1,
        label: "January 2026",
        slugs: ["newer-january-story", "same-day-alpha", "same-day-zulu"],
      },
      {
        key: "2025-12",
        year: 2025,
        month: 12,
        label: "December 2025",
        slugs: ["december-story"],
      },
    ]
  );
});

test("month grouping uses only the filtered result and handles an empty archive", () => {
  const groupArticlesByMonth = (
    blogContent as typeof blogContent & {
      groupArticlesByMonth: (articles: readonly BlogArticle[]) => ReadonlyArray<{
        key: string;
        articles: readonly BlogArticle[];
      }>;
    }
  ).groupArticlesByMonth;

  assert.equal(typeof groupArticlesByMonth, "function");

  const published = [
    article("document-guide", "2026-03-10T08:00:00.000Z", { type: "guide" }),
    article("company-news", "2026-03-09T08:00:00.000Z", { type: "news" }),
  ];
  const filtered = blogContent.queryArticles(published, { type: "guide" });

  assert.deepEqual(
    groupArticlesByMonth(filtered.items).flatMap((group) =>
      group.articles.map((entry) => entry.slug)
    ),
    ["document-guide"]
  );
  assert.deepEqual(groupArticlesByMonth([]), []);
});

test("article headings extract readable H2 and H3 text with stable duplicate ids", () => {
  const markdown = [
    "# Page title is not part of the contents",
    "",
    "## Review **sensitive** [details](https://example.com)",
    "",
    "### Export `safely` & verify!",
    "",
    "## Review sensitive details",
    "",
    "#### Supporting detail is too deep",
  ].join("\n");

  assert.deepEqual(extractArticleHeadings(markdown), [
    { id: "review-sensitive-details", depth: 2, text: "Review sensitive details" },
    { id: "export-safely-verify", depth: 3, text: "Export safely & verify!" },
    { id: "review-sensitive-details-2", depth: 2, text: "Review sensitive details" },
  ]);
});

test("article heading ids retain non-Latin letters and ignore headings inside code fences", () => {
  const markdown = [
    "## حماية البيانات",
    "",
    "## Résumé review: what changed?",
    "",
    "```md",
    "## Not a real heading",
    "```",
  ].join("\n");

  assert.deepEqual(extractArticleHeadings(markdown), [
    { id: "حماية-البيانات", depth: 2, text: "حماية البيانات" },
    { id: "resume-review-what-changed", depth: 2, text: "Résumé review: what changed?" },
  ]);
});

test("the chronological archive renders semantic month headings and only supplied articles", async () => {
  const { ArticleArchive } = await import("../src/components/blog/ArticleArchive");
  const groups = (
    blogContent as typeof blogContent & {
      groupArticlesByMonth: (articles: readonly BlogArticle[]) => ReadonlyArray<{
        key: `${number}-${string}`;
        year: number;
        month: number;
        label: string;
        articles: readonly BlogArticle[];
      }>;
    }
  ).groupArticlesByMonth([
    article("march-review", "2026-03-15T09:00:00.000Z"),
    article("february-review", "2026-02-10T09:00:00.000Z"),
  ]);

  const html = renderToStaticMarkup(
    createElement(ArticleArchive, { groups, totalItems: 2 })
  );

  assert.match(html, /aria-label="Chronological article archive"/);
  assert.match(html, /<h2[^>]*>March 2026<\/h2>/);
  assert.match(html, /<h2[^>]*>February 2026<\/h2>/);
  assert.match(html, /href="\/blog\/march-review"/);
  assert.match(html, /href="\/blog\/february-review"/);
  assert.doesNotMatch(html, /placeholder|coming soon/i);
});

test("the featured story uses the approved OpenRedakt product visual when no image is published", async () => {
  const { FeaturedArticle } = await import("../src/components/blog/FeaturedArticle");
  const featured = article("featured-review", "2026-03-15T09:00:00.000Z", {
    title: "A review-led redaction workflow",
    excerpt: "A grounded editorial summary of the review decisions behind a redaction workflow.",
    featured: true,
  });

  const html = renderToStaticMarkup(createElement(FeaturedArticle, { article: featured }));

  assert.match(html, /aria-label="Featured insight"/);
  assert.match(html, /A review-led redaction workflow/);
  assert.match(html, /%2Fimages%2Fproduct%2Fhero-document-review\.png/);
  assert.match(html, /alt="OpenRedakt document review workspace"/);
  assert.doesNotMatch(html, /placeholder|coming soon/i);
});

test("article body heading ids and table-of-contents links share one parsed source", async () => {
  const [{ ArticleBody }, { ArticleTableOfContents }] = await Promise.all([
    import("../src/components/blog/ArticleBody"),
    import("../src/components/blog/ArticleTableOfContents"),
  ]);
  const markdown = [
    "# Page title must stay out of the contents",
    "",
    "## Review the file",
    "",
    "Body copy.",
    "",
    "### Check the output",
    "",
    "## Review the file",
  ].join("\n");
  const headings = extractArticleHeadings(markdown);
  const bodyHtml = renderToStaticMarkup(createElement(ArticleBody, { content: markdown }));
  const tocHtml = renderToStaticMarkup(createElement(ArticleTableOfContents, { headings }));

  assert.deepEqual(headings.map((heading) => heading.id), [
    "review-the-file",
    "check-the-output",
    "review-the-file-2",
  ]);
  for (const heading of headings) {
    assert.match(bodyHtml, new RegExp(`id="${heading.id}"`));
    assert.match(bodyHtml, new RegExp(`id="${heading.id}" tabindex="-1"`));
    assert.match(tocHtml, new RegExp(`href="#${heading.id}"`));
  }
  assert.doesNotMatch(tocHtml, /Page title must stay out/);
});

test("short articles omit the table of contents", async () => {
  const { ArticleTableOfContents } = await import(
    "../src/components/blog/ArticleTableOfContents"
  );
  const headings = extractArticleHeadings("## One section\n\n## A second section");

  assert.equal(
    renderToStaticMarkup(createElement(ArticleTableOfContents, { headings })),
    ""
  );
});

test("the compact table of contents uses a disclosure instead of occupying the mobile reading viewport", async () => {
  const { ArticleTableOfContents } = await import(
    "../src/components/blog/ArticleTableOfContents"
  );
  const headings = extractArticleHeadings(
    "## First section\n\n## Second section\n\n### Supporting section"
  );
  const html = renderToStaticMarkup(
    createElement(ArticleTableOfContents, { headings, compact: true })
  );

  assert.match(html, /<details/);
  assert.match(html, /<summary/);
  assert.match(html, /On this page/);
  assert.doesNotMatch(html, /<details[^>]* open/);
});

test("insights search submits the existing GET form with Enter and has no visible submit control", async () => {
  const { ArticleSearch } = await import("../src/components/blog/ArticleSearch");
  const html = renderToStaticMarkup(
    createElement(ArticleSearch, {
      query: "document",
      type: "guide",
      tag: "privacy",
    })
  );

  assert.match(html, /<form[^>]*role="search"/);
  assert.match(html, /<form[^>]*action="\/blog"/);
  assert.match(html, /<form[^>]*method="get"/);
  assert.match(html, /type="search"[^>]*name="query"[^>]*value="document"/);
  assert.match(html, /type="hidden" name="type" value="guide"/);
  assert.match(html, /type="hidden" name="tag" value="privacy"/);
  assert.match(html, /Search by title, topic, or author/);
  assert.doesNotMatch(html, /<button/);
  assert.doesNotMatch(html, /Submit insights search/);
});

test("table of contents uses a quiet coral marker without a filled active row", async () => {
  const { ArticleTableOfContents } = await import(
    "../src/components/blog/ArticleTableOfContents"
  );
  const headings = extractArticleHeadings(
    "## First section\n\n## Second section\n\n### Supporting section"
  );
  const html = renderToStaticMarkup(
    createElement(ArticleTableOfContents, { headings })
  );

  assert.match(
    html,
    /aria-current="location"[^>]*class="[^"]*border-accent-warm[^"]*font-medium[^"]*text-white/
  );
  assert.doesNotMatch(html, /aria-current="location"[^>]*class="[^"]*bg-/);
  assert.match(html, /class="pl-3"/);
  assert.match(html, /focus-visible:ring-2/);
});

test("scrollspy selection advances through headings and pins the final section at the article end", async () => {
  const tocModule = await import("../src/components/blog/ArticleTableOfContents");
  const selectActiveHeading = (
    tocModule as typeof tocModule & {
      selectActiveHeading?: (
        positions: ReadonlyArray<{ id: string; top: number }>,
        marker: number,
        atArticleEnd: boolean
      ) => string | null;
    }
  ).selectActiveHeading;

  assert.equal(typeof selectActiveHeading, "function");
  if (!selectActiveHeading) return;

  const positions = [
    { id: "first", top: -280 },
    { id: "second", top: 110 },
    { id: "third", top: 690 },
  ];

  assert.equal(selectActiveHeading(positions, 160, false), "second");
  assert.equal(
    selectActiveHeading(
      positions.map((position) => ({ ...position, top: position.top + 500 })),
      160,
      false
    ),
    "first"
  );
  assert.equal(selectActiveHeading(positions, 160, true), "third");
  assert.equal(selectActiveHeading([], 160, false), null);
});

test("TOC following moves only enough to fully reveal the active item", async () => {
  const tocModule = await import("../src/components/blog/ArticleTableOfContents");
  const getNextTocScrollTop = (
    tocModule as typeof tocModule & {
      getNextTocScrollTop?: (metrics: {
        scrollTop: number;
        scrollHeight: number;
        clientHeight: number;
        containerTop: number;
        itemTop: number;
        itemBottom: number;
        inset?: number;
      }) => number;
    }
  ).getNextTocScrollTop;

  assert.equal(typeof getNextTocScrollTop, "function");
  if (!getNextTocScrollTop) return;

  const viewport = {
    scrollTop: 120,
    scrollHeight: 900,
    clientHeight: 300,
    containerTop: 100,
  };

  assert.equal(
    getNextTocScrollTop({ ...viewport, itemTop: 150, itemBottom: 190, inset: 12 }),
    120,
    "an already visible item must not move the TOC"
  );
  assert.equal(
    getNextTocScrollTop({ ...viewport, itemTop: 385, itemBottom: 425, inset: 12 }),
    157,
    "a lower item is revealed with the smallest downward movement"
  );
  assert.equal(
    getNextTocScrollTop({ ...viewport, itemTop: 80, itemBottom: 120, inset: 12 }),
    88,
    "an upper item is revealed when the reader scrolls back"
  );
  assert.equal(
    getNextTocScrollTop({
      ...viewport,
      clientHeight: 80,
      itemTop: 405,
      itemBottom: 525,
      inset: 12,
    }),
    413,
    "a wrapped item taller than the usable viewport aligns predictably to the top"
  );
  assert.equal(
    getNextTocScrollTop({
      scrollTop: 580,
      scrollHeight: 900,
      clientHeight: 300,
      containerTop: 100,
      itemTop: 395,
      itemBottom: 440,
      inset: 12,
    }),
    600,
    "following remains bounded by the TOC scroll range"
  );
});

test("a single unfiltered content type does not create a redundant filter row", async () => {
  const { ContentTypeFilter } = await import("../src/components/blog/ContentTypeFilter");

  const unfiltered = renderToStaticMarkup(
    createElement(ContentTypeFilter, {
      activeType: null,
      availableTypes: ["article"],
    })
  );
  assert.equal(unfiltered, "");

  const filtered = renderToStaticMarkup(
    createElement(ContentTypeFilter, {
      activeType: "article",
      availableTypes: ["article"],
    })
  );
  assert.match(filtered, /All content/);
  assert.match(filtered, /Industry Insights/);
});

test("related stories rank real published matches deterministically and exclude the active article", () => {
  const current = article("active-story", "2026-03-20T09:00:00.000Z", {
    tags: ["Review", "Privacy"],
    tagSlugs: ["review", "privacy"],
  });
  const candidates = [
    current,
    article("newer-category-match", "2026-03-19T09:00:00.000Z"),
    article("older-category-tag-match", "2026-01-10T09:00:00.000Z", {
      tags: ["Review"],
      tagSlugs: ["review"],
    }),
    article("type-and-tag-match", "2026-03-18T09:00:00.000Z", {
      category: "Workflow",
      categorySlug: "workflow",
      tags: ["Privacy"],
      tagSlugs: ["privacy"],
    }),
    article("archived-perfect-match", "2026-03-21T09:00:00.000Z", {
      tags: ["Review", "Privacy"],
      tagSlugs: ["review", "privacy"],
      publication: "archived",
    }),
    article("unrelated-guide", "2026-03-22T09:00:00.000Z", {
      type: "guide",
      category: "Product",
      categorySlug: "product",
    }),
  ];

  assert.deepEqual(
    blogContent.getRelatedArticles(candidates, current, 3).map((entry) => entry.slug),
    ["older-category-tag-match", "newer-category-match", "type-and-tag-match"]
  );
});

test("related stories return no module candidates when nothing is genuinely relevant", () => {
  const current = article("active-story", "2026-03-20T09:00:00.000Z");
  const unrelated = article("unrelated-guide", "2026-03-22T09:00:00.000Z", {
    type: "guide",
    category: "Product",
    categorySlug: "product",
  });

  assert.deepEqual(blogContent.getRelatedArticles([current, unrelated], current, 3), []);
});

test("the related-stories module hides when empty and renders only supplied published stories", async () => {
  const { RelatedStories } = await import("../src/components/blog/RelatedStories");
  const published = article("published-related", "2026-03-19T09:00:00.000Z", {
    title: "A published related insight",
  });

  assert.equal(
    renderToStaticMarkup(createElement(RelatedStories, { articles: [] })),
    ""
  );

  const html = renderToStaticMarkup(
    createElement(RelatedStories, { articles: [published] })
  );
  assert.match(html, /aria-labelledby="related-articles-heading"/);
  assert.match(html, /A published related insight/);
  assert.doesNotMatch(html, /placeholder|coming soon/i);
});
