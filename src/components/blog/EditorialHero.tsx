import React from "react";
import { Container } from "@/components/ui/Container";

export function EditorialHero() {
  return (
    <section className="blog-hero pt-[8.25rem] sm:pt-[9.25rem]">
      <Container className="flex max-w-4xl flex-col items-center pb-12 text-center sm:pb-14">
        <p className="type-eyebrow">OpenRedakt Insights</p>
        <h1 className="type-display mt-4">
          Insights
        </h1>
        <p className="type-lede mt-5 max-w-[44rem]">
          Practical guidance for teams reviewing sensitive information. Explore responsible approaches to document, audio, and video redaction—from identification through final verification.
        </p>
      </Container>
    </section>
  );
}
