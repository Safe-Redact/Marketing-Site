/**
 * Marketing media registry (D2). Only captures that may be published are listed here;
 * every crop is in source pixels and stays clear of the status bar, which carries
 * wording ("Permanent export") the claim policy avoids.
 *
 * Deliberately excluded (see docs/marketing/product-screenshot-manifest.md):
 *   format-audio.png   source-data provenance unconfirmed; status bar shows a local path
 *   format-video.png   third-party broadcast watermark and identifiable people
 *   step-open.png      legacy "Safe Redact" branding, test file names, local paths
 *   step-export.png    "Permanent removal" wording
 * Where those would have appeared, pages use a MediaSlot with a truthful diagram.
 */

export type CaptureId = "document-editor" | "document-editor-hero";

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
  // Approved for Stage B reuse: synthetic financial statement, no real personal data.
  "document-editor": {
    src: "/images/product/format-documents.png",
    revision: "88730f63e860",
    width: 1451,
    height: 853,
    crops: {
      page: { x: 398, y: 142, w: 548, h: 663 },
      pageWithFindings: { x: 362, y: 88, w: 1038, h: 734 },
      findings: { x: 982, y: 86, w: 418, h: 736 },
      manualPanel: { x: 62, y: 86, w: 290, h: 714 },
      toolsAndPage: { x: 60, y: 86, w: 888, h: 714 },
      pageCloseup: { x: 360, y: 140, w: 600, h: 450 },
      toolsWide: { x: 60, y: 86, w: 960, h: 600 },
      // 4:3 detail crops for capability rows: the page beside each side panel.
      findingsBeside: { x: 640, y: 86, w: 760, h: 570 },
      manualBeside: { x: 62, y: 86, w: 760, h: 570 },
    },
  },
  // Same synthetic scenario; approved for homepage use.
  "document-editor-hero": {
    src: "/images/product/hero-document-review.png",
    revision: "0191b36dbce8",
    width: 1438,
    height: 859,
    crops: {
      pageWithFindings: { x: 360, y: 86, w: 1040, h: 736 },
      page: { x: 396, y: 142, w: 548, h: 663 },
    },
  },
};

/**
 * Replacement slots from the asset production plan. Each placeholder diagram carries
 * its slot id in `data-media-slot`, so it can be swapped for an approved capture
 * without restructuring the page.
 */
export const mediaSlots = {
  "CAP-AUD-01": "Audio range on the waveform with transcript context (synthetic recording)",
  "CAP-AUD-02": "Audio effect choice and preview",
  "CAP-VID-01": "Video frame with a supported region effect over owned footage",
  "CAP-VID-02": "Video candidate list with confirmed and rejected items",
  "CAP-VID-03": "Video timeline with visual and audio ranges",
  "CAP-PRJ-01": "Project workspace with synthetic mixed-format projects",
  "CAP-EXP-01": "Export dialog with output options",
  "CAP-DOC-05": "Re-opened output with the output-check result",
} as const;

export type MediaSlotId = keyof typeof mediaSlots;
