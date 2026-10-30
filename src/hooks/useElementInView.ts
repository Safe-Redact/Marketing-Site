"use client";

import { useEffect, useState } from "react";

/**
 * Whether any element matching `selector` intersects the viewport, narrowed by
 * `rootMargin`. Re-queries when `key` changes (pass the pathname), so it follows
 * client-side navigation. Returns `initial` until the observer reports, and `false`
 * when nothing matches.
 */
export function useElementInView(selector: string, { rootMargin = "0px", key, initial = false }: { rootMargin?: string; key?: string; initial?: boolean } = {}) {
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));
    if (elements.length === 0 || typeof IntersectionObserver === "undefined") {
      setInView(false);
      return;
    }
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setInView(visible.size > 0);
    }, { rootMargin });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [selector, rootMargin, key]);

  return inView;
}
