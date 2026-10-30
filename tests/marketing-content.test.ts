import assert from "node:assert/strict";
import test from "node:test";
import {
  capabilityClaims,
  featureOverview,
  featurePages,
  getFeaturePage,
} from "../src/content/features";
import { validateFeatureContent } from "../src/lib/marketing/content";

// Product scope: document and audio redaction are the marketed workflows.
const approvedSlugs = [
  "document-redaction",
  "audio-redaction",
] as const;

test("the feature registry exposes only the approved, uniquely targeted routes", () => {
  assert.deepEqual(featurePages.map((page) => page.slug), approvedSlugs);
  assert.ok(featurePages.every((page) => page.publicationStatus === "published"));
  assert.deepEqual(
    featurePages.map((page) => page.seo.canonicalPath),
    approvedSlugs.map((slug) => `/features/${slug}`)
  );
  assert.equal(new Set(featurePages.map((page) => page.h1)).size, featurePages.length);
  assert.equal(new Set(featurePages.map((page) => page.seo.title)).size, featurePages.length);
  assert.equal(new Set(featurePages.map((page) => page.seo.description)).size, featurePages.length);
  assert.equal(getFeaturePage("not-an-approved-feature"), undefined);
  assert.equal(getFeaturePage("document-redaction")?.slug, "document-redaction");
});

test("feature metadata and cross-links satisfy the public content contract", () => {
  assert.deepEqual(validateFeatureContent(featureOverview, featurePages, capabilityClaims), []);

  for (const page of featurePages) {
    assert.ok(page.seo.title.length >= 35 && page.seo.title.length <= 65, page.seo.title);
    assert.ok(
      page.seo.description.length >= 120 && page.seo.description.length <= 165,
      page.seo.description
    );
    assert.ok(page.faq.length >= 4);
    assert.ok(page.workflow.length >= 3);
    assert.ok(page.relatedFeatures.length === 1);
    if (page.insightsHref) assert.equal(page.insightsHref, "/blog/understanding-document-redaction");
  }
  assert.equal(getFeaturePage("document-redaction")?.insightsHref, "/blog/understanding-document-redaction");
  assert.equal(getFeaturePage("audio-redaction")?.insightsHref, undefined);
  assert.equal(getFeaturePage("video-redaction"), undefined);
});

test("public feature claims are evidence-linked and never use blocked proof", () => {
  const publishedCopy = JSON.stringify({ featureOverview, featurePages });
  assert.doesNotMatch(
    publishedCopy,
    /SOC\s?2|HIPAA|CJIS|GDPR|FERPA|customer logos?|testimonial|time savings|accuracy rate|irreversible export|perfect sync|real[- ]time tracking|live redaction|free trial|sign in|log in/i
  );

  for (const page of featurePages) {
    for (const claimId of page.claimIds) {
      const claim = capabilityClaims[claimId];
      assert.ok(claim, `${page.slug} references unknown claim ${claimId}`);
      assert.notEqual(claim.status, "blocked", `${claimId} cannot be published`);
    }
  }
});

test("audio marketing stays inside the verified capability envelope and video is not marketed", () => {
  const audio = getFeaturePage("audio-redaction");
  assert.ok(audio);

  assert.equal(audio.availabilityNote?.status, "manual-first");
  assert.match(JSON.stringify(audio), /manual-first/i);
  assert.match(JSON.stringify(audio), /automated transcript analysis is not presented as a complete/i);
  assert.doesNotMatch(JSON.stringify(audio), /perfect synchronization/i);
  assert.match(JSON.stringify(audio), /manual timeline/i);

  // Video and standalone image redaction are not marketed (pricing and product scope).
  assert.equal(getFeaturePage("video-redaction"), undefined);
  assert.doesNotMatch(JSON.stringify({ featureOverview, featurePages }), /\bvideo\b|format-video\.png|PNG \/ JPG/i);
});

