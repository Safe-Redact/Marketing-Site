import { cn } from "@/lib/utils";
import { workbenchLabels } from "@/content/platform";

function TextLine({ width }: { width: string }) {
  return <span className={`block h-1.5 rounded-full bg-slate-300/80 ${width}`} />;
}

function DetectionItem({ label, tone }: { label: string; tone: "cool" | "warm" }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-white/[0.06] bg-white/[0.035] px-2.5 py-2">
      <span className="truncate text-[9px] font-medium text-slate-300 sm:text-[10px]">{label}</span>
      <span
        className={`h-1.5 w-8 shrink-0 rounded-full ${tone === "cool" ? "bg-accent-cool" : "bg-accent-warm"}`}
        aria-hidden="true"
      />
    </div>
  );
}

export function RedactionWorkbench({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "relative mx-auto aspect-[608/372] w-full max-w-[608px] overflow-hidden rounded-panel border border-border-subtle bg-[#0d1220] shadow-panel",
        className
      )}
      aria-label={workbenchLabels.figureLabel}
      data-hero-workbench
    >
      <div className="flex h-[12%] items-center justify-between border-b border-border-subtle bg-surface-raised px-[4%]">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded bg-accent-warm/15 sm:h-6 sm:w-6">
            <span className="h-1.5 w-3 rounded-sm bg-accent-warm" />
          </span>
          <span className="font-heading text-[9px] font-semibold text-white sm:text-xs">
            {workbenchLabels.product}
          </span>
        </div>
        <span className="rounded border border-border-subtle px-2 py-1 text-[7px] text-ink-muted sm:text-[9px]">
          {workbenchLabels.file}
        </span>
      </div>

      <div className="grid h-[76%] grid-cols-[1.65fr_0.85fr] gap-[3%] p-[4%]">
        <div className="relative overflow-hidden rounded-[7px] bg-[#eef2f7] p-[6%] shadow-inner">
          <div className="mb-[7%] flex items-center justify-between">
            <div>
              <span className="block text-[7px] font-bold uppercase tracking-[0.16em] text-slate-700 sm:text-[9px]">
                {workbenchLabels.record}
              </span>
              <span className="mt-1 block text-[6px] text-slate-400 sm:text-[8px]">{workbenchLabels.page}</span>
            </div>
            <span className="rounded bg-slate-800 px-1.5 py-1 text-[6px] font-semibold text-white sm:text-[8px]">{workbenchLabels.action}</span>
          </div>

          <div className="space-y-[5%]">
            <TextLine width="w-11/12" />
            <div className="flex gap-1.5">
              <TextLine width="w-1/4" />
              <span className="h-1.5 w-1/3 rounded-sm bg-accent-cool/65 ring-1 ring-accent-cool" />
              <TextLine width="w-1/4" />
            </div>
            <TextLine width="w-4/5" />
            <div className="flex gap-1.5">
              <TextLine width="w-1/3" />
              <span className="h-1.5 w-2/5 rounded-sm bg-accent-warm/65 ring-1 ring-accent-warm" />
            </div>
            <TextLine width="w-11/12" />
            <TextLine width="w-2/3" />
          </div>

          <svg
            className="absolute bottom-[6%] right-[5%] h-[30%] w-[40%] text-slate-300"
            viewBox="0 0 130 72"
            fill="none"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="128" height="70" rx="7" stroke="currentColor" />
            <path d="M15 19h70M15 29h96M15 39h52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M15 52h76" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>

        <div className="flex min-w-0 flex-col rounded-[7px] border border-white/[0.06] bg-surface-raised p-[8%]">
          <div className="mb-[8%] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-cool shadow-[0_0_12px_rgba(51,183,255,0.75)]" />
            <span className="text-[8px] font-semibold text-white sm:text-[10px]">{workbenchLabels.detector}</span>
          </div>
          <div className="space-y-2">
            <DetectionItem label={workbenchLabels.findings[0]} tone="cool" />
            <DetectionItem label={workbenchLabels.findings[1]} tone="warm" />
            <DetectionItem label={workbenchLabels.findings[2]} tone="cool" />
          </div>
          <div className="mt-auto hidden rounded-md bg-accent-cool/10 p-2 text-[8px] leading-3 text-slate-300 sm:block">
            {workbenchLabels.guidance}
          </div>
        </div>
      </div>

      <div className="flex h-[12%] items-center justify-between border-t border-border-subtle bg-[#0a0f1c] px-[4%] text-[7px] text-ink-muted sm:text-[9px]">
        <span>{workbenchLabels.view}</span>
        <span className="inline-flex items-center gap-1.5 text-accent-mint">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {workbenchLabels.status}
        </span>
      </div>
      <figcaption className="sr-only">
        {workbenchLabels.caption}
      </figcaption>
    </figure>
  );
}
