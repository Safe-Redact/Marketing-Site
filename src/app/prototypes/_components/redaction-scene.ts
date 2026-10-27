/**
 * Prototype A scene: one coral redaction bar that moves between three verified
 * OpenRedakt workflows. Each motif shows only a supported capability:
 *   document: a reviewed passage covered by a redaction mark (DOC-MANUAL, DOC-REVIEW)
 *   audio:    a manual range on a waveform with a mute effect (AUD-TIMELINE, AUD-EFFECTS)
 *   video:    a static manual region with pixelation and its time interval
 *             (VID-MANUAL, VID-TIMELINE, VID-EFFECTS); the region never moves, so
 *             nothing implies object tracking.
 * Geometry is in design units and fully deterministic, so the server-rendered SVG
 * fallback and the canvas frames match exactly.
 */

export type Rect = { x: number; y: number; w: number; h: number };
export type Bar = { x: number; amp: number };

export type SceneLayout = {
  width: number;
  height: number;
  lines: Rect[][];
  passage: Rect[];
  bars: Bar[];
  barWidth: number;
  waveY: number;
  maxAmp: number;
  rangeIndex: readonly [number, number];
  range: Rect;
  frame: Rect;
  region: Rect;
  track: Rect;
  interval: Rect;
};

export const SCENE_END = 13400;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildLayout(compact: boolean): SceneLayout {
  const width = compact ? 600 : 1000;
  const height = compact ? 480 : 440;
  const random = mulberry32(7);

  // Document: seven lines of word-shaped placeholders. No legible text.
  const docLeft = compact ? 60 : 250;
  const docRight = compact ? 540 : 750;
  const spacing = compact ? 44 : 40;
  const lineCount = 7;
  const top = (height - ((lineCount - 1) * spacing + 10)) / 2;
  const lines: Rect[][] = [];
  for (let i = 0; i < lineCount; i++) {
    const maxX = i === lineCount - 1 ? docLeft + (docRight - docLeft) * 0.58 : docRight;
    const row: Rect[] = [];
    let x = docLeft;
    while (x < maxX) {
      let w = 34 + random() * 92;
      if (x + w > maxX) w = maxX - x;
      if (w < 26) break;
      row.push({ x, y: top + i * spacing, w, h: 10 });
      x += w + 12;
    }
    lines.push(row);
  }
  const span = (row: Rect[], from: number, to: number): Rect => {
    const first = row[from];
    const last = row[Math.min(to, row.length - 1)];
    return { x: first.x - 5, y: first.y - 5, w: last.x + last.w - first.x + 10, h: 20 };
  };
  const passage = [span(lines[2], 2, lines[2].length - 1), span(lines[3], 0, 1)];

  // Audio: a deterministic waveform.
  const barCount = compact ? 64 : 110;
  const waveLeft = compact ? 40 : 150;
  const waveRight = compact ? 560 : 850;
  const waveY = height / 2;
  const maxAmp = compact ? 120 : 118;
  const step = (waveRight - waveLeft) / (barCount - 1);
  const bars: Bar[] = Array.from({ length: barCount }, (_, i) => {
    const shape = Math.abs(Math.sin(i * 0.21) * 0.6 + Math.sin(i * 0.067 + 1.1) * 0.4);
    return { x: waveLeft + i * step, amp: maxAmp * Math.min(1, 0.18 + shape * (0.5 + random() * 0.55)) };
  });
  const rangeIndex = [Math.round(barCount * 0.44), Math.round(barCount * 0.64)] as const;
  const range: Rect = {
    x: bars[rangeIndex[0]].x - step * 0.7,
    y: waveY - maxAmp - 16,
    w: bars[rangeIndex[1]].x - bars[rangeIndex[0]].x + step * 1.4,
    h: maxAmp * 2 + 32,
  };

  // Video: a 16:9 frame, a static region, and the region's interval on a timeline.
  const frameW = compact ? 480 : 470;
  const frameH = (frameW * 9) / 16;
  const frame: Rect = { x: (width - frameW) / 2, y: compact ? 56 : 34, w: frameW, h: frameH };
  const sign: Rect = { x: frame.x + frameW * 0.57, y: frame.y + frameH * 0.34, w: frameW * 0.25, h: frameH * 0.21 };
  const region: Rect = { x: sign.x - 8, y: sign.y - 8, w: sign.w + 16, h: sign.h + 16 };
  const track: Rect = { x: frame.x, y: frame.y + frameH + (compact ? 46 : 40), w: frameW, h: 6 };
  const interval: Rect = { x: track.x + frameW * 0.42, y: track.y - 2, w: frameW * 0.26, h: 10 };

  return { width, height, lines, passage, bars, barWidth: Math.max(2.2, step * 0.42), waveY, maxAmp, rangeIndex, range, frame, region, track, interval };
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const progress = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export type SceneState = ReturnType<typeof stateAt>;

/** Timeline: entrance, document, audio, video, then settle back on the document. */
export function stateAt(t: number) {
  const toAudio = ease(progress(t, 4000, 5200));
  const toVideo = ease(progress(t, 7800, 9000));
  const toDocument = ease(progress(t, 12000, 13300));
  const wAudio = toAudio * (1 - toVideo);
  const wVideo = toVideo * (1 - toDocument);
  return {
    lineReveal: (i: number) => ease(progress(t, 200 + i * 90, 760 + i * 90)),
    select: ease(progress(t, 1300, 2100)),
    fill: ease(progress(t, 2100, 2700)),
    mute: ease(progress(t, 5300, 6100)),
    regionDraw: ease(progress(t, 9100, 9800)),
    pixelate: ease(progress(t, 9800, 10500)),
    audioPlayhead: progress(t, 5300, 7600),
    videoPlayhead: progress(t, 9100, 11800),
    wAudio,
    wVideo,
    wDocument: 1 - wAudio - wVideo,
  };
}

export type ScenePhase = "document" | "audio" | "video";

export function phaseAt(t: number): ScenePhase {
  if (t < 4600 || t >= 12650) return "document";
  return t < 8400 ? "audio" : "video";
}

const mix = (a: Rect, b: Rect, c: Rect, wa: number, wb: number, wc: number): Rect => ({
  x: a.x * wa + b.x * wb + c.x * wc,
  y: a.y * wa + b.y * wb + c.y * wc,
  w: a.w * wa + b.w * wb + c.w * wc,
  h: a.h * wa + b.h * wb + c.h * wc,
});

export type SceneColours = {
  coral: string;
  coralSoft: string;
  signal: string;
  fg: string;
  fgMuted: string;
  line: string;
  elevated: string;
  graphite: string;
  midnight: string;
};

/** Converts "R G B" channel tokens into canvas-safe rgba() strings. */
export function rgba(channels: string, alpha: number) {
  const [r, g, b] = channels.trim().split(/\s+/);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha).toFixed(3)})`;
}

function roundRect(ctx: CanvasRenderingContext2D, r: Rect, radius: number) {
  const rad = Math.min(radius, r.h / 2, r.w / 2);
  ctx.beginPath();
  ctx.moveTo(r.x + rad, r.y);
  ctx.arcTo(r.x + r.w, r.y, r.x + r.w, r.y + r.h, rad);
  ctx.arcTo(r.x + r.w, r.y + r.h, r.x, r.y + r.h, rad);
  ctx.arcTo(r.x, r.y + r.h, r.x, r.y, rad);
  ctx.arcTo(r.x, r.y, r.x + r.w, r.y, rad);
  ctx.closePath();
}

function strokeProgress(ctx: CanvasRenderingContext2D, r: Rect, radius: number, amount: number) {
  if (amount <= 0) return;
  const perimeter = 2 * (r.w + r.h);
  ctx.setLineDash([perimeter * amount, perimeter]);
  roundRect(ctx, r, radius);
  ctx.stroke();
  ctx.setLineDash([]);
}

/** Paints the abstract video still once per resize; pixelation samples from it. */
export function paintVideoScene(layout: SceneLayout, colours: SceneColours, pixelsPerUnit: number) {
  const { frame, region } = layout;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(frame.w * pixelsPerUnit);
  canvas.height = Math.ceil(frame.h * pixelsPerUnit);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.scale(pixelsPerUnit, pixelsPerUnit);
  const sky = ctx.createLinearGradient(0, 0, 0, frame.h);
  sky.addColorStop(0, rgba(colours.elevated, 1));
  sky.addColorStop(0.62, rgba(colours.graphite, 1));
  sky.addColorStop(1, rgba(colours.midnight, 1));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, frame.w, frame.h);
  // Distant buildings with lit windows and a street: environment, not people.
  const buildings = [
    { x: 0.04, w: 0.15, h: 0.46 },
    { x: 0.2, w: 0.11, h: 0.32 },
    { x: 0.32, w: 0.14, h: 0.52 },
    { x: 0.86, w: 0.12, h: 0.38 },
  ];
  for (const b of buildings) {
    const top = frame.h * (0.72 - b.h);
    ctx.fillStyle = rgba(colours.line, 0.95);
    ctx.fillRect(frame.w * b.x, top, frame.w * b.w, frame.h * b.h);
    ctx.fillStyle = rgba(colours.coralSoft, 0.35);
    for (let wy = top + 8; wy < frame.h * 0.68; wy += 12) {
      for (let wx = frame.w * b.x + 6; wx < frame.w * (b.x + b.w) - 8; wx += 11) {
        if ((Math.floor(wx) + Math.floor(wy)) % 3 === 0) ctx.fillRect(wx, wy, 5, 6);
      }
    }
  }
  const street = ctx.createLinearGradient(0, frame.h * 0.72, 0, frame.h);
  street.addColorStop(0, rgba(colours.graphite, 1));
  street.addColorStop(1, rgba(colours.midnight, 1));
  ctx.fillStyle = street;
  ctx.fillRect(0, frame.h * 0.72, frame.w, frame.h * 0.28);
  ctx.fillStyle = rgba(colours.fgMuted, 0.25);
  for (let x = 0; x < frame.w; x += 34) ctx.fillRect(x, frame.h * 0.86, 18, 2);
  ctx.fillStyle = rgba(colours.coralSoft, 0.55);
  ctx.beginPath();
  ctx.arc(frame.w * 0.84, frame.h * 0.18, frame.h * 0.05, 0, Math.PI * 2);
  ctx.fill();
  // A sign with readable-looking text blocks: the region a reviewer chooses to conceal.
  const sign = { x: region.x - frame.x + 8, y: region.y - frame.y + 8, w: region.w - 16, h: region.h - 16 };
  const panel = ctx.createLinearGradient(sign.x, sign.y, sign.x + sign.w, sign.y + sign.h);
  panel.addColorStop(0, rgba(colours.fg, 0.95));
  panel.addColorStop(1, rgba(colours.fgMuted, 0.9));
  ctx.fillStyle = panel;
  roundRect(ctx, sign, 4);
  ctx.fill();
  ctx.fillStyle = rgba(colours.signal, 0.85);
  ctx.fillRect(sign.x, sign.y, sign.w, 6);
  ctx.fillStyle = rgba(colours.midnight, 0.9);
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(sign.x + 8, sign.y + 14 + i * (sign.h - 20) / 4, sign.w * (i === 3 ? 0.46 : 0.8), 4);
  }
  ctx.fillStyle = rgba(colours.line, 1);
  ctx.fillRect(sign.x + sign.w / 2 - 2, sign.y + sign.h, 4, frame.h * 0.72 - sign.y - sign.h);
  return canvas;
}

// One reusable canvas for the pixelation down-sample, rather than one per frame.
let mosaicCanvas: HTMLCanvasElement | null = null;

export function drawScene(
  ctx: CanvasRenderingContext2D,
  layout: SceneLayout,
  state: SceneState,
  colours: SceneColours,
  videoScene: HTMLCanvasElement | null,
  pixelsPerUnit: number
) {
  const { lines, passage, bars, range, frame, region, track, interval, waveY, maxAmp, rangeIndex } = layout;
  const { wDocument, wAudio, wVideo, fill } = state;
  ctx.clearRect(0, 0, layout.width, layout.height);

  // Document lines.
  if (wDocument > 0.001) {
    ctx.save();
    ctx.globalAlpha = wDocument;
    ctx.translate(0, (1 - wDocument) * -10);
    ctx.fillStyle = rgba(colours.fgMuted, 0.3);
    lines.forEach((row, i) => {
      const reveal = state.lineReveal(i);
      const rowEnd = row[0].x + (row[row.length - 1].x + row[row.length - 1].w - row[0].x) * reveal;
      for (const word of row) {
        if (word.x >= rowEnd) break;
        roundRect(ctx, { ...word, w: Math.min(word.w, rowEnd - word.x) }, 5);
        ctx.fill();
      }
    });
    ctx.strokeStyle = rgba(colours.coral, 0.9 * (1 - fill * 0.65));
    ctx.lineWidth = 1.5;
    for (const rect of passage) strokeProgress(ctx, rect, 5, state.select);
    // The second line of the passage; the first is the travelling bar below.
    ctx.shadowColor = rgba(colours.coral, 0.45);
    ctx.shadowBlur = 18 * pixelsPerUnit;
    ctx.fillStyle = rgba(colours.coral, fill);
    roundRect(ctx, passage[1], 4);
    ctx.fill();
    ctx.restore();
  }

  // Audio waveform; it settles onto the video timeline as video takes over.
  if (wAudio > 0.001) {
    ctx.save();
    ctx.globalAlpha = wAudio;
    const growth = 1 - Math.pow(1 - wAudio, 3);
    const toTrack = wVideo / Math.max(0.0001, wVideo + wAudio);
    const centre = waveY + (track.y + track.h / 2 - waveY) * toTrack;
    bars.forEach((bar, i) => {
      const inRange = i >= rangeIndex[0] && i <= rangeIndex[1];
      const amplitude = bar.amp * growth * (inRange ? 1 - 0.93 * state.mute : 1);
      ctx.fillStyle = inRange ? rgba(colours.fgMuted, 0.45) : rgba(colours.signal, 0.78);
      roundRect(ctx, { x: bar.x - layout.barWidth / 2, y: centre - amplitude, w: layout.barWidth, h: Math.max(2, amplitude * 2) }, layout.barWidth / 2);
      ctx.fill();
    });
    const playheadAlpha = Math.sin(Math.PI * state.audioPlayhead);
    if (playheadAlpha > 0.01) {
      const x = bars[0].x + (bars[bars.length - 1].x - bars[0].x) * state.audioPlayhead;
      ctx.strokeStyle = rgba(colours.fg, 0.75 * playheadAlpha);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, waveY - maxAmp - 26);
      ctx.lineTo(x, waveY + maxAmp + 26);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Video frame, region and timeline.
  if (wVideo > 0.001 && videoScene) {
    ctx.save();
    ctx.globalAlpha = wVideo;
    const scale = 0.97 + 0.03 * wVideo;
    ctx.translate(frame.x + frame.w / 2, frame.y + frame.h / 2);
    ctx.scale(scale, scale);
    ctx.translate(-(frame.x + frame.w / 2), -(frame.y + frame.h / 2));
    ctx.save();
    roundRect(ctx, frame, 10);
    ctx.clip();
    ctx.drawImage(videoScene, frame.x, frame.y, frame.w, frame.h);
    if (state.pixelate > 0.01) {
      const block = 1 + state.pixelate * 12;
      const cols = Math.max(1, Math.round(region.w / block));
      const rows = Math.max(1, Math.round(region.h / block));
      const small = (mosaicCanvas ??= document.createElement("canvas"));
      small.width = cols;
      small.height = rows;
      const sctx = small.getContext("2d");
      if (sctx) {
        sctx.drawImage(videoScene, (region.x - frame.x) * pixelsPerUnit, (region.y - frame.y) * pixelsPerUnit, region.w * pixelsPerUnit, region.h * pixelsPerUnit, 0, 0, cols, rows);
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = wVideo * Math.min(1, state.pixelate * 1.6);
        ctx.drawImage(small, region.x, region.y, region.w, region.h);
        ctx.imageSmoothingEnabled = true;
        ctx.globalAlpha = wVideo;
      }
    }
    ctx.restore();
    ctx.strokeStyle = rgba(colours.fg, 0.1);
    ctx.lineWidth = 1;
    roundRect(ctx, frame, 10);
    ctx.stroke();
    ctx.strokeStyle = rgba(colours.coral, 0.95);
    ctx.lineWidth = 2;
    strokeProgress(ctx, region, 4, state.regionDraw);
    // Timeline track with ticks.
    ctx.fillStyle = rgba(colours.line, 0.95);
    roundRect(ctx, track, 3);
    ctx.fill();
    ctx.fillStyle = rgba(colours.fgMuted, 0.3);
    for (let i = 0; i <= 10; i++) ctx.fillRect(track.x + (track.w * i) / 10 - 0.5, track.y + 12, 1, i % 5 === 0 ? 8 : 4);
    const playheadAlpha = Math.min(1, state.videoPlayhead * 6);
    if (playheadAlpha > 0.01) {
      const x = interval.x + interval.w * state.videoPlayhead;
      ctx.strokeStyle = rgba(colours.fg, 0.85 * playheadAlpha);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, track.y - 16);
      ctx.lineTo(x, track.y + 22);
      ctx.stroke();
      ctx.fillStyle = rgba(colours.fg, playheadAlpha);
      ctx.beginPath();
      ctx.arc(x, track.y - 18, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // The travelling redaction bar: passage mark, then audio range, then video interval.
  if (fill > 0.001) {
    const bar = mix(passage[0], range, interval, wDocument, wAudio, wVideo);
    ctx.save();
    ctx.shadowColor = rgba(colours.coral, 0.5);
    ctx.shadowBlur = (18 + 14 * wAudio) * pixelsPerUnit;
    ctx.fillStyle = rgba(colours.coral, fill * (wDocument + wAudio * 0.16 + wVideo));
    roundRect(ctx, bar, 4 * wDocument + 10 * wAudio + 5 * wVideo);
    ctx.fill();
    if (wAudio > 0.01) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = rgba(colours.coral, 0.95 * wAudio);
      for (const edge of [bar.x, bar.x + bar.w]) {
        ctx.fillRect(edge - 1, bar.y, 2, bar.h);
        roundRect(ctx, { x: edge - 4, y: bar.y - 6, w: 8, h: 14 }, 3);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}
