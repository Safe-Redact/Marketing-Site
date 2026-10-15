import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArticleSearch } from "@/components/blog/ArticleSearch";
import { CategoryNavigation } from "@/components/blog/CategoryNavigation";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { Pagination } from "@/components/blog/Pagination";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  getArticleCategories,
  loadPublishedArticles,
  queryArticles,
} from "@/lib/blog/content";
import { EDITORIAL_TYPES } from "@/lib/blog/types";

interface BlogPageProps {
  searchParams: Promise<{ query?: string | string[]; page?: string | string[] }>;
}

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parsePage(value: string): number {
  if (!value) return 1;
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const parameters = await searchParams;
  const query = firstValue(parameters.query).trim();
  const page = parsePage(firstValue(parameters.page));
  const canonical = page > 1 && !query ? `/blog?page=${page}` : "/blog";

  return {
    title: "Blog & Insights",
    description:
      "SafeRedact articles, product announcements, industry news, and practical guidance about responsible redaction workflows.",
    alternates: { canonical },
    robots: query ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url: canonical,
      title: "Blog & Insights | SafeRedact",
      description:
        "Articles and practical guidance about responsible redaction workflows from SafeRedact.",
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const parameters = await searchParams;
  const query = firstValue(parameters.query).trim().slice(0, 100);
  const page = parsePage(firstValue(parameters.page));
  // /blog is the editorial surface. Company news and product updates are
  // announcements and have their own listing at /news.
  const articles = (await loadPublishedArticles()).filter((article) =>
    EDITORIAL_TYPES.includes(article.type)
  );
  const categories = getArticleCategories(articles);
  const featured = !query && page === 1
    ? articles.find((article) => article.featured) ?? articles[0]
    : undefined;
  const listingArticles = featured
    ? articles.filter((article) => article.slug !== featured.slug)
    : articles;
  const results = queryArticles(listingArticles, { query, page });

  if (page > 1 && (results.totalPages === 0 || page > results.totalPages)) notFound();

  return (
    <>
      <section className="blog-hero border-b border-border-subtle pt-[8.75rem] sm:pt-[10rem] lg:pt-[11.5rem]">
        <Container className="pb-14 sm:pb-16 lg:pb-20">
          <Eyebrow>SafeRedact resources</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink text-balance">
            Blog &amp; Insights
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg leading-8 text-ink-muted">
            Product updates, industry perspectives, and practical guidance for teams building careful, reviewable redaction workflows.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-16 lg:py-20" aria-label="Article directory">
        <Container>
          <div className="grid gap-8 border-b border-border-subtle pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <ArticleSearch query={query} />
            <CategoryNavigation categories={categories} />
          </div>

          {featured ? <div className="mt-12"><FeaturedArticle article={featured} /></div> : null}

          {results.items.length ? (
            <>
              <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow>{query ? "Search results" : "Latest insights"}</Eyebrow>
                  <h2 className="mt-3 font-heading text-heading-xl text-ink">
                    {query ? `Results for “${query}”` : "From the SafeRedact team"}
                  </h2>
                </div>
                <p className="text-body-sm text-ink-muted">
                  {results.totalItems} {results.totalItems === 1 ? "article" : "articles"}
                </p>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.items.map((article) => <ArticleCard key={article.slug} article={article} />)}
              </div>
              <Pagination
                currentPage={results.page}
                totalPages={results.totalPages}
                basePath="/blog"
                query={query || undefined}
              />
            </>
          ) : (
            <div className="mx-auto mt-14 max-w-2xl rounded-panel border border-border-subtle bg-surface-raised px-6 py-12 text-center sm:px-10">
              <Eyebrow>{query ? "No matching results" : "Publication queue"}</Eyebrow>
              <h2 className="mt-4 font-heading text-heading-xl text-ink">
                {query ? "No articles match your search" : "No articles have been published yet"}
              </h2>
              <p className="mt-4 text-body leading-7 text-ink-muted">
                {query
                  ? "Try a different phrase or return to all insights."
                  : "Approved SafeRedact articles will appear here after editorial review and publication."}
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
