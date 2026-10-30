"use client";

import React, { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MotionControl, type MotionState } from "@/components/cinematic/MotionControl";
import { useMotionGate } from "@/components/cinematic/useMotionGate";
import { cn } from "@/lib/utils";
import {
  SCENE_END,
  buildLayout,
  drawScene,
  paintVideoScene,
  phaseAt,
  stateAt,
  type SceneColours,
  type SceneLayout,
  type ScenePhase,
} from "./redaction-scene";
import styles from "./prototypes.module.css";

const PHASES: { id: ScenePhase; label: string; detail: string }[] = [
  { id: "document", label: "Document", detail: "Redacted passage" },
  { id: "audio", label: "Audio", detail: "Muted range" },
  { id: "video", label: "Video", detail: "Pixelated region" },
];

type Engine = {
  layout: SceneLayout;
  colours: SceneColours;
  pixelsPerUnit: number;
  videoScene: HTMLCanvasElement | null;
  offsetX: number;
  offsetY: number;
  scale: number;
  dpr: number;
};

function readColours(): SceneColours {
  const root = getComputedStyle(document.documentElement);
  const token = (name: string) => root.getPropertyValue(`--or-${name}`).trim() || "255 255 255";
  return {
    coral: token("coral"),
    coralSoft: token("coral-soft"),
    signal: token("signal"),
    fg: token("fg"),
    fgMuted: token("fg-muted"),
    line: token("line"),
    elevated: token("elevated"),
    graphite: token("graphite"),
    midnight: token("midnight"),
  };
}

/**
 * Prototype A: a native Canvas 2D animation of the redaction bar. It runs one
 * thirteen-second sequence, then stops on the document state with no further work.
 * It pauses whenever the stage is off-screen or the tab is hidden, honours
 * prefers-reduced-motion (static final frame), and the static SVG fallback stays
 * visible until the first canvas frame is drawn.
 */
export function RedactionBarCanvas({ fallback }: { fallback: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const timeRef = useRef(0);
  const userStartedRef = useRef(false);
  const [motion, setMotion] = useState<MotionState>("playing");
  const [phase, setPhase] = useState<ScenePhase>("document");
  const [ready, setReady] = useState(false);
  const { active } = useMotionGate(stageRef);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !engine || !ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(engine.dpr * engine.scale, 0, 0, engine.dpr * engine.scale, engine.offsetX * engine.dpr, engine.offsetY * engine.dpr);
    drawScene(ctx, engine.layout, stateAt(timeRef.current), engine.colours, engine.videoScene, engine.pixelsPerUnit);
    const next = phaseAt(timeRef.current);
    setPhase((current) => (current === next ? current : next));
  }, []);

  // Size the canvas to its stage and rebuild geometry for wide or compact layouts.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas || !canvas.getContext) return;
    const colours = readColours();
    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const compact = width / height < 1.6;
      const layout = engineRef.current?.layout.width === (compact ? 600 : 1000) ? engineRef.current.layout : buildLayout(compact);
      const scale = Math.min(width / layout.width, height / layout.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const pixelsPerUnit = dpr * scale;
      engineRef.current = {
        layout,
        colours,
        dpr,
        scale,
        pixelsPerUnit,
        offsetX: (width - layout.width * scale) / 2,
        offsetY: (height - layout.height * scale) / 2,
        videoScene: paintVideoScene(layout, colours, pixelsPerUnit),
      };
      draw();
      setReady(true);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [draw]);

  // The animation loop only runs while playing, visible and on-screen.
  useEffect(() => {
    if (motion !== "playing" || !active) return;
    if (!userStartedRef.current && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeRef.current = SCENE_END;
      draw();
      setMotion("ended");
      return;
    }
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      timeRef.current = Math.min(SCENE_END, timeRef.current + Math.min(now - last, 50));
      last = now;
      draw();
      if (timeRef.current >= SCENE_END) {
        setMotion("ended");
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [motion, active, draw]);

  const toggle = () => {
    userStartedRef.current = true;
    if (motion === "playing") setMotion("paused");
    else if (motion === "paused") setMotion("playing");
    else {
      timeRef.current = 0;
      setMotion("playing");
    }
  };

  return (
    <div className={styles.visual}>
      <div ref={stageRef} className={cn(styles.stage, ready && styles.stageReady)} data-motion={motion}>
        <div className={styles.fallback}>{fallback}</div>
        <canvas ref={canvasRef} aria-hidden="true" className={styles.canvas} />
      </div>
      <p className="sr-only">
        Animated illustration of the OpenRedakt redaction bar: a reviewed passage in a document is covered by a redaction mark, the bar becomes a
        muted range on an audio waveform, then the time interval of a pixelated region in a video frame.
      </p>
      <div className={styles.legend}>
        <ol className={styles.phases} aria-label="Formats shown">
          {PHASES.map((item) => (
            <li key={item.id} className={cn(styles.phase, phase === item.id && styles.phaseActive)} aria-current={phase === item.id ? "step" : undefined}>
              <span className={styles.phaseLabel}>{item.label}</span>
              <span className={styles.phaseDetail}>{item.detail}</span>
            </li>
          ))}
        </ol>
        <MotionControl state={motion} onToggle={toggle} />
      </div>
    </div>
  );
}
