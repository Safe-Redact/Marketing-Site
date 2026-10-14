import { Icon } from "@/components/ui/Icon";

export function UseCaseVisual({ variant, icon }: { variant: string; icon: string }) {
  return (
    <div className="relative h-36 overflow-hidden border-b border-border-subtle bg-[#0c111f] p-5" aria-hidden="true">
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(51,183,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(51,183,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative flex h-full items-end justify-between">
        <div className="relative h-24 w-36 rounded-card border border-border-subtle bg-surface-raised p-4 shadow-panel">
          <span className="grid h-8 w-8 place-items-center rounded-control bg-accent-cool/10 text-accent-cool"><Icon name={icon} size={17} /></span>
          <div className="mt-3 h-1.5 w-full rounded bg-white/10" />
          <div className="mt-2 h-1.5 w-3/4 rounded bg-white/10" />
        </div>
        <div className="absolute bottom-4 left-24 h-20 w-32 rotate-3 rounded-card border border-accent-warm/25 bg-[#151b2f] p-3">
          <div className="h-2 w-4/5 rounded bg-accent-warm/65" />
          <div className="mt-3 h-1.5 w-full rounded bg-white/10" />
          <div className="mt-2 h-1.5 w-2/3 rounded bg-white/10" />
        </div>
        <span className="mb-1 rounded-control border border-accent-cool/20 bg-accent-cool/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-accent-cool">
          {variant === "records" ? "Release review" : variant === "health" ? "Record review" : "Internal review"}
        </span>
      </div>
    </div>
  );
}
