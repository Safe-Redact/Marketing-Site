import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const bundleDirectory = path.join(repositoryRoot, ".release", "bundle");
const serverPath = path.join(bundleDirectory, "server.js");
const manifest = JSON.parse(
  await readFile(path.join(bundleDirectory, "release-manifest.json"), "utf8")
);

function availablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => error || !port ? reject(error || new Error("No port")) : resolve(port));
    });
  });
}

async function waitForReady(origin, processHandle) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (processHandle.exitCode !== null) {
      throw new Error(`Release process exited before readiness (${processHandle.exitCode}).`);
    }
    try {
      const response = await fetch(`${origin}/api/health`, { cache: "no-store" });
      if (response.ok) return response.json();
    } catch {
      // The candidate has not started listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for ${origin}.`);
}

function startRelease(port, releaseId) {
  const child = spawn(process.execPath, [serverPath], {
    cwd: bundleDirectory,
    env: {
      ...process.env,
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      SAFEREDACT_RELEASE_ID: releaseId,
      SAFEREDACT_COMMIT_SHA: manifest.commitSha,
      CMS_ENABLED: "false",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let diagnostics = "";
  child.stdout.on("data", (chunk) => { diagnostics += chunk.toString(); });
  child.stderr.on("data", (chunk) => { diagnostics += chunk.toString(); });
  return { child, diagnostics: () => diagnostics };
}

function createProxy(initialPort) {
  let activePort = initialPort;
  const server = http.createServer((request, response) => {
    const upstream = http.request({
      hostname: "127.0.0.1",
      port: activePort,
      path: request.url,
      method: request.method,
      headers: request.headers,
    }, (upstreamResponse) => {
      response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
      upstreamResponse.pipe(response);
    });
    upstream.on("error", () => {
      if (!response.headersSent) response.writeHead(502, { "content-type": "text/plain" });
      response.end("Upstream unavailable");
    });
    request.pipe(upstream);
  });
  return {
    server,
    switchTo(port) { activePort = port; },
  };
}

function closeServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

async function health(origin) {
  const response = await fetch(`${origin}/api/health`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Health check failed with ${response.status}.`);
  return response.json();
}

const [bluePort, greenPort, proxyPort] = await Promise.all([
  availablePort(),
  availablePort(),
  availablePort(),
]);
const blue = startRelease(bluePort, "blue-previous");
let green;
let proxy;

try {
  await waitForReady(`http://127.0.0.1:${bluePort}`, blue.child);
  proxy = createProxy(bluePort);
  await new Promise((resolve, reject) => {
    proxy.server.once("error", reject);
    proxy.server.listen(proxyPort, "127.0.0.1", resolve);
  });
  const publicOrigin = `http://127.0.0.1:${proxyPort}`;
  if ((await health(publicOrigin)).releaseId !== "blue-previous") {
    throw new Error("Proxy did not keep the previous release active.");
  }

  green = startRelease(greenPort, "green-candidate");
  // While the candidate starts, visitor traffic must still reach the previous release.
  if ((await health(publicOrigin)).releaseId !== "blue-previous") {
    throw new Error("Traffic changed before candidate readiness.");
  }
  await waitForReady(`http://127.0.0.1:${greenPort}`, green.child);

  proxy.switchTo(greenPort);
  if ((await health(publicOrigin)).releaseId !== "green-candidate") {
    throw new Error("Traffic did not switch to the ready candidate.");
  }

  const [article, insights, cmsConfig, cmsValidation] = await Promise.all([
    fetch(`${publicOrigin}/blog/understanding-document-redaction`),
    fetch(`${publicOrigin}/blog`),
    fetch(`${publicOrigin}/admin/config.yml`, { cache: "no-store" }),
    fetch(`${publicOrigin}/admin/editor-validation.js`),
  ]);
  const [insightsHtml, cmsConfigText] = await Promise.all([insights.text(), cmsConfig.text()]);
  if (!article.ok || !insights.ok || !insightsHtml.includes("Understanding Document Redaction")) {
    throw new Error("Published article acceptance failed on the candidate release.");
  }
  if (
    !cmsConfig.ok ||
    !cmsConfigText.includes("https://cms-auth.invalid") ||
    /client_secret|access_token/i.test(cmsConfigText) ||
    !cmsValidation.ok
  ) {
    throw new Error("Runtime CMS configuration did not remain portable and fail closed.");
  }

  const assetPath = /(?:src|href)="(\/_next\/static\/[^"]+)"/.exec(insightsHtml)?.[1];
  if (!assetPath || !(await fetch(`${publicOrigin}${assetPath}`)).ok) {
    throw new Error("Candidate static assets are unavailable after the traffic switch.");
  }

  proxy.switchTo(bluePort);
  if ((await health(publicOrigin)).releaseId !== "blue-previous") {
    throw new Error("Rollback did not restore the previous healthy release.");
  }

  console.log(JSON.stringify({
    contract: manifest.trafficSwitchContract,
    previousStayedAvailable: true,
    candidateReadinessPassed: true,
    trafficSwitchPassed: true,
    articleRoutePassed: true,
    insightsListingPassed: true,
    staticAssetsPassed: true,
    runtimeCmsConfigPassed: true,
    rollbackPassed: true,
  }));
} catch (error) {
  const diagnostics = [blue.diagnostics(), green?.diagnostics()].filter(Boolean).join("\n");
  if (diagnostics) console.error(diagnostics);
  throw error;
} finally {
  if (proxy) await closeServer(proxy.server);
  for (const processHandle of [green?.child, blue.child]) {
    if (processHandle && processHandle.exitCode === null) processHandle.kill("SIGTERM");
  }
}
