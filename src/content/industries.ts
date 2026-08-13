import type { Industry } from "@/types";

export const industries: Industry[] = [
  {
    icon: "scale",
    title: "Legal",
    description:
      "Law firms and courts rely on proper redaction of PII from legal documents, case files, and discovery materials before filing.",
  },
  {
    icon: "heart",
    title: "Healthcare",
    description:
      "HIPAA-compliant redaction of PHI from medical records, clinical trial documentation, and patient communications.",
  },
  {
    icon: "building",
    title: "Government",
    description:
      "FOIA and FISMA-compliant redaction for public records requests, agency documents, and classified materials.",
  },
  {
    icon: "landmark",
    title: "Financial Services",
    description:
      "GDPR and GLBA-compliant de-identification of financial records, loan documents, and banking statements.",
  },
  {
    icon: "briefcase",
    title: "Corporate",
    description:
      "Internal documents, HR records, contracts, and communications redacted for mergers, litigation, and compliance.",
  },
  {
    icon: "search",
    title: "Investigations",
    description:
      "Sensitive investigative materials redacted for disclosure, FOIA requests, and legal proceedings.",
  },
];
