import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { parseDocument } from "yaml";
import { z } from "zod";
import { ARTICLE_TYPES } from "./types";
import type { ArticleQuery, ArticleType, BlogArticle, ContentOptions, PaginatedArticles } from "./types";

export const BLOG_PAGE_SIZE = 6;
export const DEFAULT_BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const MAX_ARTICLE_TAGS = 6;

const optionalText = z.preprocess(
  (value) => (value === null || value === "" ? undefined : value),
  z.string().trim().optional()
);

const dateText = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.string().datetime({ offset: true })
);

const articleFrontmatterSchema = z
  .object({
    title: z.string().trim().min(5).max(120),
    slug: z.string().trim().min(3).max(100).regex(slugPattern),
    excerpt: z.string().trim().min(40).max(240),
    author: z.string().trim().min(2).max(80),
    type: z.enum(ARTICLE_TYPES).default("article"),
    category: z.string().trim().min(2).max(60),
    tags: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      z.array(z.string().trim().min(2).max(30)).max(MAX_ARTICLE_TAGS).default([])
    ),
    date: dateText,
    updatedDate: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      dateText.optional()
    ),
    featuredImage: optionalText,
    imageAlt: optionalText,
    status: z.enum(["draft", "published", "archived"]),
    featured: z.boolean().default(false),
    seoDescription: z.string().trim().min(50).max(170),
  })
  .strict()
  .superRefine((value, context) => {
    for (const [index, tag] of value.tags.entries()) {
      if (!slugifyCategory(tag)) {
        context.addIssue({
          code: "custom",
          path: ["tags", index],
          message: "Each tag must contain letters or digits so it can produce a URL slug.",
        });
      }
    }
    if (value.featuredImage && !isSafeBlogImagePath(value.featuredImage)) {
      context.addIssue({
        code: "custom",
        path: ["featuredImage"],
        message: "Featured images must use the local /images/blog/ media directory.",
      });
    }
    if (value.featuredImage && !value.imageAlt) {
      context.addIssue({
        code: "custom",
        path: ["imageAlt"],
        message: "Featured images require image alt text.",
      });
    }
    if (!value.featuredImage && value.imageAlt) {
      context.addIssue({
        code: "custom",
        path: ["imageAlt"],
        message: "Image alt text requires a featured image.",
      });
    }
  });

export type ArticleFrontmatter = Omit<
  BlogArticle,
  "body" | "readingMinutes"
>;

/**
 * Validates one article's frontmatter and derives the URL slugs the public routes
 * filter on. Tags are de-duplicated by slug so "Redaction" and "redaction" cannot
 * produce two archives of the same thing; the first spelling wins.
 */
export function parseArticleFrontmatter(data: unknown): ArticleFrontmatter {
  const frontmatter = articleFrontmatterSchema.parse(data);

  const categorySlug = slugifyCategory(frontmatter.category);
  if (!categorySlug) {
    throw new Error("Article category cannot produce a valid URL slug.");
  }

  const tags: string[] = [];
  const tagSlugs: string[] = [];
  for (const tag of frontmatter.tags) {
    const tagSlug = slugifyCategory(tag);
    if (!tagSlug || tagSlugs.includes(tagSlug)) continue;
    tags.push(tag);
    tagSlugs.push(tagSlug);
  }

  return { ...frontmatter, categorySlug, tags, tagSlugs };
}

export function isValidArticleSlug(slug: string): boolean {
  return slugPattern.test(slug);
}

