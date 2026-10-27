import type { ClaimId, MarketingFaq, SeoFields } from "@/lib/marketing/content";
import type { MediaFormat } from "@/lib/marketing/industries";

/** Supporting marketing pages. Each owns one search intent and one H1. */
export type SupportingPageContent = {
  eyebrow: string;
  h1: string;
  summary: string;
  seo: SeoFields & { primaryIntent: string; secondaryThemes: readonly string[] };
  lastReviewed: `${number}-${number}-${number}`;
};

export const industriesHub = {
  eyebrow: "Industries",
  h1: "Industry guides to document, audio, and video redaction.",
  summary:
    "Every sector protects different people and answers to different recipients. Find the records, recordings, and footage your team handles, then see which reviewer-controlled OpenRedakt workflows apply.",
  seo: {
    title: "Redaction Software by Industry and Use Case",
    description:
      "See how redaction needs differ across legal, government, healthcare, finance, insurance, education, HR, and media teams, and which OpenRedakt workflows fit each.",
    canonicalPath: "/industries",
    primaryIntent: "redaction software by industry",
    secondaryThemes: ["redaction use cases", "industry redaction requirements", "who uses redaction software"],
  },
  lastReviewed: "2026-10-26",
  dimensions: [
    { title: "What counts as sensitive", description: "An account number in a statement, a witness in an investigation report, a bystander's face in a news clip. The category changes with the sector." },
    { title: "Who receives the record", description: "The public, a court, a regulator, a researcher, or the person the record is about. Each recipient changes what must be removed." },
    { title: "Which media carry it", description: "Some teams work almost entirely in documents. Others depend on recorded statements, meetings, dashcam, or interview footage." },
    { title: "What must be explained later", description: "Disclosures get challenged. Where that happens, the reason behind each mark matters as much as the mark itself." },
  ],
  faq: [
    {
      question: "Are the industry guides different products?",
      answer:
        "No. Every guide uses the same Windows desktop application and the same document, audio, and video workflows. The guides differ in which records, risks, and checks matter to each sector.",
    },
    {
      question: "Does OpenRedakt hold industry-specific certifications?",
      answer:
        "No. OpenRedakt does not claim certification or compliance under named sector regulations. It provides a review workflow; your legal and governance teams decide what each disclosure requires.",
    },
    {
      question: "Why isn't my industry listed?",
      answer:
        "We publish an industry guide only when we can describe its workflows accurately. If your sector is missing, the feature pages explain each workflow, and a demo can test it against your own representative files.",
    },
  ] satisfies MarketingFaq[],
} satisfies SupportingPageContent & Record<string, unknown>;

export type LifecycleStage = {
  id: string;
  title: string;
  summary: string;
  formats: Record<MediaFormat, string>;
  claimIds: readonly ClaimId[];
};

