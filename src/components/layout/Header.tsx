"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-primary-800/95 backdrop-blur-md shadow-lg"
            : "bg-primary-800"
        )}
      >
        <nav
          className="mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <a
            href="#"
            className="text-xl font-bold text-white"
          >
            <span className="text-accent">Safe</span>Redact
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-body-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <Button variant="primary" size="sm" asChild>
              <a href="#contact">Request a Quote</a>
            </Button>
          </div>

          <button
            className="flex items-center justify-center text-white md:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <Icon name="menu" size={24} />
          </button>
        </nav>
      </header>

      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
