import { useCaseGroups } from "@/content/platform";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { UseCaseVisual } from "@/components/visuals/UseCaseVisual";

export function Industries() {
  return (
    <section id="industries" className="relative overflow-hidden bg-canvas py-section text-ink">
      <Container>
        <AnimateOnScroll className="max-w-3xl">
          <Eyebrow>Use cases</Eyebrow>
          <h2 className="mt-4 font-heading text-display font-bold text-ink text-balance">
            Prepare sensitive records for the next step
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
            Teams use redaction when records need to move into filing, disclosure, release, research, or controlled internal review.
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {useCaseGroups.map((useCase, index) => (
            <AnimateOnScroll key={useCase.title} delay={index * 90}>
              <article className="h-full overflow-hidden rounded-card border border-border-subtle bg-surface-raised shadow-panel transition-colors duration-300 hover:border-accent-cool/35">
                <UseCaseVisual variant={useCase.visual} icon={useCase.icon} />
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-cool">{useCase.kicker}</p>
                  <h3 className="mt-3 font-heading text-xl font-semibold leading-7 text-ink">{useCase.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-6 text-ink-muted">{useCase.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${useCase.title} categories`}>
                    {useCase.tags.map((tag) => (
                      <li key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1 text-xs text-ink-muted">
                        <Icon name="check-circle" size={12} className="text-accent-mint" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
