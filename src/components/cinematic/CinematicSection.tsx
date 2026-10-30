import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./cinematic.module.css";

const rhythm = { hero: styles.sectionHero, lg: styles.sectionLg, md: styles.sectionMd, editorial: styles.sectionEditorial } as const;
const tones = { midnight: styles.sectionMidnight, graphite: styles.sectionGraphite, none: undefined } as const;

/**
 * Section wrapper that sets the Cinematic spacing rhythm and surface. Separation comes
 * from space and light rather than borders; decorative layers go inside as siblings.
 */
export function CinematicSection({
  size = "md",
  tone = "midnight",
  id,
  labelledBy,
  className,
  children,
}: {
  size?: keyof typeof rhythm;
  tone?: keyof typeof tones;
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(styles.section, rhythm[size], tones[tone], className)}>
      {children}
    </section>
  );
}
