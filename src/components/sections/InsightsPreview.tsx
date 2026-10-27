import Image from "next/image";
import Link from "next/link";
import { formatArticleDate } from "@/components/blog/ArticleCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { articleTypeLabel, loadPublishedArticles } from "@/lib/blog/content";
import { cn } from "@/lib/utils";

/**
 * Latest published Insights. Uses the same publication gate as /blog, so archived and
 * scheduled entries never appear. Renders nothing when there is nothing published.
 */
export async function InsightsPreview() {
  const [lead, ...rest] = (await loadPublishedArticles()).slice(0, 3);
  if (!lead) return null;

  return (
    <section id="insights" aria-labelledby="insights-heading" className="sheet section-y bg-canvas text-ink">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <AnimateOnScroll>
            <p className="type-eyebrow">Insights</p>
            <h2 id="insights-heading" className="type-h2 mt-4 max-w-[18ch]">
              Notes on redaction practice. <span className="type-quiet">Written for reviewers.</span>
            </h2>
            <p className="type-body mt-5 max-w-md">
              Guidance on review workflows, disclosure preparation, and how to evaluate redaction output.
            </p>
            <Link href="/blog" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover motion-reduce:transition-none">
              Read all Insights
              <Icon name="arrow" size={16} />
            </Link>
          </AnimateOnScroll>

          <div>
            <AnimateOnScroll delay={80}>
              <article
                className={cn(
                  "group grid overflow-hidden rounded-[16px] border border-border-subtle/50 bg-surface-raised/50 transition-colors hover:border-border-subtle motion-reduce:transition-none",
                  lead.featuredImage && "sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                )}
              >
                {/* Articles without an approved featured image stay text-only rather than showing filler. */}
                {lead.featuredImage ? (
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border-subtle/50 bg-surface-active sm:aspect-auto sm:min-h-[15rem] sm:border-b-0 sm:border-r">
                    <Image
                      src={lead.featuredImage}
                      alt={lead.imageAlt ?? ""}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 45vw, 400px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-col p-6 sm:p-8">
                  <p className="type-meta flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-accent-warm">{articleTypeLabel(lead.type)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{lead.category}</span>
                  </p>
                  <h3 className="mt-4 font-heading text-[1.375rem] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">
                    <Link
                      href={`/blog/${lead.slug}`}
                      className="rounded-sm transition-colors hover:text-accent-warm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none"
                    >
                      {lead.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 max-w-2xl text-[0.9375rem] leading-6 text-ink-muted">{lead.excerpt}</p>
                  <p className="type-meta mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-6">
                    <time dateTime={lead.date}>{formatArticleDate(lead.date)}</time>
                    <span>{lead.readingMinutes} min read</span>
                  </p>
                </div>
              </article>
            </AnimateOnScroll>

            {rest.length > 0 ? (
              <ul className="mt-6 border-t border-border-subtle/60">
                {rest.map((article) => (
                  <li key={article.slug} className="border-b border-border-subtle/60">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="group flex flex-col gap-1 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cool motion-reduce:transition-none sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <span className="font-semibold text-ink transition-colors group-hover:text-accent-warm-hover motion-reduce:transition-none">{article.title}</span>
                      <span className="type-meta shrink-0">
                        <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
