import React from "react";
import type { FeatureSlug } from "@/lib/marketing/content";
import { AudioDiagram, OutputCheckDiagram, VideoDiagram } from "@/components/media/Diagrams";
import { MediaSlot } from "@/components/media/MediaSlot";
import { ProductShot } from "@/components/media/ProductShot";

/**
 * Every visual on the Features pages. Document visuals are crops of the approved
 * synthetic capture; audio, video, and output visuals are labelled diagrams that hold
 * their asset-plan slot until an approved capture replaces them.
 */
export type FeatureVisualId =
  | "doc-overview"
  | "doc-closeup"
  | "doc-findings"
  | "doc-manual"
  | "doc-output"
  | "aud-transcript"
  | "aud-range"
  | "aud-effects"
  | "vid-lanes"
  | "vid-region"
  | "vid-candidates";

const DIAGRAM_RATIO = "16 / 10";

export function FeatureVisual({
  visual,
  displayWidth = 640,
  priority = false,
  diagramRatio = DIAGRAM_RATIO,
}: {
  visual: FeatureVisualId;
  displayWidth?: number;
  priority?: boolean;
  /** Frame ratio for diagrams; captures keep their crop's ratio. */
  diagramRatio?: string;
}) {
  switch (visual) {
    case "doc-overview":
      return <ProductShot capture="document-editor" crop="pageWithFindings" alt="OpenRedakt document review: a synthetic financial statement with reviewer-controlled marks beside the findings list" displayWidth={displayWidth} priority={priority} />;
    case "doc-closeup":
      return <ProductShot capture="document-editor" crop="pageCloseup" alt="Close view of a synthetic financial statement with redaction marks placed for review" displayWidth={displayWidth} priority={priority} />;
    case "doc-findings":
      return <ProductShot capture="document-editor" crop="findingsBeside" alt="OpenRedakt findings list beside the marked page, with each candidate awaiting a reviewer decision" displayWidth={displayWidth} priority={priority} />;
    case "doc-manual":
      return <ProductShot capture="document-editor" crop="manualBeside" alt="OpenRedakt manual redaction panel with text and area selection modes beside the page" displayWidth={displayWidth} priority={priority} />;
    case "doc-output":
      return <MediaSlot slot="CAP-DOC-05" aspectRatio={diagramRatio}><OutputCheckDiagram /></MediaSlot>;
    case "aud-transcript":
      return <MediaSlot slot="CAP-AUD-01" aspectRatio={diagramRatio} glow="signal"><AudioDiagram variant="transcript" /></MediaSlot>;
    case "aud-range":
      return <MediaSlot slot="CAP-AUD-01" aspectRatio={diagramRatio} glow="signal"><AudioDiagram variant="range" /></MediaSlot>;
    case "aud-effects":
      return <MediaSlot slot="CAP-AUD-02" aspectRatio={diagramRatio} glow="signal"><AudioDiagram variant="effects" /></MediaSlot>;
    case "vid-lanes":
      return <MediaSlot slot="CAP-VID-03" aspectRatio={diagramRatio}><VideoDiagram variant="lanes" /></MediaSlot>;
    case "vid-region":
      return <MediaSlot slot="CAP-VID-01" aspectRatio={diagramRatio}><VideoDiagram variant="region" /></MediaSlot>;
    case "vid-candidates":
      return <MediaSlot slot="CAP-VID-02" aspectRatio={diagramRatio}><VideoDiagram variant="candidates" /></MediaSlot>;
  }
}

/** Hero, overview, and capability-row visuals per feature, chosen so no page repeats one. */
export const featureVisuals: Record<FeatureSlug, { hero: FeatureVisualId; overview: FeatureVisualId; sections: readonly (FeatureVisualId | null)[] }> = {
  "document-redaction": { hero: "doc-overview", overview: "doc-overview", sections: ["doc-findings", "doc-manual", "doc-output"] },
  // The transcript-context row has no visual of its own: the hero already shows it.
  "audio-redaction": { hero: "aud-transcript", overview: "aud-range", sections: ["aud-range", "aud-effects", null] },
  "video-redaction": { hero: "vid-lanes", overview: "vid-candidates", sections: ["vid-candidates", "vid-region", null] },
};
