"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";
import { selectShowcaseTheme, type ShowcaseTheme } from "@/components/visuals/showcase-screenshots";
import { useShowcaseTheme } from "@/components/visuals/ShowcaseThemeProvider";

interface ShowcaseThemeToggleProps {
  lightAvailable: boolean;
  className?: string;
}

const themes: ShowcaseTheme[] = ["dark", "light"];

export function ShowcaseThemeToggle({ lightAvailable, className }: ShowcaseThemeToggleProps) {
  const { theme, setTheme } = useShowcaseTheme();
  const descriptionId = useId();
  const effectiveTheme = lightAvailable ? theme : "dark";

  return (
    <div className={cn("relative z-10", className)}>
      <div
        role="group"
        aria-label="Product screenshot theme"
        aria-describedby={!lightAvailable ? descriptionId : undefined}
        className="inline-flex items-center rounded-full border border-white/15 bg-[#080b13]/90 p-0.5 shadow-lg shadow-black/20 backdrop-blur-md"
      >
        {themes.map((option) => {
          const unavailable = option === "light" && !lightAvailable;
          const selected = effectiveTheme === option;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              disabled={unavailable}
              onClick={() => setTheme(selectShowcaseTheme(theme, option, lightAvailable))}
              className={cn(
                "min-h-7 rounded-full px-2.5 font-heading text-[10px] font-semibold capitalize tracking-wide transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b13] motion-reduce:transition-none",
                selected
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-ink-muted hover:bg-white/[0.07] hover:text-white",
                unavailable && "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-ink-muted"
              )}
            >
              {option === "dark" ? "Dark" : "Light"}
            </button>
          );
        })}
      </div>
      {!lightAvailable ? (
        <span id={descriptionId} className="sr-only">
          Light screenshot not yet available.
        </span>
      ) : null}
    </div>
  );
}
