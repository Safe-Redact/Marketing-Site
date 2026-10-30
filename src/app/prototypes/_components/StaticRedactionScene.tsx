import React from "react";
import { buildLayout } from "./redaction-scene";
import styles from "./prototypes.module.css";

/**
 * The settled document state as server-rendered SVG. It is visible before hydration,
 * when canvas or JavaScript is unavailable, and it matches the canvas's final frame.
 */
export function StaticRedactionScene() {
  return (
    <>
      <SceneSvg compact={false} className={styles.sceneWide} />
      <SceneSvg compact className={styles.sceneCompact} />
    </>
  );
}

function SceneSvg({ compact, className }: { compact: boolean; className: string }) {
  const layout = buildLayout(compact);
  const [first, second] = layout.passage;
  return (
    <svg aria-hidden="true" focusable="false" viewBox={`0 0 ${layout.width} ${layout.height}`} className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id={`bar-glow-${compact ? "c" : "w"}`} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <g className={styles.svgWords}>
        {layout.lines.flat().map((word) => (
          <rect key={`${word.x}-${word.y}`} x={word.x} y={word.y} width={word.w} height={word.h} rx={5} />
        ))}
      </g>
      <g className={styles.svgGlow} filter={`url(#bar-glow-${compact ? "c" : "w"})`}>
        <rect x={first.x} y={first.y} width={first.w} height={first.h} rx={4} />
        <rect x={second.x} y={second.y} width={second.w} height={second.h} rx={4} />
      </g>
      <g className={styles.svgBars}>
        <rect x={first.x} y={first.y} width={first.w} height={first.h} rx={4} />
        <rect x={second.x} y={second.y} width={second.w} height={second.h} rx={4} />
      </g>
    </svg>
  );
}
