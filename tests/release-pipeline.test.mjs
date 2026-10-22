import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

test("pull-request validation and master release packaging are separate least-privilege workflows", async () => {
  const releasePath = path.join(repositoryRoot, ".github", "workflows", "release.yml");
  assert.ok(existsSync(releasePath), "the production release workflow must exist");

  const [ciText, releaseText] = await Promise.all([
    read(".github/workflows/ci.yml"),
    read(".github/workflows/release.yml"),
  ]);
  const ci = YAML.parse(ciText);
  const release = YAML.parse(releaseText);

  assert.ok(ci.on.pull_request);
  assert.ok(Object.hasOwn(ci.on, "workflow_dispatch"));
  assert.equal(ci.on.pull_request_target, undefined);
  assert.equal(ci.on.push, undefined, "PR validation must not deploy or package merged releases");
  assert.doesNotMatch(
    ciText,
    /github\.event\.before/,
    "manual CI cannot depend on a push-only before SHA"
  );

  assert.deepEqual(release.on.push.branches, ["master"]);
  assert.deepEqual(release.permissions, { contents: "read" });
  assert.equal(release.concurrency["cancel-in-progress"], false);
  const uploadStep = release.jobs["validate-package"].steps.find(
    (step) => typeof step.uses === "string" && step.uses.startsWith("actions/upload-artifact@")
  );
  assert.equal(uploadStep.with["include-hidden-files"], true, "the .next runtime must be packaged");

  const serialized = JSON.stringify(release);
  for (const command of [
    "npm ci",
    "npm run content:validate",
    "npm run typecheck",
    "npm run lint",
    "npm test",
    "npm run check:secrets",
    "npm audit --omit=dev",
    "npm run build",
    "npm run release:package",
  ]) {
    assert.match(serialized, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(serialized, /NETLIFY|VERCEL|deploy-hook|ssh|kubectl/i);
});

test("the production build emits a portable standalone artifact with an immutable identity", async () => {
  const [nextConfig, packageJsonText] = await Promise.all([
    read("next.config.ts"),
    read("package.json"),
  ]);
  const packageJson = JSON.parse(packageJsonText);

  assert.match(nextConfig, /output:\s*["']standalone["']/);
  assert.equal(packageJson.scripts["content:validate"], "tsx scripts/validate-content.ts");
  assert.equal(packageJson.scripts["release:package"], "node scripts/release/package-release.mjs");
  assert.equal(packageJson.scripts["release:verify"], "node scripts/release/verify-blue-green.mjs");
  assert.ok(existsSync(path.join(repositoryRoot, "scripts", "release", "package-release.mjs")));
  assert.ok(existsSync(path.join(repositoryRoot, "scripts", "release", "verify-blue-green.mjs")));
});

test("runtime health and CMS configuration remain host-neutral and fail closed", async () => {
  const [health, cmsRoute, template] = await Promise.all([
    read("src/app/api/health/route.ts"),
    read("src/app/admin/config.yml/route.ts"),
    read("config/decap-cms.yml"),
  ]);

  assert.match(health, /SAFEREDACT_RELEASE_ID/);
  assert.match(health, /SAFEREDACT_COMMIT_SHA/);
  assert.match(health, /no-store/i);
  assert.match(cmsRoute, /buildCmsConfig/);
  assert.match(template, /publish_mode:\s*editorial_workflow/);
  assert.doesNotMatch(`${health}\n${cmsRoute}\n${template}`, /netlify|vercel|pages\.dev/i);
});
