"use client";

import { useState } from "react";
import { faqItems } from "@/content/faq";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-section">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-caption font-medium uppercase tracking-wider text-accent">
              Common Questions
            </p>
            <Heading>Frequently Asked Questions</Heading>
          </div>
        </AnimateOnScroll>

        <div className="mx-auto mt-14 max-w-prose">
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <AnimateOnScroll key={item.question} delay={i * 50}>
                <div className="rounded-panel border border-surface-300 bg-surface-50 transition-all duration-200 hover:border-accent/20">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === i ? null : i)
                    }
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={openIndex === i}
                  >
                    <span className="text-body-lg font-medium text-primary-800">
                      {item.question}
                    </span>
                    <Icon
                      name="chevron-down"
                      size={20}
                      className={cn(
                        "shrink-0 text-muted transition-transform duration-200",
                        openIndex === i && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openIndex === i
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-6 pb-5 text-body text-primary-500">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
