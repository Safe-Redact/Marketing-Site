import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { NextRequest } from "next/server";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { middleware } from "../src/middleware";
import { resolveChatwootPublicConfig } from "../src/lib/support/chatwoot-config";
import {
  createChatwootLoader,
  type ChatwootLoaderRuntime,
  type ScriptHandle,
} from "../src/lib/support/chatwoot-loader";

const validEnvironment = {
  OPENREDAKT_CHATWOOT_ENABLED: "true",
  OPENREDAKT_CHATWOOT_BASE_URL: "https://support.example.test",
  OPENREDAKT_CHATWOOT_WEBSITE_TOKEN: "public_website_token_123456",
};

test("Chatwoot configuration fails closed and accepts only an exact HTTPS origin", async () => {
  const resolve = resolveChatwootPublicConfig;
  assert.equal(resolve({}), null);
  assert.equal(resolve({ OPENREDAKT_CHATWOOT_ENABLED: "true" }), null);
  assert.equal(
    resolve({ ...validEnvironment, OPENREDAKT_CHATWOOT_BASE_URL: "http://support.example.test" }),
    null
  );
  assert.equal(
    resolve({ ...validEnvironment, OPENREDAKT_CHATWOOT_BASE_URL: "https://support.example.test/path" }),
    null
  );
  assert.deepEqual(resolve(validEnvironment), {
    baseUrl: "https://support.example.test",
    websiteToken: "public_website_token_123456",
  });
});

test("the Chatwoot loader is lazy and initializes one exact SDK script once", async () => {
  const scripts: ScriptHandle[] = [];
  const runCalls: unknown[] = [];
  let settings: unknown;
  const runtime: ChatwootLoaderRuntime = {
    findScript: () => scripts[0] ?? null,
    createScript: () => ({}) as ScriptHandle,
    appendScript: (script) => {
      scripts.push(script);
      queueMicrotask(() => {
        const onload = script.onload as ((event: Event) => void) | null;
        onload?.(new Event("load"));
      });
    },
    getSdk: () => ({ run: (config: unknown) => runCalls.push(config) }),
    setSettings: (value: unknown) => {
      settings = value;
    },
  };

  const loader = createChatwootLoader(runtime);
  assert.equal(scripts.length, 0, "the third-party script must not exist before activation");

  const first = loader.load(validEnvironment.OPENREDAKT_CHATWOOT_BASE_URL, validEnvironment.OPENREDAKT_CHATWOOT_WEBSITE_TOKEN);
  const second = loader.load(validEnvironment.OPENREDAKT_CHATWOOT_BASE_URL, validEnvironment.OPENREDAKT_CHATWOOT_WEBSITE_TOKEN);
  assert.equal(first, second, "concurrent activations must share one initialization");
  await first;

  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, "https://support.example.test/packs/js/sdk.js");
  assert.equal(scripts[0].id, "openredakt-chatwoot-sdk");
  assert.deepEqual(runCalls, [
    {
      baseUrl: "https://support.example.test",
      websiteToken: "public_website_token_123456",
    },
  ]);
  assert.deepEqual(settings, {
    hideMessageBubble: true,
    locale: "en",
    position: "right",
    useBrowserLanguage: false,
    enableFileUpload: false,
  });
});

test("the custom support launcher exposes accessible loading and fallback states", async () => {
  globalThis.React = (await import("react")).default;
  const { SupportChatLauncher } = await import(
    "../src/components/support/SupportChatLauncher"
  );

  const idle = renderToStaticMarkup(
    createElement(SupportChatLauncher, {
      status: "idle",
      onActivate: () => undefined,
      fallbackEmail: "support@saferedact.io",
    })
  );
  assert.match(idle, /aria-label="Open OpenRedakt support chat"/);
  assert.match(idle, />Chat with us</);

  const loading = renderToStaticMarkup(
    createElement(SupportChatLauncher, {
      status: "loading",
      onActivate: () => undefined,
      fallbackEmail: "support@saferedact.io",
    })
  );
  assert.match(loading, /aria-busy="true"/);
  assert.match(loading, /Loading support chat/);

  const error = renderToStaticMarkup(
    createElement(SupportChatLauncher, {
      status: "error",
      onActivate: () => undefined,
      fallbackEmail: "support@saferedact.io",
    })
  );
  assert.match(error, /role="status"/);
  assert.match(error, /Chat is unavailable/);
  assert.match(error, /mailto:support@saferedact\.io/);
});

test("the Insights launcher cannot cover editorial controls on tablet or mobile", () => {
  const stylesheet = readFileSync(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8"
  );

  assert.match(
    stylesheet,
    /@media \(max-width: 991px\)[\s\S]*?body:has\(main\[data-insights-page\]\) \[data-support-launcher\][\s\S]*?position: static !important/
  );
});

test("Chatwoot CSP allowances are exact, conditional, and never weaken core directives", () => {
  const previous = { ...process.env };
  Object.assign(process.env, validEnvironment, { NODE_ENV: "production" });
  try {
    const response = middleware(new NextRequest("https://marketing.example.test/"));
    const policy = response.headers.get("content-security-policy") ?? "";
    assert.match(policy, /script-src [^;]*https:\/\/support\.example\.test/);
    assert.match(policy, /connect-src [^;]*https:\/\/support\.example\.test[^;]*wss:\/\/support\.example\.test/);
    assert.match(policy, /frame-src https:\/\/support\.example\.test/);
    assert.match(policy, /style-src 'self'/);
    assert.doesNotMatch(policy, /style-src [^;]*'unsafe-inline'/);
    assert.match(policy, /object-src 'none'/);
    assert.match(policy, /frame-ancestors 'none'/);
    assert.doesNotMatch(policy, /https:\/\/\*/);
  } finally {
    for (const key of Object.keys(validEnvironment)) delete process.env[key];
    Object.assign(process.env, previous);
  }
});

test("the app supplies CSP-compatible positioning styles for the hosted Chatwoot holder", () => {
  const stylesheetUrl = new URL(
    "../src/components/support/chatwoot-widget.css",
    import.meta.url
  );
  assert.equal(
    existsSync(stylesheetUrl),
    true,
    "the SDK injects an inline stylesheet that strict CSP blocks, so holder styles must ship with the app"
  );

  const stylesheet = readFileSync(stylesheetUrl, "utf8");
  assert.match(stylesheet, /\.woot-widget-holder/);
  assert.match(stylesheet, /position:\s*fixed\s*!important/);
  assert.match(stylesheet, /\.woot--hide/);
  assert.match(stylesheet, /max-width:\s*667px/);
  assert.match(
    stylesheet,
    /max-width:\s*667px[\s\S]*\.woot-widget-holder\.woot-elements--right\s*{\s*right:\s*0/
  );

  const component = readFileSync(
    new URL("../src/app/layout.tsx", import.meta.url),
    "utf8"
  );
  assert.match(
    component,
    /import\s+["']@\/components\/support\/chatwoot-widget\.css["']/
  );
});
