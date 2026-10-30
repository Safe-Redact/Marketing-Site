import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { pricingPackages, pricingSharedLicenseNote } from "@/content/pricing";
import { cn } from "@/lib/utils";

const annualFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const monthlyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const familyIcon = {
  documents: "document",
  audio: "audio",
} as const;

export function PricingCards() {
  return (
    <>
      {/* At desktop width each card is a subgrid over four shared rows (summary, price, CTA,
          features), so prices and buttons line up even when copy wraps differently. */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(4,auto)]">
        {pricingPackages.map((plan) => {
          const proposed = plan.priceStatus === "proposed";

          return (
            <article
              key={plan.slug}
              aria-labelledby={`package-${plan.slug}`}
              className={cn(
                "relative flex min-w-0 flex-col rounded-panel border bg-surface-raised p-6 shadow-panel sm:p-8 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-0",
                plan.families.length > 1 && "md:col-span-2 lg:col-span-1",
                plan.emphasized
                  ? "border-accent-warm/60 bg-[linear-gradient(180deg,rgb(var(--or-coral)/0.12),rgb(var(--or-graphite))_34%)]"
                  : "border-border-subtle"
              )}
            >
              <div>
                <h3
                  id={`package-${plan.slug}`}
                  className="font-heading text-2xl font-semibold tracking-[-0.02em] text-ink"
                >
                  {plan.name}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-accent-mint">
                  {plan.families.map((family) => (
                    <Icon key={family} name={familyIcon[family]} size={16} className="shrink-0" />
                  ))}
                  {plan.scopeLabel}
                </p>
                <p className="mt-4 text-body leading-7 text-ink-muted">{plan.description}</p>
              </div>

              <div className="mt-6 border-t border-border-subtle pt-6">
                {proposed ? (
                  <>
                    <p className="font-heading text-3xl font-semibold text-ink">Contact Sales</p>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">
                      <span className="font-semibold text-ink">
                        {annualFormatter.format(plan.annualPriceUsd)} per license/year proposed
                      </span>
                      <br />
                      Approximately {monthlyFormatter.format(plan.monthlyEquivalentUsd)} monthly equivalent.
                      Pending business confirmation.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                      <p className="font-heading text-4xl font-semibold tracking-[-0.03em] text-ink">
                        {annualFormatter.format(plan.annualPriceUsd)}
                      </p>
                      <p className="pb-1 text-sm text-ink-muted">/ license / year</p>
                    </div>
                    <p className="mt-3 text-sm text-ink-muted">
                      {Number.isInteger(plan.monthlyEquivalentUsd) ? "" : "Approximately "}
                      {monthlyFormatter.format(plan.monthlyEquivalentUsd)} per license/month equivalent
                    </p>
                  </>
                )}
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-accent-cool">
                  Per license. Billed annually.
                </p>
              </div>

              <Button
                asChild
                variant={plan.emphasized ? "primary" : "secondary"}
                size="lg"
                className="mt-6 w-full lg:self-start"
              >
                <Link href={`/book-a-demo?package=${plan.slug}`}>
                  {plan.ctaLabel}
                  <Icon name="arrow" size={17} />
                </Link>
              </Button>

              <ul className="mt-7 space-y-3 border-t border-border-subtle pt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-ink-muted">
                    <Icon name="check-circle" size={18} className="mt-0.5 shrink-0 text-accent-mint" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <p className="mt-8 flex items-start gap-3 text-sm leading-6 text-ink-muted lg:justify-center">
        <Icon name="shield-check" size={18} className="mt-0.5 shrink-0 text-accent-cool" />
        <span>{pricingSharedLicenseNote}</span>
      </p>
    </>
  );
}
