export type ClaimStatus = "publishable" | "conditional" | "blocked";

export type ClaimId =
  | "DOC-INPUT"
  | "DOC-OCR"
  | "DOC-CANDIDATES"
  | "DOC-MANUAL"
  | "DOC-REVIEW"
  | "DOC-OUTPUT-CHECK"
  | "DOC-REPORT"
  | "AUD-INPUT"
  | "AUD-TIMELINE"
  | "AUD-EFFECTS"
  | "AUD-PREVIEW"
  | "AUD-TRANSCRIPT-CONTEXT"
  | "AUD-EXPORT"
  | "VID-INPUT"
  | "VID-DETECTION"
  | "VID-MANUAL"
  | "VID-TIMELINE"
  | "VID-EFFECTS"
  | "VID-AUDIO"
  | "VID-OUTPUT-CHECK"
  | "BLOCK-AUDIO-AUTO"
  | "BLOCK-TRACKING"
  | "BLOCK-COMPLIANCE"
  | "BLOCK-GUARANTEE"
  | "BLOCK-COLLABORATION";

export type CapabilityClaim = {
  status: ClaimStatus;
  publicWording: string;
  condition?: string;
};

export type CapabilityClaims = Record<ClaimId, CapabilityClaim>;

export type SeoFields = {
  title: string;
  description: string;
  canonicalPath: `/${string}`;
};

export type MarketingFaq = {
  question: string;
  answer: string;
};

export type WorkflowStep = {
  title: string;
  description: string;
};

export type FeatureSlug =
  | "document-redaction"
  | "audio-redaction"
  | "video-redaction";

export type FeatureMedia =
  | {
      kind: "screenshot";
      screenshotId: "format-document";
      caption: string;
    }
  | {
      // Labelled illustration standing in for a capture that is not yet approved.
      kind: "workflow-diagram";
      format: "audio" | "video";
      caption: string;
    };

export type FeatureSection = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: readonly string[];
};

export type FeaturePageContent = {
  slug: FeatureSlug;
  publicationStatus: "published" | "draft";
  eyebrow: string;
  h1: string;
  summary: string;
  seo: SeoFields;
  claimIds: readonly ClaimId[];
  media: FeatureMedia;
  atGlance: readonly string[];
  problem: {
    eyebrow: string;
    title: string;
    description: string;
  };
  workflow: readonly WorkflowStep[];
  sections: readonly FeatureSection[];
  supportedFormats: readonly string[];
  formatNote: string;
  faq: readonly MarketingFaq[];
  relatedFeatures: readonly FeatureSlug[];
  insightsHref?: "/blog/understanding-document-redaction";
  availabilityNote?: {
    status: "manual-first" | "configuration-dependent";
    title: string;
    description: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
  };
};

export type FeatureOverviewContent = {
  eyebrow: string;
  h1: string;
  summary: string;
  seo: SeoFields;
  workflow: readonly WorkflowStep[];
  faq: readonly MarketingFaq[];
};

export function validateFeatureContent(
  overview: FeatureOverviewContent,
  pages: readonly FeaturePageContent[],
  claims: CapabilityClaims
): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const h1s = new Set<string>();

  if (overview.seo.canonicalPath !== "/features") {
    errors.push("The features overview canonical must be /features.");
  }

  for (const page of pages) {
    if (page.publicationStatus !== "published") continue;
    if (page.claimIds.length === 0) errors.push(`${page.slug} has no evidence-linked claims.`);
    if (slugs.has(page.slug)) errors.push(`Duplicate feature slug: ${page.slug}`);
    slugs.add(page.slug);
    if (page.seo.canonicalPath !== `/features/${page.slug}`) {
      errors.push(`Canonical does not match ${page.slug}.`);
    }
    if (titles.has(page.seo.title)) errors.push(`Duplicate SEO title: ${page.seo.title}`);
    if (descriptions.has(page.seo.description)) {
      errors.push(`Duplicate SEO description: ${page.slug}`);
    }
    if (h1s.has(page.h1)) errors.push(`Duplicate H1: ${page.h1}`);
    titles.add(page.seo.title);
    descriptions.add(page.seo.description);
    h1s.add(page.h1);

    for (const related of page.relatedFeatures) {
      if (related === page.slug) errors.push(`${page.slug} links to itself.`);
      if (!pages.some((candidate) => candidate.slug === related)) {
        errors.push(`${page.slug} links to unknown feature ${related}.`);
      }
    }

    for (const claimId of page.claimIds) {
      const claim = claims[claimId];
      if (!claim) errors.push(`${page.slug} references unknown claim ${claimId}.`);
      else if (claim.status === "blocked") errors.push(`${page.slug} publishes blocked claim ${claimId}.`);
    }
  }

  return errors;
}

