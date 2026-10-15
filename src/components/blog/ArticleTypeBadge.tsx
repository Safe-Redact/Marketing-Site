import { articleTypeLabel, isAnnouncement } from "@/lib/blog/content";
import type { BlogArticle } from "@/lib/blog/types";

/**
 * Announcements carry the coral accent so a company update is never mistaken for
 * editorial writing in a mixed list. Articles and guides stay unlabelled, because a
 * badge on every card would be noise rather than a distinction.
 */
export function ArticleTypeBadge({ article, className }: { article: BlogArticle; className?: string }) {
  if (!isAnnouncement(article)) return null;

  return (
    <span
      className={`inline-flex items-center rounded-sm border border-accent-warm/40 bg-accent-warm/10 px-2 py-0.5 font-heading text-caption font-semibold uppercase tracking-[0.04em] text-accent-warm ${className ?? ""}`}
    >
      {articleTypeLabel(article.type)}
    </span>
  );
}
