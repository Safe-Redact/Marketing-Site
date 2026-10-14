import { Icon } from "@/components/ui/Icon";

interface FormatPreviewProps {
  visual: string;
  fileLabel: string;
}

export function FormatPreview({ visual, fileLabel }: FormatPreviewProps) {
  return (
    <figure className="relative min-h-[310px] overflow-hidden rounded-panel border border-border-subtle bg-[#0c111f] p-5 sm:min-h-[390px] sm:p-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(51,183,255,0.12),transparent_38%)]" />
      <div className="relative flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-control bg-accent-cool/10 text-accent-cool">
            <Icon name={visual === "audio" ? "audio" : visual === "video" ? "video" : "document"} size={18} />
          </span>
          <div>
            <p className="font-heading text-xs font-semibold text-ink">{fileLabel}</p>
            <p className="text-[10px] text-ink-muted">Review workspace</p>
          </div>
        </div>
        <span className="rounded-control border border-accent-mint/25 bg-accent-mint/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-accent-mint">Ready</span>
      </div>

      {visual === "audio" ? <AudioVisual /> : visual === "video" ? <VideoVisual /> : <DocumentVisual />}
      <figcaption className="sr-only">Original SafeRedact illustration for the selected format workflow.</figcaption>
    </figure>
  );
}

function DocumentVisual() {
  return (
    <div className="relative mx-auto mt-6 h-[235px] max-w-[380px] rounded-card bg-[#eef2f7] p-5 shadow-panel sm:h-[290px] sm:p-7">
      <div className="h-2 w-2/3 rounded bg-slate-400/60" />
      <div className="mt-6 space-y-4">
        <div className="flex gap-2"><span className="h-2 flex-1 rounded bg-slate-300" /><span className="h-3 w-24 rounded-sm bg-accent-cool/55 ring-1 ring-accent-cool" /></div>
        <div className="h-2 w-5/6 rounded bg-slate-300" />
        <div className="flex gap-2"><span className="h-3 w-20 rounded-sm bg-accent-warm/55 ring-1 ring-accent-warm" /><span className="h-2 flex-1 rounded bg-slate-300" /></div>
        <div className="h-2 w-11/12 rounded bg-slate-300" />
      </div>
      <div className="absolute bottom-5 right-5 rounded bg-slate-900 px-3 py-2 text-[9px] font-semibold text-white">2 findings</div>
    </div>
  );
}

function AudioVisual() {
  const bars = [18, 34, 24, 52, 40, 28, 62, 44, 30, 56, 38, 22, 48, 32, 18];
  return (
    <div className="relative mt-8">
      <div className="flex h-28 items-center gap-1.5 rounded-card border border-border-subtle bg-surface-raised/70 px-5">
        {bars.map((height, index) => <span key={index} className="flex-1 rounded-full bg-accent-cool/70" style={{height}} />)}
      </div>
      <div className="mt-5 space-y-3 rounded-card border border-border-subtle bg-surface-raised/70 p-4">
        <p className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Transcript</p>
        <p className="text-xs leading-5 text-ink">Please send the <span className="rounded bg-accent-warm/20 px-1 text-accent-warm">account reference</span> with the revised record.</p>
        <div className="h-1.5 w-3/4 rounded bg-white/10" />
      </div>
    </div>
  );
}

function VideoVisual() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-card border border-border-subtle bg-surface-raised/70">
      <div className="relative h-48 bg-[linear-gradient(145deg,#172033,#0d1321)] sm:h-56">
        <div className="absolute left-[18%] top-[24%] h-20 w-16 rounded border-2 border-accent-cool"><span className="absolute -top-5 left-0 text-[9px] font-semibold text-accent-cool">Face</span></div>
        <div className="absolute bottom-[22%] right-[16%] h-10 w-24 rounded border-2 border-accent-warm"><span className="absolute -top-5 right-0 text-[9px] font-semibold text-accent-warm">Plate</span></div>
        <div className="absolute inset-x-0 bottom-0 h-14 bg-black/25" />
      </div>
      <div className="flex items-center gap-2 border-t border-border-subtle p-3">
        {[0,1,2,3,4,5].map(i=><span key={i} className={`h-6 flex-1 rounded-sm ${i===2||i===3?"bg-accent-warm/45":"bg-white/[0.07]"}`} />)}
      </div>
    </div>
  );
}
