import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./cinematic.module.css";

/**
 * Frames a product visual with a lit hairline edge and content-tinted light behind it.
 * The fixed aspect ratio reserves space before media loads, so it cannot shift layout.
 * It adds no window controls: anything that looks like product UI must come from a capture.
 */
export function ProductFrame({
  aspectRatio,
  glow = "coral",
  className,
  screenClassName,
  children,
}: {
  aspectRatio: string;
  glow?: "coral" | "signal" | "none";
  className?: string;
  screenClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(styles.frame, glow === "signal" && styles.frameGlowSignal, glow === "none" && styles.frameGlowNone, className)}>
      <div className={cn(styles.frameScreen, screenClassName)} style={{ aspectRatio }}>
        {children}
      </div>
    </div>
  );
}
