import assert from "node:assert/strict";
import test from "node:test";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import tailwindConfig from "../tailwind.config";
import { Button } from "../src/components/ui/Button";
import { cn, customFontSizes } from "../src/lib/utils";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

const classSet = (value: string) => new Set(value.split(/\s+/).filter(Boolean));

test("custom font-size tokens and text colours both survive a merge, in either order", () => {
  assert.deepEqual(classSet(cn("text-body-sm", "text-white")), new Set(["text-body-sm", "text-white"]));
  assert.deepEqual(classSet(cn("text-white", "text-body-sm")), new Set(["text-white", "text-body-sm"]));
  assert.deepEqual(classSet(cn("text-caption text-ink-muted")), new Set(["text-caption", "text-ink-muted"]));
  assert.deepEqual(classSet(cn("text-display", "font-semibold", "text-ink")), new Set(["text-display", "font-semibold", "text-ink"]));
});

test("genuine conflicts still resolve to the last class", () => {
  assert.equal(cn("text-body-sm", "text-caption"), "text-caption");
  assert.equal(cn("text-display-sm", "text-display"), "text-display");
  assert.equal(cn("text-ink", "text-white"), "text-white");
  assert.equal(cn("text-sm", "text-body"), "text-body");
  assert.deepEqual(classSet(cn("text-sm text-white")), new Set(["text-sm", "text-white"]));
});

test("every custom font size in tailwind.config.ts is registered with the merge helper", () => {
  const configured = Object.keys(tailwindConfig.theme?.extend?.fontSize ?? {}).sort();
  assert.ok(configured.length > 0);
  assert.deepEqual([...customFontSizes].sort(), configured);
});

test("every Button variant and size keeps both its label colour and its font size", () => {
  const expectedColour = { primary: "text-canvas", secondary: "text-ink", ghost: "text-ink" } as const;
  const expectedSize = { sm: "text-body-sm", md: "text-body", lg: "text-body" } as const;

  for (const variant of ["primary", "secondary", "ghost"] as const) {
    for (const size of ["sm", "md", "lg"] as const) {
      const markup = renderToStaticMarkup(createElement(Button, { variant, size }, "Request a Demo"));
      const classes = classSet(/class="([^"]+)"/.exec(markup)?.[1] ?? "");
      assert.ok(classes.has(expectedColour[variant]), `${variant}/${size} lost ${expectedColour[variant]}`);
      assert.ok(classes.has(expectedSize[size]), `${variant}/${size} lost ${expectedSize[size]}`);
    }
  }

  const asChild = renderToStaticMarkup(
    createElement(Button, { variant: "primary", size: "sm", asChild: true }, createElement("a", { href: "/contact" }, "Request a Demo"))
  );
  assert.match(asChild, /<a [^>]*class="[^"]*\btext-canvas\b[^"]*\btext-body-sm\b/);
});
