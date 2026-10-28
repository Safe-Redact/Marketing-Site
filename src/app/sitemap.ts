import type { MetadataRoute } from "next";
import { CONTENT_FILTERS } from "@/components/blog/ContentTypeFilter";
import { getArticleCategories, isAnnouncement, loadPublishedArticles } from "@/lib/blog/content";
import { publicSiteUrl } from "@/content/site";
import { marketingRoutes } from "@/lib/marketing/site-routes";

// Scheduled content enters the sitemap at its approved UTC publication time without
// requiring a host-specific cron rebuild.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = publicSiteUrl;
  const articles = await loadPublishedArticles();
  const categories = getArticleCategories(articles);
  const announcements = articles.filter(isAnnouncement);

  // Marketing routes come from one registry, so draft industries can never be listed.
  const [home, ...pages] = marketingRoutes();

  return [
    {
      url: baseUrl,
      lastModified: home.lastModified,
      changeFrequency: home.changeFrequency,
      priority: home.priority,
    },
    ...pages.map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
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
