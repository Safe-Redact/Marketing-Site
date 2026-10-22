import { capabilityStripHeading, trustPillars } from "@/content/trust-bar";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export function TrustBar() {
  return (
    <section
      className="border-b border-border-subtle bg-canvas pb-14 pt-6 md:pb-20 md:pt-6"
      aria-label="Supported OpenRedakt workflows"
    >
      <Container>
        <p className="text-center font-heading text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
          {capabilityStripHeading}
        </p>
        <div
          className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-4 md:gap-8"
          data-capability-strip
        >
          {trustPillars.map((pillar) => (
            <div key={pillar.title} className="flex items-center justify-center gap-3 text-ink-muted">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-control border border-border-subtle bg-surface-raised text-accent-cool">
                <Icon name={pillar.icon} size={18} />
              </span>
              <span className="font-heading text-xs font-semibold sm:text-sm">{pillar.title}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
