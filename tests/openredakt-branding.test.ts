import assert from "node:assert/strict";
import test from "node:test";
import { heroContent } from "../src/content/hero";
import { faqItems } from "../src/content/faq";
import { finalCtaContent } from "../src/content/final-cta";
import { siteConfig } from "../src/content/site";
import { buildArticleJsonLd, buildArticleMetadata } from "../src/lib/blog/seo";
import type { BlogArticle } from "../src/lib/blog/types";

const article: BlogArticle = {
  title: "A verified redaction guide",
  slug: "verified-redaction-guide",
  excerpt: "A verified guide to reviewing sensitive information before export.",
  author: "OpenRedakt Team",
  category: "Guides",
  categorySlug: "guides",
  tags: [],
  tagSlugs: [],
  date: "2026-10-21T12:00:00.000Z",
  publication: "immediate",
  type: "guide",
  featured: false,
  seoDescription:
    "Learn how reviewers inspect sensitive information and verify redacted output before it is used or shared.",
  body: "Review detected information and verify the exported result.",
  readingMinutes: 1,
};

test("the public brand contract uses the exact OpenRedakt spelling", () => {
  assert.equal(siteConfig.name, "OpenRedakt");
  assert.doesNotMatch(siteConfig.name, /OpenRedact/);

  const publicCopy = JSON.stringify({ heroContent, faqItems, finalCtaContent });
  assert.doesNotMatch(publicCopy, /Safe\s?Redact/i);
  assert.doesNotMatch(publicCopy, /OpenRedact(?!k)/);
});

test("legacy external coordinates remain explicit and pending rather than invented", () => {
  assert.equal(siteConfig.externalCoordinates.status, "legacy-pending-migration");
  assert.equal(siteConfig.externalCoordinates.url, "https://saferedact.io");
  assert.equal(siteConfig.externalCoordinates.email, "support@saferedact.io");
});

test("article metadata and structured data publish under OpenRedakt", () => {
  const metadata = buildArticleMetadata(article);
  const jsonLd = buildArticleJsonLd(article);

  assert.equal(metadata.openGraph?.siteName, "OpenRedakt");
  assert.equal(jsonLd.publisher.name, "OpenRedakt");
  assert.equal(jsonLd.publisher.url, siteConfig.externalCoordinates.url);
});
