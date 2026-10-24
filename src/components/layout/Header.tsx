"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { isRouteActive } from "@/lib/nav";
import { navLinks, siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { useActiveSection } from "@/hooks/useActiveSection";
import { MobileNav } from "./MobileNav";

const sectionHrefs = navLinks
  .map((link) => link.href)
  .filter((href) => href.startsWith("#"));

export function Header({ variant = "default" }: { variant?: "default" | "editorial" }) {
  const pathname = usePathname();
  const editorial = variant === "editorial";
  const isHomePage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeHref = useActiveSection(isHomePage ? sectionHrefs : []);
  const resolveHref = (href: string) =>
    href.startsWith("#") && !isHomePage ? `/${href}` : href;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 992px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    media.addEventListener("change", closeAtDesktop);
    return () => media.removeEventListener("change", closeAtDesktop);
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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] border-b transition-all duration-300",
          editorial
            ? isScrolled
              ? "border-editorial-line bg-white/95 shadow-[0_8px_28px_rgba(23,31,46,0.08)] backdrop-blur-xl"
              : "border-transparent bg-white"
            : isScrolled
              ? "border-border-subtle bg-canvas/95 shadow-[0_8px_32px_rgba(0,0,0,0.24)] backdrop-blur-xl"
              : "border-transparent bg-canvas"
        )}
      >
        <Container as="nav" className="flex h-[78px] items-center justify-between gap-5 min-[992px]:h-[94px]" aria-label="Main navigation">
          <a
            href={isHomePage ? "#main-content" : "/"}
            className={cn(
              "inline-flex shrink-0 items-center gap-2.5 font-heading text-xl font-semibold tracking-[-0.03em]",
              editorial ? "text-editorial-ink" : "text-white"
            )}
            aria-label={`${siteConfig.name} home`}
          >
            <span className={cn(
              "flex h-8 w-8 items-center justify-center rounded-control border",
              editorial ? "border-editorial-line bg-editorial-soft" : "border-accent-warm/30 bg-accent-warm/10"
            )}>
              <Image src="/favicon.svg" alt="" width={22} height={22} priority />
            </span>
            <span><span className="text-accent-warm">Open</span>Redakt</span>
          </a>

          <div className="hidden items-center gap-3 min-[992px]:flex min-[1120px]:gap-4 xl:gap-6">
            {navLinks.map((link) => {
              if (link.href.startsWith("#")) {
                return (
                  <a
                    key={link.href}
                    href={resolveHref(link.href)}
                    aria-current={activeHref === link.href ? "location" : undefined}
                    className={cn(
                      "relative rounded-sm px-0.5 py-2 text-body-sm font-medium transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-accent-cool after:transition-transform after:duration-300",
                      activeHref === link.href
                        ? editorial
                          ? "text-editorial-ink after:scale-x-100"
                          : "text-white after:scale-x-100"
                        : editorial
                          ? "text-editorial-muted after:scale-x-0 hover:text-editorial-ink"
                          : "text-ink-muted after:scale-x-0 hover:text-white"
                    )}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isRouteActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-sm px-0.5 py-2 text-body-sm font-medium transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-accent-cool after:transition-transform after:duration-300",
                    isRouteActive(pathname, link.href)
                      ? editorial
                        ? "text-editorial-ink after:scale-x-100"
                        : "text-white after:scale-x-100"
                      : editorial
                        ? "text-editorial-muted after:scale-x-0 hover:text-editorial-ink"
                        : "text-ink-muted after:scale-x-0 hover:text-white"
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 min-[992px]:flex">
            {editorial ? (
              <>
                <a
                  href={resolveHref("#services")}
                  className="inline-flex min-h-11 items-center rounded-control border border-editorial-line px-5 text-body-sm font-semibold text-editorial-ink transition-colors hover:bg-editorial-soft focus-visible:ring-2 focus-visible:ring-editorial-blue"
                >
                  Explore Platform
                </a>
                <a
                  href={resolveHref("#demo-enquiry")}
                  className="inline-flex min-h-11 items-center rounded-control bg-editorial-ink px-5 text-body-sm font-semibold text-white transition-colors hover:bg-[#292D39] focus-visible:ring-2 focus-visible:ring-editorial-blue"
                >
                  Request a Demo
                </a>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <a href={resolveHref("#services")}>Explore Platform</a>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <a href={resolveHref("#demo-enquiry")}>Request a Demo</a>
                </Button>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3 min-[992px]:hidden">
            {editorial ? (
              <a
                href={resolveHref("#demo-enquiry")}
                className="hidden min-h-11 items-center rounded-control bg-editorial-ink px-5 text-body-sm font-semibold text-white sm:inline-flex"
              >
                Request a Demo
              </a>
            ) : (
              <Button variant="primary" size="sm" className="hidden sm:inline-flex" asChild>
                <a href={resolveHref("#demo-enquiry")}>Request a Demo</a>
              </Button>
            )}
            <button
              ref={menuButtonRef}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-control border transition-colors",
                editorial
                  ? "border-editorial-line text-editorial-ink hover:bg-editorial-soft"
                  : "border-border-subtle text-white hover:border-accent-cool/55 hover:bg-surface-raised"
              )}
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              <Icon name={isOpen ? "close" : "menu"} size={24} />
            </button>
          </div>
        </Container>
      </header>

      <MobileNav
        isOpen={isOpen}
        onClose={closeMenu}
        activeHref={activeHref}
        pathname={pathname}
        isHomePage={isHomePage}
        variant={variant}
      />
    </>
  );
}
