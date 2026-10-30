import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

// Development-only index of design prototypes. Not compiled by production builds.
export const metadata: Metadata = {
  title: "Design prototypes",
  robots: { index: false, follow: false },
};

const prototypes = [
  { href: "/prototypes/hero-a", name: "Hero A: native canvas", note: "Canvas 2D redaction bar moving between document, audio and video motifs. Asset-independent." },
  { href: "/prototypes/hero-b", name: "Hero B: layered media", note: "Real document capture with lighting, plus audio and video diagrams. CSS-only motion." },
];

export default function PrototypeIndex() {
  return (
    <main id="main-content" className="min-h-screen bg-midnight px-5 py-24 text-fg">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-coral">Development only</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold">Homepage hero prototypes</h1>
        <p className="mt-4 text-fg-muted">Both use the same copy and actions. Compare them at 1920, 1440, 768 and 390 widths, and with reduced motion enabled.</p>
        <ul className="mt-10 space-y-4">
          {prototypes.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block rounded-xl border border-line bg-graphite p-6 transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
                <span className="text-lg font-semibold">{item.name}</span>
                <span className="mt-2 block text-fg-muted">{item.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
