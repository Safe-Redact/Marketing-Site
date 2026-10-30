import React from "react";
import Link from "next/link";
import { featureHref, publishedFeaturePages } from "@/content/features";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { FeatureMedia } from "./FeatureMedia";

export function FeatureOverviewGrid() {
  return (
    <section aria-label="Format workflows" className="bg-canvas text-ink">
      <Container>
        {publishedFeaturePages.map((page, index) => {
          const flip = index % 2 === 1;
          return (
            <AnimateOnScroll key={page.slug}>
              <article className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16 lg:py-24">
                <div className={cn("min-w-0", flip && "lg:order-2")}>
                  <p className="type-meta flex items-center gap-3">
                    <span className="text-accent-ink">0{index + 1}</span>
                    <span aria-hidden="true" className="h-px w-8 bg-border-subtle" />
                    {page.eyebrow}
                  </p>
                  <h2 className="type-h2 mt-5 max-w-[20ch]">{page.h1}</h2>
                  <p className="type-body mt-5 max-w-xl">{page.summary}</p>
                  <ul className="mt-7 border-t border-border-subtle/60">
                    {page.atGlance.map((item) => (
                      <li key={item} className="flex items-start gap-3 border-b border-border-subtle/60 py-3.5 text-[0.9375rem] leading-6 text-ink-muted">
                        <Icon name="check-circle" size={17} className="mt-0.5 shrink-0 text-accent-ink" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={featureHref(page.slug)} className="mt-7 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none">
                    Explore {page.eyebrow.toLowerCase()}
                    <Icon name="arrow" size={16} />
                  </Link>
                </div>
                <div className={cn("min-w-0", flip && "lg:order-1")}>
                  <FeatureMedia slug={page.slug} media={page.media} placement="overview" />
                </div>
              </article>
            </AnimateOnScroll>
          );
        })}
      </Container>
    </section>
  );
}
