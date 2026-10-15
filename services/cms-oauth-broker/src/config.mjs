const repositoryPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const base64UrlKeyPattern = /^[A-Za-z0-9_-]{43}$/;

// decap-cms@3.17.1 discards backend.site_domain whenever the CMS is served from a
// localhost hostname and substitutes Netlify's demo identifier:
//
//   site_id: "localhost" === document.location.host.split(":")[0]
//     ? "demo.decapcms.org"
//     : this.props.siteId
//
// so a local editor presents this identifier and never the configured one. It is
// registered below as an alias of an allowed localhost origin, which means it exists
// only where the operator already allowlisted localhost and always resolves to that
// origin. A deployment whose allowlist holds no localhost origin still refuses it.
const decapLocalhostSiteId = "demo.decapcms.org";

function required(environment, name) {
  const value = environment[name];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`OAuth broker configuration error: ${name} is required.`);
  }
  return value.trim();
}

function exactHttpsOrigin(name, value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`OAuth broker configuration error: ${name} must be an exact credential-free HTTPS origin.`);
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash ||
    parsed.hostname.includes("*")
  ) {
    throw new Error(`OAuth broker configuration error: ${name} must be an exact credential-free HTTPS origin.`);
  }

  return parsed.origin;
}

function exactCallback(value, publicOrigin) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("OAuth broker configuration error: OAUTH_CALLBACK_URL must be the exact HTTPS callback.");
  }

  if (
    parsed.origin !== publicOrigin ||
    parsed.pathname !== "/callback" ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error("OAuth broker configuration error: OAUTH_CALLBACK_URL must equal the broker /callback URL.");
  }

  return parsed.href;
}

function commaSeparated(name, value) {
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) {
    throw new Error(`OAuth broker configuration error: ${name} must not be empty.`);
  }
  return parts;
}

function positiveInteger(name, value, { minimum, maximum }) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(
      `OAuth broker configuration error: ${name} must be an integer from ${minimum} to ${maximum}.`
    );
  }
  return parsed;
}

export function loadConfig(environment = {}) {
  for (const name of ["GITHUB_HOSTNAME", "GITHUB_API_URL", "GITHUB_OAUTH_HOST"]) {
    if (environment[name]?.trim()) {
      throw new Error("OAuth broker configuration error: custom GitHub hosts are not enabled.");
    }
  }

  const clientId = required(environment, "GITHUB_OAUTH_CLIENT_ID");
  const clientSecret = required(environment, "GITHUB_OAUTH_CLIENT_SECRET");
  if (/\s/.test(clientId) || /[\r\n]/.test(clientSecret)) {
    throw new Error("OAuth broker configuration error: GitHub OAuth credentials are malformed.");
  }

  const publicOrigin = exactHttpsOrigin(
    "OAUTH_PUBLIC_ORIGIN",
    required(environment, "OAUTH_PUBLIC_ORIGIN")
  );
  const callbackUrl = exactCallback(
    required(environment, "OAUTH_CALLBACK_URL"),
    publicOrigin
  );

  const allowedOrigins = new Set();
  const siteIdOrigins = new Map();
  for (const rawOrigin of commaSeparated(
    "OAUTH_ALLOWED_ORIGINS",
    required(environment, "OAUTH_ALLOWED_ORIGINS")
  )) {
    const allowedOrigin = exactHttpsOrigin("OAUTH_ALLOWED_ORIGINS", rawOrigin);
    if (allowedOrigins.has(allowedOrigin)) {
      throw new Error("OAuth broker configuration error: duplicate allowed origin.");
    }
    const parsedOrigin = new URL(allowedOrigin);
    const siteIds = [parsedOrigin.host];
    if (parsedOrigin.hostname === "localhost") {
      siteIds.push(decapLocalhostSiteId);
    }
    for (const siteId of siteIds) {
      if (siteIdOrigins.has(siteId)) {
        throw new Error("OAuth broker configuration error: duplicate allowed site identifier.");
      }
    }
    allowedOrigins.add(allowedOrigin);
    for (const siteId of siteIds) {
      siteIdOrigins.set(siteId, allowedOrigin);
    }
  }

  const repository = required(environment, "OAUTH_ALLOWED_REPOSITORY");
  if (!repositoryPattern.test(repository)) {
    throw new Error("OAuth broker configuration error: OAUTH_ALLOWED_REPOSITORY must use owner/repository form.");
  }

  const allowedGitHubUserIds = new Set();
  for (const value of commaSeparated(
    "OAUTH_ALLOWED_GITHUB_USER_IDS",
    required(environment, "OAUTH_ALLOWED_GITHUB_USER_IDS")
  )) {
    const userId = Number(value);
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new Error("OAuth broker configuration error: staff entries must be positive GitHub user IDs.");
    }
    if (allowedGitHubUserIds.has(userId)) {
      throw new Error("OAuth broker configuration error: duplicate GitHub user ID.");
    }
    allowedGitHubUserIds.add(userId);
  }

  const stateSecret = required(environment, "OAUTH_STATE_SECRET");
  if (!base64UrlKeyPattern.test(stateSecret)) {
    throw new Error("OAuth broker configuration error: OAUTH_STATE_SECRET must be a 32-byte base64url key.");
  }

  const scope = required(environment, "OAUTH_GITHUB_SCOPE");
  if (scope !== "public_repo") {
    throw new Error("OAuth broker configuration error: OAUTH_GITHUB_SCOPE must be exactly public_repo.");
  }

  const transactionTtlSeconds = positiveInteger(
    "OAUTH_TRANSACTION_TTL_SECONDS",
    environment.OAUTH_TRANSACTION_TTL_SECONDS?.trim() || "600",
    { minimum: 60, maximum: 600 }
  );
  const requestTimeoutMs = positiveInteger(
    "OAUTH_REQUEST_TIMEOUT_MS",
    environment.OAUTH_REQUEST_TIMEOUT_MS?.trim() || "5000",
    { minimum: 500, maximum: 10_000 }
  );
  const maxPendingTransactions = positiveInteger(
    "OAUTH_MAX_PENDING_TRANSACTIONS",
    environment.OAUTH_MAX_PENDING_TRANSACTIONS?.trim() || "1024",
    { minimum: 16, maximum: 100_000 }
  );

  return Object.freeze({
    clientId,
    clientSecret,
    publicOrigin,
    callbackUrl,
    allowedOrigins,
    siteIdOrigins,
    repository,
    allowedGitHubUserIds,
    stateSecret,
    scope,
    transactionTtlMs: transactionTtlSeconds * 1000,
    maxPendingTransactions,
    requestTimeoutMs,
    githubAuthorizeUrl: "https://github.com/login/oauth/authorize",
    githubTokenUrl: "https://github.com/login/oauth/access_token",
    githubApiUrl: "https://api.github.com",
  });
}
