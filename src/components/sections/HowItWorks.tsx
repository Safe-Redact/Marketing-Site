"use client";

import Link from "next/link";
import { useState } from "react";
import { workflowSteps } from "@/content/platform";
import { AppWindow } from "@/components/media/AppWindow";
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

/**
 * One capture per step, each a real state of that step: files listed with their
 * preparation status, the manual redaction tools, and the export dialog. All three crops
 * are 4:3 (4:5 on phones), so switching steps never shifts the layout.
 */
const stepVisuals = [
  {
    capture: "document-workspace",
    crop: "filesPanel",
    mobileCrop: "filesMobile",
    alt: "OpenRedakt project panel listing files with their preparation status (Ready, Not prepared) and the action to add files. File and project names are blurred.",
  },
  {
    capture: "document-workspace",
    crop: "manualTools",
    mobileCrop: "manualMobile",
    alt: "OpenRedakt manual redaction panel: select marks or text, draw a free-form area, choose the redaction appearance and record a reason. No document is open in this view.",
  },
  {
    capture: "audio-export",
    crop: "dialogFourThree",
    mobileCrop: "summary",
    alt: "OpenRedakt export dialog: the redacted copy is written as a new file with the chosen file type and export mode, and the original is left unchanged",
  },
] as const;

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = workflowSteps[activeIndex];
  const visual = stepVisuals[activeIndex];

  return (
    <section id="how-it-works" className="section-y relative bg-canvas text-ink">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <AnimateOnScroll>
            <p className="type-eyebrow">Workflow</p>
            <h2 className="mt-4 font-heading text-[clamp(2rem,1.4rem+2.1vw,3.25rem)] font-medium leading-[1.06] tracking-[-0.035em] text-ink">
              From sensitive to shareable.
            </h2>
            <p className="type-body mt-5 max-w-xl">The same three steps for every document and recording.</p>
            <Accordion
              className="mt-9"
              items={accordionItems}
              openIndex={activeIndex}
              onOpenChange={(index) => setActiveIndex(index ?? activeIndex)}
              allowCollapse={false}
            />
            <Link href="/how-it-works" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover motion-reduce:transition-none">
              Read the full six-stage review lifecycle
              <Icon name="arrow" size={16} />
            </Link>
          </AnimateOnScroll>

          <div className="lg:sticky lg:top-28">
            <p className="type-meta mb-4 flex items-center gap-2">
              <span className="text-accent-ink">0{activeIndex + 1}</span>
              <span aria-hidden="true">·</span>
              {active.title}
            </p>
            <AppWindow>
              <ProductShot {...visual} displayWidth={640} frame={false} glow="none" />
            </AppWindow>
          </div>
        </div>
      </Container>
    </section>
  );
}
