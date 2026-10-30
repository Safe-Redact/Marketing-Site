"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PrimaryNavItem } from "@/content/navigation";
import { siteConfig } from "@/content/site";
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
        className="fixed inset-0 z-[65] bg-[rgb(28_25_23/0.35)] backdrop-blur-[2px] motion-safe:animate-fade-in min-[992px]:hidden"
        onClick={() => onClose(true)}
        aria-hidden="true"
      />

      <div
        id="mobile-navigation"
        ref={panelRef}
        className="fixed inset-x-3 top-3 z-[70] max-h-[calc(100dvh-24px)] overscroll-contain overflow-y-auto rounded-[24px] border border-border-subtle bg-canvas px-4 pb-5 pt-2 shadow-panel motion-safe:animate-fade-in sm:inset-x-5 min-[992px]:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* The sheet covers the header, so this is the only close control on screen. */}
        <div className="flex h-12 items-center justify-between pl-1">
          <span className="inline-flex items-center gap-2.5 font-heading text-[1.1875rem] font-semibold tracking-[-0.03em] text-ink" aria-hidden="true">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent-warm/15">
              <Image src="/favicon.svg" alt="" width={18} height={18} />
            </span>
            <span><span className="text-accent-ink">Open</span>Redakt</span>
          </span>
          <button
            type="button"
            onClick={() => onClose(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
            aria-label="Close mobile menu"
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav className="mx-auto mt-3 max-w-content" aria-label={`${siteConfig.name} mobile navigation`}>
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
                              current ? "bg-surface-active text-ink" : "text-ink-muted hover:bg-surface-active hover:text-ink"
                            )}
                          >
                            {link.icon ? <Icon name={link.icon} size={17} className="text-accent-ink" /> : null}
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
          <div className="mt-5 pt-1">
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
