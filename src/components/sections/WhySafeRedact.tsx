import { differentiators } from "@/content/why-saferedact";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

export function WhySafeRedact() {
  return (
    <section id="why-saferedact" className="relative overflow-hidden bg-primary-800 py-section text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-pattern text-white/[0.03]" />
        <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-accent/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-caption font-medium uppercase tracking-wider text-accent">
              Why SafeRedact
            </p>
            <Heading className="text-white">Redaction Done Right</Heading>
            <p className="mt-4 text-body-lg text-white/60">
              We combine technology with expertise to deliver redaction that is
              accurate, permanent, and auditable.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Uniform 3-col grid with equal height cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((diff, i) => (
            <AnimateOnScroll key={diff.title} delay={i * 80}>
              <div className="group flex h-full flex-col rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.1] hover:ring-accent/20">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 transition-transform duration-300 group-hover:scale-110">
                  <Icon name={diff.icon} size={22} className="text-accent" />
                </div>
                <h3 className="text-heading-sm font-bold text-white">
                  {diff.title}
                </h3>
                <p className="mt-1.5 text-body-sm text-white/50 leading-relaxed">
                  {diff.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={200}>
          <div className="mt-12 text-center">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 text-body font-medium text-white transition-all hover:bg-accent-dark shadow-lg shadow-accent/20"
            >
              Get a Quote
              <Icon name="arrow" size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
