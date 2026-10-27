import {
  isIndustryLive,
  type IndustryGroup,
  type IndustryPageContent,
  type IndustrySlug,
} from "@/lib/marketing/industries";

const documentGuide = {
  href: "/blog/understanding-document-redaction",
  title: "Understanding document redaction and why it matters",
} as const;

export const industryGroups: readonly IndustryGroup[] = [
  {
    id: "law-public-sector",
    title: "Law and the public record",
    description: "Disclosure, filing, and release decisions that may be challenged, published, or relied on as evidence.",
  },
  {
    id: "people-care-education",
    title: "Patients, students, and employees",
    description: "Records about individuals where other people named in the file must be protected too.",
  },
  {
    id: "financial-transactional",
    title: "Financial and claims records",
    description: "Dense identifiers, account data, and supporting evidence shared with auditors, counterparties, and courts.",
  },
  {
    id: "media-data",
    title: "Media and data reuse",
    description: "Recordings and source material prepared for publication or other authorized downstream use.",
  },
];

export const industryPages: readonly IndustryPageContent[] = [
  {
    slug: "legal",
    publicationStatus: "published",
    lastReviewed: "2026-10-26",
    group: "law-public-sector",
    navLabel: "Legal",
    icon: "scale",
    layout: "records-led",
    mediaEmphasis: ["document", "video", "audio"],
    hubSummary: "Privilege, third-party details, and evidence media across filings, productions, and exhibits.",
    seo: {
      title: "Legal Redaction Software for Case Files & Evidence",
      description:
        "Review privileged, personal, and case-sensitive details in pleadings, discovery sets, recorded statements, and video evidence before disclosure with OpenRedakt.",
      canonicalPath: "/industries/legal",
      primaryIntent: "legal redaction software",
      secondaryThemes: ["redact discovery documents", "privilege redaction", "redacting court filings", "evidence video redaction", "recorded statement redaction"],
    },
    eyebrow: "Legal",
    h1: "Redaction review for case files, discovery, and evidence.",
    summary:
      "Prepare filings, productions, and exhibits with a reviewer-controlled workflow that spans scanned bundles, recorded statements, and video evidence, and keeps the reasoning behind each document mark visible.",
    audience: {
      title: "For litigation, disclosure, and case-support teams",
      description:
        "Legal teams redact under two pressures at once: withholding what is privileged or protected, while producing everything the other side, the court, or the public is entitled to see. Over-redaction invites challenge; under-redaction cannot be undone once a production is served.",
      roles: [
        "Litigation support and e-disclosure teams",
        "Paralegals preparing filings, bundles, and exhibits",
        "In-house counsel responding to disclosure obligations",
        "Court and tribunal staff publishing judgments or records",
      ],
    },
    sensitiveInformation: [
      { label: "Personal identifiers", examples: "Names of minors and witnesses, dates of birth, home addresses, identity and account numbers." },
      { label: "Privileged material", examples: "Legal advice, correspondence with counsel, and internal case strategy inside otherwise disclosable files." },
      { label: "Third-party information", examples: "Details about people who are not parties to the matter but appear in emails, statements, or exhibits." },
      { label: "Evidence media", examples: "Faces, vehicle plates, and spoken names in interview recordings, CCTV, or recorded calls." },
    ],
    challenges: [
      {
        title: "Privilege depends on context",
        description:
          "A detector can recognise a pattern such as a name or a number. It cannot decide whether a paragraph is legal advice. That call stays with a reviewer, and the reason for it should stay attached to the mark.",
      },
      {
        title: "Productions mix formats",
        description:
          "A single disclosure set can hold scanned bundles, native office files, voicemail, and body-worn or CCTV footage. Moving each format through a different tool fragments the review record.",
      },
      {
        title: "Visible masking is not removal",
        description:
          "A black box drawn over a page can leave the underlying text selectable or searchable. The file that leaves the firm has to be checked as a file, not judged by how the screen looked.",
      },
      {
        title: "Redactions get challenged",
        description:
          "When the other side disputes what was withheld, the team needs to show what was marked and why, item by item, long after the production was prepared.",
      },
    ],
    workflows: [
      {
        format: "document",
        title: "Pleadings, bundles, and discovery sets",
        description:
          "Open PDFs directly and convert supported office files and images for review. Run OCR on image-only pages, assess candidate findings, add text or area marks for privileged passages, and record a reason against each decision before rendering the production copy.",
        claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK", "DOC-REPORT"],
      },
      {
        format: "video",
        title: "Interview, CCTV, and body-worn footage",
        description:
          "Review configured face, plate, and visible-text candidates, place manual regions for anything else, bound each region to the part of the clip where it applies, and inspect picture and sound after rendering.",
        claimIds: ["VID-DETECTION", "VID-MANUAL", "VID-TIMELINE", "VID-OUTPUT-CHECK"],
      },
      {
        format: "audio",
        title: "Recorded statements and calls",
        description:
          "Mark the spans where a witness names a third party or reads out an identifier, choose a supported effect such as mute or tone, and listen back before the recording is exported for service.",
        claimIds: ["AUD-TIMELINE", "AUD-EFFECTS", "AUD-PREVIEW", "AUD-EXPORT"],
      },
    ],
    considerations: [
      "OpenRedakt records review decisions and reasons for document marks. It does not determine whether material is privileged or whether a redaction is legally sufficient.",
      "Rules on what must be removed from court filings differ by court and jurisdiction. Confirm the applicable rules with counsel before production.",
      "Video candidates are not continuous tracking. Reviewers set and check the time range of every visual region.",
      "Inspect the rendered production files, not only the working project, before they are served or filed.",
    ],
    faq: [
      {
        question: "Can OpenRedakt decide what is privileged?",
        answer:
          "No. Configured engines can surface candidate personal information, but privilege is a legal judgement. Reviewers mark privileged passages manually and record the reason against the mark.",
      },
      {
        question: "Can we explain our redactions if they are challenged?",
        answer:
          "For documents, reviewers can record a reason for each mark and create a report describing the reviewed actions. The report documents the workflow; it does not establish that the redactions were legally sufficient.",
      },
      {
        question: "Does it handle scanned court bundles?",
        answer:
          "Yes, when OCR tooling is configured. Recognition quality depends on scan clarity, layout, and language, so recognised text and proposed marks still need review before the bundle is produced.",
      },
      {
        question: "Can audio and video evidence be handled in the same application?",
        answer:
          "Yes. Recorded statements use a waveform and timeline, and video uses frame regions, time ranges, and a separate audio lane. Media handling depends on configured FFmpeg tooling and the codecs in each source file.",
      },
    ],
    relatedFeatures: ["document-redaction", "video-redaction", "audio-redaction"],
    relatedIndustries: ["government", "insurance", "human-resources"],
    relatedInsights: [documentGuide],
    cta: {
      eyebrow: "Legal workflow review",
      title: "Walk through a representative production set.",
      description:
        "Bring a sample bundle, recording, or clip and we will show how preparation, privilege marks, reasons, and output inspection fit your disclosure process.",
    },
  },
  {
    slug: "government",
    publicationStatus: "published",
    lastReviewed: "2026-10-26",
    group: "law-public-sector",
    navLabel: "Government",
    icon: "landmark",
    layout: "mixed",
    mediaEmphasis: ["document", "audio", "video"],
    hubSummary: "Agency records, staff and citizen details, and operational information prepared for disclosure.",
    seo: {
      title: "Government Redaction Software for Records Release",
      description:
        "Prepare agency records, interview recordings, and footage for public release or disclosure with reviewer-controlled redaction across documents, audio, and video.",
      canonicalPath: "/industries/government",
      primaryIntent: "government redaction software",
      secondaryThemes: ["public records redaction", "freedom of information redaction", "redacting agency documents", "records release review", "government video redaction"],
    },
    eyebrow: "Government",
    h1: "Redaction for agency records, disclosures, and public release.",
    summary:
      "Give records officers and disclosure teams one review process for the documents, recordings, and footage that fall within a release request, without treating software as a substitute for the exemptions your jurisdiction applies.",
    audience: {
      title: "For agencies that release, disclose, or share records",
      description:
        "Government bodies hold information about citizens, staff, contractors, and their own operations, and are routinely asked to disclose it. The hard part is rarely finding a single document; it is preparing a defensible release from a mixed set of files against a statutory deadline.",
      roles: [
        "Records management and information-governance officers",
        "Freedom-of-information and disclosure teams",
        "Investigations, audit, and oversight units",
        "Communications teams preparing proactive publication",
      ],
    },
    sensitiveInformation: [
      { label: "Members of the public", examples: "Names, contact details, case references, and personal circumstances described in correspondence." },
      { label: "Staff details", examples: "Names of junior officials, direct phone numbers, signatures, and internal personnel references." },
      { label: "Operational information", examples: "Security arrangements, facility locations, system identifiers, and details of ongoing investigations." },
      { label: "Third-party commercial detail", examples: "Contractor pricing, bid content, and supplier information provided in confidence." },
    ],
    challenges: [
      {
        title: "Exemptions are applied, not detected",
        description:
          "The reason information is withheld comes from legislation and policy. Software can surface candidates, but each exemption decision belongs to a trained officer who can explain it on appeal.",
      },
      {
        title: "Requests cut across formats",
        description:
          "Emails saved as PDF, scanned forms, meeting recordings, and site footage can all fall within the scope of one request and arrive in the same release folder.",
      },
      {
        title: "Consistency across a release",
        description:
          "The same name or reference should be treated the same way on every page and in every recording. That needs a clear record of what was marked and the reason given.",
      },
      {
        title: "Publication cannot be recalled",
        description:
          "Once a disclosure log or reading room publishes a record, a missed identifier is effectively permanent. The released file has to be inspected after export, not before.",
      },
    ],
    workflows: [
      {
        format: "document",
        title: "Correspondence, forms, and reports",
        description:
          "Bring email exports, scanned forms, and reports into the document workflow, recognise text on image pages, review candidate findings, and record the reason for each withheld item before creating the release copy and its report.",
        claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK", "DOC-REPORT"],
      },
      {
        format: "audio",
        title: "Interviews and meeting recordings",
        description:
          "Open the recording on a waveform, use an available transcript to orient yourself, and mark the ranges that reveal personal or operational details before applying a supported masking effect.",
        claimIds: ["AUD-INPUT", "AUD-TIMELINE", "AUD-EFFECTS", "AUD-TRANSCRIPT-CONTEXT"],
      },
      {
        format: "video",
        title: "Site, facility, and public-space footage",
        description:
          "Review configured candidates for faces, plates, and visible text, add regions for screens or documents caught on camera, and inspect the rendered clip before it joins the release.",
        claimIds: ["VID-DETECTION", "VID-MANUAL", "VID-EFFECTS", "VID-OUTPUT-CHECK"],
      },
    ],
    considerations: [
      "Exemption categories and disclosure rules are jurisdiction-specific. Reviewers can record a reason against each document mark; OpenRedakt does not supply or interpret legal exemptions.",
      "Some detection paths can be configured per job to use optional services. Confirm which engines a job uses before processing records with handling restrictions.",
      "OpenRedakt is a Windows desktop application. It is not a request-tracking or case-management system.",
      "Output checks support review but cannot prove that every sensitive item was found.",
    ],
    faq: [
      {
        question: "Does OpenRedakt apply freedom-of-information exemptions automatically?",
        answer:
          "No. Exemptions are legal decisions. OpenRedakt can surface candidate personal information where engines are configured, and reviewers record the reason for each document mark in their own terms.",
      },
      {
        question: "Can we show why information was withheld?",
        answer:
          "For documents, each mark can carry a recorded reason, and the workflow can create a report describing the reviewed actions to keep with the release file.",
      },
      {
        question: "Does OpenRedakt track requests and deadlines?",
        answer:
          "No. It is a redaction review application. Teams use it alongside whatever system they already use to log requests, deadlines, and correspondence.",
      },
      {
        question: "Where does processing happen?",
        answer:
          "Core review and rendering run in the Windows desktop application. Some detection paths can be configured per job to use optional services, so the job configuration should be checked against your handling rules.",
      },
    ],
    relatedFeatures: ["document-redaction", "audio-redaction", "video-redaction"],
    relatedIndustries: ["local-government", "legal", "education"],
    relatedInsights: [documentGuide],
    cta: {
      eyebrow: "Records release review",
      title: "Test a release set that mixes formats.",
      description:
        "Bring a representative request, whether documents, a recording, or footage, and see how review, recorded reasons, and output inspection fit your release process.",
    },
  },
  {
    slug: "local-government",
    publicationStatus: "published",
    lastReviewed: "2026-10-26",
    group: "law-public-sector",
    navLabel: "Local Government",
    icon: "building",
    layout: "media-led",
    mediaEmphasis: ["document", "audio", "video"],
    hubSummary: "Resident details in planning files, complaints, petitions, and recorded council meetings.",
    seo: {
      title: "Local Government Redaction for Council Records",
      description:
        "Help councils and municipalities redact resident details in planning files, complaints, meeting recordings, and public-space footage before records are published.",
      canonicalPath: "/industries/local-government",
      primaryIntent: "local government redaction software",
      secondaryThemes: ["council records redaction", "municipal public records requests", "redact planning applications", "council meeting recording redaction", "CCTV redaction for councils"],
    },
    eyebrow: "Local government",
    h1: "Redaction for council and municipal records that residents can see.",
    summary:
      "Councils publish and share records constantly: planning files, committee papers, complaint responses, and meeting recordings. OpenRedakt gives small records teams one desktop workflow for the resident details inside them.",
    audience: {
      title: "For councils, municipalities, and city services",
      description:
        "Municipal teams handle the records closest to residents' daily lives, usually with a small team that has other duties too. Redaction work needs to be learnable, consistent between officers, and checkable without a dedicated disclosure department.",
      roles: [
        "Clerks and democratic-services officers",
        "Planning, building-control, and licensing administrators",
        "Complaints and customer-service teams",
        "Municipal records and public-records request officers",
      ],
    },
    sensitiveInformation: [
      { label: "Resident identity", examples: "Names, home addresses, phone numbers, and signatures on applications, objections, and petitions." },
      { label: "Personal circumstances", examples: "Health, family, or financial situations residents describe in complaints and service requests." },
      { label: "People in recordings", examples: "Members of the public who speak or appear in council meetings, consultations, or premises CCTV." },
      { label: "Service references", examples: "Account numbers, payment references, and case numbers attached to council services." },
    ],
    challenges: [
      {
        title: "Publication is routine",
        description:
          "Planning portals, committee packs, and meeting archives publish documents as a matter of course, so redaction is a weekly task rather than an occasional project.",
      },
      {
        title: "Signatures live in scans",
        description:
          "Applications and petitions often arrive as scans where names and signatures are images, not text. They need OCR, or an area mark drawn by the reviewer, before publication.",
      },
      {
        title: "Public meetings are recorded",
        description:
          "A resident speaking during a session may mention their address, a neighbour's name, or a health condition that should not remain in the archived recording.",
      },
      {
        title: "Small teams, varied files",
        description:
          "The same officer may prepare a scanned objection letter in the morning and a three-hour committee recording in the afternoon, so switching formats should not mean switching tools.",
      },
    ],
    workflows: [
      {
        format: "document",
        title: "Applications, petitions, and complaint files",
        description:
          "Convert scanned forms and letters for review, run OCR where it is configured, and draw area marks over signatures and handwriting before checking the published copy.",
        claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK"],
      },
      {
        format: "audio",
        title: "Meeting and consultation recordings",
        description:
          "Locate the moments where residents disclose personal details, mark those spans on the timeline, preview mute, tone, or silence, and export a recording ready for the meeting archive.",
        claimIds: ["AUD-INPUT", "AUD-TIMELINE", "AUD-EFFECTS", "AUD-PREVIEW", "AUD-EXPORT"],
      },
      {
        format: "video",
        title: "Webcast meetings and premises footage",
        description:
          "Treat faces of members of the public in webcast or CCTV footage with bounded visual regions, and handle the soundtrack in the same project before rendering the release copy.",
        claimIds: ["VID-DETECTION", "VID-MANUAL", "VID-TIMELINE", "VID-AUDIO"],
      },
    ],
    considerations: [
      "Handwriting and signatures may not be recognised as text. Plan for reviewers to draw area marks on scanned applications and petitions.",
      "Meeting recordings can be long. Audio redaction is manual-first, so reviewers mark each sensitive span; automated transcript analysis is not presented as a complete workflow.",
      "Publication rules for planning and committee documents vary by authority and jurisdiction.",
      "Listen to and watch the exported recording before it is posted to an archive or streaming page.",
    ],
    faq: [
      {
        question: "Can OpenRedakt redact signatures on scanned planning forms?",
        answer:
          "Yes. Reviewers can draw area marks over signatures, handwriting, or any other visual content on a page. Configured OCR helps with typed text, but handwriting recognition should not be assumed.",
      },
      {
        question: "Can we remove a resident's details from a meeting recording?",
        answer:
          "Yes. Mark the time range on the audio timeline, choose a supported effect such as mute, tone, or silence, preview it, then export and listen to the result before publishing.",
      },
      {
        question: "Do reviewers still need to watch the whole webcast?",
        answer:
          "Yes, for anything that will be published. Configured face, plate, and visible-text candidates help orient review, but they are candidates, not complete coverage of the footage.",
      },
      {
        question: "How does this differ from the government guide?",
        answer:
          "This guide focuses on resident-facing municipal records such as planning files, petitions, and council meetings. The government guide covers agency disclosure, records release, and operational information.",
      },
    ],
    relatedFeatures: ["document-redaction", "audio-redaction", "video-redaction"],
    relatedIndustries: ["government", "education", "human-resources"],
    relatedInsights: [],
    cta: {
      eyebrow: "Council records review",
      title: "Try the workflow with a planning file or meeting recording.",
      description:
        "Bring a representative scanned application or committee recording and we will walk through marking, previewing, exporting, and checking the published copy.",
    },
  },
  {
    slug: "healthcare",
    publicationStatus: "published",
    lastReviewed: "2026-10-26",
    group: "people-care-education",
    navLabel: "Healthcare",
    icon: "heart",
    layout: "records-led",
    mediaEmphasis: ["document", "audio", "video"],
    hubSummary: "Patient identifiers and clinical narrative in records, letters, scans, and recorded consultations.",
    seo: {
      title: "Healthcare Redaction Software for Patient Records",
      description:
        "Review patient identifiers in medical records, referral letters, scanned forms, and recorded consultations before they are shared for care, research, or requests.",
      canonicalPath: "/industries/healthcare",
      primaryIntent: "healthcare redaction software",
      secondaryThemes: ["medical records redaction", "redact patient information", "patient health information redaction", "clinical document redaction", "redact recorded consultations"],
    },
    eyebrow: "Healthcare",
    h1: "Redaction review for patient records and clinical documents.",
    summary:
      "Prepare medical records, correspondence, and recorded consultations for sharing with a review-led workflow, where every identifier is marked or confirmed by a person who understands the clinical context.",
    audience: {
      title: "For health records, privacy, and research teams",
      description:
        "Health information is shared for many legitimate reasons: continuity of care, insurance and legal requests, clinical audit, teaching, and research. Each purpose allows a different amount of detail, so the same record may need to be redacted differently for each recipient.",
      roles: [
        "Health information and medical records departments",
        "Privacy and information-governance officers",
        "Research and clinical-audit teams preparing source material",
        "Legal and claims teams answering records requests",
      ],
    },
    sensitiveInformation: [
      { label: "Patient identifiers", examples: "Names, dates of birth, addresses, medical record numbers, and insurance or member numbers." },
      { label: "Clinical detail", examples: "Diagnoses, medications, results, and notes that can identify someone indirectly, such as a rare condition." },
      { label: "Other people in the record", examples: "Relatives, carers, and staff named in clinical notes and correspondence." },
      { label: "Recordings and images", examples: "Voices and faces in recorded consultations, telehealth sessions, and teaching video." },
    ],
    challenges: [
      {
        title: "Identity hides in narrative text",
        description:
          "Clinical notes describe people in free text. A rare condition, an employer, or a family relationship can identify a patient even after the name is gone.",
      },
      {
        title: "Records are often scanned",
        description:
          "Referral letters, handwritten notes, and faxed results commonly exist only as images, so text must be recognised before a reviewer can assess it.",
      },
      {
        title: "Different recipients, different redactions",
        description:
          "A copy prepared for a research team may need far more removed than a copy released to the patient's own representative.",
      },
      {
        title: "Clinical judgement matters",
        description:
          "Deciding whether a detail is identifying, or whether it is needed for the recipient's purpose, often requires someone who understands what the note means.",
      },
    ],
    workflows: [
      {
        format: "document",
        title: "Medical records, letters, and scanned forms",
        description:
          "Convert records and letters for review, recognise text on scanned pages, assess candidate identifiers, and mark clinical narrative manually where context makes it identifying. Record a reason for each mark and keep a report with the released copy.",
        claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK", "DOC-REPORT"],
      },
      {
        format: "audio",
        title: "Recorded consultations and dictation",
        description:
          "Use an available transcript to find where a patient states identifying details, mark each span on the waveform, and render a masked copy for teaching or review.",
        claimIds: ["AUD-TIMELINE", "AUD-EFFECTS", "AUD-TRANSCRIPT-CONTEXT", "AUD-EXPORT"],
      },
      {
        format: "video",
        title: "Teaching, telehealth, and facility footage",
        description:
          "Review face candidates where engines are configured, place manual regions over screens showing patient data, and inspect the rendered video before it is used for education.",
        claimIds: ["VID-DETECTION", "VID-MANUAL", "VID-EFFECTS", "VID-OUTPUT-CHECK"],
      },
    ],
    considerations: [
      "OpenRedakt does not claim certification or compliance under any named health-privacy regulation. Your organisation remains responsible for its own privacy obligations.",
      "Some detection paths can be configured per job to use optional services. Confirm the job configuration before processing patient records.",
      "Candidate detection looks for categories of identifiers. It cannot judge whether clinical narrative indirectly identifies someone.",
      "Removing direct identifiers is not the same as de-identifying a dataset for research. Apply your organisation's own de-identification standard.",
    ],
    faq: [
      {
        question: "Does OpenRedakt hold health-privacy certifications?",
        answer:
          "No. OpenRedakt does not claim certification or compliance under named health-privacy regulations. It provides a review workflow; your privacy and legal teams decide what each disclosure requires.",
      },
      {
        question: "Can it find patient names and record numbers automatically?",
        answer:
          "Configured engines can surface candidate identifiers for review, and the categories depend on that configuration. Every candidate is confirmed by a reviewer, and free-text clinical narrative still needs human assessment.",
      },
      {
        question: "Do patient records stay on our workstation?",
        answer:
          "Core review and rendering run in the Windows desktop application. Some detection paths can be configured per job to use optional services, so check which engines a job uses before processing patient records.",
      },
      {
        question: "Can we redact a recorded consultation for teaching?",
        answer:
          "Yes. Reviewers mark the time ranges that contain identifying speech, apply a supported effect such as mute or tone, and listen to the exported copy before it is used.",
      },
    ],
    relatedFeatures: ["document-redaction", "audio-redaction", "video-redaction"],
    relatedIndustries: ["insurance", "legal", "education"],
    relatedInsights: [documentGuide],
    cta: {
      eyebrow: "Health records review",
      title: "Evaluate the workflow with synthetic or approved test records.",
      description:
        "We can walk through OCR, candidate review, manual marks for clinical narrative, and output inspection using representative files your governance team has approved for testing.",
    },
  },
  {
    slug: "finance",
    publicationStatus: "published",
    lastReviewed: "2026-10-26",
    group: "financial-transactional",
    navLabel: "Finance",
    icon: "credit-card",
    layout: "records-led",
    mediaEmphasis: ["document", "audio"],
    hubSummary: "Account numbers, client identifiers, and transaction detail in statements, files, and recorded calls.",
    seo: {
      title: "Financial Document Redaction for Statements & Files",
      description:
        "Redact account numbers, client identifiers, and transaction details in statements, loan files, and recorded client calls with a reviewer-controlled workflow.",
      canonicalPath: "/industries/finance",
      primaryIntent: "financial document redaction",
      secondaryThemes: ["redact bank statements", "redact account numbers", "loan file redaction", "call recording redaction", "client data redaction"],
    },
    eyebrow: "Finance",
    h1: "Redaction for statements, client files, and financial communications.",
    summary:
      "Remove account numbers, client identifiers, and transaction detail from the statements, applications, and call recordings your teams share with auditors, regulators, counterparties, and courts.",
    audience: {
      title: "For banking, lending, wealth, and finance operations teams",
      description:
        "Financial records pack many identifiers onto one page: names, account and card numbers, balances, counterparties, and addresses. They are shared constantly, with auditors, investigators, litigants, and acquirers, and each recipient needs only part of the picture.",
      roles: [
        "Operations and back-office teams answering records requests",
        "Financial-crime and investigation units",
        "Lending and underwriting teams sharing application files",
        "Legal teams producing financial records in disputes",
      ],
    },
    sensitiveInformation: [
      { label: "Account and card identifiers", examples: "Account, card, sort or routing numbers, and wallet or reference IDs printed across statements." },
      { label: "Client identity", examples: "Names, addresses, tax and identity numbers, and copies of identity documents in onboarding packs." },
      { label: "Transaction detail", examples: "Counterparties, amounts, payment references, and balances that reveal more than the recipient needs." },
      { label: "Spoken verification details", examples: "Account numbers, dates of birth, and security answers read out in recorded calls." },
    ],
    challenges: [
      {
        title: "Tables are dense",
        description:
          "Statements and ledgers repeat identifiers in columns, headers, and footers on every page, which makes a single missed occurrence easy and costly.",
      },
      {
        title: "Partial disclosure is the norm",
        description:
          "A recipient may need the transaction history but not the account number, or the amount but not the counterparty. Redaction has to be selective, not wholesale.",
      },
      {
        title: "Calls carry verification details",
        description:
          "Recorded instructions and service calls can contain spoken account numbers or security answers that must not travel with the recording.",
      },
      {
        title: "Native exports meet scans",
        description:
          "Application packs often combine system-generated PDFs with scanned identity and income documents that have no text layer.",
      },
    ],
    workflows: [
      {
        format: "document",
        title: "Statements, applications, and loan files",
        description:
          "Open statement exports as PDFs, recognise text on scanned supporting documents, review candidate identifiers, and add precise text or area marks so that only the fields the recipient should not see are removed.",
        claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK", "DOC-REPORT"],
      },
      {
        format: "audio",
        title: "Recorded client and service calls",
        description:
          "Load common call-recording formats, mark the spans where account or verification details are spoken, preview a masking effect, and export a copy for complaint handling or dispute review.",
        claimIds: ["AUD-INPUT", "AUD-TIMELINE", "AUD-EFFECTS", "AUD-PREVIEW", "AUD-EXPORT"],
      },
    ],
    considerations: [
      "Candidate categories depend on the configured engine. Test detection with your own statement layouts and identifier formats.",
      "Audio redaction is manual-first. Reviewers mark spoken account or verification details on the timeline; automated transcript analysis is not presented as a complete workflow.",
      "OpenRedakt does not claim certification under payment-card or financial-sector security standards.",
      "It is a desktop review application, not a document-management, archiving, or retention system.",
    ],
    faq: [
      {
        question: "Can OpenRedakt find account numbers automatically?",
        answer:
          "Configured engines can surface candidate identifiers, including number patterns, for review. Coverage depends on configuration and document layout, so reviewers confirm each finding and check repeated headers and footers.",
      },
      {
        question: "Can we keep amounts visible while removing the account number?",
        answer:
          "Yes. Reviewers choose exactly which text or areas to mark, so the rest of the statement remains readable in the rendered copy.",
      },
      {
        question: "Can recorded calls be redacted?",
        answer:
          "Yes. Supported audio formats open on a waveform where reviewers mark the sensitive spans, apply a supported effect, and listen to the exported recording.",
      },
      {
        question: "Does OpenRedakt hold payment-card security certifications?",
        answer:
          "No. OpenRedakt does not claim certification under payment-card or other financial-sector standards. Evaluate it against your own security and data-handling requirements.",
      },
    ],
    relatedFeatures: ["document-redaction", "audio-redaction"],
    relatedIndustries: ["insurance", "legal", "human-resources"],
    relatedInsights: [documentGuide],
    cta: {
      eyebrow: "Financial records review",
      title: "Test the workflow on a representative statement set.",
      description:
        "Bring sample statements or a recorded call with synthetic data and we will show candidate review, selective marks, export, and output inspection.",
    },
  },
  {
    slug: "insurance",
    publicationStatus: "published",
    lastReviewed: "2026-10-26",
    group: "financial-transactional",
    navLabel: "Insurance",
    icon: "shield-check",
    layout: "mixed",
    mediaEmphasis: ["document", "video", "audio"],
    hubSummary: "Policyholder and third-party details across claim documents, photos, statements, and dashcam video.",
    seo: {
      title: "Insurance Claims Redaction for Files, Photos & Video",
      description:
        "Review policyholder, medical, and third-party details in claims files, damage photos, recorded statements, and dashcam or site video with OpenRedakt.",
      canonicalPath: "/industries/insurance",
      primaryIntent: "insurance claims redaction",
      secondaryThemes: ["redact claims documents", "policyholder data redaction", "recorded statement redaction", "dashcam video redaction", "redact damage photos"],
    },
    eyebrow: "Insurance",
    h1: "Redaction for claims files, recorded statements, and supporting media.",
    summary:
      "A single claim can hold policy documents, medical reports, phone photos, a recorded statement, and dashcam footage. OpenRedakt brings those formats into one review process before the file is shared with experts, counterparties, or litigants.",
    audience: {
      title: "For claims, investigations, and recovery teams",
      description:
        "Claims files move between adjusters, loss assessors, medical experts, investigators, reinsurers, and lawyers. Each handover can expose information about the policyholder, and about third parties who never agreed to appear in the file.",
      roles: [
        "Claims handlers and adjusters",
        "Special investigations units",
        "Claims litigation and recovery teams",
        "Third-party administrators and loss assessors",
      ],
    },
    sensitiveInformation: [
      { label: "Policyholder details", examples: "Names, addresses, policy numbers, and bank details for claim payments." },
      { label: "Medical and injury information", examples: "Medical reports, treatment notes, and photographs of injuries." },
      { label: "Third-party identities", examples: "Witnesses, other drivers, neighbours, and bystanders named in statements or seen in media." },
      { label: "Vehicle and location media", examples: "Licence plates, faces, and house numbers in dashcam, site, and damage footage." },
    ],
    challenges: [
      {
        title: "Evidence arrives in every format",
        description:
          "Forms, reports, phone photos, recorded statements, and video often sit in the same claim. Reviewing each in a separate tool makes it harder to see what has already been handled.",
      },
      {
        title: "Footage captures bystanders",
        description:
          "Dashcam and site footage routinely records people and vehicles unrelated to the claim, and their details should not travel with the evidence.",
      },
      {
        title: "Medical information travels with the claim",
        description:
          "Injury and treatment details need tighter handling than the rest of the file, especially when evidence is shared with a counterparty.",
      },
      {
        title: "Evidence is shared again and again",
        description:
          "The same photo or clip may go to an assessor, an expert, and opposing counsel, and each release needs its own check of the rendered file.",
      },
    ],
    workflows: [
      {
        format: "document",
        title: "Claim forms, reports, and damage photos",
        description:
          "Open claim forms, reports, and supported image files in the document workflow, recognise text on scans, review candidate identifiers, and draw area marks over plates or faces in still photos.",
        claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK"],
      },
      {
        format: "video",
        title: "Dashcam, site, and surveillance footage",
        description:
          "Review configured face and licence-plate candidates, add manual regions for house numbers or documents in frame, set when each region applies, and inspect the rendered clip.",
        claimIds: ["VID-INPUT", "VID-DETECTION", "VID-MANUAL", "VID-TIMELINE", "VID-EFFECTS", "VID-OUTPUT-CHECK"],
      },
      {
        format: "audio",
        title: "Recorded statements and claim calls",
        description:
          "Mark spans where a claimant or witness gives medical details or names a third party, preview the masking effect, and export the statement for onward sharing.",
        claimIds: ["AUD-TIMELINE", "AUD-EFFECTS", "AUD-PREVIEW", "AUD-EXPORT"],
      },
    ],
    considerations: [
      "Face, plate, and visible-text candidates require configured engines and reviewer confirmation. They are not continuous tracking across a clip.",
      "Video decoding and rendering depend on configured FFmpeg tooling and the codecs in each source file. Test with your own dashcam and phone footage.",
      "Still photos are reviewed through the document and image workflow and checked like any other rendered file.",
      "OpenRedakt does not decide what a counterparty or court is entitled to see.",
    ],
    faq: [
      {
        question: "Can OpenRedakt blur licence plates in dashcam footage?",
        answer:
          "When the required engines are configured, licence-plate candidates can be surfaced for review, and reviewers can place manual regions for anything missed. Each region is bounded to a time range and checked after rendering.",
      },
      {
        question: "Will it follow a moving vehicle automatically?",
        answer:
          "No. Generic object tracking is not presented as a packaged capability. Reviewers set the time range for each region and confirm coverage during playback.",
      },
      {
        question: "Can we redact damage or injury photos?",
        answer:
          "Yes. Supported image formats such as PNG, JPG, and TIFF can be opened for review, and reviewers draw area marks over faces, plates, or other identifying content.",
      },
      {
        question: "Can recorded statements be redacted before sharing?",
        answer:
          "Yes. Mark the sensitive ranges on the audio timeline, apply a supported effect such as mute or tone, and listen to the exported recording before it is shared.",
      },
    ],
    relatedFeatures: ["document-redaction", "video-redaction", "audio-redaction"],
    relatedIndustries: ["finance", "healthcare", "legal"],
    relatedInsights: [],
    cta: {
      eyebrow: "Claims evidence review",
      title: "Bring a claim file with mixed evidence.",
      description:
        "Use a representative claim with documents, photos, a statement, and owned footage to see how each format is reviewed and checked in one application.",
    },
  },
  {
    slug: "education",
    publicationStatus: "published",
    lastReviewed: "2026-10-26",
    group: "people-care-education",
    navLabel: "Education",
    icon: "graduation",
    layout: "mixed",
    mediaEmphasis: ["document", "video", "audio"],
    hubSummary: "Other students' details, welfare notes, and campus footage in records released to families and authorities.",
    seo: {
      title: "Education Redaction Software for Student Records",
      description:
        "Redact student names, identifiers, and sensitive notes in school records, welfare files, correspondence, and classroom or campus video before release.",
      canonicalPath: "/industries/education",
      primaryIntent: "student records redaction",
      secondaryThemes: ["education redaction software", "redact school records", "school CCTV redaction", "school records requests", "redact student information"],
    },
    eyebrow: "Education",
    h1: "Redaction for student records, school correspondence, and campus footage.",
    summary:
      "Schools, colleges, and universities release records to parents, students, regulators, and courts. OpenRedakt helps staff remove other students' details and sensitive notes from documents and recordings before they leave the institution.",
    audience: {
      title: "For schools, districts, colleges, and universities",
      description:
        "Education records rarely concern one person. A behaviour report, an email thread, or a corridor video usually involves several students, and a request from one family must not expose another.",
      roles: [
        "School and district records officers",
        "Student services and registry teams",
        "Welfare and safeguarding leads preparing case files",
        "Legal and governance staff handling records requests",
      ],
    },
    sensitiveInformation: [
      { label: "Student identity", examples: "Names, student numbers, dates of birth, photographs, and home addresses." },
      { label: "Other students in the record", examples: "Classmates named in incident logs, behaviour reports, and staff email threads." },
      { label: "Welfare and support notes", examples: "Health, learning-support, and family-circumstance information recorded by staff." },
      { label: "Campus media", examples: "Faces in classroom, bus, or CCTV footage, and voices in recorded meetings or hearings." },
    ],
    challenges: [
      {
        title: "One request, many students",
        description:
          "Releasing a file to one family requires removing every other child's details, including nicknames, initials, and descriptions that make a classmate recognisable.",
      },
      {
        title: "Incident video shows bystanders",
        description:
          "Classroom, playground, and bus footage usually shows students who are not the subject of the request and whose families have not consented to its release.",
      },
      {
        title: "Sensitive notes hide in routine records",
        description:
          "Welfare, health, and support information can appear inside otherwise ordinary correspondence between staff and parents.",
      },
      {
        title: "Redaction competes with other duties",
        description:
          "Records work is often done by administrators alongside daily responsibilities, so each decision needs to be visible and easy to check before release.",
      },
    ],
    workflows: [
      {
        format: "document",
        title: "Student files, incident reports, and email exports",
        description:
          "Review student files and emails saved as PDF, surface candidate names where engines are configured, mark other students' details manually, and create a report of the reviewed actions to keep with the response.",
        claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK", "DOC-REPORT"],
      },
      {
        format: "video",
        title: "Classroom, bus, and campus footage",
        description:
          "Review configured face candidates, add manual regions for students the detector misses, bound each region to the part of the clip where it is needed, and inspect the rendered video.",
        claimIds: ["VID-INPUT", "VID-DETECTION", "VID-MANUAL", "VID-TIMELINE", "VID-EFFECTS", "VID-OUTPUT-CHECK"],
      },
      {
        format: "audio",
        title: "Recorded meetings and hearings",
        description:
          "Mark the spans in a recorded meeting where other students are named, preview the masking effect, and keep the remainder of the discussion intact.",
        claimIds: ["AUD-TIMELINE", "AUD-EFFECTS", "AUD-PREVIEW"],
      },
    ],
    considerations: [
      "Rules on releasing student records vary by country, region, and institution. OpenRedakt does not interpret them.",
      "Face candidates require configured engines and still need reviewer confirmation across every part of the clip that matters.",
      "Records involving children warrant a second review of the exported output before release.",
      "Emails are reviewed once saved in a supported document format. PST and OST mailbox files are not promoted as a supported input.",
    ],
    faq: [
      {
        question: "Can OpenRedakt obscure other students in incident video?",
        answer:
          "Yes. Where engines are configured, face candidates are surfaced for review, and reviewers can draw manual regions for anyone missed, then choose blur, pixelate, or a solid block for each region.",
      },
      {
        question: "Can we remove other students' names from an email thread?",
        answer:
          "Yes, once the thread is saved as a PDF or another supported document format. Candidate findings and manual text marks are reviewed together before the copy is rendered.",
      },
      {
        question: "Does OpenRedakt open mailbox exports directly?",
        answer:
          "Not currently. PST and OST mailbox files are not promoted as supported inputs while representative acceptance is pending. Save the relevant messages in a supported document format first.",
      },
      {
        question: "Is OpenRedakt approved under student-privacy laws?",
        answer:
          "No. OpenRedakt does not claim certification or compliance under named student-privacy laws. It provides a review workflow; your institution decides what each release requires.",
      },
    ],
    relatedFeatures: ["document-redaction", "video-redaction", "audio-redaction"],
    relatedIndustries: ["local-government", "government", "human-resources"],
    relatedInsights: [documentGuide],
    cta: {
      eyebrow: "Student records review",
      title: "Walk through a records request with synthetic student files.",
      description:
        "See how email exports, incident reports, and owned test footage move through review, export, and a final check before release.",
    },
  },
  {
    slug: "human-resources",
    publicationStatus: "published",
    lastReviewed: "2026-10-26",
    group: "people-care-education",
    navLabel: "Human Resources",
    icon: "users",
    layout: "mixed",
    mediaEmphasis: ["document", "audio", "video"],
    hubSummary: "Employee, witness, and health details in personnel files, investigations, and recorded interviews.",
    seo: {
      title: "HR Redaction Software for Employee Records",
      description:
        "Redact employee identifiers, witness details, and sensitive personal information in personnel files, investigation reports, and recorded interviews.",
      canonicalPath: "/industries/human-resources",
      primaryIntent: "HR redaction software",
      secondaryThemes: ["redact employee records", "workplace investigation redaction", "redact personnel files", "employee data request redaction", "interview recording redaction"],
    },
    eyebrow: "Human resources",
    h1: "Redaction for personnel files, workplace investigations, and interview recordings.",
    summary:
      "When an employee asks for their file, a grievance reaches a tribunal, or investigation findings go to managers, HR teams need to disclose what is relevant and protect everyone else who is named.",
    audience: {
      title: "For HR, employee-relations, and people-operations teams",
      description:
        "HR records mix the requester's own information with details about colleagues, managers, and witnesses who gave evidence in confidence. Redaction protects those people while letting the record serve its purpose.",
      roles: [
        "Employee-relations and workplace-investigation teams",
        "HR operations handling employee data requests",
        "Recruitment teams sharing candidate packs with panels",
        "Employment counsel preparing tribunal or court bundles",
      ],
    },
    sensitiveInformation: [
      { label: "Employee identifiers", examples: "Staff numbers, home addresses, bank and tax details, and dates of birth." },
      { label: "Witness and complainant identities", examples: "Names, roles, and descriptions that reveal who raised or supported a complaint." },
      { label: "Health and absence information", examples: "Medical notes, occupational-health reports, and leave records." },
      { label: "Interview recordings", examples: "Voices, names, and personal details in recorded investigation meetings and hearings." },
    ],
    challenges: [
      {
        title: "Witnesses expect confidentiality",
        description:
          "Investigation reports name the colleagues who gave evidence. A job title, a shift pattern, or a description of an event can identify a witness as clearly as a name.",
      },
      {
        title: "The requester's data is mixed with others'",
        description:
          "An employee is entitled to information about themselves, not about everyone else copied into the same email chain or meeting note.",
      },
      {
        title: "Meetings are increasingly recorded",
        description:
          "Investigation interviews and grievance hearings may exist as audio or video as well as written notes, and each version needs the same protection.",
      },
      {
        title: "Candidate packs carry personal detail",
        description:
          "CVs and application forms can include addresses, dates of birth, and photographs that a hiring panel does not need to see.",
      },
    ],
    workflows: [
      {
        format: "document",
        title: "Personnel files, investigation reports, and CVs",
        description:
          "Review candidate identifiers in personnel files, mark witness names and indirect identifiers manually, record a reason for each mark, and create a report alongside the disclosed copy.",
        claimIds: ["DOC-INPUT", "DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK", "DOC-REPORT"],
      },
      {
        format: "audio",
        title: "Recorded interviews and hearings",
        description:
          "Open the interview recording, use any available transcript as context, mark the ranges where witnesses or health details are mentioned, preview, and export a masked copy.",
        claimIds: ["AUD-INPUT", "AUD-TIMELINE", "AUD-EFFECTS", "AUD-PREVIEW", "AUD-TRANSCRIPT-CONTEXT", "AUD-EXPORT"],
      },
      {
        format: "video",
        title: "Video-recorded meetings",
        description:
          "Place regions over faces or shared screens in recorded meetings, bound them to the right part of the timeline, and handle the soundtrack in the same project.",
        claimIds: ["VID-MANUAL", "VID-TIMELINE", "VID-AUDIO", "VID-OUTPUT-CHECK"],
      },
    ],
    considerations: [
      "Indirect identifiers such as job titles, shifts, locations, or descriptions of an event are judgement calls. Candidate detection does not assess them.",
      "OpenRedakt is a desktop review application, not an HR information system or case-management platform.",
      "Rules on employee data requests differ by jurisdiction. Confirm what must be disclosed with your legal team.",
      "Recorded interviews are redacted manually on the timeline. Listen to the export before sharing it.",
    ],
    faq: [
      {
        question: "Can OpenRedakt remove witness names from an investigation report?",
        answer:
          "Yes. Candidate findings can surface names where engines are configured, and reviewers add manual marks for indirect identifiers such as roles or shift details, recording a reason for each.",
      },
      {
        question: "Can we prepare CVs for a hiring panel without personal details?",
        answer:
          "Reviewers can mark names, contact details, photographs, and other personal information on CVs before they are shared. The reviewer decides what is removed and checks the rendered copy.",
      },
      {
        question: "Can recorded grievance interviews be redacted?",
        answer:
          "Yes. Mark the sensitive spans on the waveform, choose a supported effect such as mute or tone, and listen to the exported file before it is shared.",
      },
      {
        question: "Is OpenRedakt an HR case-management system?",
        answer:
          "No. It is a redaction review application that works alongside your existing HR and case-management systems.",
      },
    ],
    relatedFeatures: ["document-redaction", "audio-redaction", "video-redaction"],
    relatedIndustries: ["legal", "education", "finance"],
    relatedInsights: [documentGuide],
    cta: {
      eyebrow: "HR records review",
      title: "Test an employee data request end to end.",
      description:
        "Use a synthetic personnel file and recorded interview to see candidate review, witness protection, audio masking, and output inspection.",
    },
  },
  {
    slug: "media-journalism",
    publicationStatus: "published",
    lastReviewed: "2026-10-26",
    group: "media-data",
    navLabel: "Media & Journalism",
    icon: "mic",
    layout: "media-led",
    mediaEmphasis: ["video", "audio", "document"],
    hubSummary: "Sources, bystanders, and identifying details in interview footage, audio, and obtained documents.",
    seo: {
      title: "Redaction for Journalists: Protect Source Identities",
      description:
        "Protect sources, bystanders, and private details in interview footage, audio recordings, and obtained documents with frame, timeline, and page-level review.",
      canonicalPath: "/industries/media-journalism",
      primaryIntent: "redaction software for journalists",
      secondaryThemes: ["blur faces in interview video", "redact audio interviews", "protect anonymous sources", "redact leaked documents", "news footage redaction"],
    },
    eyebrow: "Media & journalism",
    h1: "Protect sources and bystanders in interviews, footage, and documents.",
    summary:
      "Newsrooms and documentary teams publish recordings and documents that can identify people who were promised anonymity. OpenRedakt combines visual regions, audio masking, and document marks so producers can review exactly what the audience will see and hear.",
    audience: {
      title: "For newsrooms, documentary producers, and investigative teams",
      description:
        "Editorial redaction is about protecting people, not only data: an anonymous source, a bystander in a crowd, a minor in the background, or a name in a document that was never meant to be public.",
      roles: [
        "Video and audio producers",
        "Investigative and data journalists",
        "Documentary and factual production teams",
        "Standards, legal, and editorial-review desks",
      ],
    },
    sensitiveInformation: [
      { label: "Source identity", examples: "Faces, voices, distinctive clothing, and recognisable locations of contributors promised anonymity." },
      { label: "Bystanders and minors", examples: "People in crowds, children in the background, and passers-by in street footage." },
      { label: "Identifying text in frame", examples: "Licence plates, door numbers, screens, name badges, and papers shown on camera." },
      { label: "Names in obtained documents", examples: "Junior staff, third parties, and signatures in documents published as evidence." },
    ],
    challenges: [
      {
        title: "A blurred face is not enough",
        description:
          "A voice, a reflection, a tattoo, or a street sign can identify a source. Picture and sound need to be reviewed together, not as separate jobs.",
      },
      {
        title: "Identifiers move through the frame",
        description:
          "People and vehicles enter and leave shots, so every visual treatment needs a defined start and end that the producer has checked.",
      },
      {
        title: "Evidence exposes the wrong people",
        description:
          "Obtained documents may need to be published to support a story while protecting the junior staff or third parties named in them.",
      },
      {
        title: "Deadlines compress review",
        description:
          "Publication pressure makes it tempting to skip the final pass. The rendered file still has to be watched and listened to before broadcast.",
      },
    ],
    workflows: [
      {
        format: "video",
        title: "Interview and field footage",
        description:
          "Review configured face, plate, and visible-text candidates, draw regions for anything else that identifies a source, set when each treatment applies, and mask spoken names on the same project timeline.",
        claimIds: ["VID-INPUT", "VID-DETECTION", "VID-MANUAL", "VID-TIMELINE", "VID-EFFECTS", "VID-AUDIO", "VID-OUTPUT-CHECK"],
      },
      {
        format: "audio",
        title: "Audio interviews and podcasts",
        description:
          "Mark the ranges where a contributor names a colleague, a place, or themselves, choose mute, tone, silence, or a noise mask, and listen to the exported episode.",
        claimIds: ["AUD-INPUT", "AUD-TIMELINE", "AUD-EFFECTS", "AUD-PREVIEW", "AUD-EXPORT"],
      },
      {
        format: "document",
        title: "Obtained and published documents",
        description:
          "Open documents and scans for review, mark names and signatures with text or area marks, and inspect the rendered copy before it is published alongside the story.",
        claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-MANUAL", "DOC-OUTPUT-CHECK"],
      },
    ],
    considerations: [
      "Mute, tone, silence, and noise masks remove speech in the selected range. Voice alteration that keeps speech intelligible is not presented as a supported capability.",
      "Face candidates depend on configured engines. Producers confirm coverage across the whole clip, especially in crowded or fast-moving shots.",
      "Generic object tracking is not presented as a packaged capability; each region has a reviewer-set time range.",
      "Watch and listen to the rendered file in full before publication.",
    ],
    faq: [
      {
        question: "Can OpenRedakt disguise a source's voice?",
        answer:
          "The promoted audio effects are mute, tone, silence, and noise masks applied to selected ranges. Voice alteration that keeps speech intelligible is not presented as a supported capability.",
      },
      {
        question: "Can I blur a face and mute a name in the same clip?",
        answer:
          "Yes. Visual regions and audio ranges are reviewed in the same video project, and the rendered picture and sound are inspected together.",
      },
      {
        question: "Will it follow a moving person automatically?",
        answer:
          "No. Configured engines can surface face candidates, but generic tracking is not a packaged capability. Producers set and check the time range of each region.",
      },
      {
        question: "Can we publish documents with names removed?",
        answer:
          "Yes. Text and area marks can cover names and signatures, and the rendered copy can be re-opened and inspected before publication.",
      },
    ],
    relatedFeatures: ["video-redaction", "audio-redaction", "document-redaction"],
    relatedIndustries: ["legal", "government", "insurance"],
    relatedInsights: [],
    cta: {
      eyebrow: "Editorial workflow review",
      title: "Review a clip you own with your producers.",
      description:
        "Bring owned interview footage or audio and see how visual regions, audio masks, and final playback checks fit your editorial standards process.",
    },
  },
  {
    slug: "real-estate",
    publicationStatus: "draft",
    draftReason:
      "Document-only fit with no audio or video differentiation. Needs validation against representative closing, title, and lease documents before it can say more than the document redaction feature page already does.",
    lastReviewed: "2026-10-26",
    group: "financial-transactional",
    navLabel: "Real Estate",
    icon: "home",
    layout: "records-led",
    mediaEmphasis: ["document"],
    hubSummary: "Buyer, seller, and tenant details in contracts, closing files, leases, and supporting financial documents.",
    seo: {
      title: "Real Estate Document Redaction for Transaction Files",
      description:
        "Redact buyer, seller, and tenant details in purchase contracts, closing files, leases, and supporting financial documents before they are shared with third parties.",
      canonicalPath: "/industries/real-estate",
      primaryIntent: "real estate document redaction",
      secondaryThemes: ["redact closing documents", "redact purchase agreements", "lease redaction", "title document redaction"],
    },
    eyebrow: "Real estate",
    h1: "Redaction for transaction files, contracts, and leases.",
    summary:
      "Property transactions gather identity documents, bank statements, and signed contracts from several parties. Review what each recipient should see before the file is shared.",
    audience: {
      title: "For brokers, conveyancers, and property managers",
      description: "Transaction files are shared with lenders, surveyors, and other parties who need only part of the record.",
      roles: ["Brokerages and agencies", "Conveyancing and closing teams", "Property and lettings managers"],
    },
    sensitiveInformation: [
      { label: "Party identity", examples: "Names, addresses, and identity documents of buyers, sellers, and tenants." },
      { label: "Financial detail", examples: "Bank statements, proof of funds, and payment instructions." },
      { label: "Signatures", examples: "Signed contracts, deeds, and leases." },
    ],
    challenges: [
      { title: "Several parties per file", description: "Each party's details need different handling depending on who receives the file." },
      { title: "Signed scans", description: "Executed documents are often scanned, so signatures and handwritten details are images." },
      { title: "Supporting financials", description: "Proof-of-funds documents carry account data unrelated to the transaction itself." },
    ],
    workflows: [
      {
        format: "document",
        title: "Contracts, closing files, and leases",
        description: "Convert scanned and native documents for review, mark party details and signatures, and inspect the rendered copy.",
        claimIds: ["DOC-INPUT", "DOC-OCR", "DOC-MANUAL", "DOC-REVIEW", "DOC-OUTPUT-CHECK"],
      },
    ],
    considerations: ["Recording and filing requirements for property documents vary by jurisdiction."],
    faq: [],
    relatedFeatures: ["document-redaction"],
    relatedIndustries: ["finance"],
    relatedInsights: [],
    cta: {
      eyebrow: "Transaction file review",
      title: "Review a representative transaction file.",
      description: "See how signed scans and supporting financial documents move through review and output inspection.",
    },
  },
  {
    slug: "ai-data-teams",
    publicationStatus: "draft",
    draftReason:
      "OpenRedakt reviews individual source files. Without verified batch processing or dataset-level de-identification evidence, a dedicated page would risk implying automated dataset anonymisation.",
    lastReviewed: "2026-10-26",
    group: "media-data",
    navLabel: "AI & Data Teams",
    icon: "database",
    layout: "mixed",
    mediaEmphasis: ["document", "audio", "video"],
    hubSummary: "Sensitive details in source documents, recordings, and footage reviewed before authorized downstream use.",
    seo: {
      title: "Reviewing Sensitive Source Material for AI Teams",
      description:
        "Review personal details in source documents, recordings, and footage before they are approved for model evaluation, annotation, or other authorized downstream use.",
      canonicalPath: "/industries/ai-data-teams",
      primaryIntent: "redact training data sources",
      secondaryThemes: ["review source data before annotation", "redact recordings before reuse", "personal data in source files"],
    },
    eyebrow: "AI & data teams",
    h1: "Review sensitive source material before authorized downstream use.",
    summary:
      "Data teams sometimes need a person to review individual documents, recordings, or clips before they are approved for annotation or evaluation. OpenRedakt supports that file-by-file review.",
    audience: {
      title: "For data stewards and annotation leads",
      description: "Teams that approve individual source files for downstream use and need a reviewer to check them first.",
      roles: ["Data stewards", "Annotation and evaluation leads", "Privacy reviewers"],
    },
    sensitiveInformation: [
      { label: "Direct identifiers", examples: "Names, contact details, and account numbers in source documents." },
      { label: "Voices and speech", examples: "Spoken personal details in recordings." },
      { label: "Faces and visible text", examples: "People and readable text in footage." },
    ],
    challenges: [
      { title: "File-level review", description: "Each source file is reviewed individually; dataset-wide assurances are out of scope." },
      { title: "Mixed media", description: "Source material can include documents, audio, and video." },
      { title: "Reuse purpose", description: "What must be removed depends on the authorized downstream purpose." },
    ],
    workflows: [
      { format: "document", title: "Source documents", description: "Review candidate identifiers and mark source documents before approval.", claimIds: ["DOC-CANDIDATES", "DOC-MANUAL", "DOC-REVIEW"] },
      { format: "audio", title: "Source recordings", description: "Mark and mask spoken personal details on the timeline.", claimIds: ["AUD-TIMELINE", "AUD-EFFECTS"] },
      { format: "video", title: "Source footage", description: "Review candidates and place regions on footage before approval.", claimIds: ["VID-DETECTION", "VID-MANUAL"] },
    ],
    considerations: ["OpenRedakt does not de-identify datasets automatically or certify that a corpus is free of personal data."],
    faq: [],
    relatedFeatures: ["document-redaction", "audio-redaction", "video-redaction"],
    relatedIndustries: ["media-journalism"],
    relatedInsights: [],
    cta: {
      eyebrow: "Source review",
      title: "Review representative source files.",
      description: "See how a reviewer checks individual documents, recordings, and clips before approval.",
    },
  },
];

export const liveIndustryPages = industryPages.filter(isIndustryLive);

export function getIndustryPage(slug: string): IndustryPageContent | undefined {
  return liveIndustryPages.find((page) => page.slug === slug);
}

export function industryHref(slug: IndustrySlug): `/industries/${IndustrySlug}` {
  return `/industries/${slug}`;
}

/** Curated, ordered entries for the Industries dropdown. Unpublished slugs drop out. */
export const featuredIndustrySlugs: readonly IndustrySlug[] = ["legal", "government", "healthcare", "finance", "insurance"];

export const featuredIndustries = featuredIndustrySlugs
  .map((slug) => getIndustryPage(slug))
  .filter((page): page is IndustryPageContent => Boolean(page));
