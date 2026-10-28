export const platformOutcomes = [
  {
    number: "01",
    title: "Detect candidates",
    description:
      "Run the available detector, OCR, or transcription workflow to surface content that may need redaction.",
  },
  {
    number: "02",
    title: "Review decisions",
    description:
      "Approve, reject, add, remove, or adjust findings in views suited to the source format.",
  },
  {
    number: "03",
    title: "Create outputs",
    description:
      "Export the redacted file, then inspect the rendered result before it is used or shared.",
  },
] as const;

export const platformCapabilities = [
  {
    icon: "document",
    title: "Document redaction",
    description:
      "Review detected text, manual text selections, and area redactions across PDFs and supported converted documents.",
    accent: "Page-based review",
  },
  {
    icon: "audio",
    title: "Audio redaction",
    description:
      "Use local or configured transcription, navigate the transcript, and review sensitive time ranges before rendering audio.",
    accent: "Transcript-led review",
  },
  {
    icon: "check-circle",
    title: "Operator review before export",
    description:
      "Keep pending, approved, and rejected findings visible while refining redactions and preparing the output file.",
    accent: "Approve, reject, adjust",
  },
  {
    icon: "settings",
    title: "Format-aware Windows workspace",
    description:
      "Move between document pages, audio transcripts, review decisions, and export checks in the desktop application.",
    accent: "Documents and audio",
  },
] as const;

export const workflowSteps = [
  {
    id: "open",
    icon: "upload",
    label: "Open a supported file",
    title: "Start in a project workspace",
    description:
      "Add a supported document or audio recording and choose the available workflow for that source.",
    previewLabel: "Source ready",
  },
  {
    id: "review",
    icon: "search",
    label: "Detect and review",
    title: "Treat detections as candidates",
    description:
      "Run detection or transcription, then approve, reject, add, remove, or adjust findings before creating an output.",
    previewLabel: "3 findings to review",
  },
  {
    id: "export",
    icon: "download",
    label: "Export and inspect",
    title: "Check the rendered result",
    description:
      "Create the redacted output and inspect the complete file before it is used or shared outside the workflow.",
    previewLabel: "Output prepared",
  },
] as const;

export const workflowPreviewLabels = {
  file: "case-records.pdf",
  project: "Project review",
  record: "Intake record",
  page: "Page 01",
  queue: "Review queue",
  findings: [
    { label: "Person name", status: "Pending", tone: "cool" },
    { label: "Email address", status: "Approved", tone: "warm" },
    { label: "Reference ID", status: "Pending", tone: "cool" },
  ],
  figureLabel: "Screenshot of the redaction workspace for the selected workflow step",
  caption:
    "A screenshot of the current product interface at the selected workflow step: the project workspace, the editor mid-review, or the export dialog.",
} as const;

export const formatTabs = [
  {
    id: "documents",
    label: "Documents",
    icon: "document",
    eyebrow: "Page and region review",
    title: "Work through findings in document context",
    description:
      "OpenRedakt combines detected findings with manual text and area controls so reviewers can inspect each page before export.",
    bullets: [
      "PDF and supported converted document intake",
      "Manual text and area selection",
      "Page and project-scope review",
    ],
    visual: "document",
    fileLabel: "case-records.pdf",
  },
  {
    id: "audio",
    label: "Audio & transcripts",
    icon: "audio",
    eyebrow: "Transcript and time ranges",
    title: "Move between spoken content and the timeline",
    description:
      "Use local or configured transcription and sensitive-category analysis to review time ranges and apply audio effects.",
    bullets: [
      "Transcript-based navigation",
      "Configured sensitive-information categories",
      "Mute, tone, and audio-mask effects",
    ],
    visual: "audio",
    fileLabel: "interview-audio.wav",
  },
] as const;

export const useCaseGroups = [
  {
    icon: "scale",
    kicker: "Disclosure workflows",
    title: "Legal and public records",
    description:
      "Prepare case files, discovery material, agency documents, and public records for review before filing or release.",
    tags: ["Legal", "Government"],
    visual: "records",
  },
  {
    icon: "heart",
    kicker: "Sensitive records",
    title: "Healthcare and research",
    description:
      "Review medical records, research documents, and patient communications before they are shared for an appropriate purpose.",
    tags: ["Healthcare", "Research"],
    visual: "health",
  },
  {
    icon: "briefcase",
    kicker: "Internal review",
    title: "Financial and corporate material",
    description:
      "Review personal and business information in financial records, contracts, HR files, and investigative material.",
    tags: ["Financial", "Corporate", "Investigations"],
    visual: "business",
  },
] as const;

export const workbenchLabels = {
  product: "OpenRedakt Workbench",
  file: "case-records.pdf",
  record: "Intake record",
  page: "Page 01 / 03",
  action: "Review",
  detector: "AI-assisted detection",
  findings: ["Person name", "Email address", "Account number"],
  guidance: "Review each suggested redaction before export.",
  view: "Detection view",
  status: "Ready for review",
  figureLabel:
    "Screenshot of the current redaction editor: a document mid-review with detected items listed for an operator to accept or adjust",
  caption:
    "A screenshot of the current redaction editor showing a document mid-review: detected items are listed in the findings panel for an operator to accept or adjust before export.",
} as const;
