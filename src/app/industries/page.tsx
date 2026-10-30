import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { industryGroups, liveIndustryPages } from "@/content/industries";
import { industriesHub } from "@/content/pages";
import { demoHref } from "@/content/navigation";
import { featureHref, getFeaturePage } from "@/content/features";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { FaqSection } from "@/components/marketing/FaqSection";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionIntro } from "@/components/marketing/SectionIntro";
import { StructuredData } from "@/components/marketing/StructuredData";
import { IndustryCard, formatMeta, industriesForFormat } from "@/components/industries/IndustryParts";
import { FeatureVisual, type FeatureVisualId } from "@/components/features/FeatureVisual";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { formatFeature, type MediaFormat } from "@/lib/marketing/industries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(industriesHub.seo);

const breadcrumbs = [{ name: "Home", path: "/" as const }, { name: "Industries", path: "/industries" as const }];
const formats: readonly MediaFormat[] = ["document", "audio"];
const formatVisuals: Record<MediaFormat, FeatureVisualId> = { document: "doc-files-light", audio: "aud-effects-panel" };

export default function IndustriesPage() {
  const groups = industryGroups
    .map((group) => ({ ...group, pages: liveIndustryPages.filter((page) => page.group === group.id) }))
    .filter((group) => group.pages.length > 0);

  return (
    <>
      <Header />
      <main id="main-content">
        <StructuredData data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <PageHero
          eyebrow={industriesHub.eyebrow}
          title={industriesHub.h1}
          summary={industriesHub.summary}
          primaryCta={{ label: "Request a Demo", href: demoHref }}
          secondaryCta={{ label: "Browse the directory", href: "#industry-directory" }}
          breadcrumbs={<Breadcrumbs items={breadcrumbs} />}
          media={<DirectorySignal groups={groups} />}
        />

        <section className="section-y bg-canvas text-ink" aria-labelledby="industry-variation">
          <Container>
            <SectionIntro id="industry-variation" eyebrow="Why sectors differ" title="How redaction needs vary from one sector to the next" description="The software workflow stays the same. What changes is what you protect, who receives the record, which media carry it, and how decisions will be scrutinised." tone="warm" />
            <ol className="mt-12 grid border-t border-border-subtle/60 md:grid-cols-2 xl:grid-cols-4">
              {industriesHub.dimensions.map((item, index) => (
                <li key={item.title} className="relative border-b border-border-subtle/60 py-7 md:pr-8 xl:border-b-0">
                  <span aria-hidden="true" className="absolute -top-px left-0 h-px w-12 bg-accent-warm" />
                  <span className="type-meta text-accent-ink">0{index + 1}</span>
                  <h3 className="type-h3 mt-3">{item.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">{item.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section id="industry-directory" data-scroll-target className="section-y bg-canvas text-ink" aria-labelledby="industry-directory-heading">
          <Container>
            <SectionIntro id="industry-directory-heading" eyebrow="Industry directory" title="Find the guide for your records" description="Each guide covers the people a sector protects, the records and media involved, the practical challenges, and the OpenRedakt capabilities that apply." />
            <div className="mt-14 space-y-16">
              {groups.map((group) => (
                <div key={group.id} aria-labelledby={`group-${group.id}`} role="group">
                  <div className="border-b border-border-subtle/60 pb-4">
                    <h3 id={`group-${group.id}`} className="type-h3 text-[1.25rem]">{group.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-[0.9375rem] leading-6 text-ink-muted">{group.description}</p>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {group.pages.map((page) => <IndustryCard key={page.slug} page={page} headingLevel={4} />)}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="section-y bg-canvas text-ink" aria-labelledby="industry-formats">
          <Container>
            <SectionIntro id="industry-formats" eyebrow="By media" title="Match the workflow to the media your sector relies on" tone="warm" />
            <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-6">
              {formats.map((format) => {
                const feature = getFeaturePage(formatFeature[format]);
                const covered = industriesForFormat(format);
                const leading = covered.filter((page) => page.mediaEmphasis[0] === format);
                if (!feature) return null;
                return (
                  <article key={format} className="flex min-w-0 flex-col">
                    <FeatureVisual visual={formatVisuals[format]} displayWidth={400} diagramRatio="4 / 3" />
                    <span className="type-meta mt-6 inline-flex items-center gap-2"><Icon name={formatMeta[format].icon} size={15} className="text-accent-ink" />{formatMeta[format].label}</span>
                    <h3 className="type-h3 mt-3 text-[1.125rem] leading-7">{feature.h1}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">
                      {covered.length} industry guides include a {formatMeta[format].label.toLowerCase()} workflow
                      {leading.length > 0 ? <>; it is the primary format for {joinNames(leading.map((page) => page.navLabel))}.</> : "."}
                    </p>
                    <Link href={featureHref(feature.slug)} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover motion-reduce:transition-none">
                      Explore {feature.eyebrow.toLowerCase()}<Icon name="arrow" size={16} />
                    </Link>
                  </article>
                );
              })}
            </div>
            <p className="mt-12 border-t border-border-subtle/60 pt-6 text-[0.9375rem] leading-7 text-ink-muted">
              New to the process? Read <Link href="/how-it-works" className="font-semibold text-accent-ink hover:text-accent-ink-hover">how redaction review works</Link> or <Link href="/why-openredakt" className="font-semibold text-accent-ink hover:text-accent-ink-hover">why teams evaluate OpenRedakt</Link>.
            </p>
          </Container>
        </section>

        <FaqSection idPrefix="industries" items={industriesHub.faq} title="Questions about industry guides" description="How the guides relate to the product, and what they do not claim." />

      </main>
      <Footer />
    </>
  );
}

function joinNames(names: readonly string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function DirectorySignal({ groups }: { groups: readonly { id: string; title: string; pages: readonly { slug: string; navLabel: string; icon: string }[] }[] }) {
  return (
    <div className="media-frame media-glow">
      <div className="rounded-[0.7rem] bg-surface-raised p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-border-subtle/60 pb-4">
          <span className="text-sm font-semibold text-ink">Industry guides</span>
          <span className="type-meta">{groups.reduce((total, group) => total + group.pages.length, 0)} published</span>
        </div>
        <ul className="divide-y divide-border-subtle/50">
          {groups.map((group) => (
            <li key={group.id} className="py-4">
              <p className="type-meta">{group.title}</p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {group.pages.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/industries/${page.slug}`} className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-border-subtle/70 bg-canvas/60 px-3 text-sm text-ink-muted transition-colors hover:border-ink-muted/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none">
                      <Icon name={page.icon} size={14} className="text-accent-ink" />
                      {page.navLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
