import { services } from "@/content/services";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

export function Services() {
  return (
    <section id="services" className="relative py-section overflow-hidden">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/[0.03] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        {/* Large container */}
        <div className="rounded-[2rem] bg-surface-100 p-8 sm:p-12 lg:p-16 xl:px-24">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_2.5fr] lg:gap-16">
            {/* Left: Title */}
            <div className="lg:sticky lg:top-28">
              <AnimateOnScroll>
                <p className="mb-3 text-caption font-medium uppercase tracking-wider text-accent">
                  What We Do
                </p>
                <Heading>
                  Secure Redaction for Video, Audio &amp; Documents
                </Heading>
                <p className="mt-4 text-body text-primary-500">
                  We handle the full redaction process — from initial analysis
                  through final delivery.
                </p>
                <div className="mt-8 hidden lg:flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                  <Icon name="layers" size={24} className="text-accent" />
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right: Service items — no numbering, dividers between items */}
            <div>
              {services.map((service, i) => (
                <AnimateOnScroll key={service.title} delay={i * 100}>
                  <div className="group">
                    {/* Divider between items (not before first) */}
                    {i > 0 && (
                      <div className="mb-8 h-px bg-surface-300" />
                    )}

                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 transition-all group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/20">
                        <Icon name={service.icon} size={22} className="text-accent transition-colors group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="text-heading-lg font-bold text-primary-800">
                          {service.title}
                        </h3>
                        <p className="mt-2 text-body text-primary-500 leading-relaxed">
                          {service.description}
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                          {service.capabilities.map((cap) => (
                            <li key={cap} className="flex items-center gap-2 text-body-sm text-primary-600">
                              <Icon name="check-circle" size={14} className="text-accent" />
                              {cap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
