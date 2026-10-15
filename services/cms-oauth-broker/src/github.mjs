const maximumProviderResponseBytes = 65_536;
const verifierPattern = /^[A-Za-z0-9._~-]{43,128}$/;

function genericFailure(message) {
  return new Error(message);
}

async function readJsonResponse(response) {
  if (!(response instanceof Response) || !response.ok) {
    throw new Error("Provider request was not successful.");
  }

  const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim();
  if (contentType !== "application/json") {
    throw new Error("Provider response was not JSON.");
  }

  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maximumProviderResponseBytes) {
    throw new Error("Provider response was too large.");
  }

  const body = await response.text();
  if (Buffer.byteLength(body, "utf8") > maximumProviderResponseBytes) {
    throw new Error("Provider response was too large.");
  }

  const parsed = JSON.parse(body);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Provider response was malformed.");
  }
  return parsed;
}

function githubRequest(url, { token, method = "GET", body, signal, accept } = {}) {
  const headers = new Headers({
    Accept: accept ?? "application/vnd.github+json",
    "User-Agent": "SafeRedact-CMS-OAuth-Broker",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (body) {
    headers.set("Content-Type", "application/x-www-form-urlencoded");
  }
  return new Request(url, { method, headers, body, signal });
}

export function buildAuthorizationUrl({ state, codeChallenge, config }) {
  const url = new URL(config.githubAuthorizeUrl);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.callbackUrl);
  url.searchParams.set("scope", config.scope);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url;
}

export async function exchangeCode({ code, codeVerifier, config, fetchImpl = fetch }) {
  try {
    if (typeof code !== "string" || !code || code.length > 512 || !verifierPattern.test(codeVerifier)) {
      throw new Error("Invalid exchange parameters.");
    }

    const body = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.callbackUrl,
      code_verifier: codeVerifier,
    });
    const response = await fetchImpl(githubRequest(config.githubTokenUrl, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(config.requestTimeoutMs),
      accept: "application/json",
    }));
    const payload = await readJsonResponse(response);
    const scopes = typeof payload.scope === "string"
      ? payload.scope.split(/[ ,]+/).filter(Boolean)
      : [];

    const expiresIn = Number(payload.expires_in);
    if (
      typeof payload.access_token !== "string" ||
      !payload.access_token ||
      payload.access_token.length > 1024 ||
      typeof payload.token_type !== "string" ||
      payload.token_type.toLowerCase() !== "bearer" ||
      scopes.length !== 1 ||
      scopes[0] !== config.scope ||
      !Number.isSafeInteger(expiresIn) ||
      expiresIn <= 0 ||
      expiresIn > 86_400
    ) {
      throw new Error("Invalid token response.");
    }

    return {
      accessToken: payload.access_token,
      expiresIn,
    };
  } catch {
    throw genericFailure("OAuth token exchange failed.");
  }
}

export async function authorizeStaff({ accessToken, config, fetchImpl = fetch }) {
  try {
    if (typeof accessToken !== "string" || !accessToken || accessToken.length > 1024) {
      throw new Error("Invalid access token.");
    }

    const request = async (path) => readJsonResponse(await fetchImpl(githubRequest(
      `${config.githubApiUrl}${path}`,
      { token: accessToken, signal: AbortSignal.timeout(config.requestTimeoutMs) }
    )));

    const user = await request("/user");
    if (
      !Number.isSafeInteger(user.id) ||
      !config.allowedGitHubUserIds.has(user.id) ||
      typeof user.login !== "string" ||
      !user.login ||
      user.type !== "User"
    ) {
      throw new Error("User is not authorized.");
    }

    const repository = await request(`/repos/${config.repository}`);
    if (repository.full_name !== config.repository || repository.permissions?.push !== true) {
      throw new Error("Repository write access is required.");
    }

    return { id: user.id, login: user.login };
  } catch {
    throw genericFailure("OAuth staff authorization failed.");
  }
}
