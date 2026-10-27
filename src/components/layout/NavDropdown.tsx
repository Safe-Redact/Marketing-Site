"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import type { PrimaryNavItem } from "@/content/navigation";
import { Icon } from "@/components/ui/Icon";
import { isCurrentPage, isRouteActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

type MenuItem = Extract<PrimaryNavItem, { kind: "menu" }>;

/** Delay before a hover-opened menu closes, so a pointer can cross into the panel. */
const HOVER_CLOSE_DELAY = 160;

/**
 * Disclosure-pattern navigation menu: a button toggles a panel of ordinary links.
 * The panel stays in the server-rendered HTML (hidden until opened) so every link is
 * crawlable, and it is not given `role="menu"`, which would change how screen readers
 * announce plain site navigation.
 */
export function NavDropdown({
  item,
  isOpen,
  pathname,
  onMenuChange,
}: {
  item: MenuItem;
  isOpen: boolean;
  pathname: string;
  onMenuChange: (id: string, open: boolean) => void;
}) {
  const containerRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const openedByHover = useRef(false);
  const pendingFocus = useRef<"first" | "last" | null>(null);
  const panelId = `nav-menu-${item.id}`;
  const sectionActive = isRouteActive(pathname, item.href);

  const setOpen = useCallback((open: boolean) => onMenuChange(item.id, open), [item.id, onMenuChange]);
  const clearCloseTimer = () => window.clearTimeout(closeTimer.current);

  const links = () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!isOpen) {
      openedByHover.current = false;
      return;
    }
    if (pendingFocus.current) {
      const items = links();
      (pendingFocus.current === "first" ? items[0] : items[items.length - 1])?.focus();
      pendingFocus.current = null;
    }
    const closeOnOutsidePointer = (event: globalThis.PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    // Escape is handled at the document so a hover-opened menu closes even when focus
    // is elsewhere; focus returns to the trigger only if it was inside this menu.
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const hadFocus = containerRef.current?.contains(document.activeElement);
      setOpen(false);
      if (hadFocus) buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, setOpen]);

  const handlePointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearCloseTimer();
    if (!isOpen) {
      openedByHover.current = true;
      setOpen(true);
    }
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
  };

  const handleClick = () => {
    clearCloseTimer();
    // A hover-opened menu stays open on the first click instead of snapping shut.
    if (isOpen && openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    setOpen(!isOpen);
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const target = event.key === "ArrowDown" ? "first" : "last";
    if (isOpen) {
      const items = links();
      (target === "first" ? items[0] : items[items.length - 1])?.focus();
    } else {
      pendingFocus.current = target;
      setOpen(true);
    }
  };

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = links();
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next = {
      ArrowDown: (index + 1) % items.length,
      ArrowUp: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <li
      ref={containerRef}
      className="relative flex items-center"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onBlur={(event) => {
        if (isOpen && !containerRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-active={sectionActive || undefined}
        onClick={handleClick}
        onKeyDown={handleButtonKeyDown}
        className={cn(
          "relative inline-flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-body-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none",
          sectionActive || isOpen ? "bg-surface-active/70 text-ink" : "text-ink-muted hover:bg-surface-active/50 hover:text-ink"
        )}
      >
        {item.label}
        {sectionActive ? <span className="sr-only"> (current section)</span> : null}
        <Icon name="chevron-down" size={15} className={cn("transition-transform duration-200 motion-reduce:transition-none", isOpen && "rotate-180")} />
      </button>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!isOpen}
        onKeyDown={handlePanelKeyDown}
        className="absolute left-0 top-full z-10 pt-3 motion-safe:animate-fade-in"
      >
        <div className={cn("rounded-[14px] border border-border-subtle/70 bg-surface-raised/95 p-1.5 shadow-[inset_0_1px_0_rgb(var(--or-fg)/0.06),0_24px_60px_rgb(0_0_0/0.5)] backdrop-blur-xl", item.id === "industries" ? "w-[25rem]" : "w-[21rem]")}>
          <ul>
            {item.links.map((link) => {
              const current = isCurrentPage(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-start gap-3 rounded-[10px] px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cool motion-reduce:transition-none",
                      current ? "bg-surface-active" : "hover:bg-surface-active focus-visible:bg-surface-active"
                    )}
                  >
                    {link.icon ? (
                      <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-control border", current ? "border-accent-warm/50 bg-accent-warm/10 text-accent-warm" : "border-border-subtle/70 text-ink-muted")}>
                        <Icon name={link.icon} size={16} />
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span className={cn("block text-body-sm font-semibold", current ? "text-white" : "text-ink")}>{link.label}</span>
                      {link.description ? <span className="mt-0.5 block text-caption leading-5 text-ink-muted">{link.description}</span> : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {item.footerLink ? (
            <div className="mt-1 border-t border-border-subtle/60 px-1 pt-1">
              <Link
                href={item.footerLink.href}
                aria-current={isCurrentPage(pathname, item.footerLink.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-control px-3 py-2.5 text-body-sm font-semibold text-accent-warm transition-colors hover:bg-surface-active focus-visible:bg-surface-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cool motion-reduce:transition-none"
              >
                {item.footerLink.label}
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}
