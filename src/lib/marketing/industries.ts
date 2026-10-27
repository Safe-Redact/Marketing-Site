import type {
  CapabilityClaims,
  ClaimId,
  FeatureSlug,
  MarketingFaq,
  SeoFields,
} from "@/lib/marketing/content";

/**
 * Target industry architecture. Every slug has a registry entry, but only entries whose
 * status is "approved" or "published" render, appear in navigation, or enter the sitemap.
 */
export type IndustrySlug =
  | "legal"
  | "local-government"
  | "government"
  | "healthcare"
  | "finance"
  | "insurance"
  | "education"
  | "real-estate"
  | "human-resources"
  | "media-journalism"
  | "ai-data-teams";

export type IndustryPublicationStatus = "draft" | "approved" | "published";

export type IndustryGroupId =
  | "law-public-sector"
  | "people-care-education"
  | "financial-transactional"
  | "media-data";

export type MediaFormat = "document" | "audio" | "video";

/** Controlled layout variation so industry pages do not read as one template. */
export type IndustryLayout = "records-led" | "media-led" | "mixed";

export type IndustrySeo = SeoFields & {
  primaryIntent: string;
  secondaryThemes: readonly string[];
};

export type IndustryWorkflow = {
  format: MediaFormat;
  title: string;
  description: string;
  /** Capability register entries shown verbatim beside the workflow. */
  claimIds: readonly ClaimId[];
};

export type IndustryPageContent = {
  slug: IndustrySlug;
  publicationStatus: IndustryPublicationStatus;
  /** Why an entry is held back. Required for drafts so the decision stays reviewable. */
  draftReason?: string;
  lastReviewed: `${number}-${number}-${number}`;
  group: IndustryGroupId;
  navLabel: string;
  icon: string;
  layout: IndustryLayout;
  /** Primary media first. Drives workflow order and the hero signal. */
  mediaEmphasis: readonly MediaFormat[];
  hubSummary: string;
  seo: IndustrySeo;
  eyebrow: string;
  h1: string;
  summary: string;
  audience: { title: string; description: string; roles: readonly string[] };
  sensitiveInformation: readonly { label: string; examples: string }[];
  challenges: readonly { title: string; description: string }[];
  workflows: readonly IndustryWorkflow[];
  considerations: readonly string[];
  faq: readonly MarketingFaq[];
  relatedFeatures: readonly FeatureSlug[];
  relatedIndustries: readonly IndustrySlug[];
  relatedInsights: readonly { href: `/blog/${string}`; title: string }[];
  cta: { eyebrow: string; title: string; description: string };
  /** Optional approved imagery. No industry image has been approved yet. */
  image?: { src: `/${string}`; alt: string; width: number; height: number };
};

export type IndustryGroup = {
  id: IndustryGroupId;
  title: string;
  description: string;
};

export const formatFeature: Record<MediaFormat, FeatureSlug> = {
  document: "document-redaction",
  audio: "audio-redaction",
  video: "video-redaction",
};

const claimPrefix: Record<MediaFormat, string> = {
  document: "DOC-",
  audio: "AUD-",
  video: "VID-",
};

export function isIndustryLive(page: Pick<IndustryPageContent, "publicationStatus">) {
  return page.publicationStatus === "approved" || page.publicationStatus === "published";
}

export function industryClaimIds(page: IndustryPageContent): ClaimId[] {
  return [...new Set(page.workflows.flatMap((workflow) => workflow.claimIds))];
}

/**
 * Affirmative claims the evidence register blocks. Regulation names are excluded
 * entirely so industry copy stays jurisdiction-neutral.
 */
export const blockedIndustryCopy: readonly RegExp[] = [
  /\b(?:HIPAA|HITECH|FERPA|GDPR|CCPA|GLBA|PCI(?:[- ]DSS)?|SOX|SOC\s?2|ISO\s?27001|CJIS|FOIA|FedRAMP)\b/i,
  /\bcompliant\b/i,
  /\bcertified\b/i,
  /\bguarantee(?:d|s)?\b/i,
  /\birreversibl[ey]\b/i,
  /\b\d+(?:\.\d+)?\s?%/,
  /\b\d+x\s+faster\b/i,
  /\b(?:fully|completely)\s+automat/i,
  /\bautomatic(?:ally)?\s+track/i,
  /\bunlimited\b/i,
  /\b(?:military|bank)[- ]grade\b/i,
  /\btrusted by\b/i,
  /\bzero learning curve\b/i,
  /\b(?:free trial|sign in|log in|download)\b/i,
];

/** Body copy authored for one page, used for thin-content and near-duplicate checks. */
export function industryBodyText(page: IndustryPageContent): string {
  return [
    page.h1,
    page.summary,
    page.audience.title,
    page.audience.description,
    ...page.audience.roles,
    ...page.sensitiveInformation.flatMap((item) => [item.label, item.examples]),
    ...page.challenges.flatMap((item) => [item.title, item.description]),
    ...page.workflows.flatMap((item) => [item.title, item.description]),
    ...page.considerations,
    ...page.faq.flatMap((item) => [item.question, item.answer]),
  ].join(" ");
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function shingles(text: string, size = 3): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter(Boolean);
  const result = new Set<string>();
  for (let index = 0; index + size <= words.length; index += 1) {
    result.add(words.slice(index, index + size).join(" "));
  }
  return result;
}

/** Jaccard similarity of three-word shingles: 0 is unrelated copy, 1 is identical. */
export function copySimilarity(a: string, b: string): number {
  const left = shingles(a);
  const right = shingles(b);
  let shared = 0;
  for (const item of left) if (right.has(item)) shared += 1;
  const union = left.size + right.size - shared;
  return union === 0 ? 0 : shared / union;
}

