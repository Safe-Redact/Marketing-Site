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
      "OpenRedakt has workflows for PDFs and supported converted documents, plus supported audio recordings. Some document conversions and local AI features require optional components, so confirm a specific format before planning a production workflow around it.",
  },
  {
    question: "What information can be redacted?",
    answer:
      "Document and transcript workflows can identify configured sensitive-information categories and patterns. Detection coverage varies, so reviewers should confirm every proposed redaction before export.",
  },
  {
    question: "How does OpenRedakt work?",
    answer:
      "Open a file in an OpenRedakt project, run the appropriate detection or transcription workflow, review or adjust the selections, and export the redacted output.",
  },
  {
    question: "Does OpenRedakt work offline?",
    answer:
      "OpenRedakt supports on-device detection, OCR, transcription, and rendering after the required local models and tools are installed. Optional AWS-backed engines can be selected per job; they are not required for local processing. Licensing requirements still apply.",
  },
  {
    question: "Can I review detected information?",
    answer:
      "Yes. OpenRedakt lets reviewers approve, reject, adjust, add, or remove findings before export, with page and transcript views suited to the content.",
  },
  {
    question: "What should I check before sharing an output?",
    answer:
      "Review the complete output, confirm that intended content remains readable, and verify that every selected redaction appears as expected for the file type.",
  },
  {
    question: "Which operating system is supported?",
    answer:
      "OpenRedakt is available as desktop software for Windows.",
  },
  {
    question: "How do I get started?",
    answer:
      "Request a demo through the enquiry form, or use the current support email if you want to evaluate OpenRedakt for your workflow.",
  },
];
