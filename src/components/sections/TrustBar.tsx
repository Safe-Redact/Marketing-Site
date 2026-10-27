import { capabilityStripHeading, trustPillars } from "@/content/trust-bar";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * The strip directly under the showcase, where a site would usually put logos: four
 * facts about what OpenRedakt handles, set as plain columns on warm white.
 */
export function TrustBar() {
  return (
    <section className="theme-light bg-canvas pb-4 text-ink" aria-label="Supported OpenRedakt workflows">
      <Container>
        <p className="type-meta text-center uppercase tracking-[0.14em]">{capabilityStripHeading}</p>
        <div className="mx-auto mt-9 grid max-w-[68rem] gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4" data-capability-strip>
          {trustPillars.map((pillar) => (
            <div key={pillar.title} className="lg:text-center">
              <div className="flex items-center gap-2.5 lg:justify-center">
                <Icon name={pillar.icon} size={18} className="text-accent-warm" />
                <span className="text-[0.9375rem] font-semibold text-ink">{pillar.title}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{pillar.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
