# OpenRedakt Pricing and Product Scope Design

## Intent

Bring the public marketing site into line with the two commercially supported OpenRedakt workflows—document redaction and audio redaction—and add a credible annual per-license pricing route. The work is a focused evolution of the existing dark OpenRedakt marketing system, not a redesign.

## Goals

- Present only document and audio redaction as available product capabilities.
- Add `/pricing` with Essential, Advanced, and Complete Suite packages sourced from one typed configuration.
- Make the capability-specific nature of Essential and Advanced unmistakable.
- Reuse the current demo enquiry workflow and carry package/license context through delivery.
- Preserve the blog/CMS, accessibility behavior, reduced-motion support, security controls, and responsive navigation.

## Non-goals and anti-goals

- No checkout, recurring billing switch, provisioning, new backend service, or invented entitlement.
- No image/video roadmap promise, “coming soon” message, testimonial, certification, usage limit, or support promise.
- No reuse of CaseGuard copy or visual design. Its page is used only as evidence that clear pricing cards, a comparison table, licensing explanation, FAQs, and a sales CTA form a useful commercial hierarchy.
- No previous redesign branch changes, commit, push, pull request, merge, or deployment.

## Current-state audit

| Surface | Finding | Decision |
| --- | --- | --- |
| Homepage hero, capability strip, platform outcomes/capabilities, format tabs, how-it-works, FAQ | Public copy markets documents, images, audio, and video; the format tabs expose a video screenshot and an image workflow. | Rewrite to documents and audio only. Keep review/export and Windows/local-processing claims that remain format-neutral and supported. |
| Header and mobile navigation | No format dropdown exists on `origin/master`; there is no Pricing route. | Add a route link to `/pricing`; preserve anchor resolution and active-route behavior. |
| Footer | Markets “Documents & images,” “Video,” and all four formats in its summary. | Replace with Documents, Audio, Pricing, and existing use-case links. |
| Root metadata and JSON-LD | Description advertises documents, images, audio, and video. | Restrict capability language to document and audio workflows. Retain `max-video-preview` as a generic crawler directive only if it remains otherwise useful; it is not a product claim. |
| Lead form and API validation | File-type options accept video and scanned-image enquiries. | Restrict format choices and add optional package plus license-count context to the existing validated submission. |
| Product screenshot registry and assets | A video screenshot key and image file exist under `public/`. | Keep as internal/inactive implementation assets, but remove every active public reference so they are not rendered, linked, indexed, or described. |
| `/features`, feature details, “Why” detail routes | These routes do not exist on the fetched `origin/master`. | Do not invent routes or redirects. There are no internal links to retire. |
| Industries | Current examples are format-neutral records/research/business use cases. | Retain; they do not claim video/image availability. |
| Blog/CMS | Published content concerns document redaction and publishing; fixtures mention video tags only as test data. | Retain editorial content and CMS behavior unchanged. Test fixtures are not public claims. |
| Sitemap | Lists homepage and blog only. | Add `/pricing`; no retired route entries exist. |
| Unused legacy content modules | Several non-rendered content modules still contain four-format claims. | Align copy where practical so future reuse does not reintroduce unsupported marketing; preserve generic icon/code primitives. |

## Chosen approach

### Considered

1. **One pricing page with local constants.** Smallest initial edit, but duplicates commercial facts across cards, table, metadata, and form options.
2. **Typed central package source plus composed server-rendered sections.** Keeps commercial facts consistent, is testable without a browser, and follows the repository’s content-module pattern.
3. **CMS-managed pricing.** Adds editorial flexibility but creates schema, validation, and publishing complexity beyond this phase.

Use approach 2. It matches the existing `src/content/*` architecture and keeps future capability/price changes bounded.

## Control Center licensing audit addendum

The pricing presentation is gated by the current implementation in `M:\Safaridesk\Admin-panel` and the desktop consumer in `M:\Safaridesk\redact`. The reference repositories remain read-only.

### Verified architecture

