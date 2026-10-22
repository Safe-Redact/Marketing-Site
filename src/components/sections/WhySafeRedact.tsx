"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { formatTabs } from "@/content/platform";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { FormatPreview } from "@/components/visuals/FormatPreview";
import { cn } from "@/lib/utils";

export function WhySafeRedact() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = formatTabs[activeIndex];

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % formatTabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + formatTabs.length) % formatTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = formatTabs.length - 1;
    else return;
    event.preventDefault();
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="why-saferedact" className="relative overflow-hidden bg-canvas py-section text-ink">
      <Container>
        <AnimateOnScroll className="max-w-4xl">
          <p className="font-heading text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-accent-cool">Why OpenRedakt</p>
          <h2 className="mt-4 font-heading text-display font-bold text-ink text-balance">
            Review content in the <span className="gradient-text">right context</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
            Pages, transcripts, frames, and timelines each need a different review surface. OpenRedakt brings them into one Windows desktop application.
          </p>
        </AnimateOnScroll>

        <div className="relative mt-10">
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-12 w-10 bg-gradient-to-l from-canvas to-transparent md:hidden" />
          <div
            role="tablist"
            aria-label="OpenRedakt format workflows"
            className="flex gap-3 overflow-x-auto pb-3 pr-7 [scrollbar-width:thin] [scrollbar-color:#222B44_transparent]"
          >
            {formatTabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(element) => { tabRefs.current[index] = element; }}
                id={`format-tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={activeIndex === index}
                aria-controls="format-panel"
                tabIndex={activeIndex === index ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => moveFocus(event, index)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 font-heading text-sm font-semibold transition-colors duration-300",
                  activeIndex === index
                    ? "border-accent-cool bg-accent-cool/10 text-ink"
                    : "border-border-subtle bg-transparent text-ink-muted hover:border-accent-cool/40 hover:text-ink"
                )}
              >
                <Icon name={tab.icon} size={17} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimateOnScroll delay={100} className="mt-7">
          <div
            id="format-panel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`format-tab-${active.id}`}
            className="grid overflow-hidden rounded-panel border border-border-subtle bg-surface-raised/65 lg:grid-cols-[0.86fr_1.14fr]"
          >
            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-warm">{active.eyebrow}</p>
              <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight text-ink sm:text-3xl">{active.title}</h3>
              <p className="mt-5 text-base leading-7 text-ink-muted">{active.description}</p>
              <ul className="mt-7 space-y-3">
                {active.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-ink-muted">
                    <Icon name="check-circle" size={17} className="mt-1 text-accent-mint" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border-subtle p-4 sm:p-6 lg:border-l lg:border-t-0">
              <FormatPreview visual={active.visual} fileLabel={active.fileLabel} />
            </div>
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
