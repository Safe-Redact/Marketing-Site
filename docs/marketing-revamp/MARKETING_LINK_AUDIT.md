# Marketing Link Audit

## Scope and method

This audit covers active configuration, metadata, structured data, content modules, rendered homepage HTML, header and footer navigation, CTA components, generated sitemap content, and internal hash targets.

Active code is defined as the recursive local import graph starting from:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`

This separates public behavior from preserved, unimported legacy modules.

## Route classification

| Route or endpoint | Classification | Result |
| --- | --- | --- |
| `/` | Marketing-approved | Retained as the only public content page |
| `POST /api/contact` | Marketing-approved with limitation | Retained; validation and log-only behavior are disclosed |
| `/sitemap.xml` | Marketing-approved | Contains only `https://saferedact.io` |
| `/robots.txt` | Marketing-approved | Retained |
| Download or installer route | Application/distribution-specific | None exists; no destination is promoted |
| Login, portal, account, or dashboard route | Application-specific | None exists; no destination is promoted |
| Legal/privacy route | Requires review | No approved route or policy content exists; no placeholder link is shown |
| `/legacy` | Legacy archival content | Deliberately not created; Git commit `31a4305` is the archive |

## CTA migration

| Location | Previous active intent | Current destination | Status |
| --- | --- | --- | --- |
| Desktop header | Software download / conversion | Request a Demo → `#demo-enquiry`; Explore Platform → `#services` | Marketing-approved |
| Mobile header and menu | Software download / conversion | Request a Demo → `#demo-enquiry`; Explore Platform → `#services` | Marketing-approved |
| Hero | Download / product exploration | Request a Demo → `#demo-enquiry`; Explore Platform → `#services` | Marketing-approved |
| CTA panel | Download / contact | Request a Demo → `#demo-enquiry`; Direct Contact → `mailto:support@saferedact.io` | Marketing-approved |
| Footer | Download / contact | Request a Demo → `#demo-enquiry`; Direct contact → `mailto:support@saferedact.io` | Marketing-approved |
| FAQ | Download/get-started wording | Demo enquiry form or direct email | Marketing-approved |

`siteConfig.downloadUrl` was removed from active configuration. Active source and rendered HTML contain no download URL or download CTA label.

## Header and footer destinations

| Label | Destination | Target status |
| --- | --- | --- |
| SafeRedact home / Skip to content | `#main-content` | Present |
| Capabilities | `#services` | Present |
| How It Works | `#how-it-works` | Present |
| Industries / Use cases | `#industries` | Present |
| Why SafeRedact / format workflow links | `#why-saferedact` | Present |
| FAQ | `#faq` | Present |
| Request a Demo | `#demo-enquiry` | Present and labels the enquiry form region |
| Direct Contact | `mailto:support@saferedact.io` | Valid explicit mail action |

The rendered-link test enumerates every `href="#…"` target and verifies a matching element ID. No empty hash links remain.

## Metadata, structured data, and sitemap

- Canonical URLs in metadata and JSON-LD point to `https://saferedact.io`.
- The `SoftwareApplication` schema describes the Windows product but does not provide an install or download destination.
- Open Graph and Twitter metadata contain descriptive marketing copy only.
- `/sitemap.xml` publishes only the homepage and contains none of: `download`, `installer`, `login`, `portal`, or `dashboard`.

## Preserved inactive references

`src/content/software.ts` and `src/components/sections/SoftwareAlternative.tsx` retain historical distribution content for recovery and comparison. They are not reachable from the active homepage import graph, navigation, footer, CTA modules, metadata, structured data, or sitemap. Other inactive legacy section modules are likewise preserved without public routes.

## Contact workflow finding

The enquiry endpoint acknowledges validated submissions after logging them to the server console. It does not deliver email, create CRM records, or persist a lead. The interface discloses this before submission and offers `mailto:support@saferedact.io` when delivery matters. A production lead-delivery integration remains a separately authorized task.

## Verification evidence

Red/green testing was used:

1. The new marketing-only tests initially failed on the active download URL, missing `#demo-enquiry` anchor, and missing form-region labelling.
2. After the bounded migration, `tests/marketing-only.test.mjs` passed all four checks.
3. The full suite then identified two stale download expectations in earlier Phase 1/2 tests; those were changed to the approved marketing destinations and explicit download rejection.
4. The complete regression suite passed all 18 tests before final production verification.

Browser automation was not used because the existing Browser Use restriction prohibits the localhost operation. The rendered-HTML and endpoint checks use the independently executed Node test suite against the local server; they do not circumvent the browser restriction.
