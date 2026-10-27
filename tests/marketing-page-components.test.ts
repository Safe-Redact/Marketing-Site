import assert from "node:assert/strict";
import test from "node:test";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Breadcrumbs } from "../src/components/marketing/Breadcrumbs";
import { ContextualCta } from "../src/components/marketing/ContextualCta";
import { PageHero } from "../src/components/marketing/PageHero";
import { WorkflowSteps } from "../src/components/marketing/WorkflowSteps";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

test("the marketing hero owns one H1 and keeps media optional", () => {
  const markup = renderToStaticMarkup(
    createElement(PageHero, {
      eyebrow: "Document redaction",
      title: "Review sensitive information before release.",
      summary: "A review-led workflow.",
      primaryCta: { label: "Request a Demo", href: "/#demo-enquiry" },
      secondaryCta: { label: "Explore features", href: "/features" },
    })
  );

  assert.equal((markup.match(/<h1\b/g) ?? []).length, 1);
  assert.match(markup, /href="\/#demo-enquiry"/);
  assert.match(markup, /href="\/features"/);
  assert.doesNotMatch(markup, /<img\b/);
});

test("breadcrumbs and contextual CTA expose marketing-only destinations", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(Breadcrumbs, {
        items: [
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ],
      }),
      createElement(ContextualCta, {
        eyebrow: "Your workflow",
        title: "See the review path in context.",
        description: "Bring representative source formats to a guided conversation.",
      })
    )
  );

  assert.match(markup, /aria-label="Breadcrumb"/);
  assert.match(markup, /href="\/contact"/);
  assert.doesNotMatch(markup, /download|sign in|log in|free trial/i);
  assert.match(markup, /motion-reduce:transition-none/);
});

test("workflow steps form an ordered, screen-reader-readable sequence", () => {
  const markup = renderToStaticMarkup(
    createElement(WorkflowSteps, {
      steps: [
        { title: "Prepare", description: "Open a supported source." },
        { title: "Review", description: "Inspect every mark." },
        { title: "Check", description: "Inspect the output." },
      ],
    })
  );

  assert.match(markup, /<ol\b/);
  assert.equal((markup.match(/<li\b/g) ?? []).length, 3);
});

