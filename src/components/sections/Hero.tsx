import { heroContent } from "@/content/hero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RedactionWorkbench } from "@/components/visuals/RedactionWorkbench";

export function Hero() {
  return (
    <section
      className="hero-gradient relative overflow-hidden pb-14 pt-[168px] md:pb-14 md:pt-[218px] min-[992px]:pb-12 min-[992px]:pt-[208px]"
      aria-labelledby="hero-heading"
      data-section="hero"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-36 top-16 h-[28rem] w-[28rem] rounded-full border border-accent-cool/[0.06]" />
        <div className="absolute -right-20 top-28 h-72 w-72 rounded-full bg-accent-cool/[0.035] blur-3xl" />
        <div className="absolute left-[8%] top-[62%] h-52 w-52 rounded-full bg-accent-warm/[0.035] blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid items-start gap-12 md:gap-10 min-[992px]:grid-cols-2 min-[992px]:gap-4">
          <div className="max-w-[608px] md:max-w-none min-[992px]:max-w-[608px] min-[992px]:pt-4">
            <Eyebrow className="mb-8 md:mb-7 min-[992px]:mb-10">{heroContent.eyebrow}</Eyebrow>
            <h1
              id="hero-heading"
              className="max-w-[17ch] font-heading text-[1.75rem] font-medium leading-[1.32] tracking-[-0.03em] text-white text-balance md:max-w-none md:text-[3.1rem] md:leading-[1.31] min-[992px]:text-[2.75rem] min-[992px]:font-normal"
            >
              {heroContent.headline}
            </h1>
            <p className="mt-7 max-w-[36rem] text-base leading-6 text-ink-muted md:max-w-none md:text-lg md:leading-7 min-[992px]:max-w-[34rem]">
              {heroContent.subheadline}
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <Button variant="primary" size="md" className="w-full sm:w-auto" asChild>
                <a href={heroContent.primaryCta.href}>
                  {heroContent.primaryCta.label}
                  <Icon name="arrow" size={18} />
                </a>
              </Button>
              <a
                href={heroContent.secondaryCta.href}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-3 text-sm font-semibold text-ink-muted transition-colors hover:text-white sm:justify-start"
              >
                {heroContent.secondaryCta.label}
                <Icon name="arrow" size={17} />
              </a>
            </div>
          </div>

          <div className="motion-safe:animate-fade-in-up min-[992px]:pl-0">
            <RedactionWorkbench className="md:max-w-none min-[992px]:max-w-[608px]" />
          </div>
        </div>
      </Container>
    </section>
  );
}