export const industryContentRules = {
  minBodyWords: 450,
  maxSimilarity: 0.12,
  minFaqs: 4,
  minChallenges: 3,
  minSensitiveCategories: 3,
  titleLength: [30, 52] as const,
  descriptionLength: [120, 165] as const,
};

export function validateIndustryContent(
  pages: readonly IndustryPageContent[],
  groups: readonly IndustryGroup[],
  claims: CapabilityClaims,
  knownFeatures: readonly FeatureSlug[],
  knownInsights: readonly string[]
): string[] {
  const errors: string[] = [];
  const seen = { slugs: new Set<string>(), titles: new Set<string>(), descriptions: new Set<string>(), h1s: new Set<string>() };
  const live = pages.filter(isIndustryLive);
  const liveSlugs = new Set(live.map((page) => page.slug));

  for (const page of pages) {
    if (seen.slugs.has(page.slug)) errors.push(`Duplicate industry slug: ${page.slug}`);
    seen.slugs.add(page.slug);
    if (!groups.some((group) => group.id === page.group)) errors.push(`${page.slug} uses unknown group ${page.group}.`);
    if (page.publicationStatus === "draft" && !page.draftReason) errors.push(`${page.slug} is a draft without a draftReason.`);

    // Blocked claims are rejected for drafts too, so a draft can never be promoted with one.
    for (const claimId of industryClaimIds(page)) {
      const claim = claims[claimId];
      if (!claim) errors.push(`${page.slug} references unknown claim ${claimId}.`);
      else if (claim.status === "blocked") errors.push(`${page.slug} references blocked claim ${claimId}.`);
    }
    for (const workflow of page.workflows) {
      for (const claimId of workflow.claimIds) {
        if (!claimId.startsWith(claimPrefix[workflow.format])) {
          errors.push(`${page.slug} ${workflow.format} workflow cites ${claimId} from another format.`);
        }
      }
    }
    const copy = JSON.stringify(page);
    for (const pattern of blockedIndustryCopy) {
      if (pattern.test(copy)) errors.push(`${page.slug} contains blocked wording ${pattern}.`);
    }
  }

  for (const page of live) {
    const { seo } = page;
    if (seo.canonicalPath !== `/industries/${page.slug}`) errors.push(`Canonical does not match ${page.slug}.`);
    for (const [key, value] of [["titles", seo.title], ["descriptions", seo.description], ["h1s", page.h1]] as const) {
      if (seen[key].has(value)) errors.push(`Duplicate industry ${key.slice(0, -1)}: ${value}`);
      seen[key].add(value);
    }
    const [minTitle, maxTitle] = industryContentRules.titleLength;
    if (seo.title.length < minTitle || seo.title.length > maxTitle) errors.push(`${page.slug} title length ${seo.title.length} is outside ${minTitle}-${maxTitle}.`);
    const [minDescription, maxDescription] = industryContentRules.descriptionLength;
    if (seo.description.length < minDescription || seo.description.length > maxDescription) {
      errors.push(`${page.slug} description length ${seo.description.length} is outside ${minDescription}-${maxDescription}.`);
    }
    if (!seo.primaryIntent || seo.secondaryThemes.length < 3) errors.push(`${page.slug} needs a primary intent and at least three secondary themes.`);
    if (page.faq.length < industryContentRules.minFaqs) errors.push(`${page.slug} needs at least ${industryContentRules.minFaqs} FAQs.`);
    if (page.challenges.length < industryContentRules.minChallenges) errors.push(`${page.slug} needs at least ${industryContentRules.minChallenges} challenges.`);
    if (page.sensitiveInformation.length < industryContentRules.minSensitiveCategories) errors.push(`${page.slug} needs more sensitive-information categories.`);
    if (page.workflows.length === 0) errors.push(`${page.slug} has no workflows.`);
    if (page.considerations.length === 0) errors.push(`${page.slug} states no considerations or limitations.`);
    if (page.mediaEmphasis[0] !== page.workflows[0]?.format) errors.push(`${page.slug} must lead with its primary media workflow.`);
    const words = wordCount(industryBodyText(page));
    if (words < industryContentRules.minBodyWords) errors.push(`${page.slug} is thin (${words} words).`);

    for (const related of page.relatedIndustries) {
      if (related === page.slug) errors.push(`${page.slug} links to itself.`);
      else if (!liveSlugs.has(related)) errors.push(`${page.slug} links to unpublished industry ${related}.`);
    }
    for (const feature of page.relatedFeatures) {
      if (!knownFeatures.includes(feature)) errors.push(`${page.slug} links to unknown feature ${feature}.`);
    }
    for (const workflow of page.workflows) {
      if (!page.relatedFeatures.includes(formatFeature[workflow.format])) {
        errors.push(`${page.slug} describes a ${workflow.format} workflow without linking its feature page.`);
      }
    }
    for (const insight of page.relatedInsights) {
      if (!knownInsights.includes(insight.href)) errors.push(`${page.slug} links to unpublished insight ${insight.href}.`);
    }
  }

  for (let left = 0; left < live.length; left += 1) {
    for (let right = left + 1; right < live.length; right += 1) {
      const similarity = copySimilarity(industryBodyText(live[left]), industryBodyText(live[right]));
      if (similarity > industryContentRules.maxSimilarity) {
        errors.push(`${live[left].slug} and ${live[right].slug} are near-duplicates (${similarity.toFixed(2)}).`);
      }
    }
  }

  return errors;
}
