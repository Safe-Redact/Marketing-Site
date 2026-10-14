import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { BlogArticle } from "@/lib/blog/types";
import { formatArticleDate } from "./ArticleCard";

export function FeaturedArticle({ article }: { article: BlogArticle }) {
  return (
    <article className="grid overflow-hidden rounded-panel border border-border-subtle bg-surface-raised shadow-panel md:grid-cols-[1.15fr_0.85fr]">
      {article.featuredImage ? (
        <div className="relative min-h-64 overflow-hidden border-b border-border-subtle md:min-h-[25rem] md:border-b-0 md:border-r">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt ?? ""}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="blog-feature-visual min-h-64 border-b border-border-subtle md:min-h-[25rem] md:border-b-0 md:border-r" aria-hidden="true" />
      )}
      <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-11">
        <p className="font-heading text-caption font-semibold uppercase tracking-[0.06em] text-accent-cool">
          Featured · {article.category}
        </p>
        <h2 className="mt-5 font-heading text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-[-0.025em] text-ink">
          <Link
            href={`/blog/${article.slug}`}
            className="rounded-sm transition-colors hover:text-accent-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-5 text-body-lg leading-7 text-ink-muted">{article.excerpt}</p>
        <p className="mt-5 text-body-sm text-ink-muted">
          {article.author} · <time dateTime={article.date}>{formatArticleDate(article.date)}</time> · {article.readingMinutes} min read
        </p>
        <div className="mt-7">
          <Button variant="primary" asChild>
            <Link href={`/blog/${article.slug}`}>Read article</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
