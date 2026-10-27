import React from "react";
import type { FeatureMedia as FeatureMediaContent, FeatureSlug } from "@/lib/marketing/content";
import { FeatureVisual, featureVisuals } from "./FeatureVisual";

/**
 * A feature's primary visual, used in its hero and on /features. The content caption
 * describes the hero visual, so the overview placement shows the visual alone.
 */
export function FeatureMedia({
  slug,
  media,
  placement = "hero",
}: {
  slug: FeatureSlug;
  media: FeatureMediaContent;
  placement?: "hero" | "overview";
}) {
  const hero = placement === "hero";
  return (
    <figure className="m-0">
      <FeatureVisual visual={featureVisuals[slug][placement]} displayWidth={hero ? 1088 : 680} priority={hero} />
      {hero ? <figcaption className="type-meta mx-auto mt-4 max-w-2xl text-center leading-5">{media.caption}</figcaption> : null}
    </figure>
  );
}
