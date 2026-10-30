import React from "react";
import type { MarketingFaq } from "@/lib/marketing/content";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";

/**
 * Visible FAQ block. FAQPage structured data is deliberately not emitted: the answers
 * stay on the page for readers, and breadcrumbs remain the only rich-result markup.
 */
export function FaqSection({
  idPrefix,
  items,
  title = "Practical questions before evaluation",
  description,
}: {
  idPrefix: string;
  items: readonly MarketingFaq[];
  title?: string;
  description: string;
}) {
  const accordionItems = items.map((item, index) => ({ id: `${idPrefix}-faq-${index + 1}`, title: item.question, description: item.answer }));
  return (
    <section className="section-y bg-canvas text-ink">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="type-eyebrow">Frequently asked questions</p>
            <h2 className="type-h2 mt-4">{title}</h2>
            <p className="type-body mt-5 max-w-md">{description}</p>
          </div>
          <Accordion items={accordionItems} />
        </div>
      </Container>
    </section>
  );
}
