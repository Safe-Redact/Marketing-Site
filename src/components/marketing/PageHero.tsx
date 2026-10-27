import React, { type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Cta = { label: string; href: string };

/**
 * Page hero for every non-home route.
 *   split:   copy and media side by side (industry pages, hubs)
 *   stacked: centred copy with a wide product frame below (feature pages)
 *   text:    copy only (editorial and supporting pages)
 * The layout defaults to `split` when media is supplied and `text` otherwise.
 */
export function PageHero({
  eyebrow,
  title,
  summary,
  primaryCta,
  secondaryCta,
  breadcrumbs,
  media,
  layout,
  // Retained for existing callers; the D2 type scale has one restrained H1 size.
  titleSize: _titleSize,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  breadcrumbs?: ReactNode;
  media?: ReactNode;
  layout?: "split" | "stacked" | "text";
  titleSize?: "default" | "compact";
}) {
  const mode = layout ?? (media ? "split" : "text");
  const stacked = mode === "stacked";

  const actions = (
    <div className={cn("mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap", stacked && "sm:justify-center")}>
      <Button variant="primary" size="lg" asChild>
        <Link href={primaryCta.href}>{primaryCta.label}<Icon name="arrow" size={17} /></Link>
      </Button>
      <Button variant="ghost" size="lg" asChild>
        <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
      </Button>
    </div>
  );

  const copy = (
    <div className={cn(stacked ? "mx-auto max-w-3xl text-center" : "max-w-2xl")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className={cn("type-h1 mt-5", stacked ? "mx-auto max-w-[20ch]" : "max-w-[20ch]")}>{title}</h1>
      <p className={cn("type-lede mt-5", stacked ? "mx-auto max-w-2xl" : "max-w-xl")}>{summary}</p>
      {actions}
    </div>
  );

  return (
    <section className="hero-gradient relative overflow-hidden pt-[8.25rem] text-ink sm:pt-[9.25rem]">
      <Container className={cn("relative", stacked ? "pb-0" : "pb-16 sm:pb-20 lg:pb-24")}>
        {breadcrumbs ? <div className={cn("mb-10", stacked && "flex justify-center")}>{breadcrumbs}</div> : null}
        {mode === "split" && media ? (
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
            {copy}
            <div className="min-w-0">{media}</div>
          </div>
        ) : (
          copy
        )}
        {stacked && media ? <div className="relative mx-auto mt-14 max-w-[68rem] sm:mt-16">{media}</div> : null}
      </Container>
      {stacked ? <div aria-hidden="true" className="h-16 sm:h-24" /> : null}
    </section>
  );
}
