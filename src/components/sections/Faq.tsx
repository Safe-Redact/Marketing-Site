"use client";

import { faqItems } from "@/content/faq";
import { Accordion } from "@/components/ui/Accordion";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const items = faqItems.map((item, index) => ({
  id: `faq-${index + 1}`,
  title: item.question,
  description: item.answer,
}));

export function Faq() {
  return (
    <section id="faq" className="relative overflow-hidden bg-canvas py-section text-ink">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <AnimateOnScroll>
            <Eyebrow>Common questions</Eyebrow>
            <h2 className="mt-4 font-heading text-display font-bold text-ink text-balance">
              What to know before you begin
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-ink-muted">
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
