import { demoHref, primaryNav } from "@/content/navigation";
import { SiteHeader } from "./SiteHeader";

/**
 * Server boundary for the site header. Navigation is resolved here from the content
 * registries, so only the finished link list, not every page's copy, reaches the
 * client bundle.
 */
export function Header() {
  return <SiteHeader items={primaryNav} demoHref={demoHref} />;
}
