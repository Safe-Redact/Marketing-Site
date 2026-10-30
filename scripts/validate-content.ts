import path from "node:path";
import {
  DEFAULT_BLOG_DIRECTORY,
  DEFAULT_BLOG_MEDIA_DIRECTORY,
  loadArticlesFromDirectory,
  validatePublicationTiming,
} from "../src/lib/blog/content";
import { capabilityClaims, featureOverview, featurePages, publishedFeaturePages } from "../src/content/features";
import { industryGroups, industryPages, liveIndustryPages } from "../src/content/industries";
import { validateFeatureContent } from "../src/lib/marketing/content";
import { validateIndustryContent } from "../src/lib/marketing/industries";
import { marketingRoutes, validateMarketingRoutes, validateSupportingContent } from "../src/lib/marketing/site-routes";

async function main() {
  const featureErrors = validateFeatureContent(featureOverview, featurePages, capabilityClaims);
  if (featureErrors.length > 0) {
    throw new Error(`Feature content validation failed:\n- ${featureErrors.join("\n- ")}`);
  }

  const articles = await loadArticlesFromDirectory(
    DEFAULT_BLOG_DIRECTORY,
    DEFAULT_BLOG_MEDIA_DIRECTORY
  );
  const now = new Date();

  for (const article of articles) validatePublicationTiming(article, now);

  // Industry pages may only link to Insights that are publicly visible right now.
  const visibleInsights = articles
    .filter((article) => article.publication === "immediate" || (article.publication === "scheduled" && new Date(article.date) <= now))
    .map((article) => `/blog/${article.slug}`);
  const marketingErrors = [
    ...validateIndustryContent(
      industryPages,
      industryGroups,
      capabilityClaims,
      publishedFeaturePages.map((page) => page.slug),
      visibleInsights
    ),
    ...validateSupportingContent(capabilityClaims),
    ...validateMarketingRoutes(marketingRoutes()),
  ];
  if (marketingErrors.length > 0) {
    throw new Error(`Marketing content validation failed:\n- ${marketingErrors.join("\n- ")}`);
  }

  const visible = articles.filter((article) =>
    article.publication === "immediate" ||
    (article.publication === "scheduled" && new Date(article.date) <= now)
  ).length;
  const scheduled = articles.filter(
    (article) => article.publication === "scheduled" && new Date(article.date) > now
  ).length;
  const archived = articles.filter((article) => article.publication === "archived").length;

  console.log(
    `Validated ${articles.length} article files (${visible} visible, ${scheduled} scheduled, ${archived} archived).`
  );
  console.log(`Validated ${featurePages.length} published feature pages against the capability register.`);
  console.log(
    `Validated ${industryPages.length} industry entries (${liveIndustryPages.length} live, ${industryPages.length - liveIndustryPages.length} draft) and ${marketingRoutes().length} indexable marketing routes.`
  );

  // Resolve the path before printing it so CI logs identify exactly which tree was validated.
  console.log(`Content root: ${path.resolve(DEFAULT_BLOG_DIRECTORY)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
