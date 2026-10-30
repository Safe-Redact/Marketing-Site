import { featuredIndustries, industryHref, liveIndustryPages } from "@/content/industries";
import { featureHref, publishedFeaturePages } from "@/content/features";

/** Every primary demo call to action leads here; /contact stays for general enquiries. */
export const demoHref = "/book-a-demo";

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

const featureNav: Record<string, { label: string; description: string; icon: string }> = {
  "document-redaction": { label: "Document Redaction", description: "PDFs, scanned pages, and office files", icon: "document" },
  "audio-redaction": { label: "Audio Redaction", description: "Waveform ranges and masking effects", icon: "audio" },
};

/**
 * Product documentation is planned but not yet published. Its menu entry is configured
 * here and appears only when a published address is supplied through
 * NEXT_PUBLIC_DOCUMENTATION_URL, so the public site never links to an empty page.
 */
const documentationUrl = process.env.NEXT_PUBLIC_DOCUMENTATION_URL?.trim() || null;

export const documentationLink: NavMenuLink | null = documentationUrl
  ? { label: "Documentation", href: documentationUrl, description: "Guides for the OpenRedakt desktop application", icon: "file-text" }
  : null;

const resourceLinks: readonly NavMenuLink[] = [
  { label: "How It Works", href: "/how-it-works", description: "The review lifecycle from source file to inspected output", icon: "layers" },
  { label: "Why OpenRedakt", href: "/why-openredakt", description: "Where the workflow fits, and its stated limits", icon: "shield-check" },
  ...(documentationLink ? [documentationLink] : []),
];

export const primaryNav: readonly PrimaryNavItem[] = [
  {
    kind: "menu",
    id: "features",
    label: "Features",
    href: "/features",
    links: [
      { label: "Features Overview", href: "/features", description: "One review workflow for documents and audio", icon: "layers" },
      ...publishedFeaturePages.map((page) => ({ ...featureNav[page.slug], href: featureHref(page.slug) })),
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
  {
    kind: "menu",
    id: "resources",
    label: "Resources",
    href: "/how-it-works",
    links: resourceLinks,
  },
  { kind: "link", label: "Pricing", href: "/pricing" },
  { kind: "link", label: "Blog", href: "/blog" },
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
      { label: "Features overview", href: "/features" },
      ...publishedFeaturePages.map((page) => ({ label: featureNav[page.slug].label, href: featureHref(page.slug) })),
      { label: "Pricing", href: "/pricing" },
      { label: "Platform overview", href: "#services" },
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
      { label: "How it works", href: "/how-it-works" },
      { label: "Why OpenRedakt", href: "/why-openredakt" },
      ...(documentationLink ? [{ label: documentationLink.label, href: documentationLink.href }] : []),
      { label: "Blog", href: "/blog" },
      { label: "Common questions", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Book a demo", href: demoHref },
      { label: "Contact", href: "/contact" },
    ],
  },
];
