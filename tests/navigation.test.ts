import assert from "node:assert/strict";
import test from "node:test";
import { demoHref, documentationLink, footerGroups, primaryNav } from "../src/content/navigation";
import { isCurrentPage, isRouteActive } from "../src/lib/nav";
import { marketingRoutes } from "../src/lib/marketing/site-routes";

// /pricing is listed in the sitemap directly rather than through the marketing registry.
const knownPaths = new Set<string>([...marketingRoutes().map((route) => route.path), "/blog", "/pricing"]);
const homepageAnchors = new Set(["services", "how-it-works", "why-saferedact", "industries", "faq", "demo-enquiry", "contact"]);

test("primary navigation follows the approved multipage model", () => {
  assert.deepEqual(
    primaryNav.map((item) => `${item.label}${item.kind === "menu" ? " ▾" : ""}`),
    ["Features ▾", "Industries ▾", "Resources ▾", "Pricing", "Blog"]
  );
  const menu = (id: string) => {
    const item = primaryNav.find((entry) => entry.kind === "menu" && entry.id === id);
    assert.ok(item && item.kind === "menu", id);
    return item;
  };
  // Only the marketed formats: no video or image redaction.
  assert.deepEqual(menu("features").links.map((link) => link.label), ["Features Overview", "Document Redaction", "Audio Redaction"]);
  // Documentation stays out until a published address is configured; no dead links.
  assert.equal(documentationLink, null);
  assert.deepEqual(menu("resources").links.map((link) => link.href), ["/how-it-works", "/why-openredakt"]);
  // Contact leaves the header but stays reachable from the footer; demo CTAs lead to /book-a-demo.
  assert.ok(!primaryNav.some((item) => item.href === "/contact"));
  assert.ok(footerGroups.some((group) => group.links.some((link) => link.href === "/contact")));
  assert.equal(demoHref, "/book-a-demo");
});

test("every navigation and footer destination resolves to a published route or homepage anchor", () => {
  const hrefs = [
    ...primaryNav.flatMap((item) => (item.kind === "menu" ? [item.href, ...item.links.map((link) => link.href), ...(item.footerLink ? [item.footerLink.href] : [])] : [item.href])),
    ...footerGroups.flatMap((group) => group.links.map((link) => link.href)),
    demoHref,
  ];
  for (const href of hrefs) {
    if (href.startsWith("#")) assert.ok(homepageAnchors.has(href.slice(1)), `${href} is not a preserved homepage anchor`);
    else assert.ok(knownPaths.has(href), `${href} is not a published route`);
  }
  const footerHrefs = footerGroups.flatMap((group) => group.links.map((link) => link.href));
  assert.equal(new Set(footerHrefs).size, footerHrefs.length, "footer links should not repeat");
});

test("section activity and exact current-page matching stay distinct", () => {
  assert.equal(isRouteActive("/features/audio-redaction", "/features"), true);
  assert.equal(isCurrentPage("/features/audio-redaction", "/features"), false);
  assert.equal(isCurrentPage("/features/", "/features"), true);
  assert.equal(isRouteActive("/industries/legal", "/industries"), true);
  assert.equal(isRouteActive("/", "/industries"), false);
  assert.equal(isRouteActive("/industries", "/"), false);
});
