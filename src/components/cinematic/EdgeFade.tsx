import React, { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./cinematic.module.css";

type Edge = "top" | "right" | "bottom" | "left";

/**
 * Fades the chosen edges of its content into the background with a CSS mask.
 * Presentation only: masked pixels are still in the DOM and in any image file.
 */
export function EdgeFade({
  edges,
  size = "12%",
  className,
  children,
}: {
  edges: readonly Edge[];
  size?: string;
  className?: string;
  children: ReactNode;
}) {
  const style = Object.fromEntries(edges.map((edge) => [`--fade-${edge}`, size])) as CSSProperties;
  return (
    <div className={cn(styles.edgeFade, className)} style={style}>
      {children}
    </div>
  );
}
