"use client";

import Link from "next/link";
import { useState } from "react";
import { workflowSteps } from "@/content/platform";
import { OutputCheckDiagram, SourcesDiagram } from "@/components/media/Diagrams";
import { MediaSlot } from "@/components/media/MediaSlot";
import { ProductShot } from "@/components/media/ProductShot";
import { Accordion } from "@/components/ui/Accordion";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const accordionItems = workflowSteps.map((step) => ({
  id: step.id,
  title: step.label,
  description: step.description,
  icon: step.icon,
}));

const STEP_RATIO = "16 / 10";

/**
 * Step visuals. Only the review step has an approved capture; opening and exporting
 * use labelled diagrams until CAP-PRJ-01 and CAP-EXP-01 are produced.
 */
function StepVisual({ index }: { index: number }) {
  if (index === 1) {
    return (
      <ProductShot
        capture="document-editor"
        crop="toolsWide"
        alt="OpenRedakt document review: manual redaction tools beside a synthetic statement with reviewed marks"
        displayWidth={620}
      />
    );
  }
  return index === 0 ? (
    <MediaSlot slot="CAP-PRJ-01" aspectRatio={STEP_RATIO}>
      <SourcesDiagram />
    </MediaSlot>
  ) : (
    <MediaSlot slot="CAP-EXP-01" aspectRatio={STEP_RATIO}>
      <OutputCheckDiagram />
    </MediaSlot>
  );
}

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = workflowSteps[activeIndex];

  return (
    <section id="how-it-works" className="section-y relative border-t border-border-subtle/50 bg-canvas text-ink">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <AnimateOnScroll>
            <p className="type-eyebrow">Product workflow</p>
            <h2 className="type-h2 mt-4 max-w-[18ch]">
              From source file to reviewed output. <span className="type-quiet">Three steps, every format.</span>
            </h2>
            <p className="type-body mt-5 max-w-xl">
              Keep detection, review decisions, and export checks together in a workflow designed around the source format.
            </p>
            <Accordion
              className="mt-9"
              items={accordionItems}
              openIndex={activeIndex}
              onOpenChange={(index) => setActiveIndex(index ?? activeIndex)}
              allowCollapse={false}
            />
            <p className="mt-6 flex gap-3 text-sm leading-6 text-ink-muted">
              <Icon name="info" size={17} className="mt-0.5 shrink-0 text-accent-warm" />
              <span>
                <strong className="font-semibold text-ink">Review remains essential.</strong> Detection results are candidates; inspect the complete rendered output before use or sharing.
              </span>
            </p>
            <Link href="/how-it-works" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover motion-reduce:transition-none">
              Read the full six-stage review lifecycle
              <Icon name="arrow" size={16} />
            </Link>
          </AnimateOnScroll>

          <div className="lg:sticky lg:top-28">
            <p className="type-meta mb-4 flex items-center gap-2">
              <span className="text-accent-warm">0{activeIndex + 1}</span>
              <span aria-hidden="true">·</span>
              {active.title}
            </p>
            <StepVisual index={activeIndex} />
          </div>
        </div>
      </Container>
    </section>
  );
}
