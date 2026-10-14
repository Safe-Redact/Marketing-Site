"use client";

import { useEffect, useRef } from "react";
import { navLinks } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: (restoreFocus?: boolean) => void;
  activeHref: string | null;
  isHomePage: boolean;
  isBlogPage: boolean;
}

export function MobileNav({ isOpen, onClose, activeHref, isHomePage, isBlogPage }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    const focusTimer = window.setTimeout(() => first?.focus(), 50);
    const outsideLandmarks = Array.from(
      document.querySelectorAll<HTMLElement>("header, main, footer")
    );
    const previousInertState = outsideLandmarks.map((element) =>
      element.hasAttribute("inert")
    );
    outsideLandmarks.forEach((element) => element.setAttribute("inert", ""));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose(true);
        return;
      }

      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      outsideLandmarks.forEach((element, index) => {
        if (!previousInertState[index]) element.removeAttribute("inert");
      });
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/55 motion-safe:animate-fade-in min-[992px]:hidden"
        onClick={() => onClose(true)}
        aria-hidden="true"
      />

      <div
        id="mobile-navigation"
        ref={panelRef}
        className="fixed inset-x-0 top-[78px] z-50 max-h-[calc(100dvh-78px)] overscroll-contain overflow-y-auto border-y border-border-subtle bg-surface-raised px-5 py-6 shadow-panel motion-safe:animate-fade-in min-[992px]:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          type="button"
          onClick={() => onClose(true)}
          className="absolute right-5 top-4 flex h-10 w-10 items-center justify-center rounded-control border border-border-subtle text-ink transition-colors hover:border-accent-cool/55 hover:bg-surface-active"
          aria-label="Close mobile menu"
        >
          <Icon name="close" size={22} />
        </button>
        <nav className="mx-auto flex max-w-content flex-col gap-1 pt-11" aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const href = link.href.startsWith("#") && !isHomePage ? `/${link.href}` : link.href;
            if (link.href.startsWith("#")) {
              return (
                <a
                  key={link.href}
                  href={href}
                  aria-current={activeHref === link.href ? "location" : undefined}
                  onClick={() => onClose(false)}
                  className={cn(
                    "rounded-control border-l-2 px-4 py-3 text-body-lg font-medium transition-colors",
                    activeHref === link.href
                      ? "border-accent-cool bg-surface-active text-white"
                      : "border-transparent text-ink-muted hover:bg-surface-active hover:text-white"
                  )}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <a
                key={link.href}
                href={href}
                aria-current={isBlogPage ? "page" : undefined}
                onClick={() => onClose(false)}
                className={cn(
                  "rounded-control border-l-2 px-4 py-3 text-body-lg font-medium transition-colors",
                  isBlogPage
                    ? "border-accent-cool bg-surface-active text-white"
                    : "border-transparent text-ink-muted hover:bg-surface-active hover:text-white"
                )}
              >
                {link.label}
              </a>
            );
          })}
          <div className="mt-5 grid gap-3 border-t border-border-subtle pt-5 sm:grid-cols-2">
            <Button variant="ghost" size="md" className="w-full" asChild>
              <a href={isHomePage ? "#services" : "/#services"} onClick={() => onClose(false)}>Explore Platform</a>
            </Button>
            <Button variant="primary" size="md" className="w-full" asChild>
              <a href={isHomePage ? "#demo-enquiry" : "/#demo-enquiry"} onClick={() => onClose(false)}>
                Request a Demo
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
