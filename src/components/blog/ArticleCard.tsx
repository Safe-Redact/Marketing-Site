import Image from "next/image";
import Link from "next/link";
import { ArticleTypeBadge } from "@/components/blog/ArticleTypeBadge";
import type { BlogArticle } from "@/lib/blog/types";

export function formatArticleDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-border-subtle bg-surface-raised transition-all duration-200 motion-safe:hover:-translate-y-0.5 hover:border-accent-cool/35">
      {article.featuredImage ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border-subtle bg-surface-active">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt ?? ""}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="blog-card-visual aspect-[16/10] border-b border-border-subtle" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption uppercase tracking-[0.04em] text-accent-cool">
          <ArticleTypeBadge article={article} />
          <span>{article.category}</span>
          <span aria-hidden="true" className="text-border-subtle">•</span>
          <time dateTime={article.date} className="normal-case tracking-normal text-ink-muted">
            {formatArticleDate(article.date)}
          </time>
        </div>
        <h2 className="mt-4 font-heading text-heading-lg text-ink">
          <Link
            href={`/blog/${article.slug}`}
            className="rounded-sm transition-colors hover:text-accent-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-body-sm leading-6 text-ink-muted">{article.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4 text-caption text-ink-muted">
          <span>{article.author}</span>
          <span>{article.readingMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}
