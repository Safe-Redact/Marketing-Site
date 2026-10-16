import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface TagNavigationProps {
  tags: Array<{ name: string; slug: string; count: number }>;
  activeSlug?: string;
  query?: string;
  type?: string;
}

export function tagHref(slug: string, query?: string, type?: string): string {
  const parameters = new URLSearchParams();
  if (type) parameters.set("type", type);
  parameters.set("tag", slug);
  if (query) parameters.set("query", query);
  return `/blog?${parameters.toString()}`;
}

export function TagNavigation({ tags, activeSlug, query, type }: TagNavigationProps) {
  if (!tags.length) return null;

  return (
    <nav aria-label="Filter content by tag" className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-heading text-caption font-semibold uppercase tracking-[0.05em] text-ink-muted">
        Topics
      </span>
      {tags.map((tag) => {
        const isActive = activeSlug === tag.slug;
        return (
          <Link
            key={tag.slug}
            href={tagHref(tag.slug, query, type)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-caption font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool",
              isActive
                ? "border-accent-cool/60 bg-accent-cool/10 text-accent-cool"
                : "border-border-subtle text-ink-muted hover:border-accent-cool/40 hover:text-ink"
            )}
          >
            {tag.name} <span className="text-[0.7rem] opacity-70">{tag.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