- A licence type (`Plan`) stores an arbitrary bitwise combination of `Document`, `Audio`, `Image`, and `Video` entitlements, a capped or uncapped seat model, a maximum device count per seat, and catalogue pricing.
- A seat is a named-user assignment identified by email inside one organisation. The plan entitlements are copied onto the seat and then into a signed, device-bound desktop token.
- Organisation owners and administrators can invite/remove users, grant/revoke seats, and release online devices. Members can see their own licence and devices.
- Online desktop tokens last 30 days and renew against an active organisation term; the organisation term may be one month, three months, six months, one year, two years, or a custom end date. A one-month trial option exists.
- The seeded catalogue is not the approved public catalogue: `Doc Suite` includes Document + Image, `Media Suite` includes Audio + Video, and `Ultimate Suite` includes all four. Essential, Advanced, and Complete Suite must be created/configured before commercial launch.
- Cloud endpoints enforce required Document and Audio entitlements. The desktop validates the signed token at startup but does not currently call `Allows(Entitlements.Document)` or `Allows(Entitlements.Audio)` from the local workflow entry points. Separate local format packages therefore require desktop enforcement work before launch.
- There is no evidence of self-service checkout, automatic commercial renewal, billing integration, or a customer-controlled plan upgrade/downgrade. Staff provision organisations and adjust seats/terms; the customer console manages users, seat assignments, and devices.

### Public-claim approaches considered

1. **Publish every configurable licensing detail.** This would expose unapproved device counts, seat caps, cloud quotas, and legacy seeded tiers as benefits. Rejected because configurability is not a commercial commitment.
2. **Delay the entire pricing page until entitlement enforcement is complete.** Safest technically, but conflicts with the approved requirement to publish the three commercial packages now.
3. **Publish the approved format/price matrix and only verified, package-neutral management facts; document launch blockers separately.** Chosen. It keeps the page accurate without presenting configurable limits or incomplete enforcement as included contractual benefits.

### Public licensing claims allowed

- Prices are USD per named-user licence for a one-year term, billed annually.
- Essential is commercially scoped to Documents; Advanced to Audio; Complete Suite to Documents + Audio.
- OpenRedakt provisions the organisation, package, term, and purchased licence quantity after a sales conversation; the site does not imply checkout or instant provisioning.
- Organisation owners/admins can invite users, assign or release named-user licences, and review activated computers in the Control Center.
- The Windows desktop activates against a named-user licence and a specific computer using a signed token; exact device allowances are confirmed in the quote rather than invented per tier.
- Renewal means the desktop refreshes its technical token while the organisation term remains active; it is not an automatic commercial subscription renewal claim.

### Public claims excluded

- Exact device counts, tier-specific seat counts, storage, support levels, installation services, usage quotas, cloud allowances, automatic renewals, self-service purchasing, upgrades/downgrades, transfer rights, cancellation, taxes, and billing integrations.
- Image and video capabilities, even though internal entitlement flags and legacy catalogue entries exist.
- Air-gapped activation as an included package benefit until it receives an explicit commercial decision.

## Pricing presentation

- Essential: `$1,500` per license/year; `$125` monthly equivalent; document redaction only.
- Advanced: `$2,500` per license/year; approximately `$208.33` monthly equivalent; audio redaction only.
- Complete Suite: card action remains **Contact Sales**. The page may state the planning reference of `$3,500` per license/year and approximately `$291.67` monthly, but must label both as proposed and pending business confirmation.
- Every price area states “Per license. Billed annually.” No monthly purchase option or billing toggle is shown.

## Page structure

1. Dark pricing hero with concise annual-license disclosure.
2. Three restrained package cards, with subtle emphasis on Complete Suite.
3. Accessible comparison table with Included/Not included text rather than color-only icons.
4. Evidence-based licensing explanation: sales-led provisioning, named-user licences, customer owner/admin management, device-bound desktop activation, and quote-confirmed device allowances. Avoid transfer, support, tax, commercial renewal, cancellation, and air-gapped-package promises.
5. Pricing FAQ covering package differences, annual billing, teams, Complete Suite, demos, installation, and activation.
6. Existing demo enquiry section, extended with package and license-count context.

## Verification design

- Static source tests pin package values, proposed-price handling, two-format copy, navigation, sitemap code, and lead schema.
- Static and route tests pin the verified named-user/Control Center workflow and reject exact device-count, instant-provisioning, self-service-purchase, and automatic-renewal claims.
- Route tests verify `/pricing`, metadata/canonical content, navigation links, comparison semantics, CTA/form integration, and sitemap inclusion.
- Existing lint, typecheck, full tests, secret scan, and production build remain required.
- Desktop, tablet, and mobile browser QA checks overflow, focus/heading structure, pricing table behavior, navigation, and the enquiry path.

