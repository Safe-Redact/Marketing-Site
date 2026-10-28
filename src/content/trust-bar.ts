import type { TrustPillar } from "@/types";

export const capabilityStripHeading =
  "Redaction workflows for the formats your team handles";

export const trustPillars: TrustPillar[] = [
  {
    icon: "document",
    title: "Documents",
    description: "Review detected text and manual selections in document context.",
  },
  {
    icon: "audio",
    title: "Audio",
    description: "Use transcription and time-range controls for spoken information.",
  },
  {
    icon: "check-circle",
    title: "Review before export",
    description: "Approve, reject, or adjust candidate findings before output.",
  },
  {
    icon: "settings",
    title: "Windows desktop",
    description: "Use supported local workflows after required components are configured.",
  },
];
