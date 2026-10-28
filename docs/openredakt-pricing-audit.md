# OpenRedakt Marketing Product-Scope and Pricing Audit

Audit date: 28 October 2026

## Result

The public product story now presents only the two approved formats: document redaction and audio redaction. Image and video entitlement flags remain an internal implementation detail and are not marketed as available capabilities.

The application is a homepage-led Next.js site rather than a collection of public `/features/*` or `/industries/*` routes. The only public product pages currently generated are `/`, `/pricing`, the blog routes, and supporting system pages. There were therefore no live image/video feature-detail URLs to redirect. Adding speculative redirects would create misleading route semantics, so none were introduced.

## Public-claim disposition

| Surface | Previous issue | Disposition | Final treatment |
| --- | --- | --- | --- |
| Homepage hero and trust bar | Broad multi-format language could imply unfinished formats. | Rewritten | Names documents and audio explicitly. |
| Capabilities/services section | Included three-format/image/video-oriented presentation. | Rewritten | Deliberate two-format presentation for documents and audio. |
| Product workflow and quality copy | Used format-generic language that could be read as covering every media type. | Rewritten | Describes supported document and audio workflows without claiming identical behavior. |
| Software alternative and reasons-to-choose sections | Contained broad workflow claims. | Rewritten | Keeps the Windows desktop and review value proposition while scoping formats. |
| FAQ and final CTA | Could invite unsupported media enquiries as if they were current products. | Rewritten | Guides visitors toward document/audio source formats and review needs. |
| Main navigation and mobile navigation | Had no commercial destination. | Extended | Adds `/pricing`; no image/video discovery links remain. |
| Footer | Product description and platform links did not expose pricing clearly. | Rewritten | Names documents/audio and adds Pricing. |
| Metadata and structured data | Product descriptions were broader than the approved scope. | Rewritten | Site metadata names document/audio redaction; pricing has route-specific metadata and canonical URL. |
| Sitemap | No pricing route. | Extended | Adds `/pricing`; no unfinished feature route was added. |
| Blog/CMS | Editorial system and historical content must remain intact. | Retained | Routes, categories, search, pagination, CMS, and existing posts were not removed. No active promotional image/video claim was found in the checked public source. |
| Media/assets | The active workflow-opening screenshot visibly listed retired video projects and the old Safe Redact identity. | Replaced in the public registry | The workflow now reuses a current document-only OpenRedakt editor screenshot. The old asset remains internal and is not rendered or linked by the public product UI. |

## Pricing implementation

- `/pricing` contains a pricing hero, three package cards, an explicit non-cumulative package comparison, verified license-management rows, a four-step licensing explanation, pricing FAQ, and the reused demo/contact workflow.
- Essential is `$1,500` per named-user license per year and includes document redaction.
- Advanced is `$2,500` per named-user license per year and includes audio redaction; it does not inherit Essential.
- Complete Suite is shown as Contact Sales with `$3,500 per license/year proposed`, an approximate `$291.67` monthly equivalent, and an explicit pending-confirmation label.
- All monthly figures are planning equivalents. Every package is presented as per license and billed annually; no monthly checkout toggle exists.
- Package definitions, comparison rows, licensing steps, and pricing FAQ live in `src/content/pricing.ts` so future approved changes do not require rewriting each component.
- Package CTAs carry a `package` query value into the reused enquiry form. The form also accepts an optional license count, and both values are propagated through the existing lead-delivery model rather than fabricating a checkout or provisioning flow.

## Licensing evidence and guarded claims

The public licensing rows are limited to behavior verified in the Control Center: one-year organization term support, named-user assignment by email, Owner/Admin management, activated-computer visibility/release, and a quote-confirmed device allowance. The implementation evidence, entitlement trace, lifecycle limitations, and launch work are documented in `docs/openredakt-control-center-licensing-audit.md`.

The pricing page intentionally excludes exact device counts, tier seat caps, support levels, storage, quotas, cloud allowances, trials, automatic commercial renewal, upgrades/downgrades, self-service purchasing, instant provisioning, air-gapped rights, and transfer/cancellation terms because those details are either unapproved, incomplete, or absent from the current commercial system.

## Verification evidence

- Automated source audit asserts that public Marketing Site source contains none of the retired image/video product phrases.
- Pricing tests assert package values, non-cumulative entitlements, annual-billing language, proposed-price treatment, verified licensing copy, navigation/footer links, sitemap inclusion, SEO copy, and lead context.
- Production-route tests cover `/pricing` and its package-prefill behavior.
- Visual acceptance screenshots are stored in `docs/openredakt-pricing-acceptance-screenshots/` at desktop and mobile-width layouts.
- Browser inspection found no document-level horizontal overflow at 1440 px, 1024 px, 768 px, 500 px, or 390 px. The comparison table uses its own horizontal scroll container at narrow widths. No browser console warning or error was recorded during the responsive inspection.

