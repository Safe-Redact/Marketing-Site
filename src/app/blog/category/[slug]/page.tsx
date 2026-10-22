import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CategoryNavigation } from "@/components/blog/CategoryNavigation";
import { Pagination } from "@/components/blog/Pagination";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  getArticleCategories,
  loadPublishedArticles,
  queryArticles,
} from "@/lib/blog/content";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getArticleCategories(await loadPublishedArticles())
    .find((entry) => entry.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name} Insights`,
    description: `Published OpenRedakt articles in the ${category.name} category.`,
    alternates: { canonical: `/blog/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, parameters] = await Promise.all([params, searchParams]);
  const articles = await loadPublishedArticles();
  const categories = getArticleCategories(articles);
  const category = categories.find((entry) => entry.slug === slug);
  if (!category) notFound();

  const rawPage = Array.isArray(parameters.page) ? parameters.page[0] : parameters.page;
  const parsedPage = Number(rawPage ?? "1");
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const results = queryArticles(articles, { category: slug, page });
  if (page > 1 && page > results.totalPages) notFound();

  return (
    <>
      <section className="blog-hero border-b border-border-subtle pt-[8.75rem] sm:pt-[10rem] lg:pt-[11.5rem]">
        <Container className="pb-12 sm:pb-16">
          <Eyebrow>Blog category</Eyebrow>
          <h1 className="mt-5 font-heading text-[clamp(2.3rem,5vw,4.2rem)] font-semibold leading-tight tracking-[-0.035em] text-ink">
            {category.name}
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg leading-8 text-ink-muted">
            Browse published OpenRedakt insights in this category.
          </p>
        </Container>
      </section>
      <section className="py-14 sm:py-16 lg:py-20">
        <Container>
          <CategoryNavigation categories={categories} activeSlug={category.slug} />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.items.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
          <Pagination
            currentPage={results.page}
            totalPages={results.totalPages}
            basePath={`/blog/category/${category.slug}`}
          />
        </Container>
      </section>
    </>
  );
}
