import React from "react";
import Link from "next/link";
import type { FeatureSlug } from "@/lib/marketing/content";
import type { IndustryPageContent, MediaFormat } from "@/lib/marketing/industries";
import { formatFeature } from "@/lib/marketing/industries";
import { capabilityClaims, featureHref, getFeaturePage } from "@/content/features";
import { industryHref, liveIndustryPages } from "@/content/industries";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export const formatMeta: Record<MediaFormat, { label: string; icon: string; tone: string; bar: string }> = {
  document: { label: "Documents", icon: "document", tone: "text-accent-warm", bar: "bg-accent-warm" },
  audio: { label: "Audio", icon: "audio", tone: "text-accent-cool", bar: "bg-accent-cool" },
  video: { label: "Video", icon: "video", tone: "text-accent-mint", bar: "bg-accent-mint" },
};

export const featureIcons: Record<FeatureSlug, string> = {
  "document-redaction": "document",
  "audio-redaction": "audio",
  "video-redaction": "video",
};

export function FormatBadge({ format, primary = false }: { format: MediaFormat; primary?: boolean }) {
  const meta = formatMeta[format];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-xs", primary ? "border-ink-muted/30 bg-surface-active/60 text-ink" : "border-border-subtle/70 text-ink-muted")}>
      <Icon name={meta.icon} size={13} className={meta.tone} />
      {meta.label}
      {primary ? <span className="sr-only"> (primary format)</span> : null}
    </span>
  );
}

/**
 * Hero panel: what this sector handles, and which media it leans on. The bars are a
 * static redaction motif, not an imitation of the application.
 */
export function IndustrySignal({ page }: { page: IndustryPageContent }) {
  return (
    <div className="media-frame media-glow" aria-label={`${page.navLabel} redaction profile`} role="group">
      <div className="rounded-[0.7rem] bg-surface-raised p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-border-subtle/60 pb-4">
          <span className="inline-flex items-center gap-3 text-sm font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-accent-warm/25 bg-accent-warm/10 text-accent-warm"><Icon name={page.icon} size={18} /></span>
            {page.navLabel} records
          </span>
          <span className="type-meta">Reviewer-led</span>
        </div>
        <ul className="divide-y divide-border-subtle/50">
          {page.sensitiveInformation.map((item, index) => (
            <li key={item.label} className="grid gap-2.5 py-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center sm:gap-5">
              <p className="text-sm font-semibold text-ink">{item.label}</p>
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2 w-[22%] rounded-full bg-ink-muted/25" />
                <span className={cn("h-2 rounded-full bg-accent-warm/85", index % 2 === 0 ? "w-[38%]" : "w-[28%]")} />
                <span className="h-2 flex-1 rounded-full bg-ink-muted/25" />
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle/60 pt-4">
          <span className="type-meta mr-1">Formats</span>
          {page.mediaEmphasis.map((format, index) => <FormatBadge key={format} format={format} primary={index === 0} />)}
        </div>
      </div>
    </div>
  );
}

/** Capability wording comes verbatim from the evidence register, with its condition. */
export function CapabilityList({ claimIds }: { claimIds: IndustryPageContent["workflows"][number]["claimIds"] }) {
  return (
    <ul className="border-t border-border-subtle/60">
      {claimIds.map((claimId) => {
        const claim = capabilityClaims[claimId];
        return (
          <li key={claimId} className="flex gap-3 border-b border-border-subtle/60 py-3.5 text-[0.9375rem] leading-6 text-ink-muted">
            <Icon name="check-circle" size={17} className="mt-0.5 shrink-0 text-accent-warm" />
            <span>
              <span className="text-ink">{claim.publicWording}</span>
              {claim.condition ? <span className="mt-1 block text-[0.8125rem] leading-5 text-ink-muted">{claim.condition}</span> : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function IndustryCard({ page, headingLevel = 3 }: { page: IndustryPageContent; headingLevel?: 3 | 4 }) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  return (
    <article className="group relative flex h-full flex-col rounded-[14px] border border-border-subtle/60 bg-surface-raised/40 p-6 transition-colors hover:border-ink-muted/35 hover:bg-surface-raised/70 motion-reduce:transition-none">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-accent-warm/25 bg-accent-warm/10 text-accent-warm"><Icon name={page.icon} size={18} /></span>
        <Heading className="type-h3 text-[1.125rem]">
          <Link href={industryHref(page.slug)} className="after:absolute after:inset-0 after:rounded-[14px] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent-cool">
            {page.navLabel}
          </Link>
        </Heading>
      </div>
      <p className="mt-4 text-[0.9375rem] leading-6 text-ink-muted">{page.hubSummary}</p>
      <ul className="mb-6 mt-5 flex flex-wrap gap-x-3 gap-y-1.5" aria-label={`${page.navLabel} sensitive information`}>
        {page.sensitiveInformation.slice(0, 3).map((item) => <li key={item.label} className="type-meta">{item.label}</li>)}
      </ul>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle/50 pt-5">
        <div className="flex flex-wrap gap-1.5" aria-label="Formats, primary first">{page.mediaEmphasis.map((format, index) => <FormatBadge key={format} format={format} primary={index === 0} />)}</div>
        <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-warm">Read guide<Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" /></span>
      </div>
    </article>
  );
}

/** Live industries whose guides describe a workflow in this format, primary format first. */
export function industriesForFormat(format: MediaFormat) {
  return [...liveIndustryPages]
    .filter((page) => page.mediaEmphasis.includes(format))
    .sort((a, b) => a.mediaEmphasis.indexOf(format) - b.mediaEmphasis.indexOf(format));
}

export function FormatIndustryLinks({ format, title }: { format: MediaFormat; title: string }) {
  const pages = industriesForFormat(format);
  if (pages.length === 0) return null;
  return (
    <div>
      <h2 className="type-h3">{title}</h2>
      <ul className="mt-5 flex flex-wrap gap-2">
        {pages.map((page) => (
          <li key={page.slug}>
            <Link href={industryHref(page.slug)} className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-border-subtle/70 px-3.5 text-sm text-ink-muted transition-colors hover:border-ink-muted/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none">
              <Icon name={page.icon} size={15} className="text-accent-warm" />
              {page.navLabel}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/industries" className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-accent-warm hover:text-accent-warm-hover">All industries<Icon name="arrow" size={15} /></Link>
        </li>
      </ul>
    </div>
  );
}

export function featureLinkFor(format: MediaFormat) {
  const page = getFeaturePage(formatFeature[format]);
  return page ? { href: featureHref(page.slug), label: page.eyebrow } : null;
}
