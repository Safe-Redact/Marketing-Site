import React, { type CSSProperties } from "react";
import Image from "next/image";
import { captures, type CaptureId, type Crop } from "@/content/media";
import { cn } from "@/lib/utils";

type Edge = "top" | "right" | "bottom" | "left";

/** Size and offset of the full capture, as percentages of a crop's frame. */
function placement(source: { width: number }, area: Crop) {
  return {
    scale: source.width / area.w,
    ratio: `${area.w} / ${area.h}`,
    width: `${(source.width / area.w) * 100}%`,
    left: `${(-area.x / area.w) * 100}%`,
    top: `${(-area.y / area.h) * 100}%`,
  };
}

/**
 * A focused crop of an approved product capture inside the shared media frame.
 * The crop is applied with CSS, so the frame reserves its aspect ratio before the
 * image loads (no layout shift) and no unapproved pixels are added. Edge fades are
 * presentation only: anything sensitive must already be absent from the capture.
 *
 * `mobileCrop` swaps in a second crop of the same file below 768px, where a wide
 * window crop is too small to read. Both crops come from one approved file, so the
 * swap needs no second download and cannot reveal anything the file does not contain.
 */
export function ProductShot({
  capture,
  crop,
  mobileCrop,
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
  mobileCrop?: string;
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
  const mobileArea = mobileCrop ? source.crops[mobileCrop] : area;
  if (!mobileArea) throw new Error(`Unknown crop ${mobileCrop} for ${capture}`);

  const wide = placement(source, area);
  const narrow = placement(source, mobileArea);
  const imageWidth = Math.round(displayWidth * wide.scale);
  const fadeStyle = Object.fromEntries(fade.map((edge) => [`--fade-${edge}`, "14%"]));
  // Below 768px the frame spans the viewport less its gutters.
  const sizes = [
    mobileCrop ? `(max-width: 767px) ${Math.round(100 * narrow.scale)}vw` : null,
    `(min-width: ${displayWidth + 64}px) ${imageWidth}px`,
    `${Math.round(100 * wide.scale)}vw`,
  ]
    .filter(Boolean)
    .join(", ");
  const geometry = {
    "--shot-ratio": wide.ratio,
    "--shot-w": wide.width,
    "--shot-x": wide.left,
    "--shot-y": wide.top,
    "--shot-ratio-sm": narrow.ratio,
    "--shot-w-sm": narrow.width,
    "--shot-x-sm": narrow.left,
    "--shot-y-sm": narrow.top,
  } as CSSProperties;

  const screen = (
    <div
      className={cn(
        // Unframed shots sit inside a frame of their own (AppWindow), which rounds them.
        frame ? "media-frame-screen" : "relative overflow-hidden",
        "aspect-[var(--shot-ratio-sm)] md:aspect-[var(--shot-ratio)]",
        fade.length > 0 && "edge-fade"
      )}
      style={{ ...geometry, ...fadeStyle }}
      data-capture={capture}
    >
      <Image
        src={`${source.src}?v=${source.revision}`}
        alt={alt}
        width={source.width}
        height={source.height}
        quality={92}
        priority={priority}
        sizes={sizes}
        className="absolute left-[var(--shot-x-sm)] top-[var(--shot-y-sm)] h-auto w-[var(--shot-w-sm)] max-w-none md:left-[var(--shot-x)] md:top-[var(--shot-y)] md:w-[var(--shot-w)]"
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
