import type {
  CapabilityClaims,
  FeatureOverviewContent,
  FeaturePageContent,
  FeatureSlug,
} from "@/lib/marketing/content";

export const capabilityClaims: CapabilityClaims = {
  "DOC-INPUT": {
    status: "conditional",
    publicWording: "Open PDFs, images, and supported office formats for review.",
    condition: "Non-PDF formats are converted at import; some formats require LibreOffice.",
  },
  "DOC-OCR": {
    status: "conditional",
    publicWording: "Run OCR on scans and image-based pages when OCR tooling is configured.",
    condition: "Recognition quality depends on the source and installed OCR tooling.",
  },
  "DOC-CANDIDATES": {
    status: "conditional",
    publicWording: "Surface candidate sensitive information for reviewer assessment.",
    condition: "Available categories and engines depend on local model or optional job configuration.",
  },
  "DOC-MANUAL": {
    status: "publishable",
    publicWording: "Add text and area redactions directly on a document page.",
  },
  "DOC-REVIEW": {
    status: "publishable",
    publicWording: "Review, edit, approve, reject, and record reasons for redaction marks.",
  },
  "DOC-OUTPUT-CHECK": {
    status: "conditional",
    publicWording: "Re-open and inspect supported document output before it is used.",
    condition: "Output checking supports review; it is not a guarantee that every sensitive item was found.",
  },
  "DOC-REPORT": {
    status: "publishable",
    publicWording: "Create a report describing reviewed redaction actions.",
  },
  "AUD-INPUT": {
    status: "conditional",
    publicWording: "Open common audio formats for waveform and timeline review.",
    condition: "Audio processing and export require configured FFmpeg tooling.",
  },
  "AUD-TIMELINE": {
    status: "publishable",
    publicWording: "Draw, adjust, and review manual redaction ranges on an audio timeline.",
  },
  "AUD-EFFECTS": {
    status: "conditional",
    publicWording: "Apply supported effects including mute, tone, silence, and noise masks.",
    condition: "Effect availability and output formats depend on configured media tooling.",
  },
  "AUD-PREVIEW": {
    status: "conditional",
    publicWording: "Preview supported audio effects before export.",
    condition: "Preview depends on a decodable source and configured media tooling.",
  },
  "AUD-TRANSCRIPT-CONTEXT": {
    status: "conditional",
    publicWording: "Use an available transcript as review context alongside the waveform.",
    condition: "Automated transcript analysis is not presented as a complete shipped workflow.",
  },
  "AUD-EXPORT": {
    status: "conditional",
    publicWording: "Render reviewed audio ranges to a supported output format and inspect the result.",
    condition: "Export requires configured media tooling and representative output review.",
  },
  "BLOCK-AUDIO-AUTO": {
    status: "blocked",
    publicWording: "Automated transcript analysis is a complete end-user workflow.",
  },
  "BLOCK-TRACKING": {
    status: "blocked",
    publicWording: "Generic automatic object tracking is available in every installation.",
  },
  "BLOCK-COMPLIANCE": {
    status: "blocked",
    publicWording: "OpenRedakt is certified compliant with named regulations.",
  },
  "BLOCK-GUARANTEE": {
    status: "blocked",
    publicWording: "Exports are guaranteed irreversible, complete, or error-free.",
  },
  "BLOCK-COLLABORATION": {
    status: "blocked",
    publicWording: "OpenRedakt includes cloud collaboration, RBAC, or storage integrations.",
  },
};

export const featureOverview: FeatureOverviewContent = {
  eyebrow: "OpenRedakt features",
  h1: "One review workflow for documents and audio.",
  summary:
    "Bring documents and recordings into a consistent process: prepare the source, mark or review sensitive content, confirm each decision, then export and inspect the result.",
  seo: {
    title: "Document and Audio Redaction Software for Windows",
    description:
      "Explore OpenRedakt review-led redaction workflows for documents and audio recordings, with manual control, supported detection, and output checks.",
    canonicalPath: "/features",
  },
  workflow: [
    { title: "Prepare the source", description: "Open a supported document or recording and confirm the page or waveform is ready for review." },
    { title: "Find or mark", description: "Use available detection candidates or place the text, area, or audio range yourself." },
    { title: "Review decisions", description: "Adjust scope, effects, and reasons while a reviewer remains responsible for every selection." },
    { title: "Export and inspect", description: "Render the reviewed output, re-open it, and check the result before it is released." },
  ],
  faq: [
    { question: "Does OpenRedakt handle more than PDFs?", answer: "Yes. The desktop workflow supports PDFs, supported converted documents, and common audio formats. Some imports require local conversion or media tools, so final format support is confirmed during evaluation." },
    { question: "Does OpenRedakt make redaction decisions automatically?", answer: "No. Where supported engines surface candidates, a reviewer still decides what to mark, adjust, approve, reject, or exempt." },
    { question: "Where does processing happen?", answer: "Core review and rendering workflows run in the Windows desktop application. Some detection paths can be configured per job to use optional services; OpenRedakt is not described as universally offline." },
    { question: "What does output checking mean?", answer: "It means inspecting the rendered deliverable and running supported checks against it. It does not replace source review or guarantee that every sensitive item was discovered." },
  ],
};

