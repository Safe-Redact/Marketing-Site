"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MotionControl, type MotionState } from "@/components/cinematic/MotionControl";
import { ProductFrame } from "@/components/cinematic/ProductFrame";
import { useMotionGate } from "@/components/cinematic/useMotionGate";
import { cn } from "@/lib/utils";
import styles from "./prototypes.module.css";

/**
 * Prototype B: a layered media treatment. The front plate is a real, approved product
 * capture (document-workspace.png, the masked light-theme workspace) shown as-is: only cropping,
 * framing and lighting are applied, and no marks are added to it. The audio and video
 * plates are clearly diagrammatic SVG because no approved captures exist for them yet.
 * All motion is a finite 13-second CSS sequence; JavaScript only pauses it.
 */
export function LayeredMediaHero() {
  const visualRef = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState<MotionState>("playing");
  const [run, setRun] = useState(0);
  const [userMotion, setUserMotion] = useState(false);
  const { active } = useMotionGate(visualRef);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setMotion("ended");
  }, []);

  const toggle = () => {
    setUserMotion(true);
    if (motion === "playing") setMotion("paused");
    else if (motion === "paused") setMotion("playing");
    else {
      setRun((value) => value + 1);
      setMotion("playing");
    }
  };

  const paused = motion === "paused" || (motion === "playing" && !active);

  return (
    <div ref={visualRef} className={styles.visual} data-paused={paused ? "true" : "false"} data-user-motion={userMotion ? "true" : undefined}>
      <div className={styles.stage}>
        <div aria-hidden="true" className={styles.stageGlow} />
        <div key={run} className={cn(styles.plates, styles.animate)} onAnimationEnd={(event) => {
          if (event.animationName.includes("carousel-D")) setMotion("ended");
        }}>
          <div className={cn(styles.plate, styles["pos-L"], styles.plateAudio)} aria-hidden="true">
            <ProductFrame aspectRatio="4 / 3" glow="signal">
              <AudioIllustration />
            </ProductFrame>
          </div>
          <div className={cn(styles.plate, styles["pos-R"], styles.plateVideo)} aria-hidden="true">
            <ProductFrame aspectRatio="4 / 3" glow="none">
              <VideoIllustration />
            </ProductFrame>
          </div>
          <div className={cn(styles.plate, styles["pos-C"], styles.plateDocument)}>
            <ProductFrame aspectRatio="4 / 3">
              <Image
                src="/images/product/document-workspace.png"
                alt="The OpenRedakt document workspace with no document open: manual redaction tools beside the page"
                width={1437}
                height={824}
                sizes="(min-width: 1120px) 1250px, 160vw"
                priority
                className={styles.capture}
              />
              <div aria-hidden="true" className={styles.spotlight} />
            </ProductFrame>
          </div>
        </div>
      </div>
      <p className="sr-only">
        A real OpenRedakt document review capture in front, with diagrams of an audio range and a video region behind it.
      </p>
      <div className={styles.legend}>
        <ol className={cn(styles.phases, styles.animate)} aria-label="Formats shown" key={`legend-${run}`}>
          <li className={cn(styles.phase, styles.phaseActive, styles.legendDocument)}>
            <span className={styles.phaseLabel}>Document</span>
            <span className={styles.phaseDetail}>Real capture</span>
          </li>
          <li className={cn(styles.phase, styles.legendAudio)}>
            <span className={styles.phaseLabel}>Audio</span>
            <span className={styles.phaseDetail}>Diagram</span>
          </li>
          <li className={cn(styles.phase, styles.legendVideo)}>
            <span className={styles.phaseLabel}>Video</span>
            <span className={styles.phaseDetail}>Diagram</span>
          </li>
        </ol>
        <MotionControl state={motion} onToggle={toggle} />
      </div>
    </div>
  );
}

function AudioIllustration() {
  const bars = Array.from({ length: 48 }, (_, i) => {
    const amp = 18 + Math.abs(Math.sin(i * 0.33) * 48 + Math.sin(i * 0.11 + 1) * 30);
    return { x: 40 + i * 6.8, amp, inRange: i >= 20 && i <= 30 };
  });
  return (
    <svg viewBox="0 0 400 300" className={styles.illustration} aria-hidden="true">
      <rect width="400" height="300" className={styles.illBg} />
      <rect x={40 + 20 * 6.8 - 6} y="52" width={10 * 6.8 + 12} height="196" rx="8" className={styles.illCoralSoft} />
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x - 1.6} y={150 - (bar.inRange ? 2 : bar.amp)} width="3.2" height={bar.inRange ? 4 : bar.amp * 2} rx="1.6" className={bar.inRange ? styles.illMuted : styles.illSignal} />
      ))}
      <rect x={40 + 20 * 6.8 - 7} y="52" width="2" height="196" className={styles.illCoral} />
      <rect x={40 + 30 * 6.8 + 5} y="52" width="2" height="196" className={styles.illCoral} />
    </svg>
  );
}

function VideoIllustration() {
  const blocks = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) blocks.push({ x: 232 + col * 14, y: 92 + row * 13, shade: (row * 7 + col * 3) % 3 });
  }
  return (
    <svg viewBox="0 0 400 300" className={styles.illustration} aria-hidden="true">
      <rect width="400" height="300" className={styles.illBg} />
      <rect x="40" y="36" width="320" height="180" rx="8" className={styles.illElevated} />
      <rect x="40" y="168" width="320" height="48" className={styles.illMidnight} />
      <rect x="62" y="96" width="46" height="72" className={styles.illLine} />
      <rect x="116" y="118" width="34" height="50" className={styles.illLine} />
      {blocks.map((block) => (
        <rect key={`${block.x}-${block.y}`} x={block.x} y={block.y} width="14" height="13" className={block.shade === 0 ? styles.illFg : block.shade === 1 ? styles.illMuted : styles.illLine} />
      ))}
      <rect x="226" y="86" width="96" height="64" rx="4" className={styles.illCoralStroke} />
      <rect x="40" y="244" width="320" height="6" rx="3" className={styles.illLine} />
      <rect x="174" y="242" width="84" height="10" rx="5" className={styles.illCoral} />
    </svg>
  );
}
