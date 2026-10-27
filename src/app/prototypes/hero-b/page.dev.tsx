import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HeroShell } from "../_components/HeroShell";
import { LayeredMediaHero } from "../_components/LayeredMediaHero";

// Development-only route: the `.dev.tsx` extension is not compiled by production builds.
export const metadata: Metadata = {
  title: "Hero prototype B",
  robots: { index: false, follow: false },
};

export default function HeroPrototypeB() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroShell label="Prototype B · layered media">
          <LayeredMediaHero />
        </HeroShell>
      </main>
    </>
  );
}
