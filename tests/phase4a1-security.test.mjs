import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("production dependency policy removes the unpatched gray-matter chain", async () => {
  const packageJson = JSON.parse(await read("package.json"));

  assert.equal(packageJson.dependencies["gray-matter"], undefined);
  assert.match(packageJson.dependencies.yaml, /^\^?2\./);
});

test("Next remains on the patched 15.x line and overrides its vulnerable PostCSS pin", async () => {
  const packageJson = JSON.parse(await read("package.json"));

  assert.match(packageJson.dependencies.next, /^\^?15\.5\.(?:2[7-9]|[3-9]\d)/);
  assert.match(packageJson.devDependencies["eslint-config-next"], /^\^?15\.5\.(?:2[7-9]|[3-9]\d)/);
  assert.match(packageJson.overrides?.next?.postcss ?? "", /^\^?8\.(?:5\.(?:2[3-9]|[3-9]\d)|[6-9]\.)/);
});

test("Next tracing root is explicitly bound to this application", async () => {
  const nextConfig = await read("next.config.ts");

  assert.match(nextConfig, /outputFileTracingRoot/);
  assert.match(nextConfig, /fileURLToPath\(import\.meta\.url\)/);
  assert.match(nextConfig, /frame-ancestors 'none'/);
  assert.match(nextConfig, /X-Frame-Options/);
});

test("Decap remains a GitHub editorial workflow with no embedded secret", async () => {
  const { buildCmsConfig } = await import("../scripts/render-cms-config.mjs");
  const config = buildCmsConfig({ CMS_ENABLED: "false" });

  assert.match(config, /name:\s*github/);
  assert.match(config, /repo:\s*Safe-Redact\/Marketing-Site/);
  assert.match(config, /publish_mode:\s*editorial_workflow/);
  assert.doesNotMatch(config, /(client_secret|access_token|private_key):/i);
});

test("the privileged CMS bundle is version-pinned and integrity-checked", async () => {
  const shell = await read("public/admin/index.html");

  assert.match(shell, /decap-cms@3\.17\.1/);
  assert.match(shell, /integrity="sha384-[A-Za-z0-9+/=]+"/);
  assert.match(shell, /crossorigin="anonymous"/);
});
