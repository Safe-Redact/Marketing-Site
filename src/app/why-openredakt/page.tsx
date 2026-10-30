import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { whyOpenRedaktPage } from "@/content/pages";
import { demoHref } from "@/content/navigation";
import { industryHref, liveIndustryPages } from "@/content/industries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeatureVisual } from "@/components/features/FeatureVisual";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { FaqSection } from "@/components/marketing/FaqSection";
import { PageHero } from "@/components/marketing/PageHero";
import { ProofByProcess } from "@/components/marketing/ProofByProcess";
import { SectionIntro } from "@/components/marketing/SectionIntro";
import { StructuredData } from "@/components/marketing/StructuredData";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(whyOpenRedaktPage.seo);

const breadcrumbs = [{ name: "Home", path: "/" as const }, { name: "Why OpenRedakt", path: "/why-openredakt" as const }];

export default function WhyOpenRedaktPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <StructuredData data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <PageHero
          layout="stacked"
          eyebrow={whyOpenRedaktPage.eyebrow}
          title={whyOpenRedaktPage.h1}
          summary={whyOpenRedaktPage.summary}
          primaryCta={{ label: "Request a Demo", href: demoHref }}
          secondaryCta={{ label: "Explore features", href: "/features" }}
          breadcrumbs={<Breadcrumbs items={breadcrumbs} />}
        />

        <ProofByProcess />

        <section className="section-y bg-canvas text-ink" aria-labelledby="why-pillars">
          <Container>
            <SectionIntro id="why-pillars" eyebrow="Positioning" title="What OpenRedakt is built to do well" tone="warm" />
            <ul className="mt-12 grid gap-px overflow-hidden rounded-[16px] border border-border-subtle/50 bg-border-subtle/50 md:grid-cols-2">
              {whyOpenRedaktPage.pillars.map((pillar) => (
                <li key={pillar.title} className="bg-canvas p-6 sm:p-8">
                  <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-border-subtle/70 bg-surface-raised text-accent-ink"><Icon name={pillar.icon} size={17} /></span>
                  <h3 className="type-h3 mt-5">{pillar.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-7 text-ink-muted">{pillar.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="section-y bg-canvas text-ink" aria-labelledby="why-fit">
          <Container>
            <SectionIntro id="why-fit" eyebrow="Fit" title="Where OpenRedakt fits, and where it may not" description="A clear answer here saves an evaluation that was never going to work." />
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[16px] border border-border-subtle/60 bg-surface-raised/40 p-6 sm:p-8">
                <h3 className="type-h3 text-[1.25rem]">A strong fit for</h3>
                <ul className="mt-5 border-t border-border-subtle/60">{whyOpenRedaktPage.fit.map((item) => <li key={item} className="flex gap-3 border-b border-border-subtle/60 py-3.5 text-[0.9375rem] leading-7 text-ink-muted"><Icon name="check-circle" size={17} className="mt-1 shrink-0 text-accent-ink" />{item}</li>)}</ul>
              </div>
              <div className="rounded-[16px] border border-accent-warm/25 bg-accent-warm/[0.06] p-6 sm:p-8">
                <h3 className="type-h3 text-[1.25rem]">Not the right tool if you need</h3>
                <ul className="mt-5 border-t border-accent-warm/15">{whyOpenRedaktPage.notFit.map((item) => <li key={item} className="flex gap-3 border-b border-accent-warm/15 py-3.5 text-[0.9375rem] leading-7 text-ink-muted"><Icon name="info" size={17} className="mt-1 shrink-0 text-accent-ink" />{item}</li>)}</ul>
              </div>
            </div>
          </Container>
        </section>

        <section className="section-y bg-canvas text-ink" aria-labelledby="why-evidence">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
              <SectionIntro id="why-evidence" eyebrow="How we describe the product" title="Every capability here is one the product ships" tone="warm" />
              <div className="lg:pt-9">
                <p className="type-lede">{whyOpenRedaktPage.evidence}</p>
                <p className="mt-6 text-[0.9375rem] leading-7 text-ink-muted">
                  Follow the <Link href="/how-it-works" className="font-semibold text-accent-ink hover:text-accent-ink-hover">six-stage review lifecycle</Link> or compare the <Link href="/features" className="font-semibold text-accent-ink hover:text-accent-ink-hover">document and audio workflows</Link>.
                </p>
              </div>
            </div>
            <figure className="m-0 mt-14">
              <FeatureVisual visual="prj-hub" displayWidth={1160} />
              <figcaption className="type-meta mx-auto mt-4 max-w-2xl text-center leading-5">
                The project library in the current Windows application. Project names, folder paths and file names are blurred.
              </figcaption>
            </figure>
            <div className="mt-14 border-t border-border-subtle/60 pt-8">
              <h3 className="type-h3">See it applied by sector</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {liveIndustryPages.map((page) => (
                  <li key={page.slug}>
                    <Link href={industryHref(page.slug)} className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-border-subtle/70 px-3.5 text-sm text-ink-muted transition-colors hover:border-ink-muted/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none">
                      <Icon name={page.icon} size={15} className="text-accent-ink" />{page.navLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <FaqSection idPrefix="why" items={whyOpenRedaktPage.faq} title="Questions teams ask during evaluation" description="Straight answers about positioning, processing, and how to test fit." />

      </main>
      <Footer />
    </>
  );
}
