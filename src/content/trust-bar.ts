import type { TrustPillar } from "@/types";

export const capabilityStripHeading =
  "Redaction workflows for the formats your team handles";

export const trustPillars: TrustPillar[] = [
  {
    icon: "document",
    title: "Documents & images",
    description: "Review text and visual regions in documents and still images.",
  },
  {
    icon: "video",
    title: "Video",
    description: "Detect faces, license plates, and text, or add regions manually.",
  },
  {
    icon: "audio",
    title: "Audio",
    description: "Use transcription and time-range controls for spoken information.",
  },
  {
    icon: "download",
    title: "Offline on Windows",
    description: "Use on-device processing after the required models and tools are set up.",
  },
];
