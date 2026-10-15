import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");
const readOrEmpty = async (file) => {
  try {
    return await read(file);
  } catch (error) {
    if (error?.code === "ENOENT") return "";
    throw error;
  }
};

test("anchor scrolling keeps fixed-header clearance and disables smooth motion when requested", async () => {
  const globals = await read("src/app/globals.css");

  assert.match(globals, /scroll-behavior:\s*smooth/);
  assert.match(globals, /scroll-padding-top:\s*var\(--anchor-offset\)/);
  assert.match(globals, /(?:main|section|data-scroll-target)[^{]*\{[^}]*scroll-margin-top:\s*var\(--anchor-offset\)/s);
  assert.match(
    globals,
    /prefers-reduced-motion:\s*reduce[\s\S]*?html\s*\{[^}]*scroll-behavior:\s*auto/s
  );
});

test("scroll reveals are progressive, one-time, and safe without motion support", async () => {
  const [component, globals] = await Promise.all([
    read("src/components/ui/AnimateOnScroll.tsx"),
    read("src/app/globals.css"),
  ]);

  assert.match(component, /^"use client";/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /prefers-reduced-motion:\s*reduce/);
  assert.match(component, /observer\.unobserve\(node\)/);
  assert.match(component, /data-reveal-ready/);
  assert.match(component, /data-revealed/);
  assert.doesNotMatch(component, /opacity-0|translate-y-/);
  assert.match(globals, /\.reveal-on-scroll\s*\{[^}]*opacity:\s*1/s);
  assert.match(
    globals,
    /data-reveal-ready="true"[^}]*:not\(\[data-revealed="true"\]\)[^{]*\{[^}]*opacity:\s*0/s
  );
});

test("active section navigation is accessible and never rewrites URL history", async () => {
  const [header, mobileNav, hook] = await Promise.all([
    read("src/components/layout/Header.tsx"),
    read("src/components/layout/MobileNav.tsx"),
    readOrEmpty("src/hooks/useActiveSection.ts"),
  ]);

  assert.match(header, /aria-current=\{activeHref === link\.href \? "location" : undefined\}/);
  assert.match(mobileNav, /aria-current=\{activeHref === link\.href \? "location" : undefined\}/);
  assert.match(hook, /requestAnimationFrame/);
  assert.match(hook, /addEventListener\("scroll"[^\n]*passive:\s*true/);
  assert.doesNotMatch(hook, /history\.(?:pushState|replaceState)|location\.hash\s*=/);
});

test("modal mobile navigation makes every outside landmark inert while open", async () => {
  const mobileNav = await read("src/components/layout/MobileNav.tsx");

  assert.match(mobileNav, /querySelectorAll<HTMLElement>\("header, main, footer"\)/);
  assert.match(mobileNav, /setAttribute\("inert",\s*""\)/);
  assert.match(mobileNav, /removeAttribute\("inert"\)/);
  assert.match(mobileNav, /aria-modal="true"/);
});

test("contact form exposes native autofill and submission state semantics", async () => {
  const section = await read("src/components/sections/FinalCta.tsx");

  assert.match(section, /aria-busy=\{isSubmitting\}/);
  assert.match(section, /autoComplete="name"/);
  assert.match(section, /autoComplete="email"/);
  assert.match(section, /autoComplete="organization"/);
  // The honeypot must stay out of the tab order and the accessibility tree, or it
  // becomes a trap for keyboard and screen-reader users rather than for bots.
  assert.match(section, /aria-hidden="true"[\s\S]{0,120}htmlFor="website"/);
  assert.match(section, /id="website"[\s\S]{0,120}tabIndex=\{-1\}/);
  assert.match(section, /autoComplete="off"/);
});

test("submission status persists across form replacement and success receives focus", async () => {
  const section = await read("src/components/sections/FinalCta.tsx");
  const statusMatches = section.match(/id="contact-form-status"/g) ?? [];

  assert.equal(statusMatches.length, 1);
  assert.ok(
    section.indexOf('id="contact-form-status"') < section.indexOf("{isSubmitted ? ("),
    "the live region must remain mounted outside the conditional form state"
  );
  assert.match(section, /successHeadingRef\.current\?\.focus\(\)/);
  assert.match(section, /ref=\{successHeadingRef\}[^>]*tabIndex=\{-1\}/);
});

test("shared actions provide restrained feedback and mobile motion remains optional", async () => {
  const [button, mobileNav, tailwind] = await Promise.all([
    read("src/components/ui/Button.tsx"),
    read("src/components/layout/MobileNav.tsx"),
    read("tailwind.config.ts"),
  ]);

  assert.match(button, /motion-safe:hover:-translate-y-0\.5/);
  assert.match(button, /motion-safe:active:scale-\[0\.99\]/);
  assert.match(mobileNav, /motion-safe:animate-fade-in/);
  assert.match(mobileNav, /overscroll-contain/);
  assert.match(tailwind, /"fade-in-up":\s*"fade-in-up 0\.45s/);
  assert.match(tailwind, /"fade-in":\s*"fade-in 0\.3s/);
});

test("metadata declares a canonical homepage without adding speculative social assets", async () => {
  const layout = await read("src/app/layout.tsx");

  assert.match(layout, /alternates:\s*\{\s*canonical:\s*"\/"/s);
  assert.doesNotMatch(layout, /images:\s*\[/);
});

test("phase 3 uses no scroll or animation package", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  const packages = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  for (const dependency of ["lenis", "gsap", "framer-motion", "motion"]) {
    assert.equal(packages[dependency], undefined);
  }
});
