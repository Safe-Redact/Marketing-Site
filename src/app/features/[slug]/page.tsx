import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { featureHref, getFeaturePage, publishedFeaturePages } from "@/content/features";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeaturePage } from "@/components/features/FeaturePage";
import { StructuredData } from "@/components/marketing/StructuredData";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

interface FeatureRouteProps { params: Promise<{ slug: string }> }

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return publishedFeaturePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: FeatureRouteProps): Promise<Metadata> {
  const page = getFeaturePage((await params).slug);
  if (!page) return {};
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: page.seo.canonicalPath },
    openGraph: { title: page.seo.title, description: page.seo.description, url: page.seo.canonicalPath },
    twitter: { card: "summary", title: page.seo.title, description: page.seo.description },
  };
}

export default async function FeatureRoute({ params }: FeatureRouteProps) {
  const page = getFeaturePage((await params).slug);
  if (!page) notFound();
  const breadcrumbs = [{ name: "Home", path: "/" as const }, { name: "Features", path: "/features" as const }, { name: page.eyebrow, path: featureHref(page.slug) }];
  return <><Header /><main id="main-content"><StructuredData data={buildBreadcrumbJsonLd(breadcrumbs)} /><FeaturePage page={page} /></main><Footer /></>;
}

