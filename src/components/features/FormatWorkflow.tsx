import React from "react";
import type { WorkflowStep } from "@/lib/marketing/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkflowSteps } from "@/components/marketing/WorkflowSteps";

export function FormatWorkflow({ steps, title = "A review path that stays consistent across formats", description = "The controls change with the medium. The responsibility to inspect every decision does not." }: { steps: readonly WorkflowStep[]; title?: string; description?: string }) {
  return (
    <section className="section-y border-t border-border-subtle/50 bg-canvas text-ink">
      <Container>
        <SectionHeading eyebrow="Review to output" title={title} description={description} />
        <div className="mt-12"><WorkflowSteps steps={steps} /></div>
      </Container>
    </section>
  );
}
