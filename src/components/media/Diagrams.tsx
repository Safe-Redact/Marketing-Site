import React from "react";

/**
 * Truthful diagrams used where no approved product capture exists yet. They show only
 * supported capabilities (manual ranges, supported effects, static regions with a time
 * interval, output inspection) and never imitate application chrome or controls.
 * Rendered on the server as SVG and coloured only through palette tokens.
 */

const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  className: "absolute inset-0 h-full w-full",
  // "meet" keeps every label inside any frame ratio; the frame shares the backdrop colour.
  preserveAspectRatio: "xMidYMid meet",
  "aria-hidden": true,
  focusable: false,
} as const;

function wave(count: number, seed: number) {
  return Array.from({ length: count }, (_, i) => {
    const shape = Math.abs(Math.sin(i * 0.23 + seed) * 0.62 + Math.sin(i * 0.071 + seed * 2) * 0.38);
    const jitter = ((Math.sin(i * 12.9898 + seed) * 43758.5453) % 1 + 1) % 1;
    return 0.16 + shape * (0.5 + jitter * 0.5);
  });
}

function Backdrop({ width, height }: { width: number; height: number }) {
  return (
    <>
      <rect width={width} height={height} className="fill-graphite" />
      <rect width={width} height={height} fill="url(#diagram-vignette)" />
      <defs>
        <radialGradient id="diagram-vignette" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="rgb(var(--or-shadow))" stopOpacity="0" />
          <stop offset="100%" stopColor="rgb(var(--or-shadow))" stopOpacity="0.12" />
        </radialGradient>
      </defs>
    </>
  );
}

function Ruler({ x, y, w, labels }: { x: number; y: number; w: number; labels: string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={1} className="fill-line" />
      {Array.from({ length: 21 }, (_, i) => (
        <rect key={i} x={x + (w * i) / 20} y={y} width={1} height={i % 5 === 0 ? 8 : 4} className="fill-line" />
      ))}
      {labels.map((label, i) => (
        <text key={label} x={x + (w * i) / (labels.length - 1)} y={y + 22} textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"} className="fill-fg-muted font-mono text-[11px]">
          {label}
        </text>
      ))}
    </g>
  );
}

/** A manual range on a waveform with a mute effect; optional transcript context. */
export function AudioDiagram({ variant = "range" }: { variant?: "range" | "effects" | "transcript" }) {
  const W = 640;
  const H = 400;
  const transcript = variant === "transcript";
  const left = transcript ? 268 : 40;
  const right = 600;
  const count = transcript ? 44 : 72;
  const amps = wave(count, 1.3);
  const step = (right - left) / (count - 1);
  const centre = variant === "effects" ? 168 : 190;
  const maxAmp = 104;
  const [from, to] = [Math.round(count * 0.42), Math.round(count * 0.62)];
  const rangeX = left + from * step - step * 0.7;
  const rangeW = (to - from) * step + step * 1.4;
  return (
    <svg {...svgProps} viewBox={`0 0 ${W} ${H}`} color="rgb(0 0 0)">
      <Backdrop width={W} height={H} />
      {transcript ? (
        <g>
          {[0, 1, 2, 3, 4, 5, 6].map((line) => (
            <g key={line}>
              <rect x={40} y={92 + line * 30} width={line % 3 === 0 ? 164 : 196} height={8} rx={4} className={line === 3 ? "fill-coral-soft/70" : "fill-fg-muted/25"} />
              {line % 2 === 0 ? <rect x={40} y={78 + line * 30} width={52} height={6} rx={3} className="fill-signal/45" /> : null}
            </g>
          ))}
          <rect x={244} y={70} width={1} height={260} className="fill-line" />
        </g>
      ) : null}
      <rect x={rangeX} y={centre - maxAmp - 18} width={rangeW} height={maxAmp * 2 + 36} rx={8} className="fill-coral/15" />
      {amps.map((amp, i) => {
        const inRange = i >= from && i <= to;
        const h = inRange ? 3 : amp * maxAmp;
        return <rect key={i} x={left + i * step - 1.6} y={centre - h} width={3.2} height={h * 2} rx={1.6} className={inRange ? "fill-fg-muted/45" : "fill-signal/75"} />;
      })}
      {[rangeX, rangeX + rangeW].map((x) => (
        <g key={x}>
          <rect x={x - 1} y={centre - maxAmp - 18} width={2} height={maxAmp * 2 + 36} className="fill-coral" />
          <rect x={x - 4} y={centre - maxAmp - 26} width={8} height={14} rx={3} className="fill-coral" />
        </g>
      ))}
      <text x={rangeX + rangeW / 2} y={centre - maxAmp - 34} textAnchor="middle" className="fill-coral-soft font-mono text-[11px]">
        Mute · manual range
      </text>
      {variant === "effects" ? (
        <g>
          {["Mute", "Tone", "Silence", "Noise"].map((label, i) => (
            <g key={label}>
              <rect x={150 + i * 88} y={322} width={78} height={28} rx={14} className={i === 0 ? "fill-coral/20 stroke-coral" : "fill-elevated stroke-line"} strokeWidth={1} />
              <text x={189 + i * 88} y={340} textAnchor="middle" className={i === 0 ? "fill-fg text-[12px]" : "fill-fg-muted text-[12px]"}>
                {label}
              </text>
            </g>
          ))}
        </g>
      ) : (
        <Ruler x={left} y={330} w={right - left} labels={transcript ? ["00:30", "00:45", "01:00"] : ["00:30", "00:40", "00:50", "01:00"]} />
      )}
    </svg>
  );
}

