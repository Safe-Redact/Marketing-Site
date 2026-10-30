import Link from "next/link";
import { heroContent } from "@/content/hero";
import { AppWindow } from "@/components/media/AppWindow";
import { ProductShot } from "@/components/media/ProductShot";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * Homepage hero: a centred composition on the burnt-orange-to-coral field (context chip,
 * eyebrow, two-line headline, CTAs), then the product itself in an application window
 * straddling the hand-over to white. `data-hero-dark` marks the field the header and
 * chat launcher observe. The window opens out as it rises (CSS scroll timeline,
 * transform only; see `.showcase-scale`).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" data-section="hero" className="relative isolate">
      <div data-hero-dark className="hero-ember relative overflow-hidden pb-20 pt-[7.5rem] sm:pb-24 sm:pt-[9rem] lg:pt-[9.75rem]">
        <Container className="relative">
          <div className="mx-auto flex max-w-[56rem] flex-col items-center text-center">
            <Link
              href={heroContent.chip.href}
              className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 text-[0.8125rem] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
            >
              {heroContent.chip.label}
              <Icon name="chevron-down" size={14} className="-rotate-90" />
            </Link>
            <p className="mt-7 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-white/80">{heroContent.eyebrow}</p>
            <h1
              id="hero-heading"
              className="mt-4 font-heading text-[clamp(2.125rem,1.3rem+4vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.045em] text-white text-balance"
            >
              <span className="block">{heroContent.headline}</span>
              <span className="block text-[#ffcfbf]">{heroContent.headlineSecond}</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-7 text-white sm:text-[1.1875rem] sm:leading-8">
              {heroContent.subheadline}
            </p>
            <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={heroContent.primaryCta.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[0.9375rem] font-semibold text-[#1c1917] shadow-[0_10px_30px_-8px_rgb(40_8_4/0.5)] transition-[background-color,transform] duration-200 hover:bg-[#fff1ec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#a44116] motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
              >
                {heroContent.primaryCta.label}
                <Icon name="arrow" size={17} />
              </Link>
              <Link
                href={heroContent.secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-white/25 bg-[rgb(40_12_4/0.22)] px-6 text-[0.9375rem] font-medium text-white backdrop-blur-sm transition-colors hover:bg-[rgb(40_12_4/0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
              >
                {heroContent.secondaryCta.label}
                <Icon name="chevron-down" size={16} className="-rotate-90" />
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <div className="showcase-stage relative pb-16 sm:pb-24 lg:pb-28">
        <Container>
          <div className="showcase-track mx-auto max-w-content" data-hero-workbench>
            <div className="showcase-scale">
              <AppWindow className="shadow-[0_50px_100px_-30px_rgb(90_20_8/0.45),0_16px_36px_-14px_rgb(90_20_8/0.28)]">
                <ProductShot
                  capture="project-workspace"
                  crop="hub"
                  mobileCrop="hubMobile"
                  alt={heroContent.showcase.alt}
                  displayWidth={1160}
                  priority
                  frame={false}
                  glow="none"
                />
              </AppWindow>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
