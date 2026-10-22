import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  DEFAULT_SHOWCASE_THEME,
  getShowcaseAspectRatio,
  resolveShowcaseScreenshot,
  selectShowcaseTheme,
  showcaseScreenshots,
  type ShowcaseScreenshotVariants,
} from "../src/components/visuals/showcase-screenshots";
import {
  ShowcaseThemeProvider,
  useShowcaseTheme,
} from "../src/components/visuals/ShowcaseThemeProvider";
import { ShowcaseThemeToggle } from "../src/components/visuals/ShowcaseThemeToggle";
import nextConfig from "../next.config";

const pairedFixture: ShowcaseScreenshotVariants = {
  dark: {
    src: "/dark.png",
    alt: "Dark product capture",
    width: 1200,
    height: 800,
  },
  light: {
    src: "/light.png",
    alt: "Light product capture",
    width: 1200,
    height: 800,
  },
};

test("the showcase defaults to the dark visual and resolves a genuine light pair", () => {
  assert.equal(DEFAULT_SHOWCASE_THEME, "dark");
  assert.equal(resolveShowcaseScreenshot(pairedFixture, "dark").src, "/dark.png");
  assert.equal(resolveShowcaseScreenshot(pairedFixture, "light").src, "/light.png");
});

test("a missing light capture cannot be selected or represented as a successful switch", () => {
  const darkOnly: ShowcaseScreenshotVariants = {
    dark: pairedFixture.dark,
    light: null,
  };

  assert.equal(selectShowcaseTheme("dark", "light", false), "dark");
  assert.equal(resolveShowcaseScreenshot(darkOnly, "light").src, "/dark.png");
});

test("theme changes retain the approved dark frame geometry", () => {
  const mismatchedPair: ShowcaseScreenshotVariants = {
    dark: pairedFixture.dark,
    light: { ...pairedFixture.light!, width: 900, height: 900 },
  };

  assert.equal(getShowcaseAspectRatio(mismatchedPair), "1200 / 800");
});

test("the current showcase registry records every product visual without claiming missing light captures", () => {
  assert.deepEqual(Object.keys(showcaseScreenshots), [
    "hero",
    "workflow-open",
    "workflow-review",
    "workflow-export",
    "format-document",
    "format-audio",
    "format-video",
  ]);

  for (const variants of Object.values(showcaseScreenshots)) {
    assert.match(variants.dark.src, /^\/images\/product\/.+\.png$/);
    assert.equal(variants.light, null);
  }
});

test("Next image optimization accepts versioned product captures at the showcase quality", () => {
  assert.deepEqual(nextConfig.images?.qualities, [92]);
  assert.deepEqual(nextConfig.images?.localPatterns, [{ pathname: "/images/product/**" }]);
});

function ThemeProbe({ name }: { name: string }) {
  const { theme } = useShowcaseTheme();
  return createElement("span", null, `${name}:${theme}`);
}

test("one provider gives every showcase consumer the same hydration-safe dark state", () => {
  const markup = renderToStaticMarkup(
    createElement(
      ShowcaseThemeProvider,
      null,
      createElement(ThemeProbe, { name: "hero" }),
      createElement(ThemeProbe, { name: "workflow" }),
      createElement(ThemeProbe, { name: "format" })
    )
  );

  assert.match(markup, /hero:dark/);
  assert.match(markup, /workflow:dark/);
  assert.match(markup, /format:dark/);
});

test("the segmented control exposes selection and disables unavailable light captures", () => {
  const markup = renderToStaticMarkup(
    createElement(
      ShowcaseThemeProvider,
      null,
      createElement(ShowcaseThemeToggle, { lightAvailable: false })
    )
  );

  assert.match(markup, /role="group"/);
  assert.match(markup, /aria-label="Product screenshot theme"/);
  assert.match(markup, /aria-pressed="true"[^>]*>Dark</);
  assert.match(markup, /aria-pressed="false"[^>]*disabled=""[^>]*>Light</);
  assert.match(markup, /Light screenshot not yet available/);
});

test("the workflow showcase keeps its toggle outside the screenshot and removes simulated file chrome", async () => {
  globalThis.React = (await import("react")).default;
  const { WorkflowPreview } = await import("../src/components/visuals/WorkflowPreview");
  const markup = renderToStaticMarkup(
    createElement(
      ShowcaseThemeProvider,
      null,
      createElement(WorkflowPreview, { activeIndex: 0 })
    )
  );

  assert.doesNotMatch(markup, /case-records\.pdf/);
  assert.doesNotMatch(markup, /Project review/);
  assert.doesNotMatch(markup, /Source ready/);
  assert.doesNotMatch(markup, /<figure class="[^"]*min-h-\[/);
  assert.match(markup, /data-showcase-theme-controls="true"[\s\S]*data-showcase-screenshot="true"/);
  assert.doesNotMatch(
    markup,
    /data-showcase-screenshot="true"[^>]*>[\s\S]*data-showcase-theme-controls="true"/
  );
  assert.match(markup, /data-showcase-screenshot="true"[\s\S]*Start in a project workspace/);
});

test("each format showcase renders its matching product screen without simulated file chrome", async () => {
  globalThis.React = (await import("react")).default;
  const { FormatPreview } = await import("../src/components/visuals/FormatPreview");
  const cases = [
    ["document", "format-documents.png", "1451 / 853"],
    ["audio", "format-audio.png", "1634 / 910"],
    ["video", "format-video.png", "1327 / 808"],
  ] as const;

  for (const [visual, filename, aspectRatio] of cases) {
    const markup = renderToStaticMarkup(
      createElement(
        ShowcaseThemeProvider,
        null,
        createElement(FormatPreview, { visual, fileLabel: "case-records.pdf" })
      )
    );

    assert.doesNotMatch(markup, /case-records\.pdf/);
    assert.doesNotMatch(markup, /Review workspace/);
    assert.doesNotMatch(markup, />Ready</i);
    assert.doesNotMatch(markup, /<figure class="[^"]*min-h-\[/);
    assert.match(markup, /data-showcase-theme-controls="true"[\s\S]*data-showcase-screenshot="true"/);
    assert.doesNotMatch(
      markup,
      /data-showcase-screenshot="true"[^>]*>[\s\S]*data-showcase-theme-controls="true"/
    );
    assert.match(markup, new RegExp(filename.replace(".", "\\.")));
    assert.match(markup, new RegExp(`aspect-ratio:${aspectRatio}`));

    const approvedAsset = readFileSync(
      path.join(process.cwd(), "public", "images", "product", filename)
    );
    const revision = createHash("sha256").update(approvedAsset).digest("hex").slice(0, 12);
    assert.match(
      markup,
      new RegExp(`v%3D${revision}`),
      `${filename} must carry a content-derived URL revision so an unchanged filename cannot serve a stale approved capture`
    );
  }
});
