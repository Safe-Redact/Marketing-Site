import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { contactPage } from "@/content/pages";
import { publicSupportEmail } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { PageHero } from "@/components/marketing/PageHero";
import { StructuredData } from "@/components/marketing/StructuredData";
import { DemoEnquiry } from "@/components/sections/FinalCta";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(contactPage.seo);

const breadcrumbs = [{ name: "Home", path: "/" as const }, { name: "Contact", path: "/contact" as const }];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <StructuredData data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <PageHero
          layout="stacked"
          eyebrow={contactPage.eyebrow}
          title={contactPage.h1}
          summary={contactPage.summary}
          primaryCta={{ label: "Go to the enquiry form", href: "#demo-enquiry" }}
          secondaryCta={{ label: "Email the team", href: `mailto:${publicSupportEmail}` }}
          breadcrumbs={<Breadcrumbs items={breadcrumbs} />}
        />

        <section className="section-y-sm bg-canvas text-ink" aria-labelledby="contact-include">
          <Container>
            <p className="type-eyebrow">Before the demo</p>
            <h2 id="contact-include" className="type-h2 mt-4 max-w-[24ch] text-[clamp(1.5rem,1.25rem+0.9vw,2rem)]">What helps us prepare a useful demo</h2>
            <ul className="mt-10 grid border-t border-border-subtle/60 md:grid-cols-3">
              {contactPage.include.map((item, index) => (
                <li key={item.title} className="relative border-b border-border-subtle/60 py-7 md:border-b-0 md:pr-8">
                  <span aria-hidden="true" className="absolute -top-px left-0 h-px w-12 bg-accent-warm" />
                  <span className="type-meta text-accent-ink">0{index + 1}</span>
                  <h3 className="type-h3 mt-3">{item.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">{item.description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-3xl text-[0.9375rem] leading-7 text-ink-muted">
              Describe your files in general terms, and please do not paste sensitive content into the form. Before the demo, you can review the <Link href="/features" className="font-semibold text-accent-ink hover:text-accent-ink-hover">feature workflows</Link> or the <Link href="/industries" className="font-semibold text-accent-ink hover:text-accent-ink-hover">industry guides</Link>.
            </p>
          </Container>
        </section>

        <section className="section-y relative isolate overflow-hidden bg-canvas text-ink">
          <div aria-hidden="true" className="closing-glow pointer-events-none absolute inset-0 -z-10" />
          <Container>
            <DemoEnquiry />
          </Container>
        </section>
      </main>
      <Footer invitation={false} />
    </>
  );
}
