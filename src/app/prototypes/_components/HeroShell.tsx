import React, { type ReactNode } from "react";
import Link from "next/link";
import { AtmosphericGlow } from "@/components/cinematic/AtmosphericGlow";
import { CinematicHeading } from "@/components/cinematic/CinematicHeading";
import { SectionEyebrow } from "@/components/cinematic/SectionEyebrow";
import styles from "./prototypes.module.css";

/**
 * Proposed homepage hero copy and actions, shared by both prototypes so they are
 * compared on the visual alone. The H1 and CTAs are plain server-rendered HTML;
 * no animation carries meaning or blocks navigation.
 */
export function HeroShell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className={styles.hero} aria-labelledby="prototype-hero-heading">
      <AtmosphericGlow placement="top" grain />
      <div className={styles.heroInner}>
        <div className={styles.copy}>
          <SectionEyebrow tone="coral">Documents · Audio · Video</SectionEyebrow>
          <CinematicHeading as="h1" size="hero" id="prototype-hero-heading" lead="Precise redaction for documents, audio, and video." className={`mt-4 ${styles.title}`} />
          <p className={styles.lede}>
            Mark the passage, the time range, or the frame region. A reviewer confirms every decision, and the output is inspected before it is
            shared.
          </p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.primary}>
              Request a Demo
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link href="/features" className={styles.secondary}>
              Explore Features
            </Link>
          </div>
        </div>
        {children}
      </div>
      <p className={styles.devTag}>{label} · dev only</p>
    </section>
  );
}
