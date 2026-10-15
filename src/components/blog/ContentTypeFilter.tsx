import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArticleType } from "@/lib/blog/types";

/**
 * The content-type filters for the Insights hub.
 *
 * Insights is the single public content hub, so the filters are what tell a reader it
 * carries news and product updates as well as editorial writing. Each one is a plain
 * link, so filtered views are shareable, crawlable and work without JavaScript.
 */
export const CONTENT_FILTERS: ReadonlyArray<{ label: string; type: ArticleType | null }> = [
  { label: "All content", type: null },
  { label: "Company News", type: "news" },
  { label: "Product Updates", type: "product-update" },
  { label: "Industry Insights", type: "article" },
  { label: "Guides & Tutorials", type: "guide" },
];

interface ContentTypeFilterProps {
  activeType: ArticleType | null;
  /** Carried through so a filter does not silently discard the reader's search. */
  query?: string;
}

export function filterHref(type: ArticleType | null, query?: string): string {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (query) params.set("query", query);
  const search = params.toString();
  return search ? `/blog?${search}` : "/blog";
}

export function ContentTypeFilter({ activeType, query }: ContentTypeFilterProps) {
  return (
    <nav aria-label="Filter content by type" className="flex flex-wrap gap-2">
      {CONTENT_FILTERS.map(({ label, type }) => {
        const isActive = activeType === type;
        return (
          <Link
            key={label}
            href={filterHref(type, query)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-4 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool",
              isActive
                ? "border-accent-cool/60 bg-accent-cool/10 text-accent-cool"
                : "border-border-subtle text-ink-muted hover:border-accent-cool/40 hover:text-ink"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
