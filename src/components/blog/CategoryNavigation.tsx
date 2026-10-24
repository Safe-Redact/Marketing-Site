import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryNavigationProps {
  categories: Array<{ name: string; slug: string }>;
  activeSlug?: string;
  /**
   * Whether to offer the "All insights" escape link. The Insights hub sets this false:
   * its content-type row already owns an "All content" chip pointing at the same URL,
   * and two identical chips both claiming `aria-current="page"` told a screen-reader
   * user they were on two different pages at once.
   */
  showAllLink?: boolean;
}

export function CategoryNavigation({
  categories,
  activeSlug,
  showAllLink = true,
}: CategoryNavigationProps) {
  if (!categories.length) return null;

  return (
    <nav aria-label="Article categories" className="flex max-w-full gap-2 overflow-x-auto pb-1 xl:flex-wrap xl:justify-end xl:overflow-visible">
      {showAllLink ? (
        <Link
          href="/blog"
          aria-current={!activeSlug ? "page" : undefined}
          className={cn(
            "inline-flex min-h-[2.375rem] shrink-0 items-center rounded-full border px-4 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool",
            !activeSlug
              ? "border-white bg-white text-canvas"
              : "border-border-subtle bg-surface-raised text-ink-muted hover:border-accent-cool/40 hover:text-white"
          )}
        >
          All insights
        </Link>
      ) : null}
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/blog/category/${category.slug}`}
          aria-current={activeSlug === category.slug ? "page" : undefined}
          className={cn(
            "inline-flex min-h-[2.375rem] shrink-0 items-center rounded-full border px-4 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool",
            activeSlug === category.slug
              ? "border-white bg-white text-canvas"
              : "border-border-subtle bg-surface-raised text-ink-muted hover:border-accent-cool/40 hover:text-white"
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
