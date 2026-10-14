import { workflowPreviewLabels, workflowSteps } from "@/content/platform";
import { Icon } from "@/components/ui/Icon";

interface WorkflowPreviewProps {
  activeIndex: number;
}

export function WorkflowPreview({ activeIndex }: WorkflowPreviewProps) {
  const active = workflowSteps[activeIndex] ?? workflowSteps[0];

  return (
    <figure
      className="relative min-h-[390px] overflow-hidden rounded-panel border border-border-subtle bg-[#0c111f] p-4 shadow-panel sm:min-h-[440px] sm:p-6"
      aria-label={workflowPreviewLabels.figureLabel}
    >
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(51,183,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(51,183,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative flex items-center justify-between rounded-card border border-border-subtle bg-surface-raised/90 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-control bg-accent-warm/15 text-accent-warm">
            <Icon name="document" size={17} />
          </span>
          <div>
            <p className="font-heading text-xs font-semibold text-ink">{workflowPreviewLabels.file}</p>
            <p className="text-[10px] text-ink-muted">{workflowPreviewLabels.project}</p>
          </div>
        </div>
        <span className="rounded-control border border-accent-cool/25 bg-accent-cool/10 px-2.5 py-1 text-[10px] font-semibold text-accent-cool">
          {active.previewLabel}
        </span>
      </div>

      <div className="relative mt-4 grid gap-4 sm:grid-cols-[1.45fr_0.75fr]">
        <div className="relative min-h-[265px] overflow-hidden rounded-card bg-[#eef2f7] p-5 text-slate-700 sm:min-h-[310px] sm:p-7">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em]">
            <span>{workflowPreviewLabels.record}</span>
            <span className="rounded bg-slate-800 px-2 py-1 text-[9px] text-white">{workflowPreviewLabels.page}</span>
          </div>
          <div className="mt-7 space-y-4">
            {["w-11/12", "w-4/5", "w-10/12", "w-3/4", "w-5/6"].map((width, index) => (
              <div key={width + index} className="flex items-center gap-2">
                <span className={`h-2 rounded-full bg-slate-300 ${width}`} />
                {index === 1 && <span className="h-3 w-20 rounded-sm bg-accent-cool/55 ring-1 ring-accent-cool" />}
                {index === 3 && <span className="h-3 w-16 rounded-sm bg-accent-warm/55 ring-1 ring-accent-warm" />}
              </div>
            ))}
          </div>
          <div className="absolute bottom-5 right-5 w-2/5 rounded-card border border-slate-300 bg-white/70 p-3 shadow-sm">
            <div className="h-1.5 w-3/4 rounded bg-slate-300" />
            <div className="mt-2 h-1.5 w-full rounded bg-slate-200" />
            <div className="mt-3 h-2 w-4/5 rounded bg-slate-900" />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-card border border-border-subtle bg-surface-raised/90 p-3 sm:p-4">
          <p className="text-xs font-semibold text-ink">{workflowPreviewLabels.queue}</p>
          {workflowPreviewLabels.findings.map(({ label, status, tone }) => (
            <div key={label} className="rounded-control border border-white/[0.06] bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-medium text-ink">{label}</span>
                <span className={`h-1.5 w-7 rounded ${tone === "warm" ? "bg-accent-warm" : "bg-accent-cool"}`} />
              </div>
              <p className="mt-1.5 text-[9px] uppercase tracking-wide text-ink-muted">{status}</p>
            </div>
          ))}
          <div className="mt-auto flex items-center gap-2 border-t border-border-subtle pt-3 text-[10px] text-accent-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {active.title}
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        {workflowPreviewLabels.caption}
      </figcaption>
    </figure>
  );
}
