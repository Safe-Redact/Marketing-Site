"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
}: AnimateOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const bounds = node.getBoundingClientRect();
    const isInitiallyVisible =
      bounds.top < window.innerHeight && bounds.bottom > 0;

    if (
      reducedMotion ||
      typeof window.IntersectionObserver === "undefined" ||
      isInitiallyVisible
    ) {
      node.setAttribute("data-revealed", "true");
      return;
    }

    let revealFrame = 0;
    let isPrepared = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (!entry.isIntersecting) {
          if (!isPrepared) {
            node.setAttribute("data-reveal-ready", "true");
            isPrepared = true;
          }
          return;
        }

        if (!isPrepared) {
          node.setAttribute("data-reveal-ready", "true");
          isPrepared = true;
        }
        revealFrame = window.requestAnimationFrame(() => {
          node.setAttribute("data-revealed", "true");
          observer.unobserve(node);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    observer.observe(node);

    return () => {
      window.cancelAnimationFrame(revealFrame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn("reveal-on-scroll", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