export const howItWorksPage = {
  eyebrow: "How it works",
  h1: "How OpenRedakt takes a file from source to reviewed output.",
  summary:
    "Every format follows the same discipline: open the source, make it reviewable, find or mark sensitive content, decide on each mark, render a new file, and inspect what will actually be shared.",
  seo: {
    title: "How Redaction Review Works, Step by Step",
    description:
      "Follow the OpenRedakt lifecycle from opening a document, recording, or video through candidate review, manual marks, export, output inspection, and reporting.",
    canonicalPath: "/how-it-works",
    primaryIntent: "how redaction software works",
    secondaryThemes: ["redaction workflow", "redaction process steps", "how to redact audio and video", "redaction review process"],
  },
  lastReviewed: "2026-10-26",
  stages: [
    {
      id: "import",
      title: "Open a supported source",
      summary: "Bring a document, image, recording, or video into the workflow suited to its format.",
      formats: {
        document: "PDFs open natively. Images and supported office formats are converted for document review; several formats need LibreOffice installed.",
        audio: "Common audio formats open on a waveform and timeline once FFmpeg tooling is configured.",
        video: "MP4, MOV, AVI, MKV, and WebM containers open for frame and timeline review, subject to the codecs in the file.",
      },
      claimIds: ["DOC-INPUT", "AUD-INPUT", "VID-INPUT"],
    },
    {
      id: "prepare",
      title: "Make the content reviewable",
      summary: "Give the reviewer something to read, hear, or see in context before any mark is made.",
      formats: {
        document: "Native text is used where it exists; configured OCR recognises text on scans and image-only pages.",
        audio: "An available transcript can sit beside the waveform as context. It is not treated as an exact timing source.",
        video: "Frames, timing, and the audio track are presented together so visual and spoken content can be reviewed in one project.",
      },
      claimIds: ["DOC-OCR", "AUD-TRANSCRIPT-CONTEXT"],
    },
    {
      id: "find",
      title: "Find candidates or mark directly",
      summary: "Use configured detection where it helps, and place marks yourself wherever judgement is needed.",
      formats: {
        document: "Configured engines surface candidate findings; reviewers also select text or draw areas on the page.",
        audio: "Reviewers drag or enter the start and end of each sensitive span on the manual timeline.",
        video: "Configured engines surface face, licence-plate, and visible-text candidates; reviewers draw manual regions for anything else.",
      },
      claimIds: ["DOC-CANDIDATES", "DOC-MANUAL", "AUD-TIMELINE", "VID-DETECTION", "VID-MANUAL"],
    },
    {
      id: "review",
      title: "Decide, adjust, and record",
      summary: "Every candidate and mark is a decision a reviewer makes, not one the software makes for them.",
      formats: {
        document: "Approve, reject, or edit each mark, adjust its appearance, and record the reason for it.",
        audio: "Choose mute, tone, silence, or a supported noise mask and preview the effect where the source decodes.",
        video: "Set when each region applies, choose blur, pixelate, or a solid block, and add audio ranges in the same project.",
      },
      claimIds: ["DOC-REVIEW", "AUD-EFFECTS", "AUD-PREVIEW", "VID-TIMELINE", "VID-EFFECTS", "VID-AUDIO"],
    },
    {
      id: "export",
      title: "Render a new output",
      summary: "Create a separate redacted file rather than relying on how the working project looks on screen.",
      formats: {
        document: "Render a reviewed copy of the document from the approved marks.",
        audio: "Render reviewed ranges to a supported output format; output choices are narrower than accepted inputs.",
        video: "Render picture and sound together with the reviewed visual regions and audio effects applied.",
      },
      claimIds: ["AUD-EXPORT"],
    },
    {
      id: "verify",
      title: "Inspect what will be shared",
      summary: "Treat the exported file as another review step before anyone outside the workflow receives it.",
      formats: {
        document: "Re-open supported output, check for readable marked content, and create a report of the recorded decisions.",
        audio: "Listen to the exported recording, paying particular attention to the boundaries of each masked span.",
        video: "Watch and listen to the rendered file, checking that each region covers its subject for the full time range.",
      },
      claimIds: ["DOC-OUTPUT-CHECK", "DOC-REPORT", "VID-OUTPUT-CHECK"],
    },
  ] satisfies LifecycleStage[],
  responsibilities: [
    "Deciding what is sensitive for the intended recipient and purpose",
    "Confirming or rejecting every candidate the software surfaces",
    "Finding what detection does not cover, such as indirect identifiers",
    "Checking that each visual region covers its subject for its whole time range",
    "Inspecting the exported file before it is shared",
  ],
  boundaries: [
    "Detection does not make final redaction decisions.",
    "Automated transcript analysis is not presented as a complete workflow.",
    "Generic object tracking is not a packaged capability.",
    "Output checks do not prove that every sensitive item was found.",
    "Format support and rendering depend on configured OCR, LibreOffice, and FFmpeg tooling.",
  ],
  faq: [
    {
      question: "Is the workflow the same for every format?",
      answer:
        "The stages are the same; the tools change. Documents use pages, text, and areas. Audio uses a waveform and time ranges. Video uses frame regions, time ranges, and an audio lane.",
    },
    {
      question: "Can I skip detection and mark everything manually?",
      answer:
        "Yes. Manual text and area marks, audio ranges, and video regions are all available without relying on detection candidates.",
    },
    {
      question: "Why inspect the output if the project looked correct?",
      answer:
        "Because the file you share is the rendered output, not the working view. Inspecting it catches problems the project view cannot show, such as a range boundary that clips a word.",
    },
    {
      question: "Does every installation have the same capabilities?",
      answer:
        "No. OCR, office conversion, media handling, and detection depend on the tooling and engines configured. A demo with representative files confirms what your setup supports.",
    },
  ] satisfies MarketingFaq[],
} satisfies SupportingPageContent & Record<string, unknown>;

