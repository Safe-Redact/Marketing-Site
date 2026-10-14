import type { MetadataRoute } from "next";
import { getArticleCategories, loadPublishedArticles } from "@/lib/blog/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://saferedact.io";
  const articles = await loadPublishedArticles();
  const categories = getArticleCategories(articles);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: articles[0]?.updatedDate ?? articles[0]?.date ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.updatedDate ?? article.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
