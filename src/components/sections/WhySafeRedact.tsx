import Link from "next/link";
import { featureHref, publishedFeaturePages } from "@/content/features";
import type { FeatureSlug } from "@/lib/marketing/content";
import { FeatureVisual, type FeatureVisualId } from "@/components/features/FeatureVisual";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** One visual per format; documents use the approved capture, audio and video labelled diagrams. */
const rowVisual: Record<FeatureSlug, FeatureVisualId> = {
  "document-redaction": "doc-closeup",
  "audio-redaction": "aud-transcript",
  "video-redaction": "vid-region",
};

/**
 * Format storytelling: one large split row per format, alternating sides. Copy comes
 * from the feature pages, so it carries the same evidence-register wording and limits.
 */
export function WhySafeRedact() {
  return (
    <section id="why-saferedact" aria-labelledby="formats-heading" className="sheet section-y bg-canvas text-ink">
      <Container>
        <AnimateOnScroll className="mx-auto max-w-3xl text-center">
          <p className="type-eyebrow">One review workspace</p>
          <h2 id="formats-heading" className="type-h2 mx-auto mt-4 max-w-[24ch] text-balance">
            Review content in the right context. <span className="type-quiet sm:block">One surface for each format.</span>
          </h2>
          <p className="type-lede mx-auto mt-5 max-w-2xl">
            Document pages and audio transcripts need different review surfaces. OpenRedakt brings both supported workflows into one Windows desktop application.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 sm:mt-20">
          {publishedFeaturePages.map((page, index) => {
            const flip = index % 2 === 1;
            return (
              <AnimateOnScroll key={page.slug}>
                <article
                  aria-labelledby={`format-${page.slug}`}
                  className="grid items-center gap-10 border-t border-border-subtle/50 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:py-24"
                >
                  <div className={cn("min-w-0", flip && "lg:order-2")}>
                    <p className="type-meta flex items-center gap-3">
                      <span className="text-accent-warm">0{index + 1}</span>
                      <span aria-hidden="true" className="h-px w-8 bg-border-subtle" />
                      {page.eyebrow}
                    </p>
                    <h3 id={`format-${page.slug}`} className="type-h2 mt-5 max-w-[18ch] text-[clamp(1.625rem,1.25rem+1.2vw,2.375rem)]">
                      {page.h1}
                    </h3>
                    <p className="type-body mt-5 max-w-xl">{page.summary}</p>
                    <ul className="mt-7 border-t border-border-subtle/60">
                      {page.atGlance.map((item) => (
                        <li key={item} className="flex items-start gap-3 border-b border-border-subtle/60 py-3.5 text-[0.9375rem] leading-6 text-ink-muted">
                          <Icon name="check-circle" size={17} className="mt-0.5 shrink-0 text-accent-warm" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={featureHref(page.slug)} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover motion-reduce:transition-none">
                      Explore {page.eyebrow.toLowerCase()}
                      <Icon name="arrow" size={16} />
                    </Link>
                  </div>
                  <div className={cn("min-w-0", flip && "lg:order-1")}>
                    <FeatureVisual visual={rowVisual[page.slug]} displayWidth={720} diagramRatio="4 / 3" />
                  </div>
                </article>
              </AnimateOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
