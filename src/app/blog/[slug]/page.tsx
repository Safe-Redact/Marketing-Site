import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleCard, formatArticleDate } from "@/components/blog/ArticleCard";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  getPublishedArticleBySlug,
  getRelatedArticles,
  loadPublishedArticles,
} from "@/lib/blog/content";
import { buildArticleJsonLd, buildArticleMetadata } from "@/lib/blog/seo";
import { contentSecurityPolicyNonce } from "@/lib/csp";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await loadPublishedArticles()).map(({ slug }) => ({ slug }));
}

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
  const jsonLd = JSON.stringify(buildArticleJsonLd(article)).replace(/</g, "\\u003c");

  return (
    <article>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <header className="blog-hero border-b border-border-subtle pt-[8.75rem] sm:pt-[10rem] lg:pt-[11.5rem]">
        <Container className="max-w-[58rem] pb-12 sm:pb-16 lg:pb-20">
          <Link href={`/blog/category/${article.categorySlug}`} className="inline-flex rounded-sm font-heading text-caption font-bold uppercase tracking-[0.05em] text-accent-cool transition-colors hover:text-white">
            {article.category}
          </Link>
          <h1 className="mt-5 font-heading text-[clamp(2.2rem,5.3vw,4.55rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-ink text-balance">
            {article.title}
          </h1>
          <p className="mt-6 max-w-3xl text-body-lg leading-8 text-ink-muted">{article.excerpt}</p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-border-subtle pt-5 text-body-sm text-ink-muted">
            <span>By {article.author}</span>
            <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
            <span>{article.readingMinutes} min read</span>
          </div>
        </Container>
      </header>

      <section className="py-12 sm:py-16 lg:py-20">
        <Container className="max-w-[50rem]">
          <ArticleBody content={article.body} />
          <div className="mt-14 border-t border-border-subtle pt-7">
            <Link href="/blog" className="font-heading text-body-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover">
              ← Back to all insights
            </Link>
          </div>
        </Container>
      </section>

      {related.length ? (
        <section className="border-t border-border-subtle bg-surface-raised/45 py-14 sm:py-16 lg:py-20" aria-labelledby="related-articles-heading">
          <Container>
            <Eyebrow>Continue reading</Eyebrow>
            <h2 id="related-articles-heading" className="mt-3 font-heading text-heading-xl text-ink">Related insights</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedArticle) => <ArticleCard key={relatedArticle.slug} article={relatedArticle} />)}
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
