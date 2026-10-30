import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleArchive } from "@/components/blog/ArticleArchive";
import { ArticleSearch } from "@/components/blog/ArticleSearch";
import { CategoryNavigation } from "@/components/blog/CategoryNavigation";
import { EditorialHero } from "@/components/blog/EditorialHero";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { Pagination } from "@/components/blog/Pagination";
import { TagNavigation } from "@/components/blog/TagNavigation";
import { Container } from "@/components/ui/Container";
import {
  getArticleCategories,
  getArticleTags,
  groupArticlesByMonth,
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
    tag?: string | string[];
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
  const tag = firstValue(parameters.tag).trim().toLowerCase();

  // A type filter is a real, linkable view of the hub, so it keeps its own canonical.
  // Search and paging are not: they point back at the view they refine.
  const canonical = type ? filterHref(type) : "/blog";
  const label = type ? CONTENT_FILTERS.find((filter) => filter.type === type)?.label : undefined;

  return {
    title: type && label ? `${label} | Blog` : "Blog",
    description:
      "OpenRedakt company news, product updates, industry insights, and practical guides about responsible redaction workflows.",
    alternates: { canonical },
    // Search results and deeper pages are refinements of a page that is already
    // indexed; indexing them would compete with it.
    robots: query || tag || page > 1 ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url: canonical,
      title: type && label ? `${label} | OpenRedakt Blog` : "Blog | OpenRedakt",
      description:
        "Company news, product updates, industry insights, and practical guides from OpenRedakt.",
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const parameters = await searchParams;
  const query = firstValue(parameters.query).trim().slice(0, 100);
  const page = parsePage(firstValue(parameters.page));
  const type = parseType(firstValue(parameters.type));
  const requestedTag = firstValue(parameters.tag).trim().toLowerCase();

  // Insights is the single content hub: company news and product updates sit here
  // alongside editorial writing, and the type filter is how a reader narrows it.
  const articles = await loadPublishedArticles();
  const categories = getArticleCategories(articles);
  const tags = getArticleTags(articles);
  const availableTypes = [...new Set(articles.map((article) => article.type))];
  const activeTag = requestedTag ? tags.find((tag) => tag.slug === requestedTag) : undefined;
  if (requestedTag && !activeTag) notFound();

  // The featured slot belongs to the unfiltered front page only; under a filter or a
  // search it would promote something the reader did not ask for.
  const featured = !query && !type && !activeTag && page === 1
    ? articles.find((article) => article.featured) ?? articles[0]
    : undefined;
  const listingArticles = featured
    ? articles.filter((article) => article.slug !== featured.slug)
    : articles;
  const results = queryArticles(listingArticles, {
    query,
    page,
    type: type ?? undefined,
    tag: activeTag?.slug,
  });
  // Guarded against `type === null`, which would otherwise match the "All content"
  // filter and make the unfiltered hub describe itself as a filtered view.
  const activeLabel = type ? CONTENT_FILTERS.find((filter) => filter.type === type)?.label : undefined;

  if (page > 1 && (results.totalPages === 0 || page > results.totalPages)) notFound();

  return (
    <>
      <EditorialHero />

      {featured ? (
        <section className="pb-12 sm:pb-14 lg:pb-16" aria-label="Featured story">
          <Container className="!max-w-5xl">
            <FeaturedArticle article={featured} />
          </Container>
        </section>
      ) : null}

      <section
        className={featured ? "pb-16 sm:pb-20 lg:pb-24" : "pb-16 pt-10 sm:pb-20 lg:pb-24"}
        aria-label="Article directory"
      >
        <Container className="!max-w-5xl">
          <div className="pt-2 sm:pt-4">
            <div>
              <ArticleSearch query={query} type={type ?? undefined} tag={activeTag?.slug} />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <ContentTypeFilter
                activeType={type}
                query={query || undefined}
                tag={activeTag?.slug}
                availableTypes={availableTypes}
              />
              {categories.length > 1 ? <div className="min-w-0 sm:ml-auto">
                <p className="sr-only">Categories</p>
                <CategoryNavigation categories={categories} showAllLink={false} />
              </div> : null}
            </div>
            {articles.length > 3 || activeTag ? (
              <div className="mt-4">
                <TagNavigation
                  tags={tags}
                  activeSlug={activeTag?.slug}
                  query={query || undefined}
                  type={type ?? undefined}
                />
              </div>
            ) : null}
          </div>

          {results.items.length ? (
            <>
              <ArticleArchive
                groups={groupArticlesByMonth(results.items)}
                totalItems={results.totalItems}
                contextLabel={
                  query
                    ? `Results for “${query}”`
                    : activeTag?.name ?? activeLabel ?? "Latest from OpenRedakt"
                }
              />
              <Pagination
                currentPage={results.page}
                totalPages={results.totalPages}
                basePath="/blog"
                query={query || undefined}
                type={type ?? undefined}
                tag={activeTag?.slug}
              />
            </>
          ) : featured && !query && !type && !activeTag ? null : (
            <div className="mx-auto mt-14 max-w-2xl rounded-[16px] border border-border-subtle bg-surface-raised px-6 py-12 text-center sm:px-10">
              <p className="font-heading text-caption font-semibold uppercase tracking-[0.12em] text-accent-ink">
                {query || type || activeTag ? "No matching results" : "Publication queue"}
              </p>
              <h2 className="mt-4 font-heading text-heading-xl text-ink">
                {query
                  ? "No content matches your search"
                  : activeLabel
                    ? `No ${activeLabel.toLowerCase()} published yet`
                    : "No content has been published yet"}
              </h2>
              <p className="mt-4 text-body leading-7 text-ink-muted">
                {query || type || activeTag ? (
                  <>
                    Try a different phrase, or{" "}
                    <Link href="/blog" className="font-semibold text-accent-cool underline-offset-4 hover:underline">
                      browse all content
                    </Link>
                    .
                  </>
                ) : (
                  "Approved OpenRedakt content will appear here after editorial review and publication."
                )}
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
