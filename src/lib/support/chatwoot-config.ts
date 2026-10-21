export interface ChatwootPublicConfig {
  baseUrl: string;
  websiteToken: string;
}

type PublicEnvironment = Record<string, string | undefined>;

const tokenPattern = /^[A-Za-z0-9_-]{16,128}$/;

/**
 * Resolves only the public coordinates needed by Chatwoot's website SDK.
 *
 * The website token identifies a public inbox and is necessarily sent to the
 * browser. Private Chatwoot API keys, admin tokens, and visitor identity data do
 * not belong in this configuration. Missing or malformed settings disable chat.
 */
export function resolveChatwootPublicConfig(
  environment: PublicEnvironment
): ChatwootPublicConfig | null {
  if (environment.OPENREDAKT_CHATWOOT_ENABLED !== "true") return null;

  const rawBaseUrl = environment.OPENREDAKT_CHATWOOT_BASE_URL?.trim();
  const websiteToken = environment.OPENREDAKT_CHATWOOT_WEBSITE_TOKEN?.trim();
  if (!rawBaseUrl || !websiteToken || !tokenPattern.test(websiteToken)) return null;

  try {
    const url = new URL(rawBaseUrl);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    return {
      baseUrl: url.origin,
      websiteToken,
    };
  } catch {
    return null;
  }
}

export function chatwootWebSocketOrigin(config: ChatwootPublicConfig) {
  return config.baseUrl.replace(/^https:/, "wss:");
}
