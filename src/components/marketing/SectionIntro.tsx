import React from "react";
import { cn } from "@/lib/utils";

// Coral leads; cyan stays restrained, so "cool" eyebrows read as neutral metadata.
const tones = {
  warm: "text-accent-warm",
  cool: "text-ink-muted",
  mint: "text-accent-mint",
} as const;

/**
 * Eyebrow, H2 and optional lede shared by the marketing sections. `continuation`
 * renders the muted second half of a two-tone heading inside the same H2.
 */
export function SectionIntro({
  eyebrow,
  title,
  continuation,
  description,
  tone = "warm",
  align = "start",
  id,
  className,
}: {
  eyebrow: string;
  title: string;
  continuation?: string;
  description?: string;
  tone?: keyof typeof tones;
  align?: "start" | "center";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("type-eyebrow", tones[tone])}>{eyebrow}</p>
      <h2 id={id} className={cn("type-h2 mt-4", align === "center" && "mx-auto")}>
        {title}
        {continuation ? (
          <>
            {" "}
            <span className="type-quiet">{continuation}</span>
          </>
        ) : null}
      </h2>
      {description ? <p className={cn("type-lede mt-5", align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl")}>{description}</p> : null}
    </div>
  );
}
