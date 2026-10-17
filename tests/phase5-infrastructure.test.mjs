import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("CI is read-only, SHA-pinned, complete, and contains no deployment path", async () => {
  const workflow = await read(".github/workflows/ci.yml");

  assert.match(workflow, /permissions:\s*\n\s+contents:\s*read/);
  assert.match(workflow, /pull_request:/);
  assert.doesNotMatch(workflow, /pull_request_target:/);
  assert.match(workflow, /actions\/checkout@[0-9a-f]{40}/);
  assert.match(workflow, /actions\/setup-node@[0-9a-f]{40}/);
  assert.match(workflow, /persist-credentials:\s*false/);

  for (const command of [
    "npm ci",
    "npm run typecheck",
    "npm run lint",
    "npm run build",
    "npm test",
    "npm audit --omit=dev",
    "npm run check:secrets",
    "git diff --check",
  ]) {
    assert.match(workflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(workflow, /\b(?:deploy|release|publish)\b.*(?:run:|uses:)/i);
  assert.doesNotMatch(workflow, /secrets\s*\.|NETLIFY_|VERCEL_|CLOUDFLARE_/i);
});

test("Decap source configuration is provider-neutral and generated from public deployment settings", async () => {
  const [template, renderer, shell, workflow] = await Promise.all([
    read("config/decap-cms.yml"),
    read("scripts/render-cms-config.mjs"),
    read("public/admin/index.html"),
    read(".github/workflows/ci.yml"),
  ]);

  assert.match(template, /name:\s*github/);
  assert.match(template, /publish_mode:\s*editorial_workflow/);
  assert.doesNotMatch(template, /https?:\/\/(?:[^/]+\.)?netlify\.(?:com|app)/i);
  assert.doesNotMatch(shell, /https?:\/\/(?:[^/]+\.)?netlify\.(?:com|app)/i);
  assert.doesNotMatch(workflow, /https?:\/\/(?:[^/]+\.)?netlify\.(?:com|app)/i);

  for (const variable of [
    "PUBLIC_SITE_ORIGIN",
    "CMS_OAUTH_PUBLIC_BASE_URL",
    "CMS_OAUTH_AUTH_ENDPOINT",
    "CMS_GITHUB_REPOSITORY",
    "CMS_PUBLISH_BRANCH",
    "CMS_AUTH_SCOPE",
    "CMS_ENABLED",
  ]) {
    assert.match(renderer, new RegExp(`\\b${variable}\\b`));
  }

  assert.doesNotMatch(renderer, /GITHUB_OAUTH_CLIENT_SECRET|OAUTH_STATE_SECRET|COMMENTS_DATABASE_SECRET/);
  assert.doesNotMatch(renderer, /NETLIFY_|api\.netlify\.com/i);
});

test("OAuth operational notes require exact callbacks and retain upstream provenance", async () => {
  const [readme, security, provenance] = await Promise.all([
    read("services/cms-oauth-broker/README.md"),
    read("services/cms-oauth-broker/SECURITY.md"),
    read("services/cms-oauth-broker/UPSTREAM.md"),
  ]);

  assert.match(readme, /exact HTTPS callback/i);
  assert.match(security, /wildcard matching must be disabled/i);
  assert.match(provenance, /not copied or deployed unchanged/i);
  assert.match(provenance, /33674be7ec77c1b771983650d979cae88160e093/);
});

test("obsolete phase documents are removed while root operations remain discoverable", async () => {
  const rootReadme = await read("README.md");

  await assert.rejects(read("docs/marketing-revamp/REPOSITORY_AUDIT.md"), /ENOENT/);
  for (const requirement of [
    "npm run comments:migrate",
    "pg_dump --format=custom",
    "npm run oauth:dev",
    "CMS_PUBLISH_BRANCH",
    "LEAD_DELIVERY_ENDPOINT",
    "TRUST_PROXY_HOPS",
  ]) {
    assert.match(rootReadme, new RegExp(requirement.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("the repository commit hook rejects unwanted Claude attribution trailers", async () => {
  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "saferedact-commit-hook-"));
  const messagePath = path.join(temporaryDirectory, "COMMIT_EDITMSG");
  try {
    await writeFile(messagePath, "Document release\n", "utf8");
    const accepted = spawnSync(
      "git",
      ["-c", "core.hooksPath=.githooks", "hook", "run", "commit-msg", "--", messagePath],
      { cwd: new URL("../", import.meta.url), encoding: "utf8" }
    );
    assert.equal(accepted.status, 0, accepted.stderr);

    await writeFile(
      messagePath,
      "Document release\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>\n",
      "utf8"
    );
    const rejected = spawnSync(
      "git",
      ["-c", "core.hooksPath=.githooks", "hook", "run", "commit-msg", "--", messagePath],
      { cwd: new URL("../", import.meta.url), encoding: "utf8" }
    );
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /AI attribution/i);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("CMS renderer fails closed and rejects unsafe deployment configuration", async () => {
  const { buildCmsConfig } = await import("../scripts/render-cms-config.mjs");

  const disabled = buildCmsConfig({ CMS_ENABLED: "false" });
  assert.match(disabled, /base_url:\s*https:\/\/cms-auth\.invalid/);
  assert.doesNotMatch(disabled, /api\.netlify\.com|client_secret|access_token/i);

  assert.throws(
    () =>
      buildCmsConfig({
        CMS_ENABLED: "true",
        PUBLIC_SITE_ORIGIN: "https://marketing.example",
      }),
    /CMS_OAUTH_PUBLIC_BASE_URL/
  );

  const valid = buildCmsConfig({
    CMS_ENABLED: "true",
    PUBLIC_SITE_ORIGIN: "https://marketing.example:7443",
    CMS_OAUTH_PUBLIC_BASE_URL: "https://auth.example",
    CMS_OAUTH_AUTH_ENDPOINT: "auth",
    CMS_GITHUB_REPOSITORY: "Safe-Redact/Marketing-Site",
    CMS_PUBLISH_BRANCH: "master",
    CMS_AUTH_SCOPE: "public_repo",
    GITHUB_OAUTH_CLIENT_SECRET: "must-not-be-rendered",
  });

  assert.match(valid, /base_url:\s*https:\/\/auth\.example/);
  assert.match(valid, /site_url:\s*https:\/\/marketing\.example:7443/);
  assert.match(valid, /site_domain:\s*marketing\.example:7443/);
  assert.doesNotMatch(valid, /must-not-be-rendered/);

  for (const unsafe of [
    { CMS_OAUTH_PUBLIC_BASE_URL: "http://auth.example" },
    { CMS_OAUTH_PUBLIC_BASE_URL: "https://user:password@auth.example" },
    { CMS_OAUTH_PUBLIC_BASE_URL: "https://auth.example/path" },
    { CMS_OAUTH_AUTH_ENDPOINT: "https://attacker.example/auth" },
    { CMS_GITHUB_REPOSITORY: "invalid repository" },
    { CMS_PUBLISH_BRANCH: "master; deploy" },
  ]) {
    assert.throws(
      () =>
        buildCmsConfig({
          CMS_ENABLED: "true",
          PUBLIC_SITE_ORIGIN: "https://marketing.example",
          CMS_OAUTH_PUBLIC_BASE_URL: "https://auth.example",
          CMS_OAUTH_AUTH_ENDPOINT: "auth",
          CMS_GITHUB_REPOSITORY: "Safe-Redact/Marketing-Site",
          CMS_PUBLISH_BRANCH: "master",
          CMS_AUTH_SCOPE: "public_repo",
          ...unsafe,
        }),
      /configuration|origin|endpoint|repository|branch/i
    );
  }
});

test("tracked secret scanner covers credential patterns and forbidden secret files", async () => {
  const [scanner, packageJsonText] = await Promise.all([
    read("scripts/check-secrets.mjs"),
    read("package.json"),
  ]);
  const packageJson = JSON.parse(packageJsonText);

  assert.match(scanner, /private key/i);
  assert.match(scanner, /GitHub fine-grained token/);
  assert.match(scanner, /AWS access key/);
  assert.match(scanner, /\.env/);
  assert.doesNotMatch(scanner, /excludedPatternDefinitionFiles/);
  assert.equal(packageJson.scripts["check:secrets"], "node scripts/check-secrets.mjs");
});

test("OAuth broker remains isolated, provider-neutral in deployment, and part of CI", async () => {
  const [workflow, packageJsonText, broker, popup, server] = await Promise.all([
    read(".github/workflows/ci.yml"),
    read("package.json"),
    read("services/cms-oauth-broker/src/broker.mjs"),
    read("services/cms-oauth-broker/src/popup.mjs"),
    read("services/cms-oauth-broker/src/server.mjs"),
  ]);
  const packageJson = JSON.parse(packageJsonText);
  const activeSource = `${broker}\n${popup}\n${server}`;

  assert.equal(packageJson.scripts["test:oauth"], "npm --prefix services/cms-oauth-broker test");
  assert.match(workflow, /npm --prefix services\/cms-oauth-broker ci/);
  assert.match(workflow, /npm --prefix services\/cms-oauth-broker audit --omit=dev/);
  assert.doesNotMatch(activeSource, /netlify\.(?:com|app)|NETLIFY_|vercel\.app|pages\.dev/i);
  assert.doesNotMatch(activeSource, /postMessage\([^;]+,\s*["']\*["']/);
  assert.doesNotMatch(activeSource, /\bgh[pousr]_[A-Za-z0-9]{20,}\b|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/);
});

test("the Decap eval exception is confined to the admin document policy", async () => {
  const [shell, nextConfig, middleware] = await Promise.all([
    read("public/admin/index.html"),
    read("next.config.ts"),
    read("src/middleware.ts"),
  ]);

  // No response header may ever grant eval: next.config.ts and src/middleware.ts are
  // the only header sources in this application, and the exception must not leak into
  // a route pattern or the per-request public policy.
  assert.doesNotMatch(nextConfig, /unsafe-eval/);
  assert.doesNotMatch(middleware, /unsafe-eval/);

  const policy = /http-equiv="Content-Security-Policy"[\s\S]*?content="([^"]+)"/.exec(shell)?.[1];
  assert.ok(policy, "the admin shell must declare a document-level CSP");

  // The document declares one policy, and grants eval exactly once inside it.
  // (Prose in the surrounding comment may name the directive; the policy may not
  // contain it twice, and no second meta policy may add another grant.)
  assert.equal((shell.match(/http-equiv="Content-Security-Policy"/g) ?? []).length, 1);
  assert.equal((policy.match(/'unsafe-eval'/g) ?? []).length, 1);
  const scriptSrc = /script-src ([^;]+)/.exec(policy)?.[1];
  assert.ok(scriptSrc?.includes("'unsafe-eval'"));
  assert.ok(scriptSrc.includes("'self'"));
  assert.ok(scriptSrc.includes("https://cdn.jsdelivr.net"));

  // Widening script-src any further is not part of this exception.
  assert.doesNotMatch(scriptSrc, /'unsafe-inline'|\*|data:/);

  // The rest of the admin policy stays closed, and the bundle stays pinned and verified.
  for (const directive of [
    "default-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-src 'none'",
    "connect-src 'self' blob: https://api.github.com",
  ]) {
    assert.ok(policy.includes(directive), `admin CSP must keep ${directive}`);
  }
  assert.match(shell, /decap-cms@3\.17\.1/);
  assert.match(shell, /integrity="sha384-[A-Za-z0-9+/=]+"/);
});

test("local environment files load through Node natively and add no dependency", async () => {
  const [packageJsonText, brokerPackageJsonText] = await Promise.all([
    read("package.json"),
    read("services/cms-oauth-broker/package.json"),
  ]);
  const packageJson = JSON.parse(packageJsonText);
  const brokerPackageJson = JSON.parse(brokerPackageJsonText);

  // The renderer can be checked locally with deployment coordinates, while the
  // application serves the public configuration dynamically at runtime.
  assert.match(packageJson.scripts["cms:config"], /^node --env-file-if-exists=\.env\.local /);
  assert.equal(
    packageJson.scripts["dev:https"],
    "node --env-file-if-exists=.env.local scripts/dev-https.mjs"
  );
  assert.equal(packageJson.scripts["predev:https"], "npm run content:validate");
  assert.equal(packageJson.scripts.prebuild, "npm run content:validate");
  assert.equal(packageJson.scripts.prestart, "npm run content:validate");
  assert.equal(packageJson.scripts["oauth:dev"], "npm --prefix services/cms-oauth-broker run dev");
  assert.equal(
    brokerPackageJson.scripts.dev,
    "node --env-file-if-exists=.env.local src/start.mjs"
  );

  // Deployment injects the broker environment directly, and the test suite must not
  // depend on a developer's local file, so neither entry point loads one.
  assert.equal(brokerPackageJson.scripts.start, "node src/start.mjs");
  assert.doesNotMatch(brokerPackageJson.scripts.test, /--env-file/);

  // The optional check profile is deterministic and tests never generate a static
  // file that could shadow the runtime route.
  assert.equal(packageJson.scripts["cms:config:test"], "node scripts/render-cms-config.mjs --disabled");
  for (const hook of ["pretest", "pretest:static", "pretest:content"]) {
    assert.equal(packageJson.scripts[hook], undefined);
  }

  for (const manifest of [packageJson, brokerPackageJson]) {
    assert.equal(manifest.dependencies?.dotenv, undefined);
    assert.equal(manifest.devDependencies?.dotenv, undefined);
  }
  assert.deepEqual(brokerPackageJson.dependencies ?? {}, {});
});

test("environment templates are placeholder-only and secret files cannot be tracked", async () => {
  const [gitignore, rootExample, brokerExample, launcher, renderer, start, config] =
    await Promise.all([
      read(".gitignore"),
      read(".env.example"),
      read("services/cms-oauth-broker/.env.example"),
      read("scripts/dev-https.mjs"),
      read("scripts/render-cms-config.mjs"),
      read("services/cms-oauth-broker/src/start.mjs"),
      read("services/cms-oauth-broker/src/config.mjs"),
    ]);

  // Slash-free patterns match at every depth, including the broker directory.
  for (const pattern of [".env.local", ".env.*.local", "*.pem", "*.key"]) {
    assert.ok(
      gitignore.split("\n").some((line) => line.trim() === pattern),
      `.gitignore must ignore ${pattern}`
    );
  }
  assert.match(gitignore, /^!\.env\.example$/m);

  // Templates carry placeholders only: no credential shapes, no real-looking values.
  for (const template of [rootExample, brokerExample]) {
    assert.doesNotMatch(template, /\bgh[pousr]_[A-Za-z0-9]{20,}\b|github_pat_|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/);
    assert.doesNotMatch(template, /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/);
  }
  assert.doesNotMatch(rootExample, /GITHUB_OAUTH_CLIENT_SECRET|OAUTH_STATE_SECRET/);
  assert.match(brokerExample, /^GITHUB_OAUTH_CLIENT_SECRET=replace-with-/m);
  assert.match(brokerExample, /^OAUTH_STATE_SECRET=replace-with-/m);

  // The broker still reads process.env only; the runtime flag loads the file.
  for (const source of [start, config]) {
    assert.doesNotMatch(source, /loadEnvFile|dotenv|\.env\.local/);
  }

  // The renderer's disabled profile ignores the ambient environment entirely.
  assert.match(renderer, /--disabled/);
  assert.match(renderer, /forceDisabled \? \{ CMS_ENABLED: "false" \} : process\.env/);

  // The launcher refuses the port drift that silently breaks the origin allowlist.
  assert.match(launcher, /PUBLIC_SITE_ORIGIN/);
  assert.match(launcher, /EADDRINUSE/);
  assert.doesNotMatch(launcher, /GITHUB_OAUTH_CLIENT_SECRET|OAUTH_STATE_SECRET/);
});

test("public routes are given a strict per-request policy that the admin block never sees", async () => {
  const [middleware, nextConfig] = await Promise.all([
    read("src/middleware.ts"),
    read("next.config.ts"),
  ]);

  // The App Router emits inline bootstrap and flight scripts whose contents change
  // with every build, so the policy is minted per request around a nonce rather than
  // declared statically. A random nonce, both header copies, and the closed
  // directives below are what make that safe.
  assert.match(middleware, /crypto\.getRandomValues/);
  assert.match(middleware, /`script-src 'self' 'nonce-\$\{nonce\}'`/);
  assert.match(middleware, /requestHeaders\.set\("content-security-policy", policy\)/);
  assert.match(middleware, /response\.headers\.set\("content-security-policy", policy\)/);

  for (const directive of [
    "default-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
  ]) {
    assert.ok(middleware.includes(`"${directive}"`), `the public policy must keep ${directive}`);
  }

  // Inline execution is granted nowhere, and the one inline-style allowance is bound
  // to the style attribute so <style> elements stay restricted to 'self'.
  assert.equal((middleware.match(/'unsafe-inline'/g) ?? []).length, 1);
  assert.deepEqual(middleware.match(/"[a-z-]+ 'unsafe-inline'"/g), ["\"style-src-attr 'unsafe-inline'\""]);

  // The Decap shell enforces its own document policy; a second enforced policy from
  // the middleware would intersect with it and break the editor.
  assert.match(middleware, /unprotectedPrefixes = \["\/admin"/);
  assert.match(middleware, /isUnprotected\(request\.nextUrl\.pathname\)/);

  // next.config.ts keeps the admin headers and declares no policy of its own for the
  // public routes, which would otherwise be enforced alongside the per-request one.
  assert.match(nextConfig, /source: "\/admin\/:path\*"/);
  assert.equal((nextConfig.match(/Content-Security-Policy/g) ?? []).length, 1);
  assert.doesNotMatch(nextConfig, /script-src|nonce/);
});

test("the pages that render inline scripts read the nonce, which keeps them out of the prerender", async () => {
  const [layout, article, helper] = await Promise.all([
    read("src/app/layout.tsx"),
    read("src/app/blog/[slug]/page.tsx"),
    read("src/lib/csp.ts"),
  ]);

  assert.match(helper, /headers\(\)/);
  assert.match(helper, /get\("x-nonce"\)/);

  for (const source of [layout, article]) {
    assert.match(source, /contentSecurityPolicyNonce/);
    assert.match(source, /<script[^>]*nonce=\{nonce\}/);
  }
  assert.match(layout, /export default async function RootLayout/);

  // Nothing below the root layout may be prerendered: a prerendered document would be
  // served with a freshly minted nonce in its header and none on its inline scripts.
  assert.match(layout, /export const dynamic = "force-dynamic"/);
});

test("the application owns its not-found page instead of Next's inline-styled default", async () => {
  const notFound = await read("src/app/not-found.tsx");

  // Next's built-in error page styles itself through an unnonced inline <style>
  // element, which is the one thing `style-src 'self'` blocks on the public site.
  assert.match(notFound, /export default function NotFound/);
  assert.match(notFound, /robots: \{ index: false, follow: false \}/);
  assert.doesNotMatch(notFound, /<style/);
});

test("the admin blob allowance is confined to the admin document", async () => {
  const [shell, middleware, nextConfig] = await Promise.all([
    read("public/admin/index.html"),
    read("src/middleware.ts"),
    read("next.config.ts"),
  ]);

  // The editor reads a selected media file back through fetch/XHR on the object URL
  // it minted for it, which connect-src governs. The allowance is same-document and
  // must never reach a response header or the public per-request policy.
  const policy = /http-equiv="Content-Security-Policy"[\s\S]*?content="([^"]+)"/.exec(shell)?.[1];
  const adminConnectSrc = /connect-src ([^;]+)/.exec(policy)?.[1];
  assert.ok(adminConnectSrc.includes("blob:"));
  assert.ok(adminConnectSrc.includes("'self'"));
  assert.ok(adminConnectSrc.includes("https://api.github.com"));

  // blob: buys the editor nothing beyond its own document: no wildcard, no scheme
  // that reaches the network, and no inline execution anywhere in the policy.
  assert.doesNotMatch(adminConnectSrc, /\*|http:|data:/);
  assert.doesNotMatch(/script-src ([^;]+)/.exec(policy)[1], /blob:/);
  assert.ok(policy.includes("default-src 'self'"));

  // The public policy keeps connect-src at 'self' exactly, and no header grants blob:.
  assert.match(middleware, /"connect-src 'self'"/);
  assert.doesNotMatch(middleware, /blob:/);
  assert.doesNotMatch(nextConfig, /blob:|connect-src/);
});
