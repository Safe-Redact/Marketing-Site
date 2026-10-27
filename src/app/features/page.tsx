import React from "react";
import type { Metadata } from "next";
import { featureOverview } from "@/content/features";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { demoHref } from "@/content/navigation";
import { ContextualCta } from "@/components/marketing/ContextualCta";
import { PageHero } from "@/components/marketing/PageHero";
import { ProofByProcess } from "@/components/marketing/ProofByProcess";
import { StructuredData } from "@/components/marketing/StructuredData";
import { FeatureOverviewGrid } from "@/components/features/FeatureOverviewGrid";
import { FormatWorkflow } from "@/components/features/FormatWorkflow";
import { FeatureVisual } from "@/components/features/FeatureVisual";
import { FaqSection } from "@/components/marketing/FaqSection";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: featureOverview.seo.title,
  description: featureOverview.seo.description,
  alternates: { canonical: featureOverview.seo.canonicalPath },
  openGraph: { title: featureOverview.seo.title, description: featureOverview.seo.description, url: featureOverview.seo.canonicalPath },
  twitter: { card: "summary", title: featureOverview.seo.title, description: featureOverview.seo.description },
};

export default function FeaturesPage() {
  const breadcrumbs = [{ name: "Home", path: "/" as const }, { name: "Features", path: "/features" as const }];
  return (
    <>
      <Header />
      <main id="main-content">
        <StructuredData data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <PageHero layout="stacked" eyebrow={featureOverview.eyebrow} title={featureOverview.h1} summary={featureOverview.summary} primaryCta={{ label: "Request a Demo", href: demoHref }} secondaryCta={{ label: "See the workflow", href: "#feature-workflow" }} breadcrumbs={<Breadcrumbs items={breadcrumbs} />} media={<FormatTriptych />} />
        <ProofByProcess />
        <FeatureOverviewGrid />
        <div id="feature-workflow" data-scroll-target><FormatWorkflow steps={featureOverview.workflow} /></div>
        <FaqSection idPrefix="features" items={featureOverview.faq} title="Understand the operating boundaries" description="OpenRedakt is evaluated against representative files and configured tooling, not universal promises." />
        <ContextualCta eyebrow="Workflow evaluation" title="See how the formats fit your review process." description="Bring representative documents, recordings, or owned footage to a guided conversation about preparation, review, export, and output inspection." />
      </main>
      <Footer />
    </>
  );
}

/** One review surface per format: the approved document capture beside two labelled diagrams. */
function FormatTriptych() {
  const formats = [
    { label: "Documents & images", visual: "doc-closeup" },
    { label: "Audio", visual: "aud-transcript" },
    { label: "Video", visual: "vid-region" },
  ] as const;
  return (
    <div className="grid gap-5 md:grid-cols-3 md:gap-4">
      {formats.map((format, index) => (
        <figure key={format.label} className="m-0 min-w-0">
          <FeatureVisual visual={format.visual} displayWidth={360} priority={index === 0} diagramRatio="4 / 3" />
          <figcaption className="type-meta mt-3 flex items-center gap-2">
            <span className="text-accent-warm">0{index + 1}</span>
            {format.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
