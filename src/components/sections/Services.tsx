import Link from "next/link";
import { platformOutcomes } from "@/content/platform";
import { whyOpenRedaktPage } from "@/content/pages";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * Platform advantages. The outcome strip states the review sequence; the pillars are
 * the register-backed positioning from /why-openredakt, so every advantage shown here
 * maps to a capability recorded in the evidence register.
 */
export function Services() {
  return (
    <section id="services" className="theme-light sheet section-y bg-canvas text-ink">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <AnimateOnScroll className="lg:sticky lg:top-28 lg:self-start">
            <p className="type-eyebrow">Platform</p>
            <h2 className="type-h2 mt-4 max-w-[18ch]">
              One review workspace for sensitive content. <span className="type-quiet">Built around decisions, not detections.</span>
            </h2>
            <p className="type-body mt-5 max-w-md">
              Move from candidate detection to operator decisions without losing the context of the document, transcript, frame, or timeline.
            </p>
            <div className="mt-7 flex flex-col items-start gap-3">
              <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover motion-reduce:transition-none">
                Compare the document, audio, and video workflows
                <Icon name="arrow" size={16} />
              </Link>
              <Link href="/why-openredakt" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink motion-reduce:transition-none">
                How OpenRedakt states its limits
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          </AnimateOnScroll>

          <div>
            <div className="grid border-y border-border-subtle/60 md:grid-cols-3">
              {platformOutcomes.map((outcome, index) => (
                <AnimateOnScroll
                  key={outcome.title}
                  delay={index * 90}
                  className="h-full border-b border-border-subtle/60 py-6 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:py-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                >
                  <article className="h-full">
                    <span className="type-meta text-accent-warm">{outcome.number}</span>
                    <h3 className="type-h3 mt-3">{outcome.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">{outcome.description}</p>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-[16px] border border-border-subtle/50 bg-border-subtle/50 sm:grid-cols-2">
              {whyOpenRedaktPage.pillars.map((pillar, index) => (
                <AnimateOnScroll key={pillar.title} delay={index * 70} className="bg-canvas">
                  <article className="h-full p-6 sm:p-7">
                    <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-border-subtle/70 bg-surface-raised text-accent-warm">
                      <Icon name={pillar.icon} size={17} />
                    </span>
                    <h3 className="type-h3 mt-5">{pillar.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">{pillar.description}</p>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
