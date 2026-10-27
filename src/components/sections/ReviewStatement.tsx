import Link from "next/link";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const principles = [
  { title: "Human review", description: "Detection proposes. A reviewer decides every mark." },
  { title: "Transparent decisions", description: "Reasons and actions stay attached to the record." },
  { title: "Verified output", description: "Exports are re-opened and inspected before release." },
] as const;

/**
 * OpenRedakt's own positioning statement, set where a customer quote would usually sit.
 * It is brand copy and deliberately carries no attribution.
 */
export function ReviewStatement() {
  return (
    <section aria-labelledby="review-statement" className="theme-light bg-canvas pb-28 pt-20 text-ink sm:pb-32 sm:pt-24 lg:pb-40 lg:pt-28">
      <Container>
        <AnimateOnScroll className="mx-auto max-w-[52rem] text-center">
          <h2 id="review-statement" className="font-heading text-[clamp(1.875rem,1.2rem+2.2vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink text-balance">
            Sensitive information deserves careful review before it&rsquo;s shared.
          </h2>
          <p className="type-lede mx-auto mt-6 max-w-[40rem]">
            OpenRedakt is built around that review: candidates are surfaced for a person to judge, decisions stay visible, and the rendered output is checked as its own step.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={120} className="mx-auto mt-14 grid max-w-[60rem] gap-8 border-t border-border-subtle pt-10 sm:grid-cols-3 sm:gap-10">
          {principles.map((item) => (
            <div key={item.title} className="text-center">
              <p className="text-[0.9375rem] font-semibold text-ink">{item.title}</p>
              <p className="mt-1.5 text-sm leading-6 text-ink-muted">{item.description}</p>
            </div>
          ))}
        </AnimateOnScroll>
        <div className="mt-10 text-center">
          <Link href="/why-openredakt" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover motion-reduce:transition-none">
            Why teams evaluate OpenRedakt
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
