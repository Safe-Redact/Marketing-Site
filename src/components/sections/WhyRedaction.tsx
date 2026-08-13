import { whyRedactionContent } from "@/content/why-redaction";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Heading } from "@/components/ui/Heading";

export function WhyRedaction() {
  return (
    <section className="bg-surface-100 py-section">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-caption font-medium uppercase tracking-wider text-accent">
              Why It Matters
            </p>
            <Heading>{whyRedactionContent.headline}</Heading>
          </div>
        </AnimateOnScroll>

        {/* Three-column layout: text blocks with decorative center */}
        <div className="mt-14 flex flex-col items-center gap-8 lg:mt-16 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          {/* Left text blocks */}
          <div className="flex w-full max-w-sm flex-col gap-10 text-left lg:text-right">
            <AnimateOnScroll delay={100}>
              <div>
                <h3 className="text-heading-lg font-bold text-primary-800">
                  {whyRedactionContent.points[0].title}
                </h3>
                <p className="mt-2 text-body text-primary-500">
                  {whyRedactionContent.points[0].description}
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={300}>
              <div>
                <h3 className="text-heading-lg font-bold text-primary-800">
                  {whyRedactionContent.points[2].title}
                </h3>
                <p className="mt-2 text-body text-primary-500">
                  {whyRedactionContent.points[2].description}
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Center decorative element */}
          <AnimateOnScroll delay={200}>
            <div className="hidden lg:flex shrink-0 flex-col items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/15">
                <span className="text-display font-bold text-accent">!</span>
              </div>
              <div className="h-24 w-px bg-accent/20" />
              <div className="h-24 w-px bg-accent/20" />
            </div>
          </AnimateOnScroll>

          {/* Right text blocks */}
          <div className="flex w-full max-w-sm flex-col gap-10 text-left">
            <AnimateOnScroll delay={150}>
              <div>
                <h3 className="text-heading-lg font-bold text-primary-800">
                  {whyRedactionContent.points[1].title}
                </h3>
                <p className="mt-2 text-body text-primary-500">
                  {whyRedactionContent.points[1].description}
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={350}>
              <div>
                <h3 className="text-heading-lg font-bold text-primary-800">
                  {whyRedactionContent.points[3].title}
                </h3>
                <p className="mt-2 text-body text-primary-500">
                  {whyRedactionContent.points[3].description}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
