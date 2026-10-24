import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArticleTypeBadge } from "@/components/blog/ArticleTypeBadge";
import type { BlogArticle } from "@/lib/blog/types";
import { formatArticleDate } from "./ArticleCard";

export function ArchiveRow({ article }: { article: BlogArticle }) {
  return (
    <article className="group relative grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-4 rounded-panel px-0 py-3 transition-colors duration-200 hover:bg-surface-raised sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-6 sm:px-2">
      <div className="relative z-10 grid h-12 w-12 place-items-center rounded-[0.75rem] border border-accent-cool/20 bg-gradient-to-br from-surface-active to-[#173775] shadow-[0_8px_22px_rgba(0,0,0,0.24)] sm:h-14 sm:w-14">
        <Image src="/favicon.svg" alt="" width={27} height={27} className="brightness-0 invert" />
      </div>

      <div className="min-w-0 py-1 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ArticleTypeBadge article={article} className="border-border-subtle bg-surface-raised text-ink-muted" />
            <span className="text-caption text-ink-muted">{article.category}</span>
          </div>
          <h3 className="mt-2 font-heading text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium leading-snug tracking-[-0.02em] text-white">
            <Link
              href={`/blog/${article.slug}`}
              className="rounded-sm transition-colors duration-200 hover:text-accent-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
            >
              {article.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-caption text-ink-muted">
            {article.author} <span aria-hidden="true">·</span>{" "}
            <time dateTime={article.date}>{formatArticleDate(article.date)}</time>{" "}
            <span aria-hidden="true">·</span> {article.readingMinutes} min read
          </p>
        </div>
        <span
          className="mt-3 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-subtle text-lg text-ink-muted transition-all group-hover:border-accent-cool/40 group-hover:text-white motion-safe:group-hover:translate-x-1 sm:inline-flex"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </article>
  );
}
