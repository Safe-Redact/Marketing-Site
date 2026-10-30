"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Whether an animation should be doing work right now: false while the element is
 * off-screen or the document is hidden. Also reports the reduced-motion preference.
 */
export function useMotionGate(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    const syncVisibility = () => setDocumentVisible(document.visibilityState === "visible");
    syncMotion();
    syncVisibility();
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);

    const node = ref.current;
    let observer: IntersectionObserver | undefined;
    if (node && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
      observer.observe(node);
    }
    return () => {
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer?.disconnect();
    };
  }, [ref]);

  return { active: inView && documentVisible, reducedMotion };
}
