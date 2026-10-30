import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/content/site";

/**
 * SITE_NOINDEX=true (review deployments such as staging) disallows every path; the
 * X-Robots-Tag header from next.config.ts carries the stronger noindex signal. Unset,
 * as in production, the rules below apply unchanged.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_NOINDEX === "true") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

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
