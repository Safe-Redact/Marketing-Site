"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PrimaryNavItem } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { useElementInView } from "@/hooks/useElementInView";
import { cn } from "@/lib/utils";
import { isRouteActive } from "@/lib/nav";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MobileNav } from "./MobileNav";
import { NavDropdown } from "./NavDropdown";

/** The homepage hero's dark field: before scrolling, the open bar uses light text over it. */
const DARK_HERO = "[data-hero-dark]";
/** The header's own band: the top 8% of the viewport. */
const HEADER_BAND = "0px 0px -92% 0px";

export function SiteHeader({ items, demoHref }: { items: readonly PrimaryNavItem[]; demoHref: string }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const ctaHref = demoHref;
  const overDarkHero = useElementInView(DARK_HERO, { rootMargin: HEADER_BAND, key: pathname, initial: isHomePage });
  const menuOpen = Boolean(openMenu) || isOpen;
  // At rest the bar is open and transparent; scrolled (or with a menu open) it becomes a
  // compact frosted pill with dark text, readable over the hero, dark and light sections.
  const compact = isScrolled || menuOpen;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
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

  const linkClass = (active: boolean) =>
    cn(
      "relative rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none",
      active ? "text-ink" : "text-ink-muted hover:bg-ink/[0.06] hover:text-ink"
    );

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5">
        <div
          className={cn(
            "pointer-events-auto mx-auto rounded-full border transition-[max-width,background-color,border-color,box-shadow] duration-300 ease-standard motion-reduce:transition-none",
            compact
              ? "max-w-[62rem] border-[rgb(28_25_23/0.06)] bg-white/80 shadow-[0_10px_34px_-14px_rgb(28_25_23/0.28)] backdrop-blur-xl"
              : cn("max-w-[74rem] border-transparent bg-transparent", overDarkHero && "theme-dark nav-on-hero")
          )}
        >
          <nav aria-label="Main navigation" className="grid h-14 grid-cols-[1fr_auto] items-center gap-4 pl-4 pr-2 min-[992px]:grid-cols-[1fr_auto_1fr]">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2.5 justify-self-start rounded-sm font-heading text-[1.1875rem] font-semibold tracking-[-0.03em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
              aria-label={`${siteConfig.name} home`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent-warm/15">
                <Image src="/favicon.svg" alt="" width={18} height={18} priority />
              </span>
              <span><span className="text-accent-ink">Open</span>Redakt</span>
            </Link>

            <ul className="hidden items-center gap-0.5 min-[992px]:flex">
              {items.map((item) =>
                item.kind === "menu" ? (
                  <NavDropdown key={item.id} item={item} isOpen={openMenu === item.id} pathname={pathname} onMenuChange={handleMenuChange} />
                ) : (
                  <li key={item.href} className="flex items-center">
                    <Link
                      href={item.href}
                      aria-current={isRouteActive(pathname, item.href) ? "page" : undefined}
                      className={linkClass(isRouteActive(pathname, item.href))}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>

            <div className="hidden items-center justify-self-end min-[992px]:flex">
              <Button variant="primary" size="sm" asChild>
                <Link href={ctaHref}>Request a Demo</Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 justify-self-end min-[992px]:hidden">
              <Button variant="primary" size="sm" className="hidden sm:inline-flex" asChild>
                <Link href={ctaHref}>Request a Demo</Link>
              </Button>
              <button
                ref={menuButtonRef}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
              >
                <Icon name="menu" size={20} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <MobileNav isOpen={isOpen} onClose={closeMenu} pathname={pathname} items={items} ctaHref={ctaHref} />
    </>
  );
}
