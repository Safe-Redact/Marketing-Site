import React from "react";
import { cn } from "@/lib/utils";
import styles from "./cinematic.module.css";

const placements = {
  top: styles.glowTop,
  center: styles.glowCenter,
  left: styles.glowLeft,
  right: styles.glowRight,
  bottom: styles.glowBottom,
} as const;

/** Decorative radial light behind a composition. Hidden from assistive technology. */
export function AtmosphericGlow({
  tone = "coral",
  placement = "top",
  intensity = "soft",
  grain = false,
  className,
}: {
  tone?: "coral" | "signal";
  placement?: keyof typeof placements;
  intensity?: "soft" | "medium";
  grain?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        styles.glow,
        placements[placement],
        tone === "signal" && styles.glowSignal,
        intensity === "medium" && styles.glowMedium,
        grain && styles.grain,
        className
      )}
    />
  );
}
