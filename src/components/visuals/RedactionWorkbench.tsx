"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { workbenchLabels } from "@/content/platform";
import { ShowcaseThemeToggle } from "@/components/visuals/ShowcaseThemeToggle";
import { useShowcaseTheme } from "@/components/visuals/ShowcaseThemeProvider";
import {
  getShowcaseAspectRatio,
  resolveShowcaseScreenshot,
  showcaseScreenshots,
} from "@/components/visuals/showcase-screenshots";

/**
 * The hero product visual: the complete current editor capture, uncropped.
 *
 * The frame carries the screenshot's own aspect ratio rather than a fixed one, so
 * the whole application window is shown with nothing trimmed. At 608px wide that is
 * 379px tall, seven pixels more than the illustration it replaced — the hero's
 * layout, spacing and type are otherwise untouched.
 */
export function RedactionWorkbench({ className }: { className?: string }) {
  const { theme } = useShowcaseTheme();
  const variants = showcaseScreenshots.hero;
  const lightAvailable = variants.light !== null;
  const effectiveTheme = lightAvailable ? theme : "dark";
  const screenshot = resolveShowcaseScreenshot(variants, effectiveTheme);

  return (
    <figure
      className={cn(
        "product-visual relative mx-auto w-full max-w-[608px] overflow-hidden",
        className
      )}
      style={{ aspectRatio: getShowcaseAspectRatio(variants) }}
      aria-label={workbenchLabels.figureLabel}
      data-hero-workbench
    >
      <ShowcaseThemeToggle
        lightAvailable={lightAvailable}
        className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3"
      />
      <Image
        key={`hero-${effectiveTheme}`}
        src={screenshot.src}
        alt={screenshot.alt}
        fill
        sizes="(max-width: 991px) 100vw, 608px"
        quality={92}
        className="object-cover motion-safe:animate-fade-in"
        priority
      />
      <figcaption className="sr-only">{workbenchLabels.caption}</figcaption>
    </figure>
  );
}
