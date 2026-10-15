import type { Metadata } from "next";
import Link from "next/link";
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
import { ContentTypeFilter, CONTENT_FILTERS, filterHref } from "@/components/blog/ContentTypeFilter";
import { ARTICLE_TYPES } from "@/lib/blog/types";
import type { ArticleType } from "@/lib/blog/types";

interface BlogPageProps {
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
    type?: string | string[];
  }>;
}

/** An unrecognised type is treated as no filter rather than an error page. */
function parseType(value: string): ArticleType | null {
  return (ARTICLE_TYPES as readonly string[]).includes(value) ? (value as ArticleType) : null;
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
  const type = parseType(firstValue(parameters.type));

  // A type filter is a real, linkable view of the hub, so it keeps its own canonical.
  // Search and paging are not: they point back at the view they refine.
  const canonical = type ? filterHref(type) : page > 1 && !query ? `/blog?page=${page}` : "/blog";
  const label = type ? CONTENT_FILTERS.find((filter) => filter.type === type)?.label : undefined;

  return {
    title: type && label ? `${label} | Insights` : "Insights",
    description:
      "SafeRedact company news, product updates, industry insights, and practical guides about responsible redaction workflows.",
    alternates: { canonical },
    // Search results and deeper pages are refinements of a page that is already
    // indexed; indexing them would compete with it.
    robots: query || page > 1 ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url: canonical,
      title: type && label ? `${label} | SafeRedact Insights` : "Insights | SafeRedact",
      description:
        "Company news, product updates, industry insights, and practical guides from SafeRedact.",
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const parameters = await searchParams;
  const query = firstValue(parameters.query).trim().slice(0, 100);
  const page = parsePage(firstValue(parameters.page));
  const type = parseType(firstValue(parameters.type));

  // Insights is the single content hub: company news and product updates sit here
  // alongside editorial writing, and the type filter is how a reader narrows it.
  const articles = await loadPublishedArticles();
  const categories = getArticleCategories(articles);

  // The featured slot belongs to the unfiltered front page only; under a filter or a
  // search it would promote something the reader did not ask for.
  const featured = !query && !type && page === 1
    ? articles.find((article) => article.featured) ?? articles[0]
    : undefined;
  const listingArticles = featured
    ? articles.filter((article) => article.slug !== featured.slug)
    : articles;
  const results = queryArticles(listingArticles, {
    query,
    page,
    type: type ?? undefined,
  });
  // Guarded against `type === null`, which would otherwise match the "All content"
  // filter and make the unfiltered hub describe itself as a filtered view.
  const activeLabel = type ? CONTENT_FILTERS.find((filter) => filter.type === type)?.label : undefined;

  if (page > 1 && (results.totalPages === 0 || page > results.totalPages)) notFound();

  return (
    <>
      <section className="blog-hero border-b border-border-subtle pt-[8.75rem] sm:pt-[10rem] lg:pt-[11.5rem]">
        <Container className="pb-14 sm:pb-16 lg:pb-20">
          <Eyebrow>SafeRedact resources</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink text-balance">
            Insights
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg leading-8 text-ink-muted">
            Company news, product updates, industry perspectives, and practical guides
            for teams building careful, reviewable redaction workflows — all in one place.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-16 lg:py-20" aria-label="Article directory">
        <Container>
          <div className="border-b border-border-subtle pb-10">
            <ContentTypeFilter activeType={type} query={query || undefined} />
            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <ArticleSearch query={query} type={type ?? undefined} />
              <CategoryNavigation categories={categories} showAllLink={false} />
            </div>
          </div>

          {featured ? <div className="mt-12"><FeaturedArticle article={featured} /></div> : null}

          {results.items.length ? (
            <>
              <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow>
                    {query ? "Search results" : activeLabel ?? "Latest insights"}
                  </Eyebrow>
                  <h2 className="mt-3 font-heading text-heading-xl text-ink">
                    {query
                      ? `Results for “${query}”`
                      : activeLabel ?? "From the SafeRedact team"}
                  </h2>
                </div>
                <p className="text-body-sm text-ink-muted">
                  {results.totalItems} {results.totalItems === 1 ? "item" : "items"}
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
                type={type ?? undefined}
              />
            </>
          ) : (
            <div className="mx-auto mt-14 max-w-2xl rounded-panel border border-border-subtle bg-surface-raised px-6 py-12 text-center sm:px-10">
              <Eyebrow>
                {query || type ? "No matching results" : "Publication queue"}
              </Eyebrow>
              <h2 className="mt-4 font-heading text-heading-xl text-ink">
                {query
                  ? "No content matches your search"
                  : activeLabel
                    ? `No ${activeLabel.toLowerCase()} published yet`
                    : "No content has been published yet"}
              </h2>
              <p className="mt-4 text-body leading-7 text-ink-muted">
                {query || type ? (
                  <>
                    Try a different phrase, or{" "}
                    <Link href="/blog" className="font-semibold text-accent-cool underline-offset-4 hover:underline">
                      browse all content
                    </Link>
                    .
                  </>
                ) : (
                  "Approved SafeRedact content will appear here after editorial review and publication."
                )}
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
