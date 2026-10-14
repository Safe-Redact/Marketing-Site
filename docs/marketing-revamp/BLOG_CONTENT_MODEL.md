# SafeRedact Blog Content Model

## Storage

Each article is one Markdown file at `content/blog/<slug>.md`. Decap stores approved media under `public/images/blog/` and writes public image references as `/images/blog/<file>`.

The production directory is intentionally empty until factual content is approved. Test articles live only under `tests/fixtures/blog/` and identify themselves as development fixtures.

## Frontmatter contract

| Field | Type | Validation | Public use |
| --- | --- | --- | --- |
| `title` | string | 5–120 trimmed characters | H1, cards, metadata |
| `slug` | string | 3–100 lowercase letters/numbers with single hyphens; must match filename | route and canonical URL |
| `excerpt` | string | 40–240 characters | listing and article introduction |
| `author` | string | 2–80 characters; approved staff byline only | byline and Article JSON-LD |
| `category` | string | 2–60 characters | filtering and category URL |
| `date` | ISO date-time | required, UTC-capable | publication eligibility and display |
| `updatedDate` | ISO date-time | optional | modified metadata and sitemap date |
| `featuredImage` | path | optional; local `/images/blog/` only | cards, article/social metadata |
| `imageAlt` | string | required when featured image exists; forbidden otherwise | accessible image description |
| `status` | enum | `draft`, `published`, or `archived` | public eligibility |
| `featured` | boolean | defaults false | listing feature selection |
| `seoDescription` | string | 50–170 characters | description and social metadata |
| Markdown body | Markdown | non-empty; no raw HTML; safe links; local images with alt text | article body |

Unknown frontmatter fields are rejected. This avoids silently accepting a misspelled publication status or safety-critical field.

## Example shape

This example is a format reference only and is not production content:

```markdown
---
title: "Approved factual title"
slug: "approved-factual-title"
excerpt: "A factual summary between forty and two hundred forty characters."
author: "Approved staff name"
category: "Education"
date: "2026-10-14T09:00:00.000Z"
updatedDate: ""
featuredImage: ""
imageAlt: ""
status: "draft"
featured: false
seoDescription: "A factual search description between fifty and one hundred seventy characters."
---

Article content in Markdown.
```

## Publication lifecycle

1. **Draft:** editor creates or updates an unpublished entry in Decap's editorial workflow. It is not present on the production branch and would also be excluded by the public loader.
2. **In review:** Decap creates or updates the editorial workflow pull request. A reviewer verifies claims, links, spelling, image rights, alt text, metadata, slug stability, and status.
3. **Published:** an authorized reviewer approves the Git change, the article uses `status: published`, its date is current or past, and the change is merged to `master`. A successful deployment build makes it public.
4. **Scheduled by content date:** a future-dated published file remains non-public until a later deployment/render occurs after the time. Decap does not provide an independent scheduler in this implementation; operations must arrange a build or publish at the intended time.
5. **Archived:** a reviewed change sets `status: archived` or removes the file. It disappears from listing, category, article lookup, related results, and sitemap after deployment.

An existing published slug should not change without an approved redirect plan. Phase 4A does not create automatic redirect records.

## Markdown policy

Allowed content is standard Markdown plus GitHub-flavored tables, task lists, and strikethrough. Safe `http`, `https`, `mailto`, local-root, and hash links are accepted. Article images must be local blog media and include alt text.

Raw HTML, scripts, iframes, MDX imports/components, remote article images, protocol-relative links, path traversal, and executable URL protocols are not accepted.

## SEO mapping

- `title`, `seoDescription`, `slug`, dates, author, and optional image feed Next.js metadata.
- Article JSON-LD includes only Article, headline, description, dates, author name, publisher identity, canonical URL, and an optional approved image.
- No rating, certification, customer, organization affiliation, biography, or performance field exists.
- Only eligible published articles and their categories enter the sitemap.

## Phase 4B separation

Comments and replies are not Markdown frontmatter and must not be committed into article files. A future discussion model should live behind a provider-neutral repository with its own IDs, moderation states, privacy rules, retention, rate limits, and migration path. Article content remains Git-backed if the comment provider changes.
