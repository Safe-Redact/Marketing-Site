import { steps } from "@/content/how-it-works";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

const stepIcons = ["upload", "settings", "check-circle"] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-white py-section overflow-hidden">
      <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-accent/[0.04] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-caption font-medium uppercase tracking-wider text-accent">
              Simple Process
            </p>
            <Heading>How the Service Works</Heading>
            <p className="mt-4 text-body-lg text-primary-500">
              A straightforward process from submission to delivery.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Horizontal process on desktop */}
        <div className="mt-16 hidden md:block">
          <div className="relative grid grid-cols-3 gap-8">
            {/* Connecting line */}
            <div className="absolute top-[40px] left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-px bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20" />

            {steps.map((step, i) => (
              <AnimateOnScroll key={step.number} delay={i * 150}>
                <div className="relative flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative z-10 mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/15">
                      <Icon name={stepIcons[i]} size={32} className="text-accent" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-lg shadow-accent/20">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-heading-lg font-bold text-primary-800">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-body text-primary-500 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Vertical process on mobile */}
        <div className="mt-14 space-y-6 md:hidden">
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 150}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/15">
                    <Icon name={stepIcons[i]} size={24} className="text-accent" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-accent/15" />
                  )}
                </div>
                <div className="pb-2">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      {step.number}
                    </span>
                    <h3 className="text-heading font-bold text-primary-800">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-body text-primary-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
