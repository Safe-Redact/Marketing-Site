import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("phase 2 content is structured around verified product narratives", async () => {
  const platform = await read("src/content/platform.ts");
  const problem = await read("src/components/sections/ProblemStatement.tsx");

  for (const exportName of [
    "platformOutcomes",
    "platformCapabilities",
    "workflowSteps",
    "formatTabs",
    "useCaseGroups",
    "workbenchLabels",
    "workflowPreviewLabels",
  ]) {
    assert.match(platform, new RegExp(`export const ${exportName}`));
  }

  // The problem is stated once, editorially, in place of the old capability icon strip.
  assert.match(problem, /Information moves\./);
  assert.match(problem, /Risk follows\./);
  assert.doesNotMatch(platform, /guarantee|99%|HIPAA|GDPR|SOC 2|zero.retention/i);
});

test("homepage uses the cohesive phase 2 section sequence", async () => {
  const page = await read("src/app/page.tsx");

  for (const component of [
    "ProblemStatement",
    "Services",
    "HowItWorks",
    "WhySafeRedact",
    "Industries",
    "Faq",
  ]) {
    assert.match(page, new RegExp(`<${component} \\/>`));
  }
  // The shared footer's centered invitation closes the page; the split form section is gone.
  assert.doesNotMatch(page, /<FinalCta/);

  assert.doesNotMatch(page, /<WhyRedaction \/>|<QualitySecurity \/>|<SoftwareAlternative \/>|<TrustBar|<ReviewStatement/);
  // The blog is the last homepage section before the footer's invitation.
  assert.ok(page.indexOf("<InsightsPreview />") > page.indexOf("<Faq />"));
});

test("shared accordion exposes disclosure semantics and hides collapsed panels", async () => {
  const accordion = await read("src/components/ui/Accordion.tsx");

  assert.match(accordion, /aria-expanded=/);
  assert.match(accordion, /aria-controls=/);
  assert.match(accordion, /hidden=/);
  assert.match(accordion, /type="button"/);
});

test("migrated sections use the shared dark canvas and container", async () => {
  const files = await Promise.all(
    [
      "Services",
      "HowItWorks",
      "WhySafeRedact",
      "Industries",
      "Faq",
    ].map((name) => read(`src/components/sections/${name}.tsx`))
  );

  for (const source of files) {
    assert.match(source, /<Container/);
    assert.doesNotMatch(source, /(?:^|\s)bg-(?:white|surface-100)(?:\s|")/);
  }
});

test("footer contains only real destinations", async () => {
  const footer = await read("src/components/layout/Footer.tsx");

  assert.match(footer, /<Container/);
  assert.doesNotMatch(footer, /href="#"/);
  assert.match(footer, /mailto:/);
  assert.match(footer, /href={demoHref}/);
  assert.doesNotMatch(footer, /downloadUrl/);
});

test("anchored sections clear the fixed header", async () => {
  const globals = await read("src/app/globals.css");

  assert.match(globals, /section\[id\][^{]*\{[^}]*scroll-margin-top:/s);
});

test("document and audio stories share one product frame on the warm band", async () => {
  // 2026-10-30: both stories use ProductStoryVisual with the same 16:10 "story" crop,
  // so the audio window can no longer be a miniature beside a large document window.
  const section = await read("src/components/sections/WhySafeRedact.tsx");

  assert.match(section, /<ProductStoryVisual \{\.\.\.story\.visual\} \/>/);
  assert.equal((section.match(/crop: "story"/g) ?? []).length, 2);
  assert.match(section, /href: "\/features\/document-redaction"/);
  assert.match(section, /href: "\/features\/audio-redaction"/);
  assert.match(section, /aria-labelledby=\{`story-\$\{story\.id\}`\}/);
  // A bounded band: hairline dividers mark where it starts and ends.
  assert.match(section, /className="story-surface/);
});

test("homepage storytelling sections are light", async () => {
  for (const name of ["WhySafeRedact", "HowItWorks", "Services", "ProblemStatement"]) {
    const source = await read(`src/components/sections/${name}.tsx`);
    assert.doesNotMatch(source, /theme-dark/, name);
  }
});

test("contact form states the delivery outcome instead of assuming one", async () => {
  const content = await read("src/content/final-cta.ts");
  const section = await read("src/components/sections/FinalCta.tsx");

  assert.match(content, /deliveryNotice/);
  assert.match(section, /form\.deliveryNotice/);

  // Delivery is reported from the response, never asserted by the form itself, and
  // an undelivered enquiry must say so rather than implying it reached someone.
  assert.match(section, /result\.delivered/);
  assert.match(section, /has been delivered/i);
  assert.match(section, /delivery is not yet switched on, so nobody has received it/i);
  assert.doesNotMatch(content, /we will reply/i);
});

test("why OpenRedakt states only register-backed differentiators", async () => {
  const services = await read("src/components/sections/Services.tsx");
  // Only the published copy, not the source comments that list what is excluded.
  const reasons = services.slice(services.indexOf("const reasons = ["), services.indexOf("] as const;"));

  assert.equal((reasons.match(/^\s+title: "/gm) ?? []).length, 4);
  assert.doesNotMatch(reasons, /offline|certif|complian|guarantee|irreversib|\bframe\b|video/i);
});