export function slugifyCategory(category: string): string {
  return category
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isSafeBlogImagePath(value: string): boolean {
  return /^\/images\/blog\/[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(value) && !value.includes("..");
}

export function isSafeArticleLink(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("..")) return true;
  if (value.startsWith("#")) return true;

  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export function validateMarkdownBody(markdown: string): void {
  if (!markdown.trim()) throw new Error("Article content cannot be empty.");

  const tree = unified().use(remarkParse).parse(markdown);
  visit(tree, (node) => {
    if (node.type === "html") {
      throw new Error("Raw HTML is not permitted in article content.");
    }

    if (node.type === "image") {
      if (!node.alt?.trim()) throw new Error("Every article image requires alt text.");
      if (!isSafeBlogImagePath(node.url)) {
        throw new Error("Article images must use local blog media under /images/blog/.");
      }
    }

    if (node.type === "link" && !isSafeArticleLink(node.url)) {
      throw new Error("Article links must use an approved URL protocol or safe local path.");
    }
  });
}

export function calculateReadingTime(markdown: string): number {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ");
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
}

export function parseArticleSource(source: string): { data: unknown; content: string } {
  const normalized = source.replace(/^\uFEFF/, "");
  const match = /^---[\t ]*\r?\n([\s\S]*?)\r?\n---[\t ]*(?:\r?\n|$)([\s\S]*)$/.exec(normalized);

  if (!match) {
    throw new Error("Article files must begin with a YAML frontmatter block.");
  }

  const document = parseDocument(match[1], {
    schema: "core",
    uniqueKeys: true,
  });

  if (document.errors.length) {
    throw new Error(`Invalid article frontmatter: ${document.errors[0].message}`);
  }

  return {
    data: document.toJS({ maxAliasCount: 20 }),
    content: match[2],
  };
}

export async function parseArticleFile(filePath: string): Promise<BlogArticle> {
  const source = await readFile(filePath, "utf8");
  const parsed = parseArticleSource(source);
  const frontmatter = parseArticleFrontmatter(parsed.data);
  const filename = path.basename(filePath, path.extname(filePath));

  if (filename !== frontmatter.slug) {
    throw new Error(`Article slug must match its filename: ${filename}.md`);
  }

  validateMarkdownBody(parsed.content);

  return {
    ...frontmatter,
    body: parsed.content.trim(),
    readingMinutes: calculateReadingTime(parsed.content),
  };
}

export async function loadArticlesFromDirectory(
  directory = DEFAULT_BLOG_DIRECTORY
): Promise<BlogArticle[]> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const articleFiles = entries
    .filter((entry) => entry.isFile() && [".md", ".markdown"].includes(path.extname(entry.name)))
    .map((entry) => path.join(directory, entry.name));

  return Promise.all(articleFiles.map(parseArticleFile));
}

export function isPublishedArticle(article: BlogArticle, now = new Date()): boolean {
  return article.status === "published" && new Date(article.date).getTime() <= now.getTime();
}

export async function loadPublishedArticles(options: ContentOptions = {}): Promise<BlogArticle[]> {
  const articles = await loadArticlesFromDirectory(options.directory);
  const now = options.now ?? new Date();

  return articles
    .filter((article) => isPublishedArticle(article, now))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

export async function getPublishedArticleBySlug(
  slug: string,
  options: ContentOptions = {}
): Promise<BlogArticle | null> {
  if (!isValidArticleSlug(slug)) return null;
  const articles = await loadPublishedArticles(options);
  return articles.find((article) => article.slug === slug) ?? null;
}

export function queryArticles(
  articles: BlogArticle[],
  { query = "", category, type, tag, page = 1, pageSize = BLOG_PAGE_SIZE }: ArticleQuery = {}
): PaginatedArticles {
  const normalizedQuery = query.trim().toLocaleLowerCase("en");
  const normalizedCategory = category?.trim().toLocaleLowerCase("en");
  const normalizedTag = tag?.trim().toLocaleLowerCase("en");
  const types = type === undefined ? null : new Set(Array.isArray(type) ? type : [type]);
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safePageSize = Number.isInteger(pageSize) && pageSize > 0 && pageSize <= 24
    ? pageSize
    : BLOG_PAGE_SIZE;

  const filtered = articles.filter((article) => {
    if (types && !types.has(article.type)) return false;
    if (normalizedCategory && article.categorySlug !== normalizedCategory) return false;
    if (normalizedTag && !article.tagSlugs.includes(normalizedTag)) return false;
    if (!normalizedQuery) return true;
    return [article.title, article.excerpt, article.author, article.category, ...article.tags]
      .join(" ")
      .toLocaleLowerCase("en")
      .includes(normalizedQuery);
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / safePageSize);
  const start = (safePage - 1) * safePageSize;

  return {
    items: filtered.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
  };
}

export function getRelatedArticles(
  articles: BlogArticle[],
  article: BlogArticle,
  limit = 3
): BlogArticle[] {
  return articles
    .filter((candidate) => candidate.slug !== article.slug && candidate.categorySlug === article.categorySlug)
    .slice(0, Math.max(0, limit));
}

export function getArticleCategories(articles: BlogArticle[]): Array<{ name: string; slug: string }> {
  return [...new Map(articles.map((article) => [
    article.categorySlug,
    { name: article.category, slug: article.categorySlug },
  ])).values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function getArticleTags(articles: BlogArticle[]): Array<{ name: string; slug: string; count: number }> {
  const tags = new Map<string, { name: string; slug: string; count: number }>();
  for (const article of articles) {
    for (const [index, slug] of article.tagSlugs.entries()) {
      const existing = tags.get(slug);
      if (existing) existing.count += 1;
      else tags.set(slug, { name: article.tags[index], slug, count: 1 });
    }
  }
  return [...tags.values()].sort(
    (left, right) => right.count - left.count || left.name.localeCompare(right.name)
  );
}

/**
 * Related entries prefer the same content type, then fall back to the same
 * category, so an announcement never trails a list of unrelated guides.
 */
export function getRelatedByType(
  articles: BlogArticle[],
  article: BlogArticle,
  limit = 3
): BlogArticle[] {
  const candidates = articles.filter((candidate) => candidate.slug !== article.slug);
  const sameTypeAndCategory = candidates.filter(
    (candidate) => candidate.type === article.type && candidate.categorySlug === article.categorySlug
  );
  const sameType = candidates.filter(
    (candidate) => candidate.type === article.type && !sameTypeAndCategory.includes(candidate)
  );
  const sameCategory = candidates.filter(
    (candidate) =>
      candidate.categorySlug === article.categorySlug &&
      !sameTypeAndCategory.includes(candidate) &&
      !sameType.includes(candidate)
  );

  return [...sameTypeAndCategory, ...sameType, ...sameCategory].slice(0, Math.max(0, limit));
}

export function isAnnouncement(article: BlogArticle): boolean {
  return article.type === "news" || article.type === "product-update";
}

const articleTypeLabels: Record<ArticleType, string> = {
  article: "Article",
  news: "Company news",
  "product-update": "Product update",
  guide: "Guide",
};

export function articleTypeLabel(type: ArticleType): string {
  return articleTypeLabels[type];
}
