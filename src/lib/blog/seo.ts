import type { Metadata } from "next";
import type { BlogArticle } from "./types";
import { publicSiteUrl, siteConfig } from "@/content/site";

const siteUrl = publicSiteUrl;

export function buildArticleMetadata(article: BlogArticle): Metadata {
  const path = `/blog/${article.slug}`;
  const images = article.featuredImage && article.imageAlt
    ? [{ url: article.featuredImage, alt: article.imageAlt }]
    : undefined;

  return {
    title: article.title,
    description: article.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: siteConfig.name,
      title: article.title,
      description: article.seoDescription,
      publishedTime: article.date,
      modifiedTime: article.updatedDate,
      authors: [article.author],
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: article.title,
      description: article.seoDescription,
      images: images?.map((image) => image.url),
    },
  };
}
export function buildArticleJsonLd(article: BlogArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    datePublished: article.date,
    ...(article.updatedDate ? { dateModified: article.updatedDate } : {}),
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${article.slug}`,
    ...(article.featuredImage ? { image: `${siteUrl}${article.featuredImage}` } : {}),
  };
}
