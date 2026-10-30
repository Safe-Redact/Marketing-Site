import Image from "next/image";
import Link from "next/link";
import { formatArticleDate } from "@/components/blog/ArticleCard";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { captureUrl } from "@/content/media";
import { articleTypeLabel, loadPublishedArticles } from "@/lib/blog/content";

/**
 * Latest published blog posts as editorial rows inside one pale coral panel. Uses the
 * same publication gate as /blog, so archived and scheduled entries never appear.
 * Renders nothing when there is nothing published.
 */
export async function InsightsPreview() {
  const articles = (await loadPublishedArticles()).slice(0, 3);
  if (articles.length === 0) return null;

  return (
    <section id="insights" aria-labelledby="insights-heading" className="relative bg-canvas pb-2 pt-[clamp(3.75rem,2.25rem+4vw,6.5rem)] text-ink">
      <Container>
        <div className="blog-panel mx-auto max-w-[64rem] rounded-[24px] px-5 py-9 sm:rounded-[28px] sm:px-9 sm:py-11 lg:px-12 lg:py-12">
          <AnimateOnScroll className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-eyebrow">Blog</p>
              <h2 id="insights-heading" className="mt-3 max-w-[24ch] font-heading text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-ink">
                Notes on redaction practice. <span className="type-quiet sm:block">Written for reviewers.</span>
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-ink/10 bg-white/70 px-5 text-sm font-medium text-ink transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none sm:self-auto"
            >
              Read the blog
              <Icon name="arrow" size={15} />
            </Link>
          </AnimateOnScroll>

          <ul className="mt-8 space-y-3 sm:mt-9 sm:space-y-4">
            {articles.map((article, index) => (
              <li key={article.slug}>
                <AnimateOnScroll delay={index * 60}>
                <article className="group relative grid gap-5 rounded-[22px] p-2 transition-colors hover:bg-white/60 motion-reduce:transition-none sm:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] sm:gap-7 sm:p-2.5 lg:gap-9">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-surface-active">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.imageAlt ?? ""}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 32vw, 340px"
                        className="object-cover transition-transform duration-500 ease-standard motion-safe:group-hover:scale-[1.02]"
                      />
                    ) : (
                      // No featured image: the processed editorial cover (decorative), labelled with the type.
                      <>
                        <Image
                          src={captureUrl("editorial-document-cover")}
                          alt=""
                          fill
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 32vw, 340px"
                          className="object-cover transition-transform duration-500 ease-standard motion-safe:group-hover:scale-[1.02]"
                        />
                        <span aria-hidden="true" className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-ink backdrop-blur-sm">
                          {articleTypeLabel(article.type)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col px-2 pb-3 sm:px-0 sm:py-2 sm:pr-4">
                    <p className="text-sm text-ink-muted">
                      <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                      <span aria-hidden="true"> · </span>
                      {article.category}
                    </p>
                    <h3 className="mt-2 max-w-[34ch] font-heading text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)] font-medium leading-[1.18] tracking-[-0.025em] text-ink text-balance">
                      {/* The title link covers the whole row, so the row has a single tab stop. */}
                      <Link
                        href={`/blog/${article.slug}`}
                        className="rounded-sm transition-colors after:absolute after:inset-0 after:rounded-[22px] group-hover:text-accent-ink-hover focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent-cool motion-reduce:transition-none"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-2 max-w-[38rem] text-[0.9375rem] leading-6 text-ink-muted">{article.excerpt}</p>
                    <span aria-hidden="true" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink sm:mt-auto sm:pt-4">
                      Read more
                      <Icon name="arrow" size={14} className="-rotate-45 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
                </AnimateOnScroll>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
