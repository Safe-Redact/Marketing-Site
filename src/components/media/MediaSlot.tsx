import React, { type ReactNode } from "react";
import { mediaSlots, type MediaSlotId } from "@/content/media";
import { cn } from "@/lib/utils";

/**
 * A stable-aspect container for a diagram standing in for a product capture that has
 * not been approved yet. It is labelled as an illustration, records the asset-plan
 * slot it fills, and keeps the page layout unchanged when the capture arrives.
 */
export function MediaSlot({
  slot,
  aspectRatio,
  label = "Illustration",
  glow = "coral",
  className,
  children,
}: {
  slot: MediaSlotId;
  aspectRatio: string;
  label?: string;
  glow?: "coral" | "signal" | "none";
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={cn("media-frame", glow !== "none" && "media-glow", glow === "signal" && "media-glow-signal", className)}
      data-media-slot={slot}
      data-media-status="diagram"
      title={mediaSlots[slot]}
    >
      <div className="media-frame-screen bg-surface-raised" style={{ aspectRatio }}>
        {children}
        {/* Top-left is the one corner every diagram keeps free of labels at any width. */}
        <figcaption className="absolute left-2 top-2 rounded-full border border-line/70 bg-midnight/80 px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-fg-muted sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[0.625rem]">
          {label}
        </figcaption>
      </div>
    </figure>
  );
}
