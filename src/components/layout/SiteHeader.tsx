"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PrimaryNavItem } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";
import { isRouteActive } from "@/lib/nav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { MobileNav } from "./MobileNav";
import { NavDropdown } from "./NavDropdown";

export function SiteHeader({ items, demoHref }: { items: readonly PrimaryNavItem[]; demoHref: string }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // The homepage keeps its on-page enquiry form; every other route uses /contact.
  const ctaHref = isHomePage ? "#demo-enquiry" : demoHref;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 992px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
      else setOpenMenu(null);
    };

    media.addEventListener("change", closeAtDesktop);
    return () => media.removeEventListener("change", closeAtDesktop);
  }, []);

  // A completed navigation closes whichever menu led to it.
  useEffect(() => {
    setOpenMenu(null);
    setIsOpen(false);
  }, [pathname]);

  const handleMenuChange = useCallback((id: string, open: boolean) => {
    setOpenMenu((current) => (open ? id : current === id ? null : current));
  }, []);

  const closeMenu = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.setTimeout(() => menuButtonRef.current?.focus(), 0);
    }
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] pt-3">
        <Container>
        <nav
          aria-label="Main navigation"
          className={cn(
            "pointer-events-auto flex h-[60px] items-center justify-between gap-4 rounded-[14px] border pl-4 pr-2.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none min-[992px]:h-16 min-[992px]:pr-3",
            isScrolled || openMenu
              ? "border-border-subtle/70 bg-canvas/85 shadow-[inset_0_1px_0_rgb(var(--or-fg)/0.06),0_18px_48px_rgb(0_0_0/0.45)]"
              : "border-border-subtle/45 bg-canvas/60 shadow-[inset_0_1px_0_rgb(var(--or-fg)/0.05)]"
          )}
        >
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-sm font-heading text-lg font-semibold tracking-[-0.03em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
            aria-label={`${siteConfig.name} home`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-accent-warm/30 bg-accent-warm/10">
              <Image src="/favicon.svg" alt="" width={18} height={18} priority />
            </span>
            <span><span className="text-accent-warm">Open</span>Redakt</span>
          </Link>

          <ul className="hidden items-stretch gap-0.5 self-stretch min-[992px]:flex xl:gap-1">
            {items.map((item) =>
              item.kind === "menu" ? (
                <NavDropdown key={item.id} item={item} isOpen={openMenu === item.id} pathname={pathname} onMenuChange={handleMenuChange} />
              ) : (
                <li key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    aria-current={isRouteActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "relative rounded-[8px] px-3 py-1.5 text-body-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none",
                      isRouteActive(pathname, item.href) ? "bg-surface-active/70 text-ink" : "text-ink-muted hover:bg-surface-active/50 hover:text-ink"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="hidden items-center min-[992px]:flex">
            <Button variant="primary" size="sm" asChild>
              <Link href={ctaHref}>Request a Demo</Link>
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-3 min-[992px]:hidden">
            <Button variant="primary" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href={ctaHref}>Request a Demo</Link>
            </Button>
            <button
              ref={menuButtonRef}
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border-subtle/70 text-ink transition-colors hover:bg-surface-active"
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              <Icon name={isOpen ? "close" : "menu"} size={22} />
            </button>
          </div>
        </nav>
        </Container>
      </header>

      <MobileNav isOpen={isOpen} onClose={closeMenu} pathname={pathname} items={items} ctaHref={ctaHref} />
    </>
  );
}
