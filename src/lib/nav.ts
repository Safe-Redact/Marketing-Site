/**
 * Whether a navigation link points at the route currently being viewed.
 *
 * Shared by the desktop header and the mobile menu so the two can never disagree
 * about what is active. A link matches its own route and anything nested beneath it
 * — `/blog` stays active on `/blog/<slug>` and `/blog/category/<slug>` — which is
 * what keeps Insights highlighted throughout the content hub.
 *
 * Query strings are not part of `usePathname()`, so a filtered view such as
 * `/blog?type=news` matches `/blog` and highlights the one hub link, not two.
 */
export function isRouteActive(pathname: string, href: string): boolean {
  if (href.startsWith("#")) return false;
  const path = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  return path === target || (target !== "/" && path.startsWith(`${target}/`));
}
