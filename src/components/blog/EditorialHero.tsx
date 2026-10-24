import React from "react";
import { Container } from "@/components/ui/Container";

export function EditorialHero() {
  return (
    <section className="blog-hero pt-[9.5rem] sm:pt-[10rem] lg:pt-[10.75rem]">
      <Container className="flex max-w-4xl flex-col items-center pb-14 text-center sm:pb-16 lg:pb-[4.5rem]">
        <h1 className="font-heading text-[clamp(3.75rem,7vw,6rem)] font-medium leading-none tracking-[-0.055em] text-white">
          Insights
        </h1>
        <p className="mt-5 max-w-[46rem] text-[clamp(1rem,1.5vw,1.125rem)] leading-7 text-ink-muted sm:leading-8">
          Practical guidance for teams reviewing sensitive information. Explore responsible approaches to document, audio, and video redaction—from identification through final verification.
        </p>
      </Container>
    </section>
  );
}
