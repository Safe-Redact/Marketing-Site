import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HeroShell } from "../_components/HeroShell";
import { RedactionBarCanvas } from "../_components/RedactionBarCanvas";
import { StaticRedactionScene } from "../_components/StaticRedactionScene";

// Development-only route: the `.dev.tsx` extension is not compiled by production builds.
export const metadata: Metadata = {
  title: "Hero prototype A",
  robots: { index: false, follow: false },
};

export default function HeroPrototypeA() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroShell label="Prototype A · native canvas">
          <RedactionBarCanvas fallback={<StaticRedactionScene />} />
        </HeroShell>
      </main>
    </>
  );
}
