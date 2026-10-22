"use client";

import Image from "next/image";
import { workflowPreviewLabels, workflowSteps } from "@/content/platform";
import { ShowcaseThemeToggle } from "@/components/visuals/ShowcaseThemeToggle";
import { useShowcaseTheme } from "@/components/visuals/ShowcaseThemeProvider";
import {
  getShowcaseAspectRatio,
  resolveShowcaseScreenshot,
  showcaseScreenshots,
  type ShowcaseScreenshotId,
} from "@/components/visuals/showcase-screenshots";

/**
 * One authentic capture per workflow step, so selecting a step shows the screen that
 * step actually happens on: the project workspace, the editor mid-review, and the
 * export dialog with its verification notice.
 */
const stepScreenshotIds: ShowcaseScreenshotId[] = [
  "workflow-open",
  "workflow-review",
  "workflow-export",
];

interface WorkflowPreviewProps {
  activeIndex: number;
}

export function WorkflowPreview({ activeIndex }: WorkflowPreviewProps) {
  const { theme } = useShowcaseTheme();
  const active = workflowSteps[activeIndex] ?? workflowSteps[0];
  const screenshotId = stepScreenshotIds[activeIndex] ?? stepScreenshotIds[0];
  const variants = showcaseScreenshots[screenshotId];
  const lightAvailable = variants.light !== null;
  const effectiveTheme = lightAvailable ? theme : "dark";
  const screenshot = resolveShowcaseScreenshot(variants, effectiveTheme);

  return (
    <figure
      className="relative overflow-hidden rounded-panel border border-border-subtle bg-[#0c111f] p-4 shadow-panel sm:p-6"
      aria-label={workflowPreviewLabels.figureLabel}
    >
      <div
        data-showcase-theme-controls="true"
        className="relative mb-3 flex min-h-7 items-center justify-end"
      >
        <ShowcaseThemeToggle lightAvailable={lightAvailable} />
      </div>

      <div
        data-showcase-screenshot="true"
        className="product-visual relative w-full overflow-hidden"
        style={{ aspectRatio: getShowcaseAspectRatio(variants) }}
      >
        <Image
          key={`${screenshotId}-${effectiveTheme}`}
          src={screenshot.src}
          alt={screenshot.alt}
          fill
          sizes="(max-width: 639px) 100vw, 640px"
          quality={92}
          className="object-cover motion-safe:animate-fade-in"
        />
      </div>
      <p className="relative mt-3 flex items-center gap-2 text-[10px] text-accent-mint">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {active.title}
      </p>
      <figcaption className="sr-only">
        {workflowPreviewLabels.caption}
      </figcaption>
    </figure>
  );
}
