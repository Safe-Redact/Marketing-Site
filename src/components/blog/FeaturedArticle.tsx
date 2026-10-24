import Image from "next/image";
import Link from "next/link";
import React from "react";
import { articleTypeLabel } from "@/lib/blog/content";
import type { BlogArticle } from "@/lib/blog/types";
import { formatArticleDate } from "./ArticleCard";

export function FeaturedArticle({ article }: { article: BlogArticle }) {
  return (
    <article
      aria-label="Featured insight"
      className="group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface-raised shadow-[0_28px_75px_rgba(0,0,0,0.34)] sm:aspect-[16/10] lg:aspect-[2/1] lg:rounded-[2rem]"
    >
      <Image
        src={article.featuredImage ?? "/images/product/hero-document-review.png"}
        alt={article.featuredImage ? article.imageAlt ?? "" : "OpenRedakt document review workspace"}
        fill
        priority
        sizes="(max-width: 1023px) 100vw, 1024px"
        className="object-cover object-center transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,15,0.96)_0%,rgba(5,7,15,0.78)_43%,rgba(5,7,15,0.12)_78%),linear-gradient(0deg,rgba(5,7,15,0.8)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative flex h-full max-w-[38rem] flex-col p-5 text-white sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-caption">
          <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-canvas">
            {articleTypeLabel(article.type)}
          </span>
          <span className="rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-white/90 backdrop-blur-sm">
            {article.category}
          </span>
          <time dateTime={article.date} className="ml-1 text-white/75">
            {formatArticleDate(article.date)}
          </time>
          <span className="text-white/75">{article.readingMinutes} min read</span>
        </div>
        <div className="mt-auto lg:mt-14">
          <h2 className="font-heading text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-white">
          <Link
            href={`/blog/${article.slug}`}
            className="rounded-sm transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {article.title}
          </Link>
          </h2>
          <p className="mt-4 hidden line-clamp-2 max-w-xl text-body-sm leading-6 text-white/75 sm:block sm:text-body">
            {article.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex min-h-10 items-center rounded-full bg-white px-5 text-body-sm font-semibold text-canvas transition-colors hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-accent-cool"
            >
              Read full article <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <span className="hidden text-body-sm text-white/70 sm:inline">By {article.author}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
