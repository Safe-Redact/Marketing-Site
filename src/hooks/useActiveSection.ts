"use client";

import { useEffect, useState } from "react";

export function useActiveSection(hrefs: readonly string[]) {
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const sections = hrefs
      .map((href) => ({ href, element: document.getElementById(href.slice(1)) }))
      .filter(
        (entry): entry is { href: string; element: HTMLElement } =>
          entry.element !== null
      );
    if (sections.length === 0) return;

    let frameId = 0;
    const updateActiveSection = () => {
      frameId = 0;
      const headerHeight =
        document.querySelector<HTMLElement>("header")?.offsetHeight ?? 0;
      const activationLine =
        headerHeight + Math.min(160, window.innerHeight * 0.22);
      const active = sections.find(({ element }) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top <= activationLine && bounds.bottom > activationLine;
      });

      setActiveHref((current) =>
        current === (active?.href ?? null) ? current : active?.href ?? null
      );
    };

    const scheduleUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [hrefs]);

  return activeHref;
}
