import type { NavLink } from "@/types";

export const siteConfig = {
  name: "OpenRedakt",
  tagline: "AI-powered redaction software",
  description:
    "Windows redaction software with AI-assisted workflows for documents, images, audio, and video.",
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

export const navLinks: NavLink[] = [
  { label: "Capabilities", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Industries", href: "#industries" },
  { label: "Why OpenRedakt", href: "#why-saferedact" },
  { label: "Insights", href: "/blog" },
  { label: "FAQ", href: "#faq" },
];
