import { qualityContent } from "@/content/quality";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

const iconNames = ["brain", "settings", "check-circle", "search"] as const;

export function QualitySecurity() {
  return (
    <section className="relative py-section overflow-hidden bg-surface-100">
      <div className="absolute top-0 left-0 h-48 w-48 dot-pattern text-primary/[0.03] pointer-events-none" />

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-caption font-medium uppercase tracking-wider text-accent">
              Review &amp; Quality
            </p>
            <Heading>{qualityContent.headline}</Heading>
            <p className="mt-4 text-body-lg text-primary-500">
              {qualityContent.intro}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Horizontal flowing list — no cards */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {qualityContent.points.map((point, i) => (
            <AnimateOnScroll key={point.title} delay={i * 100}>
              <div className="relative">
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Icon name={iconNames[i]} size={22} className="text-accent" />
                </div>

                {/* Connector line (not on last) */}
                {i < qualityContent.points.length - 1 && (
                  <div className="absolute top-6 left-12 hidden h-px w-[calc(100%-2rem)] bg-surface-300 lg:block" />
                )}

                <h3 className="text-heading font-bold text-primary-800">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-body text-primary-500 leading-relaxed">
                  {point.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
