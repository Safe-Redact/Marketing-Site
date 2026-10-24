import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { ArticleType } from "@/lib/blog/types";

/**
 * The content-type filters for the Insights hub.
 *
 * Insights is the single public content hub, so the filters are what tell a reader it
 * carries news and product updates as well as editorial writing. Each one is a plain
 * link, so filtered views are shareable, crawlable and work without JavaScript.
 */
export const CONTENT_FILTERS: ReadonlyArray<{ label: string; type: ArticleType | null; icon: string }> = [
  { label: "All content", type: null, icon: "layers" },
  { label: "Company News", type: "news", icon: "message-circle" },
  { label: "Product Updates", type: "product-update", icon: "settings" },
  { label: "Industry Insights", type: "article", icon: "file-text" },
  { label: "Guides & Tutorials", type: "guide", icon: "document" },
];

interface ContentTypeFilterProps {
  activeType: ArticleType | null;
  /** Carried through so a filter does not silently discard the reader's search. */
  query?: string;
  tag?: string;
  availableTypes?: readonly ArticleType[];
}

export function filterHref(type: ArticleType | null, query?: string, tag?: string): string {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (tag) params.set("tag", tag);
  if (query) params.set("query", query);
  const search = params.toString();
  return search ? `/blog?${search}` : "/blog";
}

export function ContentTypeFilter({ activeType, query, tag, availableTypes }: ContentTypeFilterProps) {
  if (availableTypes && availableTypes.length < 2 && !activeType) return null;

  const visibleFilters = availableTypes
    ? CONTENT_FILTERS.filter(
        ({ type }) => type === null || type === activeType || availableTypes.includes(type)
      )
    : CONTENT_FILTERS;

  return (
    <nav aria-label="Filter content by type" className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
      {visibleFilters.map(({ label, type, icon }) => {
        const isActive = activeType === type && (type !== null || !tag);
        return (
          <Link
            key={label}
            href={filterHref(type, query, tag)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-[2.375rem] shrink-0 items-center gap-2 rounded-full border px-3.5 text-body-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool",
              isActive
                ? "border-white bg-white text-canvas shadow-[0_6px_18px_rgba(0,0,0,0.16)]"
                : "border-border-subtle bg-surface-raised/70 text-ink-muted hover:border-accent-cool/40 hover:bg-surface-active hover:text-white"
            )}
          >
            <Icon name={icon} size={15} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
