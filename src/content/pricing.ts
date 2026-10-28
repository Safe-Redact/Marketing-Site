export type PricingPackageSlug = "essential" | "advanced" | "complete-suite";

export const pricingPackageSlugs = [
  "essential",
  "advanced",
  "complete-suite",
] as const satisfies readonly PricingPackageSlug[];

/**
 * The two capability families OpenRedakt sells. Essential and Advanced each license one family;
 * Complete Suite licenses both. Comparison rows are tied to a family, so a capability can never
 * be shown under a package that does not license it.
 *
 * Every public claim on the pricing page summarises capabilities marked "Advertise: Yes" in
 * docs/openredakt-pricing-feature-audit.md. Add nothing here that the audit does not support.
 */
export type PricingCapabilityFamily = "documents" | "audio";

export const pricingCapabilityFamilies = {
  documents: {
    label: "Documents",
    inputFormats:
      "PDF, Word (.docx), RTF, HTML, Markdown and plain text. Legacy Word (.doc), Excel, PowerPoint, OpenDocument and CSV files also work when LibreOffice is installed on the same computer.",
    outputFormats:
      "PDF, PDF/A (archival) and multi-page TIFF Group IV, with an optional redaction report as PDF and CSV.",
  },
  audio: {
    label: "Audio",
    inputFormats: "WAV, MP3, M4A, AAC, FLAC, OGG, OGA, Opus, WMA, AIFF, ALAC and AMR.",
    outputFormats:
      "Redacted audio as WAV, MP3, M4A, AAC, FLAC, OGG or Opus, and redacted transcripts as TXT, SRT, VTT, DOCX or PDF.",
  },
} as const satisfies Record<PricingCapabilityFamily, { label: string; inputFormats: string; outputFormats: string }>;

export interface PricingPackage {
  slug: PricingPackageSlug;
  name: string;
  shortName: string;
  /** The capability family descriptor shown under the package name. */
  scopeLabel: string;
  description: string;
  annualPriceUsd: number;
  monthlyEquivalentUsd: number;
  priceStatus: "approved" | "proposed";
  families: readonly PricingCapabilityFamily[];
  /** Six to eight customer-facing benefits, each grouping related verified capabilities. */
  features: readonly string[];
  ctaLabel: string;
  emphasized?: boolean;
}

export const pricingPackages = [
  {
    slug: "essential",
    name: "OpenRedakt Essential",
    shortName: "Essential",
    scopeLabel: "Documents",
    description:
      "Find, review and permanently remove sensitive information from documents on your own computer.",
    annualPriceUsd: 1500,
    monthlyEquivalentUsd: 125,
    priceStatus: "approved",
    families: ["documents"],
    features: [
      "Redact PDFs, Word files and other common document formats",
      "OCR that makes scanned and image-only pages redactable",
      "On-device AI detection of names, IDs, financial data and more",
      "Text, area, search and pattern-based redaction",
      "Review every mark, with redaction reasons, templates and undo",
      "Permanent redaction, independently verified, with metadata removed",
      "PDF, PDF/A and TIFF export with Bates numbering and redaction reports",
    ],
    ctaLabel: "Request an Essential demo",
    emphasized: false,
  },
  {
    slug: "advanced",
    name: "OpenRedakt Advanced",
    shortName: "Advanced",
    scopeLabel: "Audio",
    description:
      "Transcribe recordings on your own computer, find sensitive speech and export redacted audio.",
    annualPriceUsd: 2500,
    monthlyEquivalentUsd: 208.33,
    priceStatus: "approved",
    families: ["audio"],
    features: [
      "Redact WAV, MP3, M4A, FLAC and other common audio formats",
      "On-device speech-to-text with word-level timing",
      "AI detection of spoken names, numbers and personal details",
      "Redact directly from a transcript synchronized with playback",
      "Waveform timeline to review and adjust every redaction",
      "Mute, beep, tone, noise masking or voice disguise",
      "Export redacted audio and redacted transcripts",
    ],
    ctaLabel: "Request an Advanced demo",
    emphasized: false,
  },
  {
    slug: "complete-suite",
    name: "OpenRedakt Complete Suite",
    shortName: "Complete Suite",
    scopeLabel: "Documents + Audio",
    description:
      "Every Essential and Advanced capability under one license, for teams handling both formats.",
    annualPriceUsd: 3500,
    monthlyEquivalentUsd: 291.67,
    priceStatus: "proposed",
    families: ["documents", "audio"],
    features: [
      "Everything in Essential and Advanced",
      "Document and audio redaction in one desktop application",
      "On-device AI detection across documents and speech",
      "Complete review and editing tools for both formats",
      "Verified document exports, plus redacted audio and transcripts",
      "One named-user license covers both workflows",
    ],
    ctaLabel: "Contact Sales",
    emphasized: true,
  },
] as const satisfies readonly PricingPackage[];

export function packageIncludesFamily(
  plan: { families: readonly PricingCapabilityFamily[] },
  family: PricingCapabilityFamily
) {
  return plan.families.includes(family);
}

