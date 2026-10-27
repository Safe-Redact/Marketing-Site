import Link from "next/link";
import { heroContent } from "@/content/hero";
import { ProductShot } from "@/components/media/ProductShot";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Margin notes in the hero gutters: the vocabulary of a review (a mark, a reason, a
 * range, a region, an inspected output). Decorative only, wide screens only.
 */
const annotations = [
  { text: "Account number", bar: true, className: "left-[2%] top-[30%]" },
  { text: "Reason · personal data", className: "left-[2%] top-[56%]" },
  { text: "Output re-opened\nfor inspection", className: "left-[2%] top-[80%]" },
  { text: "Mute · manual range\n00:42 → 00:47", className: "right-[3%] top-[20%]" },
  { text: "Region · Pixelate", className: "right-[5.5%] top-[47%]" },
  { text: "Plate · confirmed", className: "right-[3%] top-[72%]" },
] as const;

const lineTones = ["text-[#ffd8cc]/45", "text-[#ffd8cc]/45", "text-[#ffd8cc]/50", "text-[#fff7f3]"];

/**
 * Homepage hero: a graphite-to-ember field with the headline set as a sequence, then
 * the product showcase straddling the hand-over to warm white. The showcase grows as
 * it rises (CSS scroll timeline, transform only; see `.showcase-scale`).
 */
export function Hero() {
  const lines = heroContent.headlineSequence;
  return (
    <section aria-labelledby="hero-heading" data-section="hero" className="relative isolate">
      <div className="hero-ember relative overflow-hidden pb-14 pt-[7.75rem] sm:pb-16 sm:pt-[9rem] lg:pb-20 lg:pt-[10rem]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden min-[1400px]:block">
          {annotations.map((note, index) => (
            <p
              key={note.text}
              className={cn("hero-annotation absolute whitespace-pre font-mono text-[0.75rem] leading-5 text-[#ffd8cc]/40", note.className)}
              style={{ animationDelay: `${400 + index * 140}ms` }}
            >
              {note.text}
              {"bar" in note ? <span className="ml-2 inline-block h-3 w-14 translate-y-0.5 rounded-[2px] bg-[#ffd8cc]/25" /> : null}
            </p>
          ))}
        </div>

        <Container className="relative">
          <div className="mx-auto max-w-[64rem]">
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-[#ffb7a3]">{heroContent.eyebrow}</p>
            <h1
              id="hero-heading"
              className="mt-6 font-heading text-[clamp(2.375rem,1.35rem+3.1vw,3.875rem)] font-semibold leading-[1.04] tracking-[-0.04em]"
            >
              {lines.map((line, index) => (
                <span
                  key={line}
                  className={cn("block", lineTones[index], index > 0 && index < lines.length - 1 && "hidden sm:block")}
                >
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-7 max-w-[36rem] text-[1.0625rem] leading-7 text-white/90 sm:text-[1.125rem] sm:leading-8">
              {heroContent.subheadline}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={heroContent.primaryCta.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-[#fff7f3] px-6 text-[0.9375rem] font-semibold text-[#14161c] shadow-[0_10px_30px_rgb(20_6_4/0.35)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4d1209] motion-reduce:transition-none"
              >
                {heroContent.primaryCta.label}
                <Icon name="arrow" size={17} />
              </a>
              <Link
                href={heroContent.secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-white/25 bg-white/10 px-6 text-[0.9375rem] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
              >
                {heroContent.secondaryCta.label}
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <div className="showcase-stage relative pb-16 sm:pb-20 lg:pb-24">
        <Container>
          <div className="showcase-track mx-auto max-w-[72rem]" data-hero-workbench>
            <div className="showcase-scale">
              <figure className="m-0 rounded-[22px] border border-white/60 bg-[#fbf8f4] p-2 shadow-[0_1px_0_rgb(255_255_255/0.7)_inset,0_40px_90px_-20px_rgb(80_24_10/0.45),0_12px_32px_-12px_rgb(80_24_10/0.25)] sm:rounded-[28px] sm:p-3">
                <div className="flex flex-col gap-3 px-3 pb-4 pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-5 sm:pb-6 sm:pt-5 lg:px-7 lg:pt-6">
                  <div>
                    <p className="font-heading text-[1.0625rem] font-semibold tracking-[-0.01em] text-[#14161c] sm:text-[1.1875rem]">
                      {heroContent.showcase.title}
                    </p>
                    <p className="mt-1.5 max-w-[34rem] text-[0.9375rem] leading-6 text-[#545965]">{heroContent.showcase.description}</p>
                  </div>
                  <p className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[#6b6f7a]">{heroContent.showcase.note}</p>
                </div>
                <div className="overflow-hidden rounded-[14px] sm:rounded-[18px]">
                  <ProductShot
                    capture="document-editor-hero"
                    crop="pageWithFindings"
                    alt="Screenshot of the current redaction editor showing a document mid-review with detected items ready for an operator to accept or adjust"
                    displayWidth={1152}
                    priority
                    frame={false}
                    glow="none"
                  />
                </div>
              </figure>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