/** Opening supported sources into one project. */
export function SourcesDiagram() {
  const groups = [
    { label: "Documents", formats: ["PDF", "DOCX", "RTF", "HTML"], tone: "stroke-coral", text: "fill-coral-soft" },
    { label: "Audio", formats: ["WAV", "MP3", "M4A", "FLAC"], tone: "stroke-signal", text: "fill-signal" },
  ];
  return (
    <svg {...svgProps} viewBox="0 0 640 400" color="rgb(0 0 0)">
      <Backdrop width={640} height={400} />
      {groups.map((group, i) => {
        const y = 104 + i * 118;
        return (
          <g key={group.label}>
            <rect x={44} y={y} width={286} height={74} rx={12} className={`fill-elevated ${group.tone}`} strokeOpacity={0.5} />
            <text x={64} y={y + 28} className="fill-fg text-[14px] font-semibold">{group.label}</text>
            {group.formats.map((format, j) => (
              <g key={format}>
                <rect x={64 + j * 60} y={y + 40} width={52} height={20} rx={10} className="fill-graphite stroke-line" />
                <text x={90 + j * 60} y={y + 54} textAnchor="middle" className={`${group.text} font-mono text-[10px]`}>{format}</text>
              </g>
            ))}
            <path d={`M330 ${y + 37} C 380 ${y + 37}, 380 200, 430 200`} fill="none" className="stroke-line" strokeWidth={1.5} />
          </g>
        );
      })}
      <rect x={430} y={150} width={170} height={100} rx={14} className="fill-elevated stroke-coral" strokeOpacity={0.6} />
      <text x={515} y={192} textAnchor="middle" className="fill-fg text-[15px] font-semibold">Review project</text>
      <text x={515} y={214} textAnchor="middle" className="fill-fg-muted font-mono text-[11px]">page · waveform</text>
    </svg>
  );
}

/** Rendering a new copy, then inspecting it before release. */
export function OutputCheckDiagram() {
  const checks = ["Rendered as a separate copy", "Re-opened for inspection", "Report of reviewed actions"];
  return (
    <svg {...svgProps} viewBox="0 0 640 400" color="rgb(0 0 0)">
      <Backdrop width={640} height={400} />
      {[0, 1].map((i) => {
        const x = 52 + i * 190;
        return (
          <g key={i}>
            <rect x={x} y={70} width={150} height={196} rx={10} className="fill-fg/90" />
            {Array.from({ length: 9 }, (_, line) => (
              <rect key={line} x={x + 16} y={92 + line * 18} width={line % 4 === 3 ? 70 : 118} height={6} rx={3} className="fill-midnight/25" />
            ))}
            <rect x={x + 16} y={128} width={86} height={12} rx={2} className="fill-midnight" />
            <rect x={x + 40} y={182} width={94} height={12} rx={2} className="fill-midnight" />
            <text x={x + 75} y={292} textAnchor="middle" className="fill-fg-muted font-mono text-[11px]">{i === 0 ? "Reviewed source" : "Rendered output"}</text>
          </g>
        );
      })}
      <path d="M206 168 L234 168" className="stroke-coral" strokeWidth={2} />
      <path d="M228 162 L236 168 L228 174" fill="none" className="stroke-coral" strokeWidth={2} />
      {checks.map((check, i) => (
        <g key={check}>
          <circle cx={420} cy={122 + i * 52} r={11} className="fill-coral/20 stroke-coral" />
          <path d={`M415 ${122 + i * 52} l3.5 3.5 l6.5 -7`} fill="none" className="stroke-coral-soft" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <text x={440} y={127 + i * 52} className="fill-fg text-[12.5px]">{check}</text>
        </g>
      ))}
      <text x={320} y={346} textAnchor="middle" className="fill-fg-muted text-[11px]">Inspection supports review; it does not prove every sensitive item was found.</text>
    </svg>
  );
}
