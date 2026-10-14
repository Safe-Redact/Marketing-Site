# SafeRedact Marketing-Only Architecture

## Decision

The public SafeRedact repository is a marketing website. It explains the production application, its verified workflows, and appropriate use cases; it does not distribute the application or act as an application portal.

The desktop product remains independently implemented in `M:\Safaridesk\redact`. No application code is imported, bundled, or served by this repository. Product copy may be checked against that codebase, but the two repositories remain technically separate.

## Active application surface

| Surface | Route | Classification | Purpose |
| --- | --- | --- | --- |
| Homepage | `/` | Marketing-approved | Product positioning, capabilities, workflow, use cases, FAQ, and enquiry conversion |
| Contact handler | `POST /api/contact` | Marketing-approved with delivery limitation | Validates an enquiry, writes it to the server log, and returns an acknowledgement |
| Sitemap | `/sitemap.xml` | Marketing-approved | Publishes only the canonical homepage |
| Robots policy | `/robots.txt` | Marketing-approved | Allows indexing and points crawlers to the sitemap |
| Framework fallback | implicit not-found response | Marketing-approved | Handles unknown routes; it is not promoted or added to the sitemap |

There are no active download, installer, login, portal, account, or dashboard routes.

## Public navigation and conversion contract

The active marketing destinations are:

| Action | Destination | Use |
| --- | --- | --- |
| Request a Demo | `#demo-enquiry` | Primary conversion action in the header, mobile navigation, hero, CTA panel, and footer |
| Explore Platform | `#services` | Secondary action in the header, mobile navigation, and hero |
| Direct Contact | `mailto:support@saferedact.io` | Explicit email fallback in the CTA panel and footer |

All other header and footer items point to rendered homepage sections. Empty hashes and dead internal targets are prohibited.

The `#demo-enquiry` region contains the enquiry heading and form. The form is labelled by `demo-enquiry-heading`; individual controls retain explicit `label`/`htmlFor` relationships, and submission status uses a live status region.

## Contact delivery boundary

`POST /api/contact` currently performs validation and writes accepted values to the server console. It does not send email, persist a lead, or create a CRM record. The form discloses this limitation before submission, and the acknowledgement says that the enquiry was accepted and logged locally.

The direct email link is the only presently configured delivery path. A real lead destination—email provider, CRM, database, or approved webhook—requires a separately authorized implementation and operational configuration.

## Content and data boundaries

- Active claims must describe capabilities verified in the SafeRedact application repository or approved product material.
- The marketing repository may render original React, CSS, and SVG product illustrations but must not import application components or business logic.
- Application installation instructions, executable links, login entry points, and portal controls are excluded from active imports and rendered HTML.
- Metadata may identify SafeRedact as Windows software. Describing the product is permitted; distributing it from this site is not.
- Unsupported performance, compliance, security, retention, confidentiality, customer, and integration claims remain prohibited.

## SEO and structured-data audit

The root metadata, Open Graph fields, Twitter fields, and `SoftwareApplication` JSON-LD describe the product and use only the canonical `https://saferedact.io` URL. They contain no download, installer, login, portal, or dashboard destinations. The generated sitemap contains only the canonical homepage.

No legal or privacy routes currently exist. They are not represented by placeholder links. Approved policy content and destinations are required before these links can be added.

## Enforcement

`tests/marketing-only.test.mjs` walks the local import graph from the page, layout, sitemap, and robots entrypoints. It rejects distribution URLs, active `downloadUrl` configuration, and download CTA labels. Rendered-HTML checks assert the three approved conversion destinations, validate every internal anchor, and confirm that the sitemap remains marketing-only.

Inactive legacy modules are outside the active import graph and are preserved for historical reference as described in `LEGACY_PRESERVATION_PLAN.md`.
