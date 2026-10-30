import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { howItWorksPage } from "@/content/pages";
import { demoHref } from "@/content/navigation";
import { featureHref, publishedFeaturePages } from "@/content/features";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { FaqSection } from "@/components/marketing/FaqSection";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionIntro } from "@/components/marketing/SectionIntro";
import { StructuredData } from "@/components/marketing/StructuredData";
import { featureIcons, formatMeta } from "@/components/industries/IndustryParts";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { FeatureVisual } from "@/components/features/FeatureVisual";
import type { MediaFormat } from "@/lib/marketing/industries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(howItWorksPage.seo);

const breadcrumbs = [{ name: "Home", path: "/" as const }, { name: "How It Works", path: "/how-it-works" as const }];
const formats: readonly MediaFormat[] = ["document", "audio"];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <StructuredData data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <PageHero
          eyebrow={howItWorksPage.eyebrow}
          title={howItWorksPage.h1}
          summary={howItWorksPage.summary}
          primaryCta={{ label: "Request a Demo", href: demoHref }}
          secondaryCta={{ label: "See the six stages", href: "#review-lifecycle" }}
          breadcrumbs={<Breadcrumbs items={breadcrumbs} />}
          media={<LifecycleSignal />}
        />

        <section id="review-lifecycle" data-scroll-target className="section-y bg-canvas text-ink" aria-labelledby="review-lifecycle-heading">
          <Container>
            <SectionIntro id="review-lifecycle-heading" eyebrow="The review lifecycle" title="Six stages, the same for every format" description="The stages do not change between a scanned bundle, a recorded interview, and a dashcam clip. The tools inside each stage do." tone="warm" />
            <StageTriptych />
            <ol className="mt-16 border-t border-border-subtle/60">
              {howItWorksPage.stages.map((stage, index) => (
                <li key={stage.id} id={`stage-${stage.id}`} data-scroll-target className="grid gap-6 border-b border-border-subtle/60 py-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:gap-12">
                  <div>
                    <span className="type-meta text-accent-ink">0{index + 1}</span>
                    <h3 className="type-h2 mt-3 text-[clamp(1.375rem,1.2rem+0.6vw,1.625rem)]">{stage.title}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-7 text-ink-muted">{stage.summary}</p>
                  </div>
                  <dl className="grid gap-px overflow-hidden rounded-[14px] border border-border-subtle/50 bg-border-subtle/50 md:grid-cols-3">
                    {formats.map((format) => (
                      <div key={format} className="bg-canvas p-5">
                        <dt className="type-meta inline-flex items-center gap-2 text-ink"><Icon name={formatMeta[format].icon} size={15} className="text-accent-ink" />{formatMeta[format].label}</dt>
                        <dd className="mt-3 text-[0.9375rem] leading-6 text-ink-muted">{stage.formats[format]}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="section-y bg-canvas text-ink" aria-labelledby="responsibility-heading">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionIntro id="responsibility-heading" eyebrow="Human review" title="What the reviewer stays responsible for" tone="warm" />
                <ul className="mt-8 border-t border-border-subtle/60">
                  {howItWorksPage.responsibilities.map((item) => <li key={item} className="flex gap-3 border-b border-border-subtle/60 py-4 text-[0.9375rem] leading-7 text-ink-muted"><Icon name="check-circle" size={17} className="mt-1 shrink-0 text-accent-ink" />{item}</li>)}
                </ul>
              </div>
              <aside className="self-start rounded-[16px] border border-accent-warm/25 bg-accent-warm/[0.06] p-6 sm:p-8">
                <p className="type-eyebrow">Boundaries</p>
                <h2 className="type-h3 mt-4 text-[1.375rem] leading-8">What the software does not do</h2>
                <ul className="mt-5 border-t border-accent-warm/15">
                  {howItWorksPage.boundaries.map((item) => <li key={item} className="flex gap-3 border-b border-accent-warm/15 py-4 text-[0.9375rem] leading-7 text-ink-muted"><Icon name="info" size={17} className="mt-1 shrink-0 text-accent-ink" />{item}</li>)}
                </ul>
              </aside>
            </div>
          </Container>
        </section>

        <section className="section-y bg-canvas text-ink" aria-labelledby="format-detail-heading">
          <Container>
            <SectionIntro id="format-detail-heading" eyebrow="Format detail" title="Go deeper into each workflow" description="Each feature page covers supported formats, review controls, and the configuration each workflow depends on." />
            <ul className="mt-12 grid gap-px overflow-hidden rounded-[16px] border border-border-subtle/50 bg-border-subtle/50 md:grid-cols-3">
              {publishedFeaturePages.map((page) => (
                <li key={page.slug} className="bg-canvas">
                  <Link href={featureHref(page.slug)} className="group flex h-full flex-col p-6 transition-colors hover:bg-surface-raised/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cool motion-reduce:transition-none sm:p-7">
                    <Icon name={featureIcons[page.slug]} size={20} className="text-accent-ink" />
                    <span className="type-h3 mt-4">{page.eyebrow}</span>
                    <span className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">{page.atGlance[0]}</span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent-ink">Explore workflow<Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" /></span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-10 border-t border-border-subtle/60 pt-6 text-[0.9375rem] leading-7 text-ink-muted">
              See how the lifecycle applies to your sector in the <Link href="/industries" className="font-semibold text-accent-ink hover:text-accent-ink-hover">industry guides</Link>, or read <Link href="/blog/understanding-document-redaction" className="font-semibold text-accent-ink hover:text-accent-ink-hover">why visual hiding is not the same as redaction</Link>.
            </p>
          </Container>
        </section>

        <FaqSection idPrefix="how-it-works" items={howItWorksPage.faq} title="Questions about the workflow" description="How the stages behave in practice and where configuration changes what is available." />

      </main>
      <Footer />
    </>
  );
}

/** Three of the six stages illustrated with the application itself. */
function StageTriptych() {
  const items = [
    { stages: "01–02", label: "Organise and open projects", visual: <FeatureVisual visual="prj-hub-four-three" displayWidth={400} /> },
    { stages: "03–04", label: "Review and mark", visual: <FeatureVisual visual="doc-manual-light" displayWidth={400} /> },
    // The capture shows export settings only; stage 06 (inspecting the output) is described below.
    { stages: "05–06", label: "Export a redacted copy", visual: <FeatureVisual visual="aud-export" displayWidth={400} /> },
  ];
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-5">
      {items.map((item) => (
        <figure key={item.label} className="m-0 min-w-0">
          {item.visual}
          <figcaption className="type-meta mt-3 flex items-center gap-2">
            <span className="text-accent-ink">{item.stages}</span>
            {item.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function LifecycleSignal() {
  return (
    <div className="media-frame media-glow">
      <div className="rounded-[0.7rem] bg-surface-raised p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-border-subtle/60 pb-4">
          <span className="text-sm font-semibold text-ink">Review lifecycle</span>
          <span className="type-meta">Every format</span>
        </div>
        <ol className="divide-y divide-border-subtle/50">
          {howItWorksPage.stages.map((stage, index) => (
            <li key={stage.id}>
              <a href={`#stage-${stage.id}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3.5 text-sm font-semibold text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cool motion-reduce:transition-none">
                <span className="type-meta w-6 text-accent-ink">0{index + 1}</span>
                <span>{stage.title}</span>
                <Icon name="arrow" size={15} className="opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
