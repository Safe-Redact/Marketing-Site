export type ArticlePublication = "immediate" | "scheduled" | "archived";

/**
 * The four kinds of entry the Insights hub carries. "news" and "product-update" are
 * company announcements; "article" and "guide" are editorial writing. All four surface
 * under /blog, where the content-type filter narrows between them.
 */
export const ARTICLE_TYPES = ["article", "news", "product-update", "guide"] as const;
export type ArticleType = (typeof ARTICLE_TYPES)[number];
export const ANNOUNCEMENT_TYPES: readonly ArticleType[] = ["news", "product-update"];
export const EDITORIAL_TYPES: readonly ArticleType[] = ["article", "guide"];

export interface BlogArticle {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  type: ArticleType;
  category: string;
  categorySlug: string;
  tags: string[];
  tagSlugs: string[];
  date: string;
  updatedDate?: string;
  featuredImage?: string;
  imageAlt?: string;
  publication: ArticlePublication;
  featured: boolean;
  seoDescription: string;
  body: string;
  readingMinutes: number;
}

export interface ArticleQuery {
  query?: string;
  category?: string;
  type?: ArticleType | readonly ArticleType[];
  tag?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedArticles {
  items: BlogArticle[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ContentOptions {
  directory?: string;
  mediaDirectory?: string;
  now?: Date;
}
