import type { Service } from "@/types";

export const services: Service[] = [
  {
    icon: "video",
    title: "Video Redaction",
    description:
      "We redact faces, license plates, on-screen text, and sensitive audio from video files. Surveillance footage, body cameras, interviews, and corporate recordings are handled with precision.",
    capabilities: [
      "Face and person blurring",
      "License plate obscuration",
      "On-screen text redaction",
      "Audio muting and removal",
      "Multi-format support",
    ],
  },
  {
    icon: "audio",
    title: "Audio Redaction",
    description:
      "Sensitive names, numbers, and confidential discussions are permanently removed or masked from audio recordings. Ideal for legal proceedings, interviews, and medical recordings.",
    capabilities: [
      "Speech-to-text transcription",
      "PII detection in audio",
      "Mute, beep, or tone replacement",
      "Multiple format support",
      "Transcript-based review",
    ],
  },
  {
    icon: "document",
    title: "Document Redaction",
    description:
      "We securely redact personal data, financial details, case information, and classified content from PDFs, Word documents, scanned files, and other digital records.",
    capabilities: [
      "PDF and document redaction",
      "Scanned file processing",
      "PII and PHI detection",
      "Permanent text removal",
      "PDF/A and archival export",
    ],
  },
];
