"use client";

import React from "react";
import { cn } from "@/lib/utils";
import styles from "./cinematic.module.css";

export type MotionState = "playing" | "paused" | "ended";

/**
 * Pause, resume or replay for any animation that runs longer than five seconds
 * (WCAG 2.2.2). The label always says what pressing it will do.
 */
export function MotionControl({
  state,
  onToggle,
  className,
}: {
  state: MotionState;
  onToggle: () => void;
  className?: string;
}) {
  const label = state === "playing" ? "Pause animation" : state === "paused" ? "Play animation" : "Replay animation";
  return (
    <button type="button" onClick={onToggle} className={cn(styles.motionControl, className)}>
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        {state === "playing" ? (
          <>
            <rect x="2" y="1.5" width="2.5" height="9" rx="0.6" />
            <rect x="7.5" y="1.5" width="2.5" height="9" rx="0.6" />
          </>
        ) : (
          <path d="M3 1.8v8.4a.6.6 0 0 0 .9.5l6.6-4.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5z" />
        )}
      </svg>
      {label}
    </button>
  );
}
