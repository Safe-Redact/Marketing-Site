"use client";

import Image from "next/image";
import { ShowcaseThemeToggle } from "@/components/visuals/ShowcaseThemeToggle";
import { useShowcaseTheme } from "@/components/visuals/ShowcaseThemeProvider";
import {
  getShowcaseAspectRatio,
  getShowcaseImageUrl,
  resolveShowcaseScreenshot,
  showcaseScreenshots,
  type ShowcaseScreenshot,
  type ShowcaseScreenshotId,
  type ShowcaseScreenshotVariants,
} from "@/components/visuals/showcase-screenshots";

interface FormatPreviewProps {
  visual: string;
  fileLabel: string;
}

/**
 * The per-format panel under "Why OpenRedakt".
 *
 * All three formats show authentic captures of the application, each at its own
 * aspect ratio so the whole screen is visible rather than cropped into a fixed box.
 */
const formatScreenshotIds: Record<string, ShowcaseScreenshotId> = {
  document: "format-document",
  audio: "format-audio",
  video: "format-video",
};

export function FormatPreview({ visual }: FormatPreviewProps) {
  const { theme } = useShowcaseTheme();
  const screenshotId = formatScreenshotIds[visual];
  const variants = screenshotId ? showcaseScreenshots[screenshotId] : null;
  const lightAvailable = variants?.light != null;
  const effectiveTheme = lightAvailable ? theme : "dark";
  const screenshot = variants ? resolveShowcaseScreenshot(variants, effectiveTheme) : null;

  return (
    <figure className="relative overflow-hidden rounded-panel border border-border-subtle bg-[#0c111f] p-3 sm:p-4">
      {screenshot && variants ? (
        <>
          <div
            data-showcase-theme-controls="true"
            className="relative mb-3 flex min-h-7 items-center justify-end"
          >
            <ShowcaseThemeToggle lightAvailable={lightAvailable} />
          </div>
          <ScreenshotPanel
            screenshot={screenshot}
            screenshotId={screenshotId}
            variants={variants}
            theme={effectiveTheme}
          />
        </>
      ) : null}
      <figcaption className="sr-only">{screenshot?.alt}</figcaption>
    </figure>
  );
}

/**
 * Full width of the figure, at the screenshot's own aspect ratio, so the whole
 * application screen is visible and nothing is cropped. The earlier 380px width cap
 * was inherited from the illustration these replaced and stranded the screenshot in
 * empty space.
 */
function ScreenshotPanel({
  screenshot,
  screenshotId,
  variants,
  theme,
}: {
  screenshot: ShowcaseScreenshot;
  screenshotId: ShowcaseScreenshotId;
  variants: ShowcaseScreenshotVariants;
  theme: "dark" | "light";
}) {
  const { alt, revision } = screenshot;
  const src = getShowcaseImageUrl(screenshot);

  return (
    <div
      data-showcase-screenshot="true"
      className="product-visual relative w-full overflow-hidden"
      style={{ aspectRatio: getShowcaseAspectRatio(variants) }}
    >
      <Image
        key={`${screenshotId}-${theme}-${revision ?? "unversioned"}`}
        src={src}
        alt={alt}
        fill
        // ~290px on a phone, ~612px from sm; 2x of the widest case keeps UI text crisp.
        sizes="(max-width: 639px) 100vw, 640px"
        quality={92}
        className="object-contain motion-safe:animate-fade-in"
      />
    </div>
  );
}
