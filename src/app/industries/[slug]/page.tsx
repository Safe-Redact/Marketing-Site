import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndustryPage, liveIndustryPages } from "@/content/industries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IndustryPage, industryBreadcrumbs } from "@/components/industries/IndustryPage";
import { StructuredData } from "@/components/marketing/StructuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

interface IndustryRouteProps { params: Promise<{ slug: string }> }

export const dynamic = "force-dynamic";

// Draft industries are never generated; requesting one falls through to notFound().
export function generateStaticParams() {
  return liveIndustryPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: IndustryRouteProps): Promise<Metadata> {
  const page = getIndustryPage((await params).slug);
  return page ? buildPageMetadata(page.seo) : {};
}

export default async function IndustryRoute({ params }: IndustryRouteProps) {
  const page = getIndustryPage((await params).slug);
  if (!page) notFound();
  return (
    <>
      <Header />
      <main id="main-content">
        <StructuredData data={buildBreadcrumbJsonLd(industryBreadcrumbs(page))} />
        <IndustryPage page={page} />
      </main>
      <Footer />
    </>
  );
}
