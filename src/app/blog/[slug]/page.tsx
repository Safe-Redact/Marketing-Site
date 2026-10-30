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
import { captureUrl } from "@/content/media";
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
  const leadImage = article.featuredImage ?? captureUrl("editorial-document-cover");
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
      <header className="blog-hero pt-[7.5rem] sm:pt-[8.25rem]">
        <Container className="max-w-[76rem] pb-10 sm:pb-14 lg:pb-16">
          <nav
            aria-label="Breadcrumb"
            className="type-meta mb-6 flex flex-wrap items-center gap-2"
          >
            <Link
              href="/blog"
              className="rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
            >
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/blog/category/${article.categorySlug}`}
              className="rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
            >
              {article.category}
            </Link>
          </nav>
          <div className="max-w-[58rem]">
            <div>
              <Link
                href={`/blog/category/${article.categorySlug}`}
                className="type-eyebrow inline-flex rounded-sm transition-colors hover:text-accent-ink-hover"
              >
                {article.category}
              </Link>
              <h1 className="type-h1 mt-4 text-balance">
                {article.title}
              </h1>
              <p className="type-lede mt-5 max-w-3xl">
                {article.excerpt}
              </p>
              <ArticleMeta article={article} />
            </div>
          </div>
          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[18px] border border-border-subtle/60 bg-surface-raised shadow-panel sm:aspect-[16/9] lg:aspect-[21/9]">
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
              <div className="mt-14 border-t border-border-subtle/60 pt-7">
                {article.tags.length ? (
                  <nav aria-label="Article topics" className="mb-6 flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Link
                        key={article.tagSlugs[index]}
                        href={`/blog?tag=${article.tagSlugs[index]}`}
                        className="inline-flex min-h-10 items-center rounded-[10px] border border-border-subtle/70 bg-surface-raised/50 px-3 text-caption text-ink-muted transition-colors hover:border-ink-muted/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
                      >
                        {tag}
                      </Link>
                    ))}
                  </nav>
                ) : null}
                <Link
                  href="/blog"
                  className="text-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover"
                >
                  ← Back to the blog
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
    </article>
  );
}
