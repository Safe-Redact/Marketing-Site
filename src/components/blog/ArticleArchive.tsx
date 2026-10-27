import React from "react";
import { ArchiveMonth } from "@/components/blog/ArchiveMonth";
import type { ArticleMonthGroup } from "@/lib/blog/types";

export function ArticleArchive({
  groups,
  totalItems,
  contextLabel = "Latest from OpenRedakt",
}: {
  groups: readonly ArticleMonthGroup[];
  totalItems: number;
  contextLabel?: string;
}) {
  return (
    <section aria-label="Chronological article archive" className="mt-14 sm:mt-16 lg:mt-20">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-heading text-caption font-semibold uppercase tracking-[0.14em] text-accent-warm">
            Archive
          </p>
          <p className="mt-2 font-heading text-[clamp(1.5rem,2.8vw,2.15rem)] font-semibold tracking-[-0.025em] text-ink">
            {contextLabel}
          </p>
        </div>
        <p className="text-body-sm text-ink-muted">
          {totalItems} {totalItems === 1 ? "published story" : "published stories"}
        </p>
      </div>

      {groups.map((group) => (
        <ArchiveMonth key={group.key} group={group} />
      ))}
    </section>
  );
}
