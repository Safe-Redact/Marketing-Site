/**
 * Marketing media registry. Only captures that may be published are listed here, and
 * these are the only files scripts/build-product-images.mjs publishes to
 * public/images/product/. Every crop is in the served file's pixels. All captures are
 * masked masters of the current light-theme build: names, paths, unconnected controls
 * and entries for unpromoted formats are baked out of the pixels (ProductShot crops
 * with CSS, so the whole file reaches the browser).
 *
 * Deliberately not published (see docs/marketing/product-screenshot-manifest.md and
 * docs/design/product-visual-audit.md):
 *   hero-document-review.png, format-documents.png   dark theme of an earlier build;
 *                      product imagery is light-theme only since 2026-10-30
 *   format-audio.png   source-data provenance unconfirmed; status bar shows a local path
 *   format-video.png   third-party broadcast watermark and identifiable people
 *   homepage.png       legacy "Safe Redact" branding, test file names, local paths
 *   workflow-export-…  "Export failed" state and "Permanent removal" wording
 * Where those would have appeared, pages use a MediaSlot with a truthful diagram.
 */

export type CaptureId =
  | "audio-workspace"
  | "audio-export"
  | "project-workspace"
  | "document-workspace"
  | "document-export"
  | "editorial-document-cover";

export type Crop = { x: number; y: number; w: number; h: number };

export type Capture = {
  src: string;
  /** Content-derived revision, so a replaced file cannot be served from a stale URL. */
  revision: string;
  width: number;
  height: number;
  crops: Record<string, Crop>;
};

export const captures: Record<CaptureId, Capture> = {
  // Masked master from "audio interface.png" (build 0.3.3, light theme): the audio
  // editor with no range selected. Project file names, the side panel and the icon rail
  // are softened or masked; title and status bars are cropped away.
  "audio-workspace": {
    src: "/images/product/audio-workspace.png",
    revision: "6ab06c9ada24",
    width: 1431,
    height: 832,
    crops: {
      workspace: { x: 0, y: 0, w: 1431, h: 832 },
      // Homepage story row: tools panel, waveform, transport and timeline overview, ending
      // at the waveform's edge. Same ratio as the document story crop (1.396).
      story: { x: 77, y: 0, w: 990, h: 709 },
      // Phones (4:5): waveform, transport and timeline.
      storyMobile: { x: 380, y: 0, w: 666, h: 832 },
      // Phones: the waveform, transport and the start of the timeline.
      waveformSquare: { x: 360, y: 51, w: 705, h: 705 },
      // The effects panel beside the start of the waveform.
      effectsBeside: { x: 77, y: 51, w: 760, h: 570 },
      // 4:3: tools panel, waveform and transport, for rows and tiles of 4:3 frames.
      workspaceFourThree: { x: 77, y: 46, w: 990, h: 743 },
      // Phones: the effects grid and the range controls.
      effectsPanel: { x: 85, y: 106, w: 260, h: 325 },
    },
  },
  // Masked master from "audio export.png": the audio export dialog on the plain editor
  // surface. The file name and location are masked; the "Schedule optional" control (not
  // connected yet) is frosted.
  "audio-export": {
    src: "/images/product/audio-export.png",
    revision: "72c0e91b5274",
    width: 1100,
    height: 688,
    crops: {
      // 16:10 with the surface around the dialog (homepage workflow steps).
      stepWide: { x: 0, y: 0, w: 1100, h: 688 },
      dialog: { x: 90, y: 35, w: 930, h: 650 },
      // 4:3 for rows of 4:3 frames (How It Works stages, industry rows).
      dialogFourThree: { x: 122, y: 35, w: 866, h: 650 },
      // Phones: the explanation column, legible at small sizes.
      summary: { x: 104, y: 48, w: 300, h: 375 },
    },
  },
  // Masked master from "home pag workspace.png" (build 0.3.3, light): the project
  // library. Project names, folder paths and file chips are masked; file-type icons are
  // softened on every thumbnail alike; title and status bars are cropped away.
  "project-workspace": {
    src: "/images/product/project-workspace.png",
    revision: "c6a8707ed118",
    width: 1438,
    height: 832,
    crops: {
      // Crops start at x 3: the capture's left edge carries a dashed window-snap line.
      hub: { x: 3, y: 0, w: 1435, h: 832 },
      // 16:10; the search field runs past the right edge.
      hubStep: { x: 3, y: 0, w: 1331, h: 832 },
      // 4:3 (How It Works stages).
      hubFourThree: { x: 3, y: 0, w: 1109, h: 832 },
      // Phones: the library list and the project to continue.
      hubMobile: { x: 3, y: 0, w: 666, h: 832 },
    },
  },
  // Masked master from "document interface.png" (build 0.3.3, light): the document
  // workspace with no document open. Project and file names are masked; the status bar
  // (a test file name and an import refused for a licence key) is cropped away. Used
  // only where the copy describes the workspace and its tools, never as a finished review.
  "document-workspace": {
    src: "/images/product/document-workspace.png",
    revision: "7b6464add20f",
    width: 1437,
    height: 824,
    crops: {
      workspace: { x: 0, y: 0, w: 1437, h: 824 },
      // Homepage story row: toolbar, tool rail, manual panel and page, ending at the page's
      // edge. Same ratio as the audio story crop (1.396), so both rows render alike.
      story: { x: 0, y: 0, w: 955, h: 684 },
      // 4:3: toolbar, tool rail, manual redaction panel, page tools and page.
      toolsCanvas: { x: 0, y: 0, w: 950, h: 712 },
      // 4:3: tool rail and the manual redaction panel through the reason library.
      manualTools: { x: 0, y: 40, w: 760, h: 570 },
      // Phones: tool rail and manual redaction panel.
      manualMobile: { x: 0, y: 46, w: 362, h: 452 },
      // 4:3: the project panel, files with their preparation status, as the subject.
      filesPanel: { x: 860, y: 96, w: 577, h: 433 },
      // Phones: the workspace panel.
      filesMobile: { x: 960, y: 112, w: 477, h: 596 },
    },
  },
  // Masked master from "document export.png": the settings column of the document export
  // dialog, as captured with nothing marked yet (the export button is unavailable).
  "document-export": {
    src: "/images/product/document-export.png",
    revision: "2426131cd4ab",
    width: 598,
    height: 620,
    crops: {
      settings: { x: 0, y: 0, w: 598, h: 620 },
    },
  },
  // Editorial cover from "document interface.png": the manual redaction tools beside the
  // page, softened and warmly tinted. A fallback for articles without their own image.
  "editorial-document-cover": {
    src: "/images/product/editorial-document-cover.png",
    revision: "f9944220fa4e",
    width: 950,
    height: 534,
    crops: {
      cover: { x: 0, y: 0, w: 950, h: 534 },
    },
  },
};

/** URL of a capture's served file, versioned by content so a replaced file is never stale. */
export function captureUrl(id: CaptureId): string {
  return `${captures[id].src}?v=${captures[id].revision}`;
}

/**
 * Replacement slots from the asset production plan. Each placeholder diagram carries
 * its slot id in `data-media-slot`, so it can be swapped for an approved capture
 * without restructuring the page.
 */
export const mediaSlots = {
  "CAP-AUD-01": "Audio range on the waveform with transcript context (synthetic recording)",
  "CAP-AUD-02": "Audio effect choice and preview",
  "CAP-PRJ-01": "Project workspace with synthetic mixed-format projects",
  "CAP-EXP-01": "Export dialog with output options",
  "CAP-DOC-05": "Re-opened output with the output-check result",
} as const;

export type MediaSlotId = keyof typeof mediaSlots;
