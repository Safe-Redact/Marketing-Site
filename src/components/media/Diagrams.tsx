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
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.35" />
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

function mosaic(x: number, y: number, cols: number, rows: number, size: number) {
  const tones = ["fill-fg/80", "fill-fg-muted/70", "fill-elevated", "fill-line", "fill-fg/60"];
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(<rect key={`${r}-${c}`} x={x + c * size} y={y + r * size} width={size} height={size} className={tones[(r * 3 + c * 7 + ((r * c) % 4)) % tones.length]} />);
    }
  }
  return cells;
}

function Street({ fx, fy, fw, fh }: { fx: number; fy: number; fw: number; fh: number }) {
  const ground = fy + fh * 0.72;
  const blocks = [
    { x: 0.04, w: 0.15, h: 0.46 },
    { x: 0.21, w: 0.11, h: 0.3 },
    { x: 0.33, w: 0.13, h: 0.52 },
    { x: 0.86, w: 0.11, h: 0.38 },
  ];
  return (
    <g>
      <rect x={fx} y={fy} width={fw} height={fh} rx={10} className="fill-elevated" />
      {blocks.map((b) => (
        <g key={b.x}>
          <rect x={fx + fw * b.x} y={ground - fh * b.h} width={fw * b.w} height={fh * b.h} className="fill-line" />
          {Array.from({ length: Math.floor((fh * b.h - 16) / 14) }, (_, row) => (
            <rect key={row} x={fx + fw * b.x + 7} y={ground - fh * b.h + 9 + row * 14} width={fw * b.w - 14} height={4} className="fill-coral-soft/25" />
          ))}
        </g>
      ))}
      <rect x={fx} y={ground} width={fw} height={fy + fh - ground} className="fill-graphite" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={fx + 10 + i * (fw / 12)} y={ground + (fy + fh - ground) * 0.55} width={fw / 24} height={2} className="fill-fg-muted/25" />
      ))}
    </g>
  );
}

