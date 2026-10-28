import { platformCapabilities, platformOutcomes } from "@/content/platform";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-canvas py-section text-ink">
      <Container>
        <div className="grid border-y border-border-subtle md:grid-cols-3">
          {platformOutcomes.map((outcome, index) => (
            <AnimateOnScroll
              key={outcome.title}
              delay={index * 90}
              className="h-full border-b border-border-subtle py-7 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:py-9 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <article className="flex h-full gap-5">
                <span className="font-heading text-sm font-semibold text-accent-warm">{outcome.number}</span>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-ink">{outcome.title}</h2>
                  <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">{outcome.description}</p>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="mt-16 max-w-4xl md:mt-20">
          <Eyebrow>Platform capabilities</Eyebrow>
          <h2 className="mt-4 max-w-[19ch] font-heading text-display font-bold text-ink text-balance">
            One review workspace for <span className="text-accent-warm">documents and audio</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
            Move from candidate detection to operator decisions without losing the context of the document page, transcript, or audio time range.
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2 lg:mt-14">
          {platformCapabilities.map((capability, index) => (
            <AnimateOnScroll key={capability.title} delay={index * 80}>
              <article className="group border-t border-border-subtle pt-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-card border border-accent-cool/20 bg-accent-cool/10 text-accent-cool transition-colors duration-300 group-hover:border-accent-cool/45 group-hover:bg-accent-cool/15">
                    <Icon name={capability.icon} size={22} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-warm">{capability.accent}</p>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-ink">{capability.title}</h3>
                    <p className="mt-3 max-w-[34rem] text-base leading-7 text-ink-muted">{capability.description}</p>
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
