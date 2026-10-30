import { articleTypeLabel, isAnnouncement } from "@/lib/blog/content";
import { cn } from "@/lib/utils";
import type { BlogArticle } from "@/lib/blog/types";

/**
 * The content type, on every card.
 *
 * Insights is one hub carrying news, product updates, articles and guides together,
 * so a reader needs to know which is which at a glance. Announcements take the coral
 * accent; editorial writing takes a quieter outline, so the badge informs without
 * turning the grid into a wall of colour.
 */
export function ArticleTypeBadge({ article, className }: { article: BlogArticle; className?: string }) {
  const announcement = isAnnouncement(article);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-heading text-caption font-semibold uppercase tracking-[0.04em]",
        announcement
          ? "border-accent-warm/40 bg-accent-warm/10 text-accent-ink"
          : "border-border-subtle text-ink-muted",
        className
      )}
    >
      {articleTypeLabel(article.type)}
    </span>
  );
}
