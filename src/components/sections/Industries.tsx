import { industries } from "@/content/industries";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

export function Industries() {
  return (
    <section id="industries" className="relative py-section overflow-hidden">
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent/[0.03] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-caption font-medium uppercase tracking-wider text-accent">
              Industries We Serve
            </p>
            <Heading>Trusted Across Sectors</Heading>
            <p className="mt-4 text-body-lg text-primary-500">
              Organizations in regulated industries rely on professional
              redaction to protect sensitive information and maintain compliance.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Horizontal flowing layout */}
        <div className="mt-14 flex flex-col gap-6 lg:mt-16">
          {/* Row 1: 3 items */}
          <div className="grid gap-4 sm:grid-cols-3">
            {industries.slice(0, 3).map((industry, i) => (
              <AnimateOnScroll key={industry.title} delay={i * 80}>
                <div className="group flex items-center gap-4 rounded-xl bg-surface-100 p-5 transition-all hover:bg-accent/[0.06]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 transition-all group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/20">
                    <Icon name={industry.icon} size={22} className="text-accent transition-colors group-hover:text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-heading-sm font-bold text-primary-800 truncate">
                      {industry.title}
                    </h3>
                    <p className="mt-0.5 text-body-sm text-primary-500 truncate">
                      {industry.description.slice(0, 60)}...
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Row 2: 3 items */}
          <div className="grid gap-4 sm:grid-cols-3">
            {industries.slice(3, 6).map((industry, i) => (
              <AnimateOnScroll key={industry.title} delay={(i + 3) * 80}>
                <div className="group flex items-center gap-4 rounded-xl bg-surface-100 p-5 transition-all hover:bg-accent/[0.06]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 transition-all group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/20">
                    <Icon name={industry.icon} size={22} className="text-accent transition-colors group-hover:text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-heading-sm font-bold text-primary-800 truncate">
                      {industry.title}
                    </h3>
                    <p className="mt-0.5 text-body-sm text-primary-500 truncate">
                      {industry.description.slice(0, 60)}...
                    </p>
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
