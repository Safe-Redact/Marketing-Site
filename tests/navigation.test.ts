import assert from "node:assert/strict";
import test from "node:test";
import { demoHref, footerGroups, primaryNav } from "../src/content/navigation";
import { isCurrentPage, isRouteActive } from "../src/lib/nav";
import { marketingRoutes } from "../src/lib/marketing/site-routes";

const knownPaths = new Set<string>([...marketingRoutes().map((route) => route.path), "/blog"]);
const homepageAnchors = new Set(["services", "how-it-works", "why-saferedact", "industries", "faq", "demo-enquiry", "contact"]);

test("primary navigation follows the approved multipage model", () => {
  assert.deepEqual(
    primaryNav.map((item) => `${item.label}${item.kind === "menu" ? " ▾" : ""}`),
    ["Home", "Features ▾", "Industries ▾", "How It Works", "Insights", "Contact"]
  );
  const features = primaryNav.find((item) => item.kind === "menu" && item.id === "features");
  assert.ok(features && features.kind === "menu");
  assert.deepEqual(features.links.map((link) => link.label), ["All Features", "Document redaction", "Audio redaction", "Video redaction"]);
  assert.equal(demoHref, "/contact");
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
