import { publicSiteUrl } from "@/content/site";

export type BreadcrumbItem = {
  name: string;
  path: `/${string}` | "/";
};

export function buildBreadcrumbJsonLd(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: new URL(item.path, `${publicSiteUrl}/`).toString(),
    })),
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

