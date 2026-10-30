import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import type { SeoFields } from "@/lib/marketing/content";

/**
 * Page-level metadata. Next replaces, rather than merges, a parent's `openGraph`, so
 * the site name and locale are restated here to keep them on every shared card.
 */
export function buildPageMetadata(seo: SeoFields): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonicalPath },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteConfig.name,
      title: seo.title,
      description: seo.description,
      url: seo.canonicalPath,
    },
    twitter: { card: "summary", title: seo.title, description: seo.description },
  };
}
