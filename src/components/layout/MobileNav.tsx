"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-primary-800 transition-transform duration-300 ease-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <a
            href="#"
            className="text-xl font-bold text-white"
            onClick={onClose}
          >
            <span className="text-accent">Safe</span>Redact
          </a>
          <button
            onClick={onClose}
            className="text-white/70 transition-colors hover:text-white"
            aria-label="Close menu"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-control px-4 py-3 text-body-lg font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-6 px-6">
          <Button variant="primary" size="md" className="w-full" asChild>
            <a href="#contact" onClick={onClose}>
              Request a Quote
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
