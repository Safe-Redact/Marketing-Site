import React from "react";
import type { FeaturePageContent } from "@/lib/marketing/content";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { FeatureVisual, featureVisuals } from "./FeatureVisual";

/**
 * Capability rows. Rows with a visual alternate sides; a row without one sets its copy
 * against its bullets so the sequence never shows an empty frame.
 */
export function CapabilitySections({ page }: { page: FeaturePageContent }) {
  const visuals = featureVisuals[page.slug].sections;
  return (
    <section aria-label={`${page.eyebrow} capabilities`} className="bg-canvas text-ink">
      <Container>
        {page.sections.map((section, index) => {
          const visual = visuals[index] ?? null;
          const flip = index % 2 === 1;
          return (
            <AnimateOnScroll key={section.title}>
              <article
                className={cn(
                  "grid gap-10 py-16 sm:py-20 lg:items-center lg:gap-16 lg:py-24",
                  visual ? "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]" : "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start"
                )}
              >
                <div className={cn("min-w-0", visual && flip && "lg:order-2")}>
                  <p className="type-eyebrow">{section.eyebrow}</p>
                  <h2 className="type-h2 mt-4 max-w-[20ch] text-[clamp(1.5rem,1.2rem+1vw,2.125rem)]">{section.title}</h2>
                  <p className="type-body mt-5 max-w-xl">{section.description}</p>
                  {visual ? <CapabilityBullets bullets={section.bullets} /> : null}
                </div>
                {visual ? (
                  <div className={cn("min-w-0", flip && "lg:order-1")}>
                    <FeatureVisual visual={visual} />
                  </div>
                ) : (
                  <CapabilityBullets bullets={section.bullets} className="lg:mt-0" />
                )}
              </article>
            </AnimateOnScroll>
          );
        })}
      </Container>
    </section>
  );
}

function CapabilityBullets({ bullets, className }: { bullets: readonly string[]; className?: string }) {
  return (
    <ul className={cn("mt-7 border-t border-border-subtle/60", className)}>
      {bullets.map((bullet) => (
        <li key={bullet} className="flex items-start gap-3 border-b border-border-subtle/60 py-3.5 text-[0.9375rem] leading-6 text-ink-muted">
          <Icon name="check-circle" size={17} className="mt-0.5 shrink-0 text-accent-ink" />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}
