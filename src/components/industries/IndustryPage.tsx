import React, { type ReactNode } from "react";
import Link from "next/link";
import type { IndustryLayout, IndustryPageContent, MediaFormat } from "@/lib/marketing/industries";
import { featureHref, getFeaturePage } from "@/content/features";
import { getIndustryPage, industryHref, liveIndustryPages } from "@/content/industries";
import { demoHref } from "@/content/navigation";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { FaqSection } from "@/components/marketing/FaqSection";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionIntro } from "@/components/marketing/SectionIntro";
import { FeatureVisual, type FeatureVisualId } from "@/components/features/FeatureVisual";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";
import { CapabilityList, FormatBadge, IndustrySignal, featureIcons, featureLinkFor } from "./IndustryParts";

type SectionKey = "sensitive" | "challenges" | "workflows";

/**
 * Section order is the controlled variation between industry pages: records-led
 * sectors start with what is sensitive, media-led sectors start with the workflow.
 */
const sectionOrder: Record<IndustryLayout, readonly SectionKey[]> = {
  "records-led": ["sensitive", "challenges", "workflows"],
  "media-led": ["workflows", "challenges", "sensitive"],
  mixed: ["challenges", "sensitive", "workflows"],
};

/**
 * Workflow visuals by format, rotated by the page's position among the live guides, so
 * neighbouring guides do not repeat the same capture; a page with two workflows in one
 * format shows two different ones.
 */
const workflowVisuals: Record<MediaFormat, readonly FeatureVisualId[]> = {
  document: ["doc-files-light", "doc-manual-light", "doc-tools-light"],
  audio: ["aud-workspace-story", "aud-effects-panel", "aud-export"],
};

export function industryBreadcrumbs(page: IndustryPageContent): BreadcrumbItem[] {
  return [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: page.navLabel, path: industryHref(page.slug) },
  ];
}

