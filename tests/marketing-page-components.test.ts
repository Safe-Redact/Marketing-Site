import assert from "node:assert/strict";
import test from "node:test";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Breadcrumbs } from "../src/components/marketing/Breadcrumbs";
import { PageHero } from "../src/components/marketing/PageHero";
import { WorkflowSteps } from "../src/components/marketing/WorkflowSteps";
import { demoHref, footerGroups } from "../src/content/navigation";

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

test("breadcrumbs and the footer expose marketing-only destinations", () => {
  // The footer closes every page (the standalone pre-footer CTA was retired), so the
  // demo and contact destinations are asserted on its link registry.
  const markup = renderToStaticMarkup(
    createElement(Breadcrumbs, {
      items: [
        { name: "Home", path: "/" },
        { name: "Features", path: "/features" },
      ],
    })
  );
  const footerHrefs = footerGroups.flatMap((group) => group.links.map((link) => link.href));

  assert.match(markup, /aria-label="Breadcrumb"/);
  assert.equal(demoHref, "/book-a-demo");
  assert.ok(footerHrefs.includes("/book-a-demo"));
  assert.ok(footerHrefs.includes("/contact"));
  assert.doesNotMatch(JSON.stringify(footerGroups), /download|sign in|log in|free trial/i);
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

