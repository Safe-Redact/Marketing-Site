export type ShowcaseTheme = "dark" | "light";

export interface ShowcaseScreenshot {
  src: string;
  revision?: string;
  alt: string;
  width: number;
  height: number;
}

export interface ShowcaseScreenshotVariants {
  dark: ShowcaseScreenshot;
  light: ShowcaseScreenshot | null;
}

export const DEFAULT_SHOWCASE_THEME: ShowcaseTheme = "dark";

export const showcaseScreenshots = {
  hero: {
    dark: {
      src: "/images/product/hero-document-review.png",
      alt: "Screenshot of the current redaction editor showing a document mid-review with detected items ready for an operator to accept or adjust",
      width: 1460,
      height: 873,
    },
    light: null,
  },
  "workflow-open": {
    dark: {
      src: "/images/product/step-open.png",
      alt: "Screenshot of the current project workspace listing recent redaction projects with their type, status and progress",
      width: 1467,
      height: 844,
    },
    light: null,
  },
  "workflow-review": {
    dark: {
      src: "/images/product/step-review.png",
      alt: "Screenshot of the current document editor: a page marked for redaction beside the manual redaction tools and the findings list",
      width: 1463,
      height: 869,
    },
    light: null,
  },
  "workflow-export": {
    dark: {
      src: "/images/product/step-export.png",
      alt: "Screenshot of the current export dialog: output settings beside a notice that every export is re-opened and checked by a second engine before it is published",
      width: 1048,
      height: 655,
    },
    light: null,
  },
  "format-document": {
    dark: {
      src: "/images/product/format-documents.png",
      revision: "88730f63e860",
      alt: "Screenshot of the current document editor: a page marked for redaction beside the manual redaction tools, the reason library and the findings list",
      width: 1451,
      height: 853,
    },
    light: null,
  },
  "format-audio": {
    dark: {
      src: "/images/product/format-audio.png",
      revision: "7cea80fa1e6e",
      alt: "Screenshot of the current audio workspace: a waveform beside a speaker-separated transcript, with transport controls and the timeline below",
      width: 1634,
      height: 910,
    },
    light: null,
  },
  "format-video": {
    dark: {
      src: "/images/product/format-video.png",
      revision: "b710e68fb2dd",
      alt: "Screenshot of the current video workspace: a frame in the preview pane with the pixelate effect and its level, beside the project files and the timeline",
      width: 1327,
      height: 808,
    },
    light: null,
  },
} satisfies Record<string, ShowcaseScreenshotVariants>;

export type ShowcaseScreenshotId = keyof typeof showcaseScreenshots;

export function resolveShowcaseScreenshot(
  variants: ShowcaseScreenshotVariants,
  theme: ShowcaseTheme
): ShowcaseScreenshot {
  return theme === "light" && variants.light ? variants.light : variants.dark;
}

export function getShowcaseAspectRatio(variants: ShowcaseScreenshotVariants): string {
  return `${variants.dark.width} / ${variants.dark.height}`;
}

export function getShowcaseImageUrl(screenshot: ShowcaseScreenshot): string {
  return screenshot.revision ? `${screenshot.src}?v=${screenshot.revision}` : screenshot.src;
}

export function selectShowcaseTheme(
  current: ShowcaseTheme,
  requested: ShowcaseTheme,
  lightAvailable: boolean
): ShowcaseTheme {
  if (requested === "light" && !lightAvailable) return current === "light" ? "dark" : current;
  return requested;
}