/** A static region with a supported effect and its interval on the timeline. Never tracking. */
export function VideoDiagram({ variant = "region" }: { variant?: "region" | "candidates" | "lanes" }) {
  const W = 640;
  const H = 400;
  const fx = 70;
  const fy = 34;
  const fw = 500;
  const fh = variant === "lanes" ? 220 : 262;
  const region = { x: fx + fw * 0.57, y: fy + fh * 0.32, w: fw * 0.26, h: fh * 0.24 };
  const trackY = fy + fh + 40;
  return (
    <svg {...svgProps} viewBox={`0 0 ${W} ${H}`} color="rgb(0 0 0)">
      <Backdrop width={W} height={H} />
      <Street fx={fx} fy={fy} fw={fw} fh={fh} />
      {/* A street sign with readable-looking text: the content a reviewer conceals. */}
      <rect x={region.x + 8} y={region.y + 8} width={region.w - 16} height={region.h - 16} rx={4} className="fill-fg/90" />
      <rect x={region.x + region.w / 2 - 2} y={region.y + region.h - 8} width={4} height={fy + fh * 0.72 - region.y - region.h + 8} className="fill-line" />
      {variant !== "candidates" ? (
        <g>
          {mosaic(region.x + 8, region.y + 8, 9, 4, (region.w - 16) / 9)}
          <rect x={region.x} y={region.y} width={region.w} height={region.h} rx={5} fill="none" className="stroke-coral" strokeWidth={2} />
          <text x={region.x} y={region.y - 9} className="fill-coral-soft font-mono text-[11px]">
            Region · Pixelate
          </text>
        </g>
      ) : (
        <g>
          {[0, 1, 2].map((line) => (
            <rect key={line} x={region.x + 16} y={region.y + 18 + line * 11} width={(region.w - 32) * (line === 2 ? 0.5 : 0.85)} height={4} className="fill-midnight/80" />
          ))}
          <rect x={region.x} y={region.y} width={region.w} height={region.h} rx={5} fill="none" className="stroke-signal" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={region.x} y={region.y - 9} className="fill-signal font-mono text-[11px]">
            Text candidate · review
          </text>
          <rect x={fx + fw * 0.07} y={fy + fh * 0.78} width={fw * 0.16} height={fh * 0.09} rx={3} className="fill-fg-muted/70" />
          {mosaic(fx + fw * 0.07, fy + fh * 0.78, 8, 2, (fw * 0.16) / 8)}
          <rect x={fx + fw * 0.07 - 6} y={fy + fh * 0.78 - 6} width={fw * 0.16 + 12} height={fh * 0.09 + 12} rx={4} fill="none" className="stroke-coral" strokeWidth={2} />
          <text x={fx + fw * 0.07 - 6} y={fy + fh * 0.78 - 13} className="fill-coral-soft font-mono text-[11px]">
            Plate · confirmed
          </text>
        </g>
      )}
      <rect x={fx} y={fy} width={fw} height={fh} rx={10} fill="none" className="stroke-fg/10" />
      {variant === "lanes" ? (
        <g>
          <text x={fx} y={trackY - 6} className="fill-fg-muted font-mono text-[10px]">PICTURE</text>
          <rect x={fx + 64} y={trackY - 14} width={fw - 64} height={10} rx={5} className="fill-line" />
          <rect x={fx + 64 + (fw - 64) * 0.4} y={trackY - 14} width={(fw - 64) * 0.24} height={10} rx={5} className="fill-coral" />
          <text x={fx} y={trackY + 26} className="fill-fg-muted font-mono text-[10px]">SOUND</text>
          {wave(46, 2.2).map((amp, i) => {
            const x = fx + 64 + i * ((fw - 64) / 45);
            const inRange = i >= 26 && i <= 33;
            const h = inRange ? 1.5 : amp * 14;
            return <rect key={i} x={x - 1.4} y={trackY + 22 - h} width={2.8} height={h * 2} rx={1.4} className={inRange ? "fill-fg-muted/45" : "fill-signal/70"} />;
          })}
          <rect x={fx + 64 + (fw - 64) * 0.57} y={trackY + 4} width={(fw - 64) * 0.17} height={36} rx={6} fill="none" className="stroke-coral" strokeWidth={1.5} />
        </g>
      ) : (
        <g>
          <rect x={fx} y={trackY} width={fw} height={6} rx={3} className="fill-line" />
          <rect x={fx + fw * 0.42} y={trackY - 2} width={fw * 0.26} height={10} rx={5} className="fill-coral" />
          <rect x={fx + fw * 0.55 - 0.75} y={trackY - 16} width={1.5} height={36} className="fill-fg" />
          <circle cx={fx + fw * 0.55} cy={trackY - 18} r={4} className="fill-fg" />
          <Ruler x={fx} y={trackY + 22} w={fw} labels={["00:10", "00:15", "00:20", "00:25"]} />
        </g>
      )}
    </svg>
  );
}

/** Opening supported sources into one project. */
export function SourcesDiagram() {
  const groups = [
    { label: "Documents", formats: ["PDF", "DOCX", "PNG", "TIFF"], tone: "stroke-coral", text: "fill-coral-soft" },
    { label: "Audio", formats: ["WAV", "MP3", "M4A", "FLAC"], tone: "stroke-signal", text: "fill-signal" },
    { label: "Video", formats: ["MP4", "MOV", "MKV", "WEBM"], tone: "stroke-fg-muted", text: "fill-fg-muted" },
  ];
  return (
    <svg {...svgProps} viewBox="0 0 640 400" color="rgb(0 0 0)">
      <Backdrop width={640} height={400} />
      {groups.map((group, i) => {
        const y = 62 + i * 98;
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
      <text x={515} y={214} textAnchor="middle" className="fill-fg-muted font-mono text-[11px]">page · waveform · frame</text>
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
