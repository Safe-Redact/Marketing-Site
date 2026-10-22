"use client";

import { useState } from "react";
import { workflowSteps } from "@/content/platform";
import { Accordion } from "@/components/ui/Accordion";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WorkflowPreview } from "@/components/visuals/WorkflowPreview";

const accordionItems = workflowSteps.map((step) => ({
  id: step.id,
  title: step.label,
  description: step.description,
  icon: step.icon,
}));

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-canvas py-section text-ink">
      <Container>
        <AnimateOnScroll className="max-w-3xl">
          <Eyebrow>Product workflow</Eyebrow>
          <h2 className="mt-4 font-heading text-display font-bold text-ink text-balance">
            From source file to reviewed output
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
            Keep detection, review decisions, and export checks together in a workflow designed around the source format.
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
          <AnimateOnScroll>
            <WorkflowPreview activeIndex={activeIndex} />
          </AnimateOnScroll>
          <AnimateOnScroll delay={100} className="lg:pt-4">
            <p className="mb-5 text-sm font-medium leading-6 text-ink-muted">
              Select a step to see the OpenRedakt workflow screen it happens on.
            </p>
            <Accordion
              items={accordionItems}
              openIndex={activeIndex}
              onOpenChange={(index) => setActiveIndex(index ?? activeIndex)}
              allowCollapse={false}
            />
            <div className="mt-6 rounded-card border border-accent-warm/20 bg-accent-warm/[0.07] p-4 text-sm leading-6 text-ink-muted">
              <strong className="font-semibold text-ink">Review remains essential.</strong>{" "}
              Detection results are candidates; inspect the complete rendered output before use or sharing.
            </div>
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
  );
}