/** Shown once beneath the cards: the verified Control Center behaviour every package shares. */
export const pricingSharedLicenseNote =
  "Every package is a named-user license assigned by email, managed by your owners and admins in the Control Center, with signed, device-bound activation on Windows.";

export interface PricingComparisonRow {
  capability: string;
  /** The family whose license provides this capability, or "all" for package-neutral rows. */
  scope: PricingCapabilityFamily | "all";
}

/**
 * High-level differences only. Rows are worded per family so a shared idea such as "export" is
 * never shown as equivalent across packages: document verification and redaction reports stay on
 * document rows, and no audio row claims a report or verification.
 */
export const pricingComparisonSections = [
  {
    title: "Documents",
    rows: [
      { capability: "Document redaction for PDF, Word and other formats", scope: "documents" },
      { capability: "OCR for scanned and image-only pages", scope: "documents" },
      { capability: "AI detection of sensitive data in documents", scope: "documents" },
      { capability: "Verified, permanent document export", scope: "documents" },
      { capability: "Bates numbering and document redaction reports", scope: "documents" },
    ],
  },
  {
    title: "Audio",
    rows: [
      { capability: "On-device audio transcription", scope: "audio" },
      { capability: "AI detection of sensitive speech", scope: "audio" },
      { capability: "Transcript and waveform review and editing", scope: "audio" },
      { capability: "Audio redaction effects, including voice disguise", scope: "audio" },
      { capability: "Redacted audio and transcript export", scope: "audio" },
    ],
  },
  {
    title: "Platform, licensing and administration",
    rows: [
      { capability: "Windows desktop application with on-device processing", scope: "all" },
      { capability: "Named-user licenses managed in the Control Center", scope: "all" },
    ],
  },
] as const satisfies readonly { title: string; rows: readonly PricingComparisonRow[] }[];

export function comparisonRowIncludes(
  plan: { families: readonly PricingCapabilityFamily[] },
  row: PricingComparisonRow
) {
  return row.scope === "all" || packageIncludesFamily(plan, row.scope);
}

export const pricingLicensingSteps = [
  {
    title: "Choose the package and quantity",
    description:
      "Request a sales conversation with the package and number of named-user licenses your organization needs.",
  },
  {
    title: "OpenRedakt provisions access",
    description:
      "OpenRedakt provisions your organization, one-year term, approved package, and purchased license quantity in the Control Center.",
  },
  {
    title: "Your team assigns licenses",
    description:
      "An organization owner/admin invites colleagues and assigns or releases named-user licenses by email in the Control Center.",
  },
  {
    title: "Each computer is activated",
    description:
      "Each named user signs in on the Windows desktop. The Control Center issues a signed, device-bound license, and an owner/admin can view and release activated computers. Device allowances are confirmed in your quote.",
  },
] as const;

export const pricingFaqs = [
  {
    id: "package-differences",
    title: "What is the difference between the three packages?",
    description:
      "Essential is licensed for document redaction. Advanced is licensed for audio redaction and does not include Essential's document capabilities. Complete Suite brings the document and audio workflows together under one license.",
  },
  {
    id: "file-formats",
    title: "Which file formats does each package support?",
    description: `Essential and Complete Suite import ${pricingCapabilityFamilies.documents.inputFormats} They export ${pricingCapabilityFamilies.documents.outputFormats} Advanced and Complete Suite import ${pricingCapabilityFamilies.audio.inputFormats} They export ${pricingCapabilityFamilies.audio.outputFormats}`,
  },
  {
    id: "requirements",
    title: "What are the technical requirements?",
    description:
      "OpenRedakt is a Windows 10 or 11 desktop application. Detection, redaction and export run on the computer itself using components installed with OpenRedakt; signing in needs an internet connection, and each named user has one active desktop session at a time. Converting legacy Word, Excel and PowerPoint files needs LibreOffice installed on the same computer.",
  },
  {
    id: "annual-billing",
    title: "Are the licenses billed monthly or annually?",
    description:
      "Licenses are billed annually. Monthly figures on this page are equivalents provided for planning; they do not represent a month-to-month subscription option.",
  },
  {
    id: "team-licenses",
    title: "How do we buy licenses for a team?",
    description:
      "Tell our sales team which package you are considering and the number of named-user licenses you expect to need. After provisioning, your organization owner or administrator can invite colleagues and assign or release licenses by email in the Control Center.",
  },
  {
    id: "complete-suite",
    title: "When should we choose Complete Suite?",
    description:
      "Choose Complete Suite when the same team needs both supported workflows: document redaction and audio redaction. Its public price remains subject to business confirmation, so contact sales for current commercial terms.",
  },
  {
    id: "demo",
    title: "Can we request a demo before choosing a package?",
    description:
      "Yes. Use the demo enquiry form to describe the formats and review workflow you want to evaluate, and select the package you are considering if you already know it.",
  },
  {
    id: "installation-activation",
    title: "How do installation and activation work?",
    description:
      "OpenRedakt is Windows desktop software. A named user signs in on the computer, and the Control Center issues a signed, device-bound license. Your quote confirms the device allowance for the package and deployment you are evaluating.",
  },
] as const;
