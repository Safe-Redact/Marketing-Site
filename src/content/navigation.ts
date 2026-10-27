import { featuredIndustries, industryHref, liveIndustryPages } from "@/content/industries";
import { featureHref, publishedFeaturePages } from "@/content/features";

/** The single demo and contact destination for CTAs outside the homepage. */
export const demoHref = "/contact";

export type NavMenuLink = {
  label: string;
  href: string;
  description?: string;
  icon?: string;
};

export type PrimaryNavItem =
  | { kind: "link"; label: string; href: string }
  | {
      kind: "menu";
      id: string;
      label: string;
      /** Section root used for active-route indication. */
      href: string;
      links: readonly NavMenuLink[];
      footerLink?: NavMenuLink;
    };

const featureIcons: Record<string, string> = {
  "document-redaction": "document",
  "audio-redaction": "audio",
  "video-redaction": "video",
};

const featureMenuDescriptions: Record<string, string> = {
  "document-redaction": "PDFs, scans, images, and office files",
  "audio-redaction": "Waveform ranges and masking effects",
  "video-redaction": "Frame regions, timelines, and sound",
};

export const primaryNav: readonly PrimaryNavItem[] = [
  { kind: "link", label: "Home", href: "/" },
  {
    kind: "menu",
    id: "features",
    label: "Features",
    href: "/features",
    links: [
      { label: "All Features", href: "/features", description: "One review workflow across formats", icon: "layers" },
      ...publishedFeaturePages.map((page) => ({
        label: page.eyebrow,
        href: featureHref(page.slug),
        description: featureMenuDescriptions[page.slug],
        icon: featureIcons[page.slug],
      })),
    ],
  },
  {
    kind: "menu",
    id: "industries",
    label: "Industries",
    href: "/industries",
    links: featuredIndustries.map((page) => ({
      label: page.navLabel,
      href: industryHref(page.slug),
      description: page.hubSummary,
      icon: page.icon,
    })),
    footerLink: { label: "View All Industries", href: "/industries" },
  },
  { kind: "link", label: "How It Works", href: "/how-it-works" },
  { kind: "link", label: "Insights", href: "/blog" },
  { kind: "link", label: "Contact", href: "/contact" },
];

export type FooterGroup = { title: string; links: readonly NavMenuLink[] };

/**
 * Footer site map. Homepage section anchors (`#...`) stay discoverable here for inbound
 * links; they resolve to `/#...` away from the homepage.
 */
export const footerGroups: readonly FooterGroup[] = [
  {
    title: "Product",
    links: [
      { label: "All features", href: "/features" },
      ...publishedFeaturePages.map((page) => ({ label: page.eyebrow, href: featureHref(page.slug) })),
      { label: "How it works", href: "/how-it-works" },
      { label: "Why OpenRedakt", href: "/why-openredakt" },
    ],
  },
  {
    title: "Industries",
    links: [
      ...liveIndustryPages.map((page) => ({ label: page.navLabel, href: industryHref(page.slug) })),
      { label: "All industries", href: "/industries" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insights", href: "/blog" },
      { label: "Platform overview", href: "#services" },
      { label: "Common questions", href: "#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