export const whyOpenRedaktPage = {
  eyebrow: "Why OpenRedakt",
  h1: "Why OpenRedakt: one review-led workflow for every format.",
  summary:
    "OpenRedakt is built for teams whose disclosures mix documents, recordings, and footage, and who need a person to make, and be able to explain, each redaction decision.",
  seo: {
    title: "Why OpenRedakt for Multi-Format Redaction",
    description:
      "Why teams evaluate OpenRedakt: one review workflow for documents, audio, and video, reviewer control over every mark, output inspection, and clearly stated limits.",
    canonicalPath: "/why-openredakt",
    primaryIntent: "multi-format redaction software",
    secondaryThemes: ["document audio and video redaction in one tool", "review-led redaction", "redaction software comparison criteria", "desktop redaction software for Windows"],
  },
  lastReviewed: "2026-10-26",
  pillars: [
    {
      icon: "layers",
      title: "Three media, one review discipline",
      description:
        "Documents, images, audio, and video are handled in one Windows desktop application, with views suited to each format and the same prepare-mark-review-export-inspect sequence throughout.",
    },
    {
      icon: "users",
      title: "Reviewer judgement stays in charge",
      description:
        "Detection candidates are never final. Reviewers approve, reject, adjust, and add marks, and can record the reason for each document mark.",
    },
    {
      icon: "shield-check",
      title: "Output is treated as evidence",
      description:
        "Rendered files are re-opened and inspected before release, and document workflows can produce a report of the reviewed actions.",
    },
    {
      icon: "settings",
      title: "Honest about configuration",
      description:
        "OCR, office conversion, media tooling, and detection engines vary by installation. We say which capabilities depend on them instead of promising universal support.",
    },
  ],
  fit: [
    "Disclosures that combine documents, recorded statements, and video",
    "Teams that need a person to make and explain each decision",
    "Organisations evaluating a Windows desktop application",
    "Reviewers who want manual control alongside configured detection",
  ],
  notFit: [
    "Unattended bulk redaction without review",
    "Cloud collaboration, role-based access, or storage integrations",
    "A certification-backed compliance tool for a named regulation",
    "Continuous automatic object tracking or live redaction",
  ],
  evidence:
    "Every capability described on this site is mapped to source code and automated tests in an internal capability evidence register. Capabilities that depend on configuration say so, and claims the register blocks, such as certifications, accuracy figures, or promises of error-free output, are not published.",
  faq: [
    {
      question: "How is OpenRedakt different from a PDF redaction tool?",
      answer:
        "A PDF tool covers documents. OpenRedakt applies the same review discipline to documents, images, audio, and video, so a mixed disclosure can be prepared in one application.",
    },
    {
      question: "Does OpenRedakt work offline?",
      answer:
        "Core review and rendering run in the Windows desktop application. Some detection paths can be configured per job to use optional services, so OpenRedakt is not described as universally offline.",
    },
    {
      question: "Why do you publish limitations?",
      answer:
        "Because redaction errors are costly and hard to reverse. Knowing what the software does not do lets your team plan the review steps that cover the gap.",
    },
    {
      question: "How should we evaluate OpenRedakt?",
      answer:
        "With representative files from your own workflow. A guided demo confirms format support, detection behaviour, and the output inspection your release process needs.",
    },
  ] satisfies MarketingFaq[],
} satisfies SupportingPageContent & Record<string, unknown>;

export const contactPage = {
  eyebrow: "Contact",
  h1: "Contact OpenRedakt or request a demo.",
  summary:
    "Tell us which formats you redact, who reviews them, and where the output goes. We will use that to plan a demo around your own workflow.",
  seo: {
    title: "Contact OpenRedakt or Request a Redaction Demo",
    description:
      "Request an OpenRedakt demo or contact the team about document, audio, and video redaction workflows, supported formats, and evaluation with representative files.",
    canonicalPath: "/contact",
    primaryIntent: "redaction software demo",
    secondaryThemes: ["contact OpenRedakt", "redaction software evaluation", "book a redaction demo"],
  },
  lastReviewed: "2026-10-26",
  include: [
    { title: "Source formats", description: "PDFs, scans, office files, audio recordings, or video, and roughly how much of each." },
    { title: "Review steps", description: "Who reviews, who approves, and what record of decisions you need to keep." },
    { title: "Destination", description: "Who receives the output: a court, the public, a regulator, a researcher, or an internal team." },
  ],
} satisfies SupportingPageContent & Record<string, unknown>;
