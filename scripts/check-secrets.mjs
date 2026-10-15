import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binaryExtensions = new Set([
  ".avif",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png",
  ".webp",
  ".woff",
  ".woff2",
]);

const secretPatterns = [
  {
    label: "private key",
    pattern: new RegExp(["-----BE", "GIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"].join(""), "g"),
  },
  {
    label: "GitHub fine-grained token",
    pattern: new RegExp(["\\bgithub", "_pat_[A-Za-z0-9_]{20,}\\b"].join(""), "g"),
  },
  {
    label: "GitHub token",
    pattern: new RegExp(["\\bgh", "[pousr]_[A-Za-z0-9]{30,}\\b"].join(""), "g"),
  },
  {
    label: "AWS access key",
    pattern: new RegExp(["\\b(?:AK", "IA|ASIA)[0-9A-Z]{16}\\b"].join(""), "g"),
  },
  {
    label: "Stripe live secret",
    pattern: new RegExp(["\\bsk_", "live_[A-Za-z0-9]{16,}\\b"].join(""), "g"),
  },
  {
    label: "Slack token",
    pattern: new RegExp(["\\bx", "ox[baprs]-[A-Za-z0-9-]{20,}\\b"].join(""), "g"),
  },
];

const forbiddenSecretFiles = [
  /(?:^|\/)\.env$/i,
  /(?:^|\/)\.env\.(?!example$)[^/]+$/i,
  /(?:^|\/)[^/]+\.(?:key|pem|p12|pfx)$/i,
  /(?:^|\/)\.npmrc$/i,
];

function listedFiles() {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: repositoryRoot }
  );
  return output
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map((file) => file.replaceAll("\\", "/"));
}

const findings = [];
const files = listedFiles();

for (const file of files) {
  if (forbiddenSecretFiles.some((pattern) => pattern.test(file))) {
    findings.push(`${file}: forbidden credential-bearing filename`);
    continue;
  }
  if (binaryExtensions.has(path.extname(file).toLowerCase())) {
    continue;
  }

  const absolutePath = path.join(repositoryRoot, file);
  let source;
  try {
    source = await readFile(absolutePath, "utf8");
  } catch {
    continue;
  }

  for (const { label, pattern } of secretPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(source)) {
      findings.push(`${file}: potential ${label}`);
    }
  }
}

if (findings.length) {
  console.error("Potential credentials or forbidden secret files detected:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log(`Secret-pattern check passed for ${files.length} repository files.`);
}
