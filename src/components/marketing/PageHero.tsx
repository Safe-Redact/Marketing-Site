import React, { type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Cta = { label: string; href: string };

/**
 * Page hero for every non-home route: centred copy on a calm orange light that fades
 * into white (`.page-glow`), the quieter sibling of the homepage's cinematic field.
 *   split:   a profile or index panel below the copy at reading width (industries, hubs)
 *   stacked: a wide product frame below the copy (feature pages)
 *   text:    copy only (supporting pages)
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
  // Retained for existing callers; the type scale has one restrained H1 size.
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
  // Every internal hero is centred. "stacked" media is a wide product frame; "split"
  // media (profile and index panels) sits below the copy at reading width.
  const mode = layout ?? (media ? "split" : "text");

  return (
    <section className="page-glow relative overflow-hidden pt-[7.5rem] text-ink sm:pt-[8.5rem]">
      <Container className="relative">
        {breadcrumbs ? <div className="mb-8 flex justify-center">{breadcrumbs}</div> : null}
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="type-h1 mx-auto mt-5 max-w-[22ch]">{title}</h1>
          <p className="type-lede mx-auto mt-5 max-w-2xl">{summary}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="primary" size="lg" asChild>
              <Link href={primaryCta.href}>{primaryCta.label}<Icon name="arrow" size={17} /></Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
        {media && mode !== "text" ? (
          <div className={cn("relative mx-auto mt-14 sm:mt-16", mode === "stacked" ? "max-w-[68rem]" : "max-w-[40rem]")}>{media}</div>
        ) : null}
      </Container>
      <div aria-hidden="true" className="h-16 sm:h-20" />
    </section>
  );
}
