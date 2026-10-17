import type { MetadataRoute } from "next";
import { CONTENT_FILTERS } from "@/components/blog/ContentTypeFilter";
import { getArticleCategories, isAnnouncement, loadPublishedArticles } from "@/lib/blog/content";

// Scheduled content enters the sitemap at its approved UTC publication time without
// requiring a host-specific cron rebuild.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://saferedact.io";
  const articles = await loadPublishedArticles();
  const categories = getArticleCategories(articles);
  const announcements = articles.filter(isAnnouncement);

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
    // The content-type filters are canonical views of the hub, so they are listed.
    ...CONTENT_FILTERS.filter((filter) => filter.type).map((filter) => ({
      url: `${baseUrl}/blog?type=${filter.type}`,
      lastModified: announcements[0]?.updatedDate ?? announcements[0]?.date ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
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
