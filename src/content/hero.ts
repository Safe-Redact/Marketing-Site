export const heroContent = {
  eyebrow: "AI-powered redaction",
  headline: "Detect sensitive information. Redact with confidence.",
  /**
   * The hero sets the headline as a sequence: muted steps leading to the final line.
   * The first and last lines are the headline itself; the middle steps appear from
   * the small-tablet width up, where each fits on one line.
   */
  headlineSequence: [
    "Detect sensitive information.",
    "Review every decision.",
    "Inspect the output.",
    "Redact with confidence.",
  ],
  subheadline:
    "OpenRedakt is a Windows desktop application for AI-assisted redaction across documents, images, audio, and video, with review controls before export.",
  primaryCta: {
    label: "Request a Demo",
    href: "#demo-enquiry",
  },
  secondaryCta: {
    label: "How It Works",
    href: "/how-it-works",
  },
  showcase: {
    title: "Review in context",
    description:
      "Detected items wait in the findings list. Accept, adjust, or add marks on the page before anything is exported.",
    note: "Current release · synthetic statement",
  },
};
