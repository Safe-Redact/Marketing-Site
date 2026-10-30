"use client";

import { faqItems } from "@/content/faq";
import { Accordion } from "@/components/ui/Accordion";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";

const items = faqItems.map((item, index) => ({
  id: `faq-${index + 1}`,
  title: item.question,
  description: item.answer,
}));

export function Faq() {
  return (
    <section id="faq" className="section-y relative bg-canvas text-ink">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <AnimateOnScroll className="lg:sticky lg:top-28 lg:self-start">
            <p className="type-eyebrow">Common questions</p>
            <h2 className="type-h2 mt-4 max-w-[16ch]">
              What to know before you begin
            </h2>
            <p className="type-body mt-5 max-w-md">
              OpenRedakt is Windows desktop software. Availability of local models, conversion tools, and optional engines depends on setup and job configuration.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <Accordion items={items} />
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
  );
}
