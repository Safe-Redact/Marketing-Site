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
  "VID-INPUT": {
    status: "conditional",
    publicWording: "Open supported video containers for frame and timeline review.",
    condition: "Decode, preview, and export depend on configured FFmpeg tooling.",
  },
  "VID-DETECTION": {
    status: "conditional",
    publicWording: "Surface face, licence-plate, and visible-text candidates when the required engines are configured.",
    condition: "Candidates require reviewer confirmation; availability depends on configured models and OCR tooling.",
  },
  "VID-MANUAL": {
    status: "publishable",
    publicWording: "Place and adjust visual redaction regions manually.",
  },
  "VID-TIMELINE": {
    status: "publishable",
    publicWording: "Set and review the time range for visual redaction regions.",
  },
  "VID-EFFECTS": {
    status: "conditional",
    publicWording: "Preview supported blur, pixelate, and solid-block effects.",
    condition: "Rendered output depends on configured media tooling.",
  },
  "VID-AUDIO": {
    status: "conditional",
    publicWording: "Review and apply supported audio effects within a video project.",
    condition: "Audio handling depends on the source track and configured media tooling.",
  },
  "VID-OUTPUT-CHECK": {
    status: "conditional",
    publicWording: "Inspect the rendered video output before release.",
    condition: "Output checks support review and do not certify that every sensitive item was detected.",
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
  h1: "One review workflow for documents, audio, and video.",
  summary:
    "Bring mixed media into a consistent process: prepare the source, mark or review sensitive content, confirm each decision, then export and inspect the result.",
  seo: {
    title: "Redaction Software for Documents, Audio & Video",
    description:
      "Explore OpenRedakt review-led redaction workflows for documents, recordings, and video, with manual control, supported detection, and output checks.",
    canonicalPath: "/features",
  },
  workflow: [
    { title: "Prepare the source", description: "Open a supported file and confirm the page, waveform, or timeline is ready for review." },
    { title: "Find or mark", description: "Use available detection candidates or place the text, area, audio range, or visual region yourself." },
    { title: "Review decisions", description: "Adjust scope, effects, and reasons while a reviewer remains responsible for every selection." },
    { title: "Export and inspect", description: "Render the reviewed output, re-open it, and check the result before it is released." },
  ],
  faq: [
    { question: "Does OpenRedakt handle more than PDFs?", answer: "Yes. The desktop workflow supports documents and images, common audio formats, and common video containers. Some imports require local conversion or media tools, so final format support is confirmed during evaluation." },
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
        "Review sensitive content in PDFs, scans, images, and supported office files with OCR, manual controls, candidate findings, and output checks in OpenRedakt.",
      canonicalPath: "/features/document-redaction",
    },
    claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK", "DOC-REPORT"],
    media: {
      kind: "screenshot",
      screenshotId: "format-document",
      caption: "A synthetic financial statement in the current document review workspace, with reviewer-controlled marks and findings.",
    },
    atGlance: ["PDF, image, and supported office-file preparation", "Text and area controls for manual review", "Candidate findings remain subject to reviewer decisions"],
    problem: {
      eyebrow: "The review problem",
      title: "Scans, dense pages, and mixed file types need more than a black rectangle.",
      description: "A useful document workflow has to expose what the reviewer is marking, preserve the context around it, and make the final output available for inspection—not simply cover pixels on screen.",
    },
    workflow: [
      { title: "Open and prepare", description: "Open a PDF directly or convert a supported document or image into the document review workflow." },
      { title: "Extract or recognise text", description: "Use native text where it exists, or run configured OCR on scans and image-based pages." },
      { title: "Review and mark", description: "Assess candidate findings, select text, or draw an area; then edit the mark, appearance, and reason." },
      { title: "Export and check", description: "Render a reviewed copy, inspect the output, and retain a report of the recorded decisions when required." },
    ],
    sections: [
      { eyebrow: "Candidate review", title: "Start with evidence, not an automatic final answer.", description: "Configured engines can surface categories of sensitive information. Findings enter a review queue so the operator can inspect context before applying or dismissing a mark.", bullets: ["Candidate categories depend on the configured engine", "Approve, reject, or refine findings before export", "Keep automated suggestions separate from reviewer judgment"] },
      { eyebrow: "Manual control", title: "Handle what a detector cannot know.", description: "Select recognised text or draw an area directly on the page for contextual, visual, or policy-specific redactions.", bullets: ["Text selections stay aligned to recognised words", "Area selections cover visual regions and non-text content", "Reasons and appearances can be reviewed before output"] },
      { eyebrow: "Output evidence", title: "Treat export as another review step.", description: "The workflow can re-open supported output, check for readable marked content, and create a report of recorded actions. Reviewers still inspect the deliverable before use.", bullets: ["Output checks run against the rendered file", "Residual findings are surfaced for follow-up", "Reports describe the review record without certifying legal sufficiency"] },
    ],
    supportedFormats: ["PDF", "PNG / JPG / TIFF / BMP", "DOCX / RTF / TXT / HTML / Markdown", "Office and OpenDocument formats via configured conversion tooling"],
    formatNote: "PDF is native. Other supported inputs are converted for document review; several legacy, spreadsheet, and presentation formats require a local LibreOffice installation.",
    faq: [
      { question: "Can OpenRedakt work with scanned PDFs?", answer: "Yes, when OCR tooling is configured. OCR quality depends on scan clarity, layout, language, and source preparation, so recognised text and proposed marks still require review." },
      { question: "Are office files edited in place?", answer: "No. Supported non-PDF files are prepared as PDFs for the redaction workflow. Conversion availability varies by format and installed tooling." },
      { question: "Can reviewers add marks manually?", answer: "Yes. Reviewers can select recognised text or draw page areas, then adjust the mark and record a reason before export." },
      { question: "Does output checking guarantee every item was removed?", answer: "No. It adds a second inspection step against the rendered result. It cannot prove that the source review identified every sensitive item." },
    ],
    relatedFeatures: ["audio-redaction", "video-redaction"],
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
      kind: "workflow-diagram",
      format: "audio",
      caption: "An original OpenRedakt workflow diagram showing a manual waveform range with a mute effect beside transcript context.",
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
    relatedFeatures: ["document-redaction", "video-redaction"],
    availabilityNote: { status: "manual-first", title: "Manual audio redaction is the shipped review path", description: "Transcript analysis controls are not marketed as a complete automatic redaction workflow. Demonstrations focus on manual ranges, effect preview, export, and inspection." },
    cta: { eyebrow: "Audio workflow review", title: "Evaluate the timeline with a representative recording.", description: "A guided demo can confirm accepted inputs, effect availability, transcript context, and the playback checks your workflow requires." },
  },
  {
    slug: "video-redaction",
    publicationStatus: "published",
    eyebrow: "Video redaction",
    h1: "Review visual and spoken information across a video timeline.",
    summary:
      "Combine frame-level visual regions, time ranges, supported effects, and audio review in one workflow while keeping the reviewer responsible for what is concealed.",
    seo: {
      title: "Video Redaction Software for Faces, Plates & Audio",
      description:
        "Review faces, licence plates, visible text, manual regions, and sensitive audio across supported video with timeline controls and output inspection in OpenRedakt.",
      canonicalPath: "/features/video-redaction",
    },
    claimIds: ["VID-INPUT", "VID-DETECTION", "VID-MANUAL", "VID-TIMELINE", "VID-EFFECTS", "VID-AUDIO", "VID-OUTPUT-CHECK"],
    media: {
      kind: "workflow-diagram",
      format: "video",
      caption: "An original OpenRedakt workflow diagram showing a bounded visual region, timeline range, and separate audio review lane.",
    },
    atGlance: ["Manual visual regions with bounded time ranges", "Configured face, plate, and visible-text candidates", "Visual and audio review in the same project"],
    problem: {
      eyebrow: "The frame problem",
      title: "A box on one frame is only the beginning of a defensible review.",
      description: "Sensitive visuals can enter and leave the frame while private speech continues underneath. Reviewers need to control where a region appears, how it is treated, and what happens to the accompanying audio.",
    },
    workflow: [
      { title: "Open supported footage", description: "Load a supported video container and confirm that picture, timing, and audio tracks can be reviewed." },
      { title: "Find or place regions", description: "Review configured face, licence-plate, or text candidates, or draw a manual region on the frame." },
      { title: "Bound the timeline", description: "Set when the visual treatment appears and add separate audio ranges where spoken information also needs treatment." },
      { title: "Preview, render, inspect", description: "Review the visual effect, render the output, and inspect the final picture and sound before release." },
    ],
    sections: [
      { eyebrow: "Visual review", title: "Turn candidates into reviewer-controlled regions.", description: "When configured engines surface faces, licence plates, or visible text, each result is a candidate—not an automatic approval. Manual regions remain available for anything outside those categories.", bullets: ["Candidate availability depends on configured engines", "Manual rectangles cover reviewer-defined content", "The reviewer confirms scope and effect"] },
      { eyebrow: "Timeline control", title: "Define when each visual treatment applies.", description: "A region is paired with a time range so it can be reviewed in context. This page deliberately does not promise generic object tracking or unattended full-motion coverage.", bullets: ["Set start and end points for each region", "Review multiple visual regions along the timeline", "Adjust blur, pixelate, or solid-block treatments"] },
      { eyebrow: "Picture and sound", title: "Review the audio track without leaving the video project.", description: "Supported audio effects can be applied to time ranges within the video workflow, helping reviewers coordinate what is visible with what is spoken.", bullets: ["Visual and audio decisions remain separate and inspectable", "Audio effects depend on the source track and media tools", "The rendered result is checked as picture and sound"] },
    ],
    supportedFormats: ["MP4 / M4V", "MOV", "AVI", "MKV / WebM"],
    formatNote: "Video decode, preview, effects, audio handling, and export depend on configured FFmpeg tooling and the codecs present in the source file.",
    faq: [
      { question: "Does OpenRedakt automatically track every face or object?", answer: "No. Configured engines can surface supported candidates, and reviewers can place regions and time ranges manually. Generic object tracking is not presented as a standard packaged capability." },
      { question: "Which visual effects can reviewers use?", answer: "The implemented video workflow supports blur, pixelate, and solid-block treatments. Availability in a final render depends on the configured media toolchain." },
      { question: "Can audio be redacted inside a video project?", answer: "Yes, for supported source tracks and effects. Reviewers place audio time ranges separately and inspect the rendered picture and sound together." },
      { question: "Is the final result guaranteed to contain no sensitive content?", answer: "No. Output inspection adds a valuable verification step, but the reviewer remains responsible for source coverage, candidate decisions, and final playback review." },
    ],
    relatedFeatures: ["document-redaction", "audio-redaction"],
    availabilityNote: { status: "configuration-dependent", title: "Detection and rendering depend on the installed toolchain", description: "Models, OCR tooling, FFmpeg, codecs, hardware, and source quality affect which candidate and rendering paths are available." },
    cta: { eyebrow: "Video workflow review", title: "Test the timeline with owned representative footage.", description: "A guided demo can confirm visual-region behavior, audio handling, codec support, and the output inspection your release process requires." },
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

