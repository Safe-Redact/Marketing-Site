import type { MetadataRoute } from "next";
import { featureOverview, publishedFeaturePages } from "@/content/features";
import { industryPages, liveIndustryPages } from "@/content/industries";
import { contactPage, howItWorksPage, industriesHub, whyOpenRedaktPage } from "@/content/pages";
import type { CapabilityClaims, SeoFields } from "@/lib/marketing/content";
import { blockedIndustryCopy } from "@/lib/marketing/industries";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export type MarketingRoute = {
  path: `/${string}` | "/";
  /** Present for every route except the homepage, whose metadata lives in the root layout. */
  seo?: SeoFields;
  h1?: string;
  lastModified: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

/** Date the Stage B feature copy was last reviewed against the evidence register. */
const featuresReviewed = "2026-10-25";
/** Date the homepage navigation and section links were last reviewed. */
const homepageReviewed = "2026-10-26";

/**
 * Every indexable marketing route, in sitemap order. Insights routes are generated from
 * the CMS content separately. Draft industries are absent by construction.
 */
export function marketingRoutes(): MarketingRoute[] {
  return [
    { path: "/", lastModified: homepageReviewed, changeFrequency: "monthly", priority: 1 },
    { path: "/features", seo: featureOverview.seo, h1: featureOverview.h1, lastModified: featuresReviewed, changeFrequency: "monthly", priority: 0.9 },
    ...publishedFeaturePages.map((page) => ({
      path: page.seo.canonicalPath,
      seo: page.seo,
      h1: page.h1,
      lastModified: featuresReviewed,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { path: "/industries", seo: industriesHub.seo, h1: industriesHub.h1, lastModified: industriesHub.lastReviewed, changeFrequency: "monthly", priority: 0.8 },
    ...liveIndustryPages.map((page) => ({
      path: page.seo.canonicalPath,
      seo: page.seo,
      h1: page.h1,
      lastModified: page.lastReviewed,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { path: "/how-it-works", seo: howItWorksPage.seo, h1: howItWorksPage.h1, lastModified: howItWorksPage.lastReviewed, changeFrequency: "monthly", priority: 0.8 },
    { path: "/why-openredakt", seo: whyOpenRedaktPage.seo, h1: whyOpenRedaktPage.h1, lastModified: whyOpenRedaktPage.lastReviewed, changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", seo: contactPage.seo, h1: contactPage.h1, lastModified: contactPage.lastReviewed, changeFrequency: "yearly", priority: 0.6 },
  ];
}

/** Site-wide checks that span registries: one title, description, and H1 per route. */
export function validateMarketingRoutes(routes: readonly MarketingRoute[]): string[] {
  const errors: string[] = [];
  const paths = new Set<string>();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const h1s = new Set<string>();
  const draftPaths = new Set(
    industryPages.filter((page) => !liveIndustryPages.includes(page)).map((page) => page.seo.canonicalPath)
  );

  for (const route of routes) {
    if (paths.has(route.path)) errors.push(`Duplicate route ${route.path}.`);
    paths.add(route.path);
    if (draftPaths.has(route.path)) errors.push(`Draft route ${route.path} is listed as indexable.`);
    if (!route.seo) continue;
    if (route.seo.canonicalPath !== route.path) errors.push(`${route.path} canonical is ${route.seo.canonicalPath}.`);
    if (titles.has(route.seo.title)) errors.push(`Duplicate title across routes: ${route.seo.title}`);
    if (descriptions.has(route.seo.description)) errors.push(`Duplicate description across routes: ${route.path}`);
    if (route.h1 && h1s.has(route.h1)) errors.push(`Duplicate H1 across routes: ${route.h1}`);
    titles.add(route.seo.title);
    descriptions.add(route.seo.description);
    if (route.h1) h1s.add(route.h1);
  }

  return errors;
}

/**
 * Supporting pages describe the product in general terms, so they are held to the same
 * blocked-wording rules as industry pages, and any capability they cite must be live.
 */
export function validateSupportingContent(claims: CapabilityClaims): string[] {
  const errors: string[] = [];
  const pages = { industriesHub, howItWorksPage, whyOpenRedaktPage, contactPage };

  for (const [name, page] of Object.entries(pages)) {
    const copy = JSON.stringify(page);
    for (const pattern of blockedIndustryCopy) {
      if (pattern.test(copy)) errors.push(`${name} contains blocked wording ${pattern}.`);
    }
  }
  for (const stage of howItWorksPage.stages) {
    for (const claimId of stage.claimIds) {
      const claim = claims[claimId];
      if (!claim) errors.push(`how-it-works stage ${stage.id} references unknown claim ${claimId}.`);
      else if (claim.status === "blocked") errors.push(`how-it-works stage ${stage.id} references blocked claim ${claimId}.`);
    }
  }

  return errors;
}
