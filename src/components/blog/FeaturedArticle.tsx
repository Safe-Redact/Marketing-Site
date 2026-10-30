import Image from "next/image";
import Link from "next/link";
import React from "react";
import { captureUrl } from "@/content/media";
import { articleTypeLabel } from "@/lib/blog/content";
import type { BlogArticle } from "@/lib/blog/types";
import { formatArticleDate } from "./ArticleCard";

export function FeaturedArticle({ article }: { article: BlogArticle }) {
  return (
    <article
      aria-label="Featured insight"
      className="group relative aspect-[4/3] overflow-hidden rounded-[18px] border border-border-subtle/60 bg-surface-raised shadow-panel sm:aspect-[16/10] lg:aspect-[21/10]"
    >
      <Image
        // Articles without their own image use the processed editorial cover.
        src={article.featuredImage ?? captureUrl("editorial-document-cover")}
        alt={article.featuredImage ? article.imageAlt ?? "" : "OpenRedakt document review workspace"}
        fill
        priority
        sizes="(max-width: 1023px) 100vw, 1024px"
        className="object-cover object-center transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(12_10_9/0.96)_0%,rgb(12_10_9/0.8)_43%,rgb(12_10_9/0.12)_78%),linear-gradient(0deg,rgb(12_10_9/0.82)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative flex h-full max-w-[38rem] flex-col p-5 text-white sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-caption">
          <span className="rounded-[8px] bg-accent-warm px-2.5 py-1 font-semibold text-on-accent">
            {articleTypeLabel(article.type)}
          </span>
          <span className="rounded-[8px] border border-white/25 bg-black/25 px-2.5 py-1 text-white/90 backdrop-blur-sm">
            {article.category}
          </span>
          <time dateTime={article.date} className="ml-1 text-white/75">
            {formatArticleDate(article.date)}
          </time>
          <span className="text-white/75">{article.readingMinutes} min read</span>
        </div>
        <div className="mt-auto lg:mt-14">
          <h2 className="font-heading text-[clamp(1.625rem,1.2rem+1.6vw,2.375rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
          <Link
            href={`/blog/${article.slug}`}
            className="rounded-sm transition-colors hover:text-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
              className="inline-flex min-h-10 items-center rounded-full bg-accent-warm px-5 text-body-sm font-semibold text-on-accent shadow-action transition-colors hover:bg-accent-warm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
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
