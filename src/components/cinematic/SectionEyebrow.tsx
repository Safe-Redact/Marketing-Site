import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./cinematic.module.css";

/** Monospace label above a heading, for technical framing ("Documents · Audio · Video"). */
export function SectionEyebrow({
  tone = "muted",
  className,
  children,
}: {
  tone?: "muted" | "coral" | "signal";
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn(styles.eyebrow, tone === "coral" && styles.eyebrowCoral, tone === "signal" && styles.eyebrowSignal, className)}>
      {children}
    </p>
  );
}
