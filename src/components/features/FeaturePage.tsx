import React from "react";
import Link from "next/link";
import type { FeaturePageContent } from "@/lib/marketing/content";
import { featureHref, getFeaturePage } from "@/content/features";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/marketing/PageHero";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { demoHref } from "@/content/navigation";
import { ContextualCta } from "@/components/marketing/ContextualCta";
import { FaqSection } from "@/components/marketing/FaqSection";
import { FormatIndustryLinks } from "@/components/industries/IndustryParts";
import type { FeatureSlug } from "@/lib/marketing/content";
import type { MediaFormat } from "@/lib/marketing/industries";
import { FeatureMedia } from "./FeatureMedia";
import { CapabilitySections } from "./CapabilitySections";
import { FormatWorkflow } from "./FormatWorkflow";
import { SupportedFormats } from "./SupportedFormats";

const featureFormat: Record<FeatureSlug, MediaFormat> = {
  "document-redaction": "document",
  "audio-redaction": "audio",
  "video-redaction": "video",
};

export function FeaturePage({ page }: { page: FeaturePageContent }) {
  return (
    <>
      <PageHero
        layout="stacked"
        eyebrow={page.eyebrow}
        title={page.h1}
        summary={page.summary}
        primaryCta={{ label: "Request a Demo", href: demoHref }}
        secondaryCta={{ label: "All features", href: "/features" }}
        breadcrumbs={<Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: page.eyebrow, path: featureHref(page.slug) }]} />}
        media={<FeatureMedia slug={page.slug} media={page.media} />}
      />

      <section aria-label="At a glance" className="bg-canvas pb-6 text-ink">
        <Container>
          <ul className="grid gap-px overflow-hidden rounded-[16px] border border-border-subtle/50 bg-border-subtle/50 sm:grid-cols-3">
            {page.atGlance.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-canvas p-6 text-[0.9375rem] leading-6 text-ink-muted">
                <Icon name="check-circle" size={17} className="mt-0.5 shrink-0 text-accent-warm" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-y bg-canvas text-ink">
        <Container>
          <AnimateOnScroll className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <p className="type-eyebrow">{page.problem.eyebrow}</p>
              <h2 className="type-h2 mt-4 max-w-[20ch]">{page.problem.title}</h2>
            </div>
            <p className="type-lede max-w-2xl lg:pt-9">{page.problem.description}</p>
          </AnimateOnScroll>
        </Container>
      </section>

      <FormatWorkflow steps={page.workflow} title={`From source to reviewed ${page.eyebrow.toLowerCase()} output`} />
      <CapabilitySections page={page} />

      <section className="section-y border-t border-border-subtle/50 bg-canvas text-ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <SupportedFormats formats={page.supportedFormats} note={page.formatNote} />
            <aside className="self-start rounded-[16px] border border-accent-warm/25 bg-accent-warm/[0.06] p-6 sm:p-8">
              <p className="type-eyebrow">Capability boundary</p>
              <h2 className="type-h3 mt-4 text-[1.25rem] leading-7">{page.availabilityNote?.title}</h2>
              <p className="mt-3 text-[0.9375rem] leading-7 text-ink-muted">{page.availabilityNote?.description}</p>
              {page.insightsHref ? (
                <Link href={page.insightsHref} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover motion-reduce:transition-none">
                  Read the document redaction guide
                  <Icon name="arrow" size={16} />
                </Link>
              ) : null}
            </aside>
          </div>
        </Container>
      </section>

      <FaqSection
        idPrefix={page.slug}
        items={page.faq}
        description="Answers reflect the current product boundary, including the tooling and review conditions that matter in a real workflow."
      />

      <section className="section-y-sm border-t border-border-subtle/50 bg-canvas text-ink">
        <Container>
          <p className="type-eyebrow">Continue exploring</p>
          <div className="mt-6 grid gap-px overflow-hidden rounded-[16px] border border-border-subtle/50 bg-border-subtle/50 sm:grid-cols-2">
            {page.relatedFeatures.map((slug) => {
              const related = getFeaturePage(slug)!;
              return (
                <Link key={slug} href={featureHref(slug)} className="group bg-canvas p-6 transition-colors hover:bg-surface-raised/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cool motion-reduce:transition-none sm:p-8">
                  <p className="type-meta">{related.eyebrow}</p>
                  <h2 className="type-h3 mt-3 text-[1.25rem] leading-7">{related.h1}</h2>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-warm">
                    Explore workflow
                    <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-12">
            <FormatIndustryLinks format={featureFormat[page.slug]} title={`Industries that rely on ${page.eyebrow.toLowerCase()}`} />
          </div>
        </Container>
      </section>

      <ContextualCta eyebrow={page.cta.eyebrow} title={page.cta.title} description={page.cta.description} />
    </>
  );
}
