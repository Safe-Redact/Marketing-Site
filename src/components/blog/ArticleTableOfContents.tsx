"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ArticleHeading } from "@/lib/blog/types";

export function selectActiveHeading(
  positions: ReadonlyArray<{ id: string; top: number }>,
  marker: number,
  atArticleEnd: boolean
): string | null {
  if (!positions.length) return null;
  if (atArticleEnd) return positions[positions.length - 1]?.id ?? null;

  const passed = positions.filter((position) => position.top <= marker);
  return passed[passed.length - 1]?.id ?? positions[0]?.id ?? null;
}

export function getNextTocScrollTop({
  scrollTop,
  scrollHeight,
  clientHeight,
  containerTop,
  itemTop,
  itemBottom,
  inset = 12,
}: {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  containerTop: number;
  itemTop: number;
  itemBottom: number;
  inset?: number;
}): number {
  if (clientHeight <= 0) return scrollTop;

  const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
  const visibleTop = containerTop + inset;
  const visibleBottom = containerTop + clientHeight - inset;
  const itemHeight = itemBottom - itemTop;
  const usableHeight = Math.max(0, clientHeight - inset * 2);
  let nextScrollTop = scrollTop;

  if (itemHeight > usableHeight || itemTop < visibleTop) {
    nextScrollTop += itemTop - visibleTop;
  } else if (itemBottom > visibleBottom) {
    nextScrollTop += itemBottom - visibleBottom;
  }

  return Math.min(maxScrollTop, Math.max(0, nextScrollTop));
}

export function ArticleTableOfContents({
  headings,
  compact = false,
}: {
  headings: readonly ArticleHeading[];
  compact?: boolean;
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const listRef = useRef<HTMLOListElement>(null);

  const updateActive = useCallback(() => {
    const positions = headings.flatMap((heading) => {
      const element = document.getElementById(heading.id);
      return element ? [{ id: heading.id, top: element.getBoundingClientRect().top }] : [];
    });
    const article = document.querySelector<HTMLElement>("[data-article-reading]");
    const atArticleEnd = article
      ? article.getBoundingClientRect().bottom <= window.innerHeight + 8
      : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    const next = selectActiveHeading(
      positions,
      Math.min(Math.max(window.innerHeight * 0.24, 128), 220),
      atArticleEnd
    );
    if (next) setActiveId(next);
  }, [headings]);

  useEffect(() => {
    if (headings.length < 3) return;
    const elements = headings.flatMap((heading) => {
      const element = document.getElementById(heading.id);
      return element ? [element] : [];
    });
    if (!elements.length) return;

    const fromHash = decodeURIComponent(window.location.hash.slice(1));
    if (headings.some((heading) => heading.id === fromHash)) setActiveId(fromHash);
    else updateActive();

    const observer = new IntersectionObserver(updateActive, {
      rootMargin: "-18% 0px -62% 0px",
      threshold: [0, 0.25, 0.75, 1],
    });
    elements.forEach((element) => observer.observe(element));
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    const followHistory = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!headings.some((heading) => heading.id === id)) {
        updateActive();
        return;
      }
      setActiveId(id);
      document.getElementById(id)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    };
    window.addEventListener("hashchange", followHistory);
    window.addEventListener("popstate", followHistory);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      window.removeEventListener("hashchange", followHistory);
      window.removeEventListener("popstate", followHistory);
    };
  }, [headings, updateActive]);

  useEffect(() => {
    const list = listRef.current;
    const activeLink = list?.querySelector<HTMLAnchorElement>(
      `[data-toc-id="${CSS.escape(activeId)}"]`
    );
    if (!list || !activeLink) return;

    const listRect = list.getBoundingClientRect();
    const activeRect = activeLink.getBoundingClientRect();
    const nextScrollTop = getNextTocScrollTop({
      scrollTop: list.scrollTop,
      scrollHeight: list.scrollHeight,
      clientHeight: list.clientHeight,
      containerTop: listRect.top,
      itemTop: activeRect.top,
      itemBottom: activeRect.bottom,
    });

    if (Math.abs(nextScrollTop - list.scrollTop) >= 1) {
      // Keep scrollspy following isolated to the bounded TOC viewport. Assigning
      // scrollTop avoids scrollIntoView moving the article or sticky ancestors.
      list.scrollTop = nextScrollTop;
    }
  }, [activeId]);

  if (headings.length < 3) return null;

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const hash = `#${id}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    setActiveId(id);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
    target.focus({ preventScroll: true });
  };

  const contents = (
    <ol
      ref={listRef}
      data-toc-scroll-region="true"
      className="article-toc-list mt-4 max-h-[min(24rem,calc(100vh-26rem))] space-y-1.5 overflow-y-auto border-l border-border-subtle pr-1"
    >
      {headings.map((heading) => (
        <li key={heading.id} className={heading.depth === 3 ? "pl-3" : undefined}>
          <a
            href={`#${heading.id}`}
            data-toc-id={heading.id}
            aria-current={activeId === heading.id ? "location" : undefined}
            onClick={(event) => navigate(event, heading.id)}
            className={cn(
              "-ml-px block border-l px-3 py-1.5 text-[0.8125rem] leading-5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none",
              activeId === heading.id
                ? "border-accent-warm font-medium text-ink"
                : "border-transparent font-normal text-ink-muted hover:border-accent-warm/55 hover:text-ink"
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (compact) {
    const activeHeading = headings.find((heading) => heading.id === activeId) ?? headings[0];
    return (
      <details
        data-toc-mode="compact"
        className="group rounded-[16px] border border-border-subtle bg-surface-raised/55 p-4 lg:hidden"
      >
        <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-4 rounded-sm font-heading text-caption font-semibold uppercase tracking-[0.12em] text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool [&::-webkit-details-marker]:hidden">
          <span>On this page</span>
          <span className="min-w-0 truncate normal-case tracking-normal text-ink">
            {activeHeading?.text}
          </span>
          <span aria-hidden="true" className="text-accent-cool transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <nav aria-label="On this page">{contents}</nav>
      </details>
    );
  }

  return (
    <nav
      aria-label="On this page"
      data-toc-mode="sidebar"
      className="hidden border-t border-border-subtle pt-5 lg:block"
    >
      <p className="font-heading text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">
        On this page
      </p>
      {contents}
    </nav>
  );
}
