import type { Service } from "@/types";

export const services: Service[] = [
  {
    icon: "document",
    title: "Document Redaction",
    description:
      "Open PDFs and supported converted formats, find sensitive text, and adjust text or area redactions before PDF export.",
    capabilities: [
      "PDF and converted document intake",
      "Text and OCR-assisted detection",
      "Manual text and area selection",
      "Page and project-scope review",
      "Redacted PDF output",
    ],
  },
  {
    icon: "audio",
    title: "Audio Redaction",
    description:
      "Transcribe speech, detect configured sensitive-information categories, and review time ranges before rendering audio.",
    capabilities: [
      "Local or configured transcription",
      "Transcript-based navigation",
      "Sensitive-information detection",
      "Mute, tone, and audio-mask effects",
      "Playback review",
    ],
  },
];
