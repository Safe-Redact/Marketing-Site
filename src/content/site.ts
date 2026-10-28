export const siteConfig = {
  name: "OpenRedakt",
  tagline: "AI-powered redaction software",
  description:
    "Windows redaction software with AI-assisted workflows for documents and audio.",
  // Official OpenRedakt coordinates have not been approved yet. Keep the existing
  // working destinations explicit rather than presenting them as new-brand URLs.
  externalCoordinates: {
    status: "legacy-pending-migration" as const,
    url: "https://saferedact.io",
    email: "support@saferedact.io",
  },
};

export const publicSiteUrl = siteConfig.externalCoordinates.url;
export const publicSupportEmail = siteConfig.externalCoordinates.email;
