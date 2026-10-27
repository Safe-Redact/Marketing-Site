import Link from "next/link";
import { ArticleTypeBadge } from "@/components/blog/ArticleTypeBadge";
import { formatArticleDate } from "@/components/blog/ArticleCard";
import { Container } from "@/components/ui/Container";
import type { BlogArticle } from "@/lib/blog/types";

export function RelatedStories({ articles }: { articles: readonly BlogArticle[] }) {
  if (!articles.length) return null;

  return (
    <section
      className="section-y-sm border-t border-border-subtle/50 bg-canvas"
      aria-labelledby="related-articles-heading"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="type-eyebrow">
            Continue reading
          </p>
          <h2 id="related-articles-heading" className="type-h2 mt-4">
            Related insights
          </h2>
          <p className="mt-3 text-body text-ink-muted">
            More practical guidance selected from published OpenRedakt topics.
          </p>
        </div>
        <div className="mt-8 grid border-t border-border-subtle md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group border-b border-border-subtle py-7 md:px-6 md:first:pl-0 lg:border-r lg:last:border-r-0 lg:last:pr-0"
            >
              <div className="flex flex-wrap items-center gap-3">
                <ArticleTypeBadge article={article} />
                <time dateTime={article.date} className="text-caption text-ink-muted">
                  {formatArticleDate(article.date)}
                </time>
              </div>
              <h3 className="mt-5 font-heading text-heading-lg leading-tight text-ink">
                <Link
                  href={`/blog/${article.slug}`}
                  className="rounded-sm transition-colors hover:text-accent-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
                >
                  {article.title}
                </Link>
              </h3>
              <p className="mt-3 text-body-sm leading-6 text-ink-muted">{article.excerpt}</p>
              <p className="mt-5 text-caption text-ink-muted">
                {article.author} · {article.readingMinutes} min read
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
