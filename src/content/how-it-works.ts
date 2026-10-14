import type { Step } from "@/types";

export const steps: Step[] = [
  {
    number: 1,
    title: "Open Your File",
    description:
      "Add a supported document, image, audio recording, or video to a SafeRedact project.",
  },
  {
    number: 2,
    title: "Detect and Review",
    description:
      "Use the available detector or transcription workflow, then review or adjust the proposed redactions.",
  },
  {
    number: 3,
    title: "Create the Output",
    description:
      "Export the redacted file and inspect the rendered result before using or sharing it.",
  },
];
