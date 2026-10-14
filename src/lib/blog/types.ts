export type ArticleStatus = "draft" | "published" | "archived";

export interface BlogArticle {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  categorySlug: string;
  date: string;
  updatedDate?: string;
  featuredImage?: string;
  imageAlt?: string;
  status: ArticleStatus;
  featured: boolean;
  seoDescription: string;
  body: string;
  readingMinutes: number;
}

export interface ArticleQuery {
  query?: string;
  category?: string;
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
  now?: Date;
}