export function IndustryPage({ page }: { page: IndustryPageContent }) {
  const primaryFeature = featureLinkFor(page.mediaEmphasis[0]);
  const sections: Record<SectionKey, ReactNode> = {
    sensitive: <SensitiveSection key="sensitive" page={page} />,
    challenges: <ChallengesSection key="challenges" page={page} />,
    workflows: <WorkflowsSection key="workflows" page={page} />,
  };

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.h1}
        summary={page.summary}
        primaryCta={{ label: "Request a Demo", href: demoHref }}
        secondaryCta={primaryFeature ? { label: `Explore ${primaryFeature.label.toLowerCase()}`, href: primaryFeature.href } : { label: "All features", href: "/features" }}
        breadcrumbs={<Breadcrumbs items={industryBreadcrumbs(page)} />}
        media={<IndustrySignal page={page} />}
      />

      <section className="section-y-sm bg-canvas text-ink" aria-labelledby={`${page.slug}-audience`}>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <SectionIntro id={`${page.slug}-audience`} eyebrow="Who this is for" title={page.audience.title} description={page.audience.description} tone="warm" />
            <ul className="grid content-start border-t border-border-subtle/60 sm:grid-cols-2 sm:gap-x-8 lg:mt-10">
              {page.audience.roles.map((role) => (
                <li key={role} className="flex gap-3 border-b border-border-subtle/60 py-3.5 text-[0.9375rem] leading-6 text-ink-muted">
                  <Icon name="users" size={17} className="mt-0.5 shrink-0 text-accent-ink" />
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {sectionOrder[page.layout].map((key) => sections[key])}

      <section className="section-y-sm bg-canvas text-ink" aria-labelledby={`${page.slug}-considerations`}>
        <Container>
          <div className="rounded-[16px] border border-accent-warm/25 bg-accent-warm/[0.06] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
              <SectionIntro id={`${page.slug}-considerations`} eyebrow="Capability boundaries" title="Considerations before you evaluate" tone="warm" />
              <ul className="border-t border-accent-warm/15">
                {page.considerations.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-accent-warm/15 py-4 text-[0.9375rem] leading-7 text-ink-muted">
                    <Icon name="info" size={17} className="mt-1 shrink-0 text-accent-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <RelatedSection page={page} />

      <FaqSection idPrefix={page.slug} items={page.faq} title={`${page.navLabel} redaction questions`} description="Answers reflect the current product boundary, including the configuration and review conditions that matter in practice." />

    </>
  );
}

function SensitiveSection({ page }: { page: IndustryPageContent }) {
  return (
    <section className="section-y bg-canvas text-ink" aria-labelledby={`${page.slug}-sensitive`}>
      <Container>
        <SectionIntro id={`${page.slug}-sensitive`} eyebrow="Sensitive information" title={`What ${page.navLabel.toLowerCase()} teams commonly need to protect`} />
        <ul className="mt-12 grid border-t border-border-subtle/60 sm:grid-cols-2 xl:grid-cols-4">
          {page.sensitiveInformation.map((item) => (
            <li key={item.label} className="relative border-b border-border-subtle/60 py-7 sm:pr-8">
              <span aria-hidden="true" className="absolute -top-px left-0 h-px w-12 bg-accent-warm" />
              <h3 className="type-h3">{item.label}</h3>
              <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">{item.examples}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function ChallengesSection({ page }: { page: IndustryPageContent }) {
  return (
    <section className="section-y bg-canvas text-ink" aria-labelledby={`${page.slug}-challenges`}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionIntro id={`${page.slug}-challenges`} eyebrow="Practical challenges" title="Why redaction is harder than it looks here" tone="cool" className="lg:sticky lg:top-28 lg:self-start" />
          <ol className="border-t border-border-subtle/60">
            {page.challenges.map((item, index) => (
              <li key={item.title} className="grid grid-cols-[auto_1fr] gap-5 border-b border-border-subtle/60 py-7">
                <span className="type-meta pt-1 text-accent-ink">0{index + 1}</span>
                <div>
                  <h3 className="type-h3">{item.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-7 text-ink-muted">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function WorkflowsSection({ page }: { page: IndustryPageContent }) {
  const seen: Partial<Record<MediaFormat, number>> = {};
  const pageIndex = Math.max(0, liveIndustryPages.findIndex((live) => live.slug === page.slug));
  return (
    <section className="section-y bg-canvas text-ink" aria-labelledby={`${page.slug}-workflows`}>
      <Container>
        <SectionIntro id={`${page.slug}-workflows`} eyebrow="Relevant workflows" title={`How OpenRedakt supports ${page.navLabel.toLowerCase()} workflows`} description="Each workflow lists the capabilities that apply, with the conditions that affect them in practice." tone="warm" />
        <div className="mt-8">
          {page.workflows.map((workflow, index) => {
            const feature = featureLinkFor(workflow.format);
            const occurrence = seen[workflow.format] ?? 0;
            seen[workflow.format] = occurrence + 1;
            const options = workflowVisuals[workflow.format];
            return (
              <article key={workflow.title} className="grid gap-8 py-12 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
                <div className="min-w-0">
                  <FormatBadge format={workflow.format} primary={index === 0} />
                  <h3 className="type-h2 mt-4 max-w-[24ch] text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)]">{workflow.title}</h3>
                  <p className="type-body mt-4 max-w-xl">{workflow.description}</p>
                  <p className="type-meta mb-3 mt-8">Supported capabilities</p>
                  <CapabilityList claimIds={workflow.claimIds} />
                  {feature ? (
                    <Link href={feature.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover motion-reduce:transition-none">
                      {feature.label} workflow
                      <Icon name="arrow" size={16} />
                    </Link>
                  ) : null}
                </div>
                <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                  <FeatureVisual visual={options[(pageIndex + occurrence) % options.length]} displayWidth={520} />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function RelatedSection({ page }: { page: IndustryPageContent }) {
  const industries = page.relatedIndustries.map((slug) => getIndustryPage(slug)).filter((item): item is IndustryPageContent => Boolean(item));
  const linkClass = "inline-flex min-h-10 items-center gap-2.5 text-[0.9375rem] text-ink-muted transition-colors hover:text-ink motion-reduce:transition-none";
  return (
    <section className="section-y bg-canvas text-ink" aria-labelledby={`${page.slug}-related`}>
      <Container>
        <SectionIntro id={`${page.slug}-related`} eyebrow="Continue exploring" title="Related workflows, sectors, and guides" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-[16px] border border-border-subtle/50 bg-border-subtle/50 lg:grid-cols-3">
          <div className="bg-canvas p-6 sm:p-7">
            <h3 className="type-meta">Feature workflows</h3>
            <ul className="mt-4 space-y-1">
              {page.relatedFeatures.map((slug) => {
                const feature = getFeaturePage(slug);
                return feature ? <li key={slug}><Link href={featureHref(slug)} className={linkClass}><Icon name={featureIcons[slug]} size={16} className="text-accent-ink" />{feature.eyebrow}</Link></li> : null;
              })}
              <li><Link href="/how-it-works" className={linkClass}><Icon name="layers" size={16} className="text-accent-ink" />How the review lifecycle works</Link></li>
            </ul>
          </div>
          <div className="bg-canvas p-6 sm:p-7">
            <h3 className="type-meta">Related industries</h3>
            <ul className="mt-4 space-y-1">
              {industries.map((item) => <li key={item.slug}><Link href={industryHref(item.slug)} className={linkClass}><Icon name={item.icon} size={16} className="text-accent-ink" />{item.navLabel}</Link></li>)}
              <li><Link href="/industries" className={linkClass}><Icon name="arrow" size={16} className="text-accent-ink" />All industries</Link></li>
            </ul>
          </div>
          <div className="bg-canvas p-6 sm:p-7">
            <h3 className="type-meta">From the blog</h3>
            {page.relatedInsights.length > 0 ? (
              <ul className="mt-4 space-y-1">
                {page.relatedInsights.map((insight) => <li key={insight.href}><Link href={insight.href} className={linkClass}><Icon name="file-text" size={16} className="text-accent-ink" />{insight.title}</Link></li>)}
              </ul>
            ) : (
              <p className="mt-4 text-[0.9375rem] leading-6 text-ink-muted">Sector guides are in preparation. Browse the <Link href="/blog" className="font-semibold text-accent-ink hover:text-accent-ink-hover">blog</Link> for current articles.</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
