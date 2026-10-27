"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PrimaryNavItem } from "@/content/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { isCurrentPage, isRouteActive } from "@/lib/nav";

interface MobileNavProps {
  isOpen: boolean;
  onClose: (restoreFocus?: boolean) => void;
  /** The current path, so a route link highlights only for its own route. */
  pathname: string;
  items: readonly PrimaryNavItem[];
  ctaHref: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav({ isOpen, onClose, pathname, items, ctaHref }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Each time the menu opens, expand only the group that contains the current page.
  useEffect(() => {
    if (!isOpen) return;
    setExpanded(
      Object.fromEntries(
        items.filter((item) => item.kind === "menu").map((item) => [item.id, isRouteActive(pathname, item.href)])
      )
    );
  }, [isOpen, items, pathname]);

  useEffect(() => {
    if (!isOpen) return;

    // Focusable elements change as groups expand, so the trap re-reads them per keypress.
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (element) => !element.closest("[hidden]")
      );
    const focusTimer = window.setTimeout(() => focusables()[0]?.focus(), 50);
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

      if (event.key !== "Tab") return;
      const elements = focusables();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;
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

  const linkClass = (active: boolean) =>
    cn(
      "flex min-h-12 items-center rounded-[10px] px-4 py-3 text-body-lg font-medium transition-colors motion-reduce:transition-none",
      active
        ? "bg-surface-active text-ink"
        : "text-ink-muted hover:bg-surface-active/70 hover:text-ink"
    );

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
        className="fixed inset-x-3 top-[80px] z-50 max-h-[calc(100dvh-92px)] overscroll-contain overflow-y-auto rounded-[16px] border border-border-subtle/70 bg-surface-raised/95 px-4 py-5 shadow-[inset_0_1px_0_rgb(var(--or-fg)/0.06),0_24px_60px_rgb(0_0_0/0.5)] backdrop-blur-xl motion-safe:animate-fade-in sm:inset-x-6 min-[992px]:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          type="button"
          onClick={() => onClose(true)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[10px] border border-border-subtle/70 text-ink transition-colors hover:bg-surface-active"
          aria-label="Close mobile menu"
        >
          <Icon name="close" size={22} />
        </button>
        <nav className="mx-auto max-w-content pt-11" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              if (item.kind === "link") {
                const active = isRouteActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={active ? "page" : undefined} onClick={() => onClose(false)} className={linkClass(active)}>
                      {item.label}
                    </Link>
                  </li>
                );
              }

              const open = Boolean(expanded[item.id]);
              const groupId = `mobile-group-${item.id}`;
              const sectionActive = isRouteActive(pathname, item.href);
              const links = item.footerLink ? [...item.links, item.footerLink] : item.links;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={groupId}
                    onClick={() => setExpanded((current) => ({ ...current, [item.id]: !current[item.id] }))}
                    className={cn(linkClass(sectionActive), "w-full justify-between text-left")}
                  >
                    {item.label}
                    <Icon name="chevron-down" size={20} className={cn("transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")} />
                  </button>
                  <ul id={groupId} hidden={!open} className="mb-2 ml-4 mt-1 border-l border-border-subtle/60 pl-3">
                    {links.map((link) => {
                      const current = isCurrentPage(pathname, link.href);
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            aria-current={current ? "page" : undefined}
                            onClick={() => onClose(false)}
                            className={cn(
                              "flex min-h-11 items-center gap-3 rounded-control px-3 py-2 text-body transition-colors motion-reduce:transition-none",
                              current ? "bg-surface-active text-white" : "text-ink-muted hover:bg-surface-active hover:text-white"
                            )}
                          >
                            {link.icon ? <Icon name={link.icon} size={17} className="text-accent-warm" /> : null}
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 border-t border-border-subtle/60 pt-5">
            <Button variant="primary" size="md" className="w-full" asChild>
              <Link href={ctaHref} onClick={() => onClose(false)}>
                Request a Demo
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
