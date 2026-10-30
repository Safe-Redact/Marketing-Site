import assert from "node:assert/strict";
import test from "node:test";
import { capabilityClaims, publishedFeaturePages } from "../src/content/features";
import {
  featuredIndustries,
  getIndustryPage,
  industryGroups,
  industryPages,
  liveIndustryPages,
} from "../src/content/industries";
import { footerGroups, primaryNav } from "../src/content/navigation";
import {
  copySimilarity,
  industryBodyText,
  industryContentRules,
  validateIndustryContent,
  type IndustryPageContent,
} from "../src/lib/marketing/industries";
import { marketingRoutes, validateMarketingRoutes, validateSupportingContent } from "../src/lib/marketing/site-routes";

const targetSlugs = [
  "legal",
  "local-government",
  "government",
  "healthcare",
  "finance",
  "insurance",
  "education",
  "real-estate",
  "human-resources",
  "media-journalism",
  "ai-data-teams",
];
const knownFeatures = publishedFeaturePages.map((page) => page.slug);
const knownInsights = ["/blog/understanding-document-redaction"];
const validate = (pages: readonly IndustryPageContent[]) =>
  validateIndustryContent(pages, industryGroups, capabilityClaims, knownFeatures, knownInsights);

test("the registry covers the full target industry architecture", () => {
  assert.deepEqual([...industryPages.map((page) => page.slug)].sort(), [...targetSlugs].sort());
  assert.deepEqual(validate(industryPages), []);
  assert.deepEqual(validateSupportingContent(capabilityClaims), []);
  assert.deepEqual(validateMarketingRoutes(marketingRoutes()), []);
});

test("drafts carry a reason and never reach routes, navigation, or the sitemap", () => {
  const drafts = industryPages.filter((page) => page.publicationStatus === "draft");
  assert.deepEqual(drafts.map((page) => page.slug).sort(), ["ai-data-teams", "real-estate"]);

  const navHrefs = JSON.stringify({ primaryNav, footerGroups });
  const routePaths = marketingRoutes().map((route) => route.path);
  for (const draft of drafts) {
    assert.ok(draft.draftReason && draft.draftReason.length > 40, `${draft.slug} needs a reviewable reason`);
    assert.equal(getIndustryPage(draft.slug), undefined);
    assert.ok(!liveIndustryPages.includes(draft));
    assert.ok(!navHrefs.includes(`/industries/${draft.slug}"`), `${draft.slug} leaked into navigation`);
    assert.ok(!routePaths.includes(`/industries/${draft.slug}`), `${draft.slug} leaked into the sitemap`);
    for (const page of liveIndustryPages) assert.ok(!page.relatedIndustries.includes(draft.slug));
  }
});

test("live industry pages are distinct, substantial, and lead with their primary media", () => {
  for (const page of liveIndustryPages) {
    assert.ok(industryBodyText(page).split(/\s+/).length >= industryContentRules.minBodyWords, page.slug);
    assert.equal(page.workflows[0].format, page.mediaEmphasis[0], page.slug);
    assert.ok(page.faq.length >= 4, page.slug);
  }
  for (const left of liveIndustryPages) {
    for (const right of liveIndustryPages) {
      if (left.slug >= right.slug) continue;
      const similarity = copySimilarity(industryBodyText(left), industryBodyText(right));
      assert.ok(similarity <= industryContentRules.maxSimilarity, `${left.slug}/${right.slug} ${similarity}`);
    }
  }
  // Layout variation is real: not every page uses the same section order.
  assert.ok(new Set(liveIndustryPages.map((page) => page.layout)).size >= 3);
  assert.ok(new Set(liveIndustryPages.map((page) => page.mediaEmphasis[0])).size >= 2);
});

test("industry capability statements come only from the evidence register", () => {
  for (const page of industryPages) {
    for (const workflow of page.workflows) {
      for (const claimId of workflow.claimIds) {
        assert.notEqual(capabilityClaims[claimId].status, "blocked", `${page.slug} ${claimId}`);
      }
    }
  }
  const liveCopy = JSON.stringify(liveIndustryPages);
  assert.doesNotMatch(liveCopy, /HIPAA|FERPA|GDPR|GLBA|SOC\s?2|CJIS|FOIA|\bcompliant\b|\bcertified\b|guarantee|irreversib|\d+\s?%|\d+x faster|trusted by|free trial|sign in|log in/i);
});

test("the validator rejects blocked claims, duplicates, thin pages, and draft links", () => {
  const legal = liveIndustryPages.find((page) => page.slug === "legal")!;
  const government = liveIndustryPages.find((page) => page.slug === "government")!;

  const blocked = { ...legal, workflows: [{ ...legal.workflows[0], claimIds: ["BLOCK-GUARANTEE"] as const }] };
  assert.ok(validate([blocked, government]).some((error) => error.includes("blocked claim BLOCK-GUARANTEE")));

  const duplicateTitle = { ...government, seo: { ...government.seo, title: legal.seo.title } };
  assert.ok(validate([legal, duplicateTitle]).some((error) => error.startsWith("Duplicate industry title")));

  const thin = { ...legal, challenges: legal.challenges.slice(0, 3), faq: legal.faq, summary: "Short.", audience: { ...legal.audience, description: "Short." }, workflows: [{ ...legal.workflows[0], description: "Short." }], considerations: ["Short."], sensitiveInformation: legal.sensitiveInformation.map((item) => ({ ...item, examples: "Short." })) };
  assert.ok(validate([thin]).some((error) => error.includes("is thin")));

  const linksDraft = { ...legal, relatedIndustries: ["real-estate"] as const };
  assert.ok(validate([linksDraft]).some((error) => error.includes("unpublished industry real-estate")));

  const claimsCompliance = { ...legal, summary: `${legal.summary} Fully HIPAA compliant.` };
  assert.ok(validate([claimsCompliance]).some((error) => error.includes("blocked wording")));

  const nearDuplicate = { ...government, slug: "insurance" as const, seo: { ...government.seo, title: "Another distinct title for testing", description: `${government.seo.description} Copy.`, canonicalPath: "/industries/insurance" as const }, h1: "Another H1" };
  assert.ok(validate([government, nearDuplicate]).some((error) => error.includes("near-duplicates")));
});

test("the Industries dropdown is curated from published entries only", () => {
  assert.deepEqual(featuredIndustries.map((page) => page.navLabel), ["Legal", "Government", "Healthcare", "Finance", "Insurance"]);
  const industriesMenu = primaryNav.find((item) => item.kind === "menu" && item.id === "industries");
  assert.ok(industriesMenu && industriesMenu.kind === "menu");
  assert.equal(industriesMenu.footerLink?.href, "/industries");
  assert.equal(industryGroups.length, 4);
});
