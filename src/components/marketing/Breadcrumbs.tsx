import React from "react";
import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/structured-data";

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="type-meta flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <span key={item.path} className="inline-flex items-center gap-2">
          {index < items.length - 1 ? (
            <Link href={item.path} className="rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none">
              {item.name}
            </Link>
          ) : (
            <span aria-current="page" className="text-ink">{item.name}</span>
          )}
          {index < items.length - 1 ? <span aria-hidden="true" className="text-border-subtle">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