export const featurePages: readonly FeaturePageContent[] = [
  {
    slug: "document-redaction",
    publicationStatus: "published",
    eyebrow: "Document redaction",
    h1: "Review and redact sensitive information across documents and scans.",
    summary:
      "Move from pages and scans to reviewed marks with candidate detection where configured, precise manual controls, and an output you can inspect before release.",
    seo: {
      title: "Document Redaction Software for Windows",
      description:
        "Review sensitive content in PDFs, scanned pages, and supported office files with OCR, manual controls, candidate findings, and output checks in OpenRedakt.",
      canonicalPath: "/features/document-redaction",
    },
    claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK", "DOC-REPORT"],
    media: {
      kind: "screenshot",
      screenshotId: "document-workspace",
      caption: "The current OpenRedakt document workspace, with no document open. Project and file names are blurred.",
    },
    atGlance: ["PDF and supported office-file preparation", "Text and area controls for manual review", "Candidate findings remain subject to reviewer decisions"],
    problem: {
      eyebrow: "The review problem",
      title: "Scans, dense pages, and mixed file types need more than a black rectangle.",
      description: "A useful document workflow has to expose what the reviewer is marking, preserve the context around it, and make the final output available for inspection—not simply cover pixels on screen.",
    },
    workflow: [
      { title: "Open and prepare", description: "Open a PDF directly or convert a supported office document into the document review workflow." },
      { title: "Extract or recognise text", description: "Use native text where it exists, or run configured OCR on scans and image-based pages." },
      { title: "Review and mark", description: "Assess candidate findings, select text, or draw an area; then edit the mark, appearance, and reason." },
      { title: "Export and check", description: "Render a reviewed copy, inspect the output, and retain a report of the recorded decisions when required." },
    ],
    sections: [
      { eyebrow: "Candidate review", title: "Start with evidence, not an automatic final answer.", description: "Configured engines can surface categories of sensitive information. Findings enter a review queue so the operator can inspect context before applying or dismissing a mark.", bullets: ["Candidate categories depend on the configured engine", "Approve, reject, or refine findings before export", "Keep automated suggestions separate from reviewer judgment"] },
      { eyebrow: "Manual control", title: "Handle what a detector cannot know.", description: "Select recognised text or draw an area directly on the page for contextual, visual, or policy-specific redactions.", bullets: ["Text selections stay aligned to recognised words", "Area selections cover visual regions and non-text content", "Reasons and appearances can be reviewed before output"] },
      { eyebrow: "Output evidence", title: "Treat export as another review step.", description: "The workflow can re-open supported output, check for readable marked content, and create a report of recorded actions. Reviewers still inspect the deliverable before use.", bullets: ["Output checks run against the rendered file", "Residual findings are surfaced for follow-up", "Reports describe the review record without certifying legal sufficiency"] },
    ],
    supportedFormats: ["PDF, including scanned pages with OCR", "DOCX / RTF / TXT / HTML / Markdown", "Office and OpenDocument formats via configured conversion tooling"],
    formatNote: "PDF is native. Other supported inputs are converted for document review; several legacy, spreadsheet, and presentation formats require a local LibreOffice installation.",
    faq: [
      { question: "Can OpenRedakt work with scanned PDFs?", answer: "Yes, when OCR tooling is configured. OCR quality depends on scan clarity, layout, language, and source preparation, so recognised text and proposed marks still require review." },
      { question: "Are office files edited in place?", answer: "No. Supported non-PDF files are prepared as PDFs for the redaction workflow. Conversion availability varies by format and installed tooling." },
      { question: "Can reviewers add marks manually?", answer: "Yes. Reviewers can select recognised text or draw page areas, then adjust the mark and record a reason before export." },
      { question: "Does output checking guarantee every item was removed?", answer: "No. It adds a second inspection step against the rendered result. It cannot prove that the source review identified every sensitive item." },
    ],
    relatedFeatures: ["audio-redaction"],
    insightsHref: "/blog/understanding-document-redaction",
    availabilityNote: { status: "configuration-dependent", title: "Format support is explicit", description: "OCR, office conversion, and optional detection engines depend on the source format and configured local or per-job tooling." },
    cta: { eyebrow: "Document workflow review", title: "Bring a representative document set to a guided demo.", description: "We can walk through source preparation, reviewer controls, and the output-checking path without assuming unsupported formats or outcomes." },
  },
  {
    slug: "audio-redaction",
    publicationStatus: "published",
    eyebrow: "Audio redaction",
    h1: "Redact sensitive moments in audio with precise timeline control.",
    summary:
      "Use the waveform, manual time ranges, supported masking effects, and transcript context where available to review what should change before you render a new recording.",
    seo: {
      title: "Audio and Transcript Redaction Software",
      description:
        "Review recordings on a waveform, mark sensitive time ranges, preview supported masking effects, and export inspected audio with OpenRedakt's Windows workflow.",
      canonicalPath: "/features/audio-redaction",
    },
    claimIds: ["AUD-INPUT", "AUD-TIMELINE", "AUD-EFFECTS", "AUD-PREVIEW", "AUD-TRANSCRIPT-CONTEXT", "AUD-EXPORT"],
    media: {
      kind: "screenshot",
      screenshotId: "audio-workspace",
      caption: "The current OpenRedakt audio workspace with a recording open. File names in the side panel are blurred.",
    },
    atGlance: ["Manual waveform and timeline selections", "Mute, tone, silence, and supported noise effects", "Transcript context without claiming automatic analysis"],
    problem: {
      eyebrow: "The listening problem",
      title: "Sensitive speech is temporal, contextual, and easy to over-cut.",
      description: "Names, identifiers, and private details can appear inside a useful statement. A timeline-based workflow lets a reviewer isolate the relevant span and choose an effect without discarding the whole recording.",
    },
    workflow: [
      { title: "Open the recording", description: "Load a supported audio file and inspect its waveform, duration, and available transcript context." },
      { title: "Mark a time range", description: "Drag or enter the start and end of the sensitive moment on the manual timeline." },
      { title: "Choose and preview", description: "Apply a supported effect such as mute, tone, silence, or noise and listen back where preview is available." },
      { title: "Render and listen", description: "Export to a supported format and inspect the new file before it is shared." },
    ],
    sections: [
      { eyebrow: "Manual-first control", title: "Put the reviewer on the waveform.", description: "The active end-user path is manual audio redaction. Reviewers place time ranges directly, can adjust their boundaries, and keep the decision attached to the timeline.", bullets: ["Start and end controls for precise ranges", "Timeline markers remain visible during review", "Overlapping ranges are composed deterministically"] },
      { eyebrow: "Effect choice", title: "Match the treatment to the disclosure risk.", description: "Different recordings call for different treatments. OpenRedakt supports several rendered effects, with availability tied to configured media tools.", bullets: ["Mute or silence a selected span", "Use tone or supported noise masks", "Preview the treatment before export where the source can be decoded"] },
      { eyebrow: "Transcript context", title: "Use words as context, not as an accuracy promise.", description: "When a transcript is available, it can sit beside the waveform and help orient review. The public workflow does not present automated transcript analysis or transcript-to-audio alignment as complete or exact.", bullets: ["Transcript text can support navigation and review", "Manual ranges remain the source of truth", "Exported transcript handling follows reviewed audio masks where supported"] },
    ],
    supportedFormats: ["WAV / MP3", "M4A / AAC / ALAC", "FLAC / OGG / OPUS", "WMA / AIFF / AMR input"],
    formatNote: "Supported decoding and export depend on the FFmpeg build configured with the application. Export choices are narrower than the accepted input list and should be confirmed with representative files.",
    faq: [
      { question: "Does OpenRedakt automatically find every spoken identifier?", answer: "No. The current public workflow is manual-first. Transcript and detection infrastructure exists in the product, but automated transcript analysis is not presented as a complete end-user capability." },
      { question: "Which masking effects are available?", answer: "The implemented timeline includes mute, tone, silence, white and pink noise, filters, and reverse. This page promotes the core effects that can be demonstrated with the configured media toolchain." },
      { question: "Can I review the effect before export?", answer: "Supported effects can be previewed when the source decodes correctly and the required media tools are available. The exported file should still be listened to after rendering." },
      { question: "Is transcript timing exact?", answer: "No. Transcription and timing vary with the recording, speakers, noise, and engine. Manual timeline ranges remain the final review control." },
    ],
    relatedFeatures: ["document-redaction"],
    availabilityNote: { status: "manual-first", title: "Manual audio redaction is the shipped review path", description: "Transcript analysis controls are not marketed as a complete automatic redaction workflow. Demonstrations focus on manual ranges, effect preview, export, and inspection." },
    cta: { eyebrow: "Audio workflow review", title: "Evaluate the timeline with a representative recording.", description: "A guided demo can confirm accepted inputs, effect availability, transcript context, and the playback checks your workflow requires." },
  },
] as const;

export const publishedFeaturePages = featurePages.filter(
  (page) => page.publicationStatus === "published"
);

export function getFeaturePage(slug: string): FeaturePageContent | undefined {
  return publishedFeaturePages.find((page) => page.slug === slug);
}

export function featureHref(slug: FeatureSlug): `/features/${FeatureSlug}` {
  return `/features/${slug}`;
}

