import type { FaqItem } from "@/types";

export const faqItems: FaqItem[] = [
  {
    question: "What is document redaction?",
    answer:
      "Document redaction is the process of identifying sensitive information, selecting what should be removed, and creating an output intended for controlled sharing. The exported result should always be reviewed before use.",
  },
  {
    question: "What types of files can you redact?",
    answer:
      "SafeRedact has workflows for PDFs and supported converted documents, common image formats, audio, and video. Some document conversions and local AI features require optional components, so confirm a specific format before planning a production workflow around it.",
  },
  {
    question: "What information can be redacted?",
    answer:
      "Implemented visual detection targets include faces, license plates, and text. Document and transcript workflows can identify configured sensitive-information categories and patterns. Detection coverage varies, so reviewers should confirm every proposed redaction.",
  },
  {
    question: "How does SafeRedact work?",
    answer:
      "Open a file in a SafeRedact project, run the appropriate detection or transcription workflow, review or adjust the selections, and export the redacted output.",
  },
  {
    question: "Does SafeRedact work offline?",
    answer:
      "SafeRedact supports on-device detection, OCR, transcription, and rendering after the required local models and tools are installed. Optional AWS-backed engines can be selected per job; they are not required for local processing. Licensing requirements still apply.",
  },
  {
    question: "Can I review detected information?",
    answer:
      "Yes. SafeRedact lets reviewers approve, reject, adjust, add, or remove findings before export, with page, timeline, and transcript views suited to the content.",
  },
  {
    question: "What should I check before sharing an output?",
    answer:
      "Review the complete output, confirm that intended content remains readable, and verify that every selected redaction appears as expected for the file type.",
  },
  {
    question: "Which operating system is supported?",
    answer:
      "SafeRedact is available as desktop software for Windows.",
  },
  {
    question: "How do I get started?",
    answer:
      "Request a demo through the enquiry form, or email support@saferedact.io directly if you want to evaluate SafeRedact for your workflow.",
  },
];
