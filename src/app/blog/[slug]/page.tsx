import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleAsideCta } from "@/components/blog/ArticleAsideCta";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleMeta } from "@/components/blog/ArticleMeta";
import { ArticleTableOfContents } from "@/components/blog/ArticleTableOfContents";
import { CommentThread } from "@/components/blog/CommentThread";
import { RelatedStories } from "@/components/blog/RelatedStories";
import { Container } from "@/components/ui/Container";
import {
  getPublishedArticleBySlug,
  getRelatedArticles,
  loadPublishedArticles,
} from "@/lib/blog/content";
import { extractArticleHeadings } from "@/lib/blog/headings";
import { buildArticleJsonLd, buildArticleMetadata } from "@/lib/blog/seo";
import { contentSecurityPolicyNonce } from "@/lib/csp";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Publication eligibility is evaluated at request time so scheduled and archived
// entries follow the deployed content manifest without requiring an extra rebuild.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  return article ? buildArticleMetadata(article) : {};
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [nonce, article, allArticles] = await Promise.all([
    contentSecurityPolicyNonce(),
    getPublishedArticleBySlug(slug),
    loadPublishedArticles(),
  ]);
  if (!article) notFound();

  const related = getRelatedArticles(allArticles, article, 3);
  const headings = extractArticleHeadings(article.body);
  const jsonLd = JSON.stringify(buildArticleJsonLd(article)).replace(/</g, "\\u003c");
  const leadImage = article.featuredImage ?? "/images/product/hero-document-review.png";
  const leadImageAlt = article.featuredImage
    ? (article.imageAlt ?? "")
    : "OpenRedakt document review workspace";

  return (
    <article>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <header className="blog-hero border-b border-border-subtle pt-[7rem] sm:pt-[7.5rem] lg:pt-[8rem]">
        <Container className="max-w-[76rem] pb-10 sm:pb-14 lg:pb-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-2 text-caption text-ink-muted"
          >
            <Link
              href="/blog"
              className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
            >
              Insights
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/blog/category/${article.categorySlug}`}
              className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
            >
              {article.category}
            </Link>
          </nav>
          <div className="max-w-[58rem]">
            <div>
              <Link
                href={`/blog/category/${article.categorySlug}`}
                className="inline-flex rounded-sm font-heading text-caption font-semibold uppercase tracking-[0.1em] text-accent-warm transition-colors hover:text-white"
              >
                {article.category}
              </Link>
              <h1 className="mt-4 font-heading text-[clamp(2.15rem,3.25vw,2.7rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white text-balance">
                {article.title}
              </h1>
              <p className="mt-4 max-w-3xl text-body-lg leading-8 text-ink-muted">
                {article.excerpt}
              </p>
              <ArticleMeta article={article} />
            </div>
          </div>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-border-subtle bg-surface-raised shadow-panel sm:mt-9 sm:aspect-[16/9] lg:aspect-[2/1] lg:rounded-[1.75rem]">
            <Image
              src={leadImage}
              alt={leadImageAlt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1216px"
              className="object-cover"
            />
          </div>
        </Container>
      </header>

      <section data-article-reading className="bg-canvas py-10 sm:py-14 lg:py-16">
        <Container className="max-w-[76rem]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,52rem)_19rem] lg:items-start lg:gap-16">
            <div className="min-w-0">
              <div className="mb-9 lg:hidden">
                <ArticleTableOfContents headings={headings} compact />
              </div>
              <ArticleBody content={article.body} />
              <div className="mt-14 border-t border-border-subtle pt-7">
                {article.tags.length ? (
                  <nav aria-label="Article topics" className="mb-6 flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Link
                        key={article.tagSlugs[index]}
                        href={`/blog?tag=${article.tagSlugs[index]}`}
                        className="inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-surface-raised px-3 text-caption text-ink-muted transition-colors hover:border-accent-cool/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
                      >
                        {tag}
                      </Link>
                    ))}
                  </nav>
                ) : null}
                <Link
                  href="/blog"
                  className="font-heading text-body-sm font-semibold text-accent-warm transition-colors hover:text-white"
                >
                  ← Back to all insights
                </Link>
              </div>
            </div>
            <div
              data-article-sidebar="true"
              className="hidden space-y-6 lg:sticky lg:top-28 lg:block lg:pb-4"
            >
              <ArticleAsideCta />
              <ArticleTableOfContents headings={headings} />
            </div>
          </div>
        </Container>
      </section>

      <RelatedStories articles={related} />

      {/* Absent entirely when comments are switched off for the deployment: a form
          that refused every submission would be worse than no form. */}
      <CommentThread articleSlug={article.slug} />

      <section
        className="border-t border-border-subtle bg-surface-raised/35 py-14 sm:py-16 lg:py-20"
        aria-labelledby="article-closing-cta"
      >
        <Container className="max-w-[64rem] text-center">
          <p className="font-heading text-caption font-semibold uppercase tracking-[0.1em] text-accent-warm">
            From guidance to workflow
          </p>
          <h2
            id="article-closing-cta"
            className="mx-auto mt-4 max-w-3xl font-heading text-[clamp(1.9rem,3.5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white"
          >
            Review how OpenRedakt can support your redaction process.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-8 text-ink-muted">
            Share the file formats, review steps, and disclosure risks your team needs to evaluate.
          </p>
          <Link
            href="/#demo-enquiry"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-accent-warm px-7 py-3 font-semibold text-canvas transition-all duration-200 hover:bg-accent-warm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-canvas motion-safe:hover:-translate-y-0.5"
          >
            Request a tailored demo
          </Link>
        </Container>
      </section>
    </article>
  );
}
