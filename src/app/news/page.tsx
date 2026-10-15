import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Pagination } from "@/components/blog/Pagination";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { loadPublishedArticles, queryArticles } from "@/lib/blog/content";
import { ANNOUNCEMENT_TYPES } from "@/lib/blog/types";

interface NewsPageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] ?? "" : value ?? "";
  if (!raw) return 1;
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const page = parsePage((await searchParams).page);
  const canonical = page > 1 ? `/news?page=${page}` : "/news";

  return {
    title: "News & Announcements",
    description:
      "Company news and product updates from the SafeRedact team, published after editorial review.",
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: "News & Announcements | SafeRedact",
      description: "Company news and product updates from the SafeRedact team.",
    },
  };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const page = parsePage((await searchParams).page);
  const articles = await loadPublishedArticles();
  const results = queryArticles(articles, { type: ANNOUNCEMENT_TYPES, page });

  if (page > 1 && (results.totalPages === 0 || page > results.totalPages)) notFound();

  return (
    <>
      <section className="blog-hero border-b border-border-subtle pt-[8.75rem] sm:pt-[10rem] lg:pt-[11.5rem]">
        <Container className="pb-14 sm:pb-16 lg:pb-20">
          <Eyebrow>SafeRedact newsroom</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink text-balance">
            News &amp; Announcements
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg leading-8 text-ink-muted">
            Company news and product updates, published after editorial review. For
            practical guidance and longer-form writing, see{" "}
            <Link
              href="/blog"
              className="rounded-sm text-accent-cool underline underline-offset-4 transition-colors hover:text-white"
            >
              Blog &amp; Insights
            </Link>
            .
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-16 lg:py-20" aria-label="News directory">
        <Container>
          {results.items.length ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow>Latest announcements</Eyebrow>
                  <h2 className="mt-3 font-heading text-heading-xl text-ink">
                    From the SafeRedact team
                  </h2>
                </div>
                <p className="text-body-sm text-ink-muted">
                  {results.totalItems} {results.totalItems === 1 ? "announcement" : "announcements"}
                </p>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.items.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
              <Pagination
                currentPage={results.page}
                totalPages={results.totalPages}
                basePath="/news"
              />
            </>
          ) : (
            <div className="mx-auto max-w-2xl rounded-panel border border-border-subtle bg-surface-raised px-6 py-12 text-center sm:px-10">
              <Eyebrow>Announcement queue</Eyebrow>
              <h2 className="mt-4 font-heading text-heading-xl text-ink">
                No announcements have been published yet
              </h2>
              <p className="mt-4 text-body leading-7 text-ink-muted">
                Approved SafeRedact company news and product updates will appear here after
                editorial review and publication.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
