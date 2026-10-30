import React from "react";
import { ArchiveRow } from "@/components/blog/ArchiveRow";
import type { ArticleMonthGroup } from "@/lib/blog/types";

export function ArchiveMonth({ group }: { group: ArticleMonthGroup }) {
  const headingId = `archive-${group.key}`;

  return (
    <section
      aria-labelledby={headingId}
      className="pt-9 sm:pt-11"
    >
      <h2
        id={headingId}
        className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-ink-muted"
      >
        {group.label}
      </h2>

      <div className="relative mt-5 space-y-2 before:absolute before:bottom-5 before:left-6 before:top-5 before:w-px before:bg-border-subtle sm:before:left-7">
        {group.articles.map((article) => (
          <ArchiveRow key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
