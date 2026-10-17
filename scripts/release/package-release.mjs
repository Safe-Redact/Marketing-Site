import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const nextDirectory = path.join(repositoryRoot, ".next");
const standaloneDirectory = path.join(nextDirectory, "standalone");
const releaseRoot = path.join(repositoryRoot, ".release");
const bundleDirectory = path.join(releaseRoot, "bundle");

function safeIdentity(value, label) {
  const normalized = value.trim();
  if (!/^[A-Za-z0-9._-]{1,160}$/.test(normalized)) {
    throw new Error(`${label} must use 1 to 160 letters, numbers, dots, underscores, or hyphens.`);
  }
  return normalized;
}

function currentCommit() {
  return execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  }).trim();
}

async function requireFile(filePath, label) {
  const details = await stat(filePath).catch(() => null);
  if (!details?.isFile()) throw new Error(`${label} is missing: ${filePath}`);
}

const commitSha = safeIdentity(process.env.RELEASE_COMMIT_SHA || currentCommit(), "Release commit SHA");
if (!/^[0-9a-f]{40}$/.test(commitSha)) throw new Error("Release commit SHA must be a full Git SHA.");
const buildIdentity = safeIdentity(
  process.env.RELEASE_BUILD_ID || `local-${Date.now()}`,
  "Release build identity"
);

await requireFile(path.join(standaloneDirectory, "server.js"), "Standalone Next.js server");
await requireFile(path.join(nextDirectory, "BUILD_ID"), "Next.js build identity");

await rm(bundleDirectory, { recursive: true, force: true });
await mkdir(bundleDirectory, { recursive: true });
await cp(standaloneDirectory, bundleDirectory, { recursive: true });
await mkdir(path.join(bundleDirectory, ".next"), { recursive: true });
await cp(path.join(nextDirectory, "static"), path.join(bundleDirectory, ".next", "static"), {
  recursive: true,
});
await cp(path.join(repositoryRoot, "public"), path.join(bundleDirectory, "public"), {
  recursive: true,
});

// A generated file would freeze deployment-specific OAuth coordinates into the
// artifact and shadow the runtime route. The release must remain portable.
const frozenCmsConfig = path.join(bundleDirectory, "public", "admin", "config.yml");
const frozenConfig = await stat(frozenCmsConfig).catch(() => null);
if (frozenConfig) throw new Error("Release contains a generated public/admin/config.yml.");

const nextBuildId = (await readFile(path.join(nextDirectory, "BUILD_ID"), "utf8")).trim();
const manifest = {
  schemaVersion: 1,
  application: "saferedact-marketing-site",
  commitSha,
  buildIdentity,
  nextBuildId,
  runtime: "nodejs22",
  startCommand: "node server.js",
  readinessPath: "/api/health",
  trafficSwitchContract: "blue-green-external-v1",
};

await writeFile(
  path.join(bundleDirectory, "release-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8"
);

console.log(`Packaged release ${buildIdentity} (${commitSha}) at ${bundleDirectory}`);
