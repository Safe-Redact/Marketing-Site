import React from "react";
import type { FeatureSlug } from "@/lib/marketing/content";
import { AudioDiagram, OutputCheckDiagram } from "@/components/media/Diagrams";
import { MediaSlot } from "@/components/media/MediaSlot";
import { ProductShot } from "@/components/media/ProductShot";

/**
 * Product visuals shared by the Features, How It Works, Industries and Why pages. All
 * captures are masked light-theme masters of the current build; the remaining ids are
 * labelled diagrams holding an asset-plan slot until an approved capture replaces them.
 */
export type FeatureVisualId =
  | "doc-output"
  | "aud-transcript"
  | "aud-range"
  | "aud-effects"
  // Masked captures of the current (light theme) application. Alt text describes what
  // each one actually shows, including views with no document open or nothing marked.
  | "aud-workspace"
  | "aud-workspace-story"
  | "aud-effects-panel"
  | "aud-export"
  | "doc-workspace-hero"
  | "doc-tools-light"
  | "doc-manual-light"
  | "doc-files-light"
  | "doc-export-settings"
  | "prj-hub"
  | "prj-hub-four-three";

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
    case "doc-output":
      return <MediaSlot slot="CAP-DOC-05" aspectRatio={diagramRatio}><OutputCheckDiagram /></MediaSlot>;
    case "aud-transcript":
      return <MediaSlot slot="CAP-AUD-01" aspectRatio={diagramRatio} glow="signal"><AudioDiagram variant="transcript" /></MediaSlot>;
    case "aud-range":
      return <MediaSlot slot="CAP-AUD-01" aspectRatio={diagramRatio} glow="signal"><AudioDiagram variant="range" /></MediaSlot>;
    case "aud-effects":
      return <MediaSlot slot="CAP-AUD-02" aspectRatio={diagramRatio} glow="signal"><AudioDiagram variant="effects" /></MediaSlot>;
    case "aud-workspace":
      return <ProductShot capture="audio-workspace" crop="workspace" mobileCrop="waveformSquare" glow="signal" alt="The OpenRedakt audio workspace: the Audio Tools panel with masking effects, a recording's waveform with transport controls, and the timeline overview" displayWidth={displayWidth} priority={priority} />;
    case "aud-workspace-story":
      return <ProductShot capture="audio-workspace" crop="workspaceFourThree" mobileCrop="waveformSquare" glow="signal" alt="The OpenRedakt audio workspace: masking effects and range controls beside a recording's waveform and transport controls" displayWidth={displayWidth} priority={priority} />;
    case "aud-effects-panel":
      return <ProductShot capture="audio-workspace" crop="effectsBeside" mobileCrop="effectsPanel" glow="signal" alt="OpenRedakt Audio Tools panel: masking effects including mute, tone, silence and noise, with start and end controls for a time range beside the waveform" displayWidth={displayWidth} priority={priority} />;
    case "aud-export":
      return <ProductShot capture="audio-export" crop="dialogFourThree" mobileCrop="summary" alt="OpenRedakt audio export dialog: the redacted copy is written as a new file with the chosen file type, audio output and export mode, and the original recording is left unchanged" displayWidth={displayWidth} priority={priority} />;
    case "doc-workspace-hero":
      return <ProductShot capture="document-workspace" crop="workspace" mobileCrop="manualMobile" alt="The OpenRedakt document workspace with no document open: tool rail, manual redaction panel, page tools, and the project panel listing files with their preparation status. Project and file names are blurred." displayWidth={displayWidth} priority={priority} />;
    case "doc-tools-light":
      return <ProductShot capture="document-workspace" crop="toolsCanvas" mobileCrop="manualMobile" alt="The OpenRedakt document workspace with no document open: the manual redaction panel with selection modes, redaction appearance and reasons, beside the tool rail and the page tools" displayWidth={displayWidth} priority={priority} />;
    case "doc-manual-light":
      return <ProductShot capture="document-workspace" crop="manualTools" mobileCrop="manualMobile" alt="OpenRedakt manual redaction panel: select marks or text, draw a free-form area, choose the redaction appearance and record a reason from the reason library. No document is open in this view." displayWidth={displayWidth} priority={priority} />;
    case "doc-files-light":
      return <ProductShot capture="document-workspace" crop="filesPanel" mobileCrop="filesMobile" alt="OpenRedakt workspace panel listing a project's files with their preparation status, and the action to add files. File and project names are blurred." displayWidth={displayWidth} priority={priority} />;
    case "doc-export-settings":
      return <ProductShot capture="document-export" crop="settings" alt="OpenRedakt document export settings: export folder and name, searchable PDF output, an optional audit report, and what the export will include. Nothing is marked in this view, so the export button is not yet available." displayWidth={displayWidth} priority={priority} />;
    case "prj-hub":
      return <ProductShot capture="project-workspace" crop="hub" mobileCrop="hubMobile" alt="The OpenRedakt project library: recent projects with their file counts and review status, library views such as Needs review and Exported, and a project to continue. Project names, folder paths and file names are blurred." displayWidth={displayWidth} priority={priority} />;
    case "prj-hub-four-three":
      return <ProductShot capture="project-workspace" crop="hubFourThree" mobileCrop="hubMobile" alt="The OpenRedakt project library: recent projects with their review status and a project to continue. Project names and folder paths are blurred." displayWidth={displayWidth} priority={priority} />;
  }
}

/** Hero, overview, and capability-row visuals per feature, chosen so no page repeats one. */
export const featureVisuals: Record<FeatureSlug, { hero: FeatureVisualId; overview: FeatureVisualId; sections: readonly (FeatureVisualId | null)[] }> = {
  // Light captures only. The candidate-review row has no visual: no light capture shows
  // the findings list yet (an optional future capture, CAP-DOC-01L).
  "document-redaction": { hero: "doc-workspace-hero", overview: "doc-files-light", sections: [null, "doc-tools-light", "doc-export-settings"] },
  // The transcript-context row has no visual of its own. The waveform row keeps its
  // diagram until a capture with a selected range exists (CAP-AUD-01).
  "audio-redaction": { hero: "aud-workspace", overview: "aud-effects-panel", sections: ["aud-range", "aud-effects-panel", null] },
};
