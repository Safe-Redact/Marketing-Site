import React from "react";
import Image from "next/image";
import { captures, type CaptureId } from "@/content/media";
import { cn } from "@/lib/utils";

type Edge = "top" | "right" | "bottom" | "left";

/**
 * A focused crop of an approved product capture inside the shared media frame.
 * The crop is applied with CSS, so the frame reserves its aspect ratio before the
 * image loads (no layout shift) and no unapproved pixels are added. Edge fades are
 * presentation only: anything sensitive must already be absent from the capture.
 */
export function ProductShot({
  capture,
  crop,
  alt,
  displayWidth,
  priority = false,
  glow = "coral",
  fade = [],
  frame = true,
  className,
}: {
  capture: CaptureId;
  crop: string;
  alt: string;
  /** Largest rendered width of the frame in CSS pixels; used to choose the image size. */
  displayWidth: number;
  priority?: boolean;
  glow?: "coral" | "signal" | "none";
  fade?: readonly Edge[];
  frame?: boolean;
  className?: string;
}) {
  const source = captures[capture];
  const area = source.crops[crop];
  if (!area) throw new Error(`Unknown crop ${crop} for ${capture}`);
  const scale = source.width / area.w;
  const imageWidth = Math.round(displayWidth * scale);
  const fadeStyle = Object.fromEntries(fade.map((edge) => [`--fade-${edge}`, "14%"]));

  const screen = (
    <div
      className={cn(frame ? "media-frame-screen" : "relative overflow-hidden rounded-[0.7rem]", fade.length > 0 && "edge-fade")}
      style={{ aspectRatio: `${area.w} / ${area.h}`, ...fadeStyle }}
      data-capture={capture}
    >
      <Image
        src={`${source.src}?v=${source.revision}`}
        alt={alt}
        width={source.width}
        height={source.height}
        quality={92}
        priority={priority}
        sizes={`(min-width: ${displayWidth + 64}px) ${imageWidth}px, ${Math.round(100 * scale)}vw`}
        className="absolute max-w-none"
        style={{
          width: `${scale * 100}%`,
          height: "auto",
          left: `${(-area.x / area.w) * 100}%`,
          top: `${(-area.y / area.h) * 100}%`,
        }}
      />
    </div>
  );

  if (!frame) return <div className={className}>{screen}</div>;
  return (
    <div className={cn("media-frame", glow !== "none" && "media-glow", glow === "signal" && "media-glow-signal", className)}>
      {screen}
    </div>
  );
}
