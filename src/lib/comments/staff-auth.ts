import type { StaffIdentity } from "./types";

/**
 * Server-side staff authorization for the moderation API.
 *
 * Decap's browser login does **not** authenticate this application. Decap stores a
 * GitHub user token in browser storage; that is a credential for github.com, not a
 * session here, and anything the browser sends is attacker-controllable. So the
 * token is verified server side on every privileged request: it is exchanged for an
 * identity at GitHub, that identity is checked against the staff allowlist, and
 * write access to the content repository is confirmed. Authority is never derived
 * from the request itself.
 *
 * This mirrors authorizeStaff in services/cms-oauth-broker/src/github.mjs rather
 * than inventing a second rule. The broker guards the login; this guards the API.
 */

const GITHUB_API_URL = "https://api.github.com";
const MAX_TOKEN_LENGTH = 1024;
const REQUEST_TIMEOUT_MS = 5000;
/** Verification costs two GitHub calls, so a result is reused briefly. */
const CACHE_TTL_MS = 60_000;

export interface StaffAuthSettings {
  allowedUserIds: ReadonlySet<number>;
  repository: string;
}

export class StaffAuthConfigurationError extends Error {}

export type AuthorizationResult =
  | { ok: true; staff: StaffIdentity }
  | { ok: false; reason: "unconfigured" | "missing" | "denied" };

export function readStaffAuthSettings(
  environment: Record<string, string | undefined>
): StaffAuthSettings | null {
  const rawIds = environment.COMMENTS_STAFF_GITHUB_USER_IDS?.trim();
  const repository = environment.CMS_GITHUB_REPOSITORY?.trim();
  if (!rawIds && !repository) return null;
  if (!rawIds || !repository) {
    throw new StaffAuthConfigurationError(
      "Moderation configuration error: COMMENTS_STAFF_GITHUB_USER_IDS and CMS_GITHUB_REPOSITORY must be set together."
    );
  }
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new StaffAuthConfigurationError(
      "Moderation configuration error: CMS_GITHUB_REPOSITORY must use owner/repository form."
    );
  }

  const allowedUserIds = new Set<number>();
  for (const entry of rawIds.split(",").map((part) => part.trim()).filter(Boolean)) {
    const id = Number(entry);
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new StaffAuthConfigurationError(
        "Moderation configuration error: staff entries must be positive GitHub user IDs, not logins."
      );
    }
    allowedUserIds.add(id);
  }
  if (!allowedUserIds.size) {
    throw new StaffAuthConfigurationError(
      "Moderation configuration error: COMMENTS_STAFF_GITHUB_USER_IDS must not be empty."
    );
  }

  return { allowedUserIds, repository };
}

/** Reads the bearer token without logging or returning it. */
export function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const [scheme, ...rest] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return null;
  const token = rest.join(" ").trim();
  if (!token || token.length > MAX_TOKEN_LENGTH) return null;
  return token;
}

interface CacheEntry {
  staff: StaffIdentity;
  expiresAt: number;
}

const verified = new Map<string, CacheEntry>();

/** Test seam: forget cached verifications. */
export function resetStaffAuthCache(): void {
  verified.clear();
}

async function githubJson(
  path: string,
  token: string,
  fetchImpl: typeof fetch
): Promise<Record<string, unknown>> {
  const response = await fetchImpl(`${GITHUB_API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "saferedact-comments-moderation",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
  return (await response.json()) as Record<string, unknown>;
}

export interface AuthorizeOptions {
  settings?: StaffAuthSettings | null;
  fetchImpl?: typeof fetch;
  now?: () => number;
}

/**
 * Verifies the caller is a staff member. Every failure is reported as the same
 * opaque "denied", so a caller cannot distinguish an unknown token from a known
 * token that lacks write access.
 */
export async function authorizeStaffRequest(
  request: Request,
  {
    settings = readStaffAuthSettings(process.env),
    fetchImpl = fetch,
    now = Date.now,
  }: AuthorizeOptions = {}
): Promise<AuthorizationResult> {
  if (!settings) return { ok: false, reason: "unconfigured" };

  const token = bearerToken(request);
  if (!token) return { ok: false, reason: "missing" };

  const cached = verified.get(token);
  if (cached && cached.expiresAt > now()) {
    return { ok: true, staff: cached.staff };
  }
  verified.delete(token);

  try {
    const user = await githubJson("/user", token, fetchImpl);
    const id = user.id;
    const login = user.login;
    if (
      !Number.isSafeInteger(id) ||
      !settings.allowedUserIds.has(id as number) ||
      typeof login !== "string" ||
      !login ||
      user.type !== "User"
    ) {
      return { ok: false, reason: "denied" };
    }

    // Allowlisted *and* still holding write access on the content repository, so
    // revoking access in GitHub revokes moderation without a deploy here.
    const repository = await githubJson(`/repos/${settings.repository}`, token, fetchImpl);
    const permissions = repository.permissions as { push?: unknown } | undefined;
    if (repository.full_name !== settings.repository || permissions?.push !== true) {
      return { ok: false, reason: "denied" };
    }

    const staff: StaffIdentity = { id: id as number, login };
    verified.set(token, { staff, expiresAt: now() + CACHE_TTL_MS });
    return { ok: true, staff };
  } catch {
    // A network failure must not be mistaken for authorization.
    return { ok: false, reason: "denied" };
  }
}
