import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Staff surfaces. Both also carry a noindex meta, which is the stronger
        // signal; this keeps them out of a crawl in the first place.
        disallow: ["/admin", "/admin/", "/moderation", "/api/"],
      },
    ],
    sitemap: `${publicSiteUrl}/sitemap.xml`,
  };
}
