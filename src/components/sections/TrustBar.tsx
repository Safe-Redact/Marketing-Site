import { trustPillars } from "@/content/trust-bar";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Icon } from "@/components/ui/Icon";

export function TrustBar() {
  return (
    <section className="border-b border-surface-300 bg-surface-100 py-10">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {trustPillars.map((pillar, i) => (
            <AnimateOnScroll key={pillar.title} delay={i * 100}>
              <div className="flex items-center gap-3">
                <Icon name={pillar.icon} size={22} className="shrink-0 text-accent" />
                <span className="text-body-sm font-medium text-primary-700">
                  {pillar.title}
                </span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
