import React, { type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import styles from "./cinematic.module.css";

/**
 * OpenRedakt's signature mark: one horizontal bar, the shape shared by a redacted
 * passage, a selected audio range and a video time interval. Decorative only.
 */
export function RedactionBar({
  tone = "coral",
  weight = "bar",
  sweep = false,
  delayMs = 0,
  className,
}: {
  tone?: "coral" | "signal";
  weight?: "bar" | "hairline";
  sweep?: boolean;
  delayMs?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(styles.bar, tone === "signal" && styles.barSignal, weight === "hairline" && styles.barHairline, sweep && styles.barSweep, className)}
      style={sweep ? ({ "--bar-delay": `${delayMs}ms` } as CSSProperties) : undefined}
    />
  );
}
