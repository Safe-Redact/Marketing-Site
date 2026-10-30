import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { bookDemoPage } from "@/content/pages";
import { pricingPackages, type PricingPackageSlug } from "@/content/pricing";
import { publicSupportEmail } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { StructuredData } from "@/components/marketing/StructuredData";
import { DemoEnquiry } from "@/components/sections/FinalCta";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(bookDemoPage.seo);

const breadcrumbs = [{ name: "Home", path: "/" as const }, { name: "Book a demo", path: "/book-a-demo" as const }];

type BookDemoPageProps = {
  searchParams: Promise<{ package?: string | string[] }>;
};

/**
 * Book a demo: the explanation on the left and the shared enquiry form in a panel on the
 * right, over one soft coral atmosphere. The page H1 names the form, so the panel variant
 * renders without its own heading. A known ?package= value preselects the package.
 */
export default async function BookDemoPage({ searchParams }: BookDemoPageProps) {
  const parameters = await searchParams;
  const requestedPackage = Array.isArray(parameters.package) ? parameters.package[0] : parameters.package;
  const initialPackage = pricingPackages.some((plan) => plan.slug === requestedPackage)
    ? (requestedPackage as PricingPackageSlug)
    : "";

  return (
    <>
      <Header />
      <main id="main-content" className="demo-atmosphere text-ink">
        <StructuredData data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <Container className="pb-20 pt-[7.5rem] sm:pb-24 sm:pt-[8.5rem] lg:pb-28 lg:pt-[9.5rem]">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-24">
            <div className="lg:pt-4">
              <p className="type-eyebrow">{bookDemoPage.eyebrow}</p>
              <h1 id="demo-enquiry-heading" className="mt-4 max-w-[16ch] font-heading text-[clamp(2.25rem,1.6rem+2.2vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.04em] text-balance">
                {bookDemoPage.h1}
              </h1>
              <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-7 text-ink-muted">{bookDemoPage.summary}</p>
              <ul className="mt-9 space-y-4">
                {bookDemoPage.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[0.9375rem] leading-6 text-ink">
                    <Icon name="check-circle" size={18} className="mt-0.5 shrink-0 text-accent-ink" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-9 max-w-[34rem] text-sm leading-6 text-ink-muted">
                {bookDemoPage.nextStep} Compare packages on the <Link href="/pricing" className="font-medium text-accent-ink hover:text-accent-ink-hover">pricing page</Link>, or email{" "}
                <a href={`mailto:${publicSupportEmail}`} className="font-medium text-accent-ink hover:text-accent-ink-hover">{publicSupportEmail}</a>.
              </p>
            </div>
            <DemoEnquiry variant="panel" initialPackage={initialPackage} />
          </div>
        </Container>
      </main>
      <Footer invitation={false} />
    </>
  );
}
