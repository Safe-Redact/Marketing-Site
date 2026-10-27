import React from "react";
import { cn } from "@/lib/utils";
import styles from "./cinematic.module.css";

const sizes = { hero: styles.headingHero, display: styles.headingDisplay, section: styles.headingSection } as const;

/**
 * Heading with an optional muted continuation, read as one sentence. Both parts stay in
 * the heading's accessible name; the continuation colour meets AA on every Cinematic surface.
 */
export function CinematicHeading({
  as: Tag = "h2",
  size = "section",
  lead,
  continuation,
  id,
  className,
}: {
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof sizes;
  lead: string;
  continuation?: string;
  id?: string;
  className?: string;
}) {
  return (
    <Tag id={id} className={cn(styles.heading, sizes[size], className)}>
      {lead}
      {continuation ? (
        <>
          {" "}
          <span className={styles.headingContinuation}>{continuation}</span>
        </>
      ) : null}
    </Tag>
  );
}
