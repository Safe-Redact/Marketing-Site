import React from "react";
import type { CaptureId } from "@/content/media";
import { AppWindow } from "./AppWindow";
import { ProductShot } from "./ProductShot";

/**
 * The homepage's product-story visual: the capture in an application window, with no
 * backing panel. Every story uses a crop of the same ratio (1.396 on desktop, 4:5
 * on phones) in a column of the same width, so document and audio read as equals.
 */
export function ProductStoryVisual({
  capture,
  crop,
  mobileCrop,
  alt,
}: {
  capture: CaptureId;
  crop: string;
  mobileCrop: string;
  alt: string;
}) {
  return (
    <div data-story-visual={capture}>
      <AppWindow>
        <ProductShot capture={capture} crop={crop} mobileCrop={mobileCrop} alt={alt} displayWidth={680} frame={false} glow="none" />
      </AppWindow>
    </div>
  );
}
