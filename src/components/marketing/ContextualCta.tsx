import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { demoHref } from "@/content/navigation";

/**
 * Closing call to action shared by every page: a contained, coral-lit band with the
 * redaction-bar motif drawn as static decoration above the heading.
 */
export function ContextualCta({ eyebrow, title, description, href = demoHref }: { eyebrow: string; title: string; description: string; href?: string }) {
  return (
    <section className="bg-canvas pb-20 pt-6 sm:pb-24 lg:pb-28">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[20px] border border-border-subtle/60 bg-surface-raised/60 px-6 py-14 text-center shadow-[inset_0_1px_0_rgb(var(--or-fg)/0.06)] sm:px-10 sm:py-16 lg:py-20">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_50%_110%,rgb(var(--or-coral)/0.22),transparent_70%)]" />
          <div aria-hidden="true" className="mx-auto mb-9 flex w-48 flex-col gap-2.5">
            <span className="h-2 w-full rounded-full bg-ink-muted/20" />
            <span className="flex gap-2"><span className="h-2 w-1/4 rounded-full bg-ink-muted/20" /><span className="h-2 flex-1 rounded-full bg-accent-warm shadow-[0_0_18px_rgb(var(--or-coral)/0.45)]" /></span>
            <span className="h-2 w-3/4 rounded-full bg-ink-muted/20" />
          </div>
          <p className="type-eyebrow">{eyebrow}</p>
          <h2 className="type-h2 mx-auto mt-4 max-w-[24ch]">{title}</h2>
          <p className="type-lede mx-auto mt-4 max-w-2xl">{description}</p>
          <Link href={href} className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-accent-warm px-6 py-3 font-semibold text-canvas shadow-action transition-all hover:bg-accent-warm-hover hover:shadow-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-canvas motion-reduce:transition-none">
            Request a Demo
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
