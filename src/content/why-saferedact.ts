import type { Differentiator } from "@/types";

export const differentiators: Differentiator[] = [
  {
    icon: "layers",
    title: "Multi-Format Workflows",
    description:
      "Work with documents and audio in one Windows desktop application.",
  },
  {
    icon: "brain",
    title: "AI-Assisted Detection",
    description:
      "Use AI-assisted detection to identify candidate sensitive information for review.",
  },
  {
    icon: "check-circle",
    title: "Review Controls",
    description:
      "Confirm or adjust suggested redactions before creating the output file.",
  },
  {
    icon: "file-text",
    title: "Project Workspace",
    description:
      "Keep mixed source files, findings, redaction controls, and exports together by project.",
  },
  {
    icon: "settings",
    title: "Format-Aware Review",
    description:
      "Use pages for documents, a timeline for media, and transcripts for spoken content.",
  },
  {
    icon: "clock",
    title: "Local Processing Options",
    description:
      "Run supported AI, OCR, and transcription workflows on-device after setup; optional cloud engines are configured per job.",
  },
];
