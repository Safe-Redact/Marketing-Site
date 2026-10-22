export function resolveCmsSettings(
  environment?: Record<string, string | undefined>
): {
  enabled: boolean;
  siteOrigin: string;
  oauthBaseUrl: string;
  authEndpoint: string;
  repository: string;
  publishBranch: string;
  authScope: string;
};

export function buildCmsConfig(environment?: Record<string, string | undefined>): string;
