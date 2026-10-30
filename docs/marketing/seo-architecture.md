# OpenRedakt SEO and information architecture

Last reviewed: 2026-10-26
Branch: `feat/openredakt-stage-b-features`
Scope: multipage architecture, Industries ecosystem, supporting pages, navigation, and technical SEO foundation. Visual redesign is out of scope.

## 1. Method and evidence limits

Competitor sites were inspected on 2026-10-26 in a browser: navigation, rendered HTML, `<title>`, meta description, canonical, robots meta, heading outline, JSON-LD types, internal links, and `sitemap.xml`. Twelve Redactable URLs and thirteen CaseGuard URLs were sampled.

Nothing here assumes competitor rankings, traffic, or keyword volumes. No keyword-volume tool was used. Search-intent targets below are editorial judgements based on how buyers describe the job, and should be validated with Search Console data after launch.

Competitor copy, claims, and assets were not reused. Their capability claims are not evidence for OpenRedakt; OpenRedakt claims come only from `docs/marketing/capability-evidence-register.md`.

## 2. Competitor findings

### Redactable (document-redaction positioning and industry landing pages)

- **Navigation.** Home, Features, an Industries dropdown with ten sectors, Pricing, Blog, plus log-in and free-trial CTAs.
- **Industries hub.** None. `/industries` returns a 404, so the ten sector pages have no parent page and no hub that can rank for broad "redaction software by industry" queries.
- **Industry pages.** Every page shares one heading skeleton: results, challenges, why us (H3 benefit list), how it works, "six ways", testimonials, security, CTA, FAQ. Copy is roughly 2,800–3,600 words per page, but the structure is identical across sectors.
- **Titles and descriptions.** Pattern `<Sector> Redaction Software | Redactable`. Descriptions lean on named regulations and percentage speed claims.
- **Structured data.** Each industry page carries a BreadcrumbList, but it is the site-wide homepage breadcrumb (one item, `@id` of the homepage) rather than a page-specific trail. The WebPage node also points at the homepage.
- **Feature architecture.** `/features` plus nine feature subpages (OCR, manual, search and redact, and others).
- **Sitemap.** 258 URLs, about 187 of them blog posts, 17 tag archives, and 23 "use case" articles that overlap the industry pages in intent (for example law-firm and insurance use cases).
- **Conversion.** "Book a demo" and "Try for free" on every page; the industry pages repeat the same CTA block.

### CaseGuard (multi-format document, image, audio, and video positioning)

- **Navigation.** A mega-menu with product pages per format (video, document, audio, image, bulk, transcription), 14 "use case" sector pages, resources, company, and CTAs for quote and demo.
- **Hub.** `/use-cases/` exists and lists all sectors, but its H1 is generic and does not state the search intent.
- **Sector pages.** Titles follow `Redaction for <Sector> | CaseGuard` or a regulation-led variant. Pages run 3,500–4,000 words with repeated statistic blocks.
- **Heading hygiene.** Several pages render the H1 twice and repeat many H2s, apparently from separate desktop and mobile blocks in the HTML.
- **Structured data.** BreadcrumbList, FAQPage, VideoObject, Organization, WebPage, and WebSite on most pages.
- **Format positioning.** Video, audio, document, and image are separate product pages, cross-linked from every sector page.

### What OpenRedakt does differently

| Pattern observed | OpenRedakt decision |
|---|---|
| No industries hub (Redactable) or a hub with a generic H1 (CaseGuard) | `/industries` is an indexable hub with a search-intent H1, sector grouping, an explanation of how needs vary, and a format-to-sector map. |
| One template per sector with only the nouns changed | A typed registry with per-page audience, sensitive-information, challenge, workflow, consideration, and FAQ content; three layout orders (`records-led`, `media-led`, `mixed`); validation fails the build if any two live pages exceed 0.12 three-word-shingle similarity (current maximum is 0.036). |
| Homepage-level breadcrumb JSON-LD on deep pages | Page-specific `BreadcrumbList` on every route, matching the visible breadcrumb trail. |
| Duplicate H1s and H2s in the HTML | Exactly one H1 per route, asserted by route tests. |
| Regulation, speed, and accuracy claims | Blocked by `blockedIndustryCopy`; regulation names are not used at all, so copy stays jurisdiction-neutral. Capability lists render verbatim from the evidence register with their conditions. |
| Thin or overlapping "use case" posts competing with sector pages | One page per sector intent. Local Government and Government target different intents (resident-facing municipal records versus agency disclosure), and the Local Government FAQ states the distinction. |
| FAQPage markup on commercial pages | FAQs are visible on the page, but FAQPage JSON-LD is not emitted. Google limits FAQ rich results to authoritative government and health sites, and Stage B already chose not to emit it. |

## 3. Route map and SEO mapping

All titles render through the root template `%s | OpenRedakt`. Canonicals and `og:url` use the route path against `publicSiteUrl`. Every route below except `/` and `/blog` gets `buildPageMetadata()` (title, description, canonical, Open Graph with site name and locale, and a Twitter summary card).

| Route | Primary search intent | Secondary keyword themes | SEO title | H1 | Publication status |
|---|---|---|---|---|---|
| `/` | OpenRedakt redaction software (brand and category) | AI-assisted redaction; document, audio, and video redaction; Windows redaction software | OpenRedakt \| AI-Powered Redaction Software (layout default) | Homepage hero (unchanged) | Published (existing) |
| `/features` | redaction software features | document, audio, video redaction; review workflow | Redaction Software for Documents, Audio & Video | One review workflow for documents, audio, and video. | Published (Stage B) |
| `/features/document-redaction` | document redaction software | see Stage B register | Document Redaction Software for Windows | Review and redact sensitive information across documents and scans. | Published (Stage B) |
| `/features/audio-redaction` | audio redaction software | see Stage B register | Audio and Transcript Redaction Software | Redact sensitive moments in audio with precise timeline control. | Published (Stage B) |
| `/features/video-redaction` | video redaction software | see Stage B register | Video Redaction Software for Faces, Plates & Audio | Review visual and spoken information across a video timeline. | Published (Stage B) |
| `/industries` | redaction software by industry | redaction use cases; industry redaction requirements; who uses redaction software | Redaction Software by Industry and Use Case | Industry guides to document, audio, and video redaction. | Published (new) |
| `/industries/legal` | legal redaction software | redact discovery documents; privilege redaction; redacting court filings; evidence video redaction; recorded statement redaction | Legal Redaction Software for Case Files & Evidence | Redaction review for case files, discovery, and evidence. | Published (new) |
| `/industries/government` | government redaction software | public records redaction; freedom of information redaction; redacting agency documents; records release review; government video redaction | Government Redaction Software for Records Release | Redaction for agency records, disclosures, and public release. | Published (new) |
| `/industries/local-government` | local government redaction software | council records redaction; municipal public records requests; redact planning applications; council meeting recording redaction; CCTV redaction for councils | Local Government Redaction for Council Records | Redaction for council and municipal records that residents can see. | Published (new) |
| `/industries/healthcare` | healthcare redaction software | medical records redaction; redact patient information; patient health information redaction; clinical document redaction; redact recorded consultations | Healthcare Redaction Software for Patient Records | Redaction review for patient records and clinical documents. | Published (new) |
| `/industries/finance` | financial document redaction | redact bank statements; redact account numbers; loan file redaction; call recording redaction; client data redaction | Financial Document Redaction for Statements & Files | Redaction for statements, client files, and financial communications. | Published (new) |
| `/industries/insurance` | insurance claims redaction | redact claims documents; policyholder data redaction; recorded statement redaction; dashcam video redaction; redact damage photos | Insurance Claims Redaction for Files, Photos & Video | Redaction for claims files, recorded statements, and supporting media. | Published (new) |
| `/industries/education` | student records redaction | education redaction software; redact school records; school CCTV redaction; school records requests; redact student information | Education Redaction Software for Student Records | Redaction for student records, school correspondence, and campus footage. | Published (new) |
| `/industries/human-resources` | HR redaction software | redact employee records; workplace investigation redaction; redact personnel files; employee data request redaction; interview recording redaction | HR Redaction Software for Employee Records | Redaction for personnel files, workplace investigations, and interview recordings. | Published (new) |
| `/industries/media-journalism` | redaction software for journalists | blur faces in interview video; redact audio interviews; protect anonymous sources; redact leaked documents; news footage redaction | Redaction for Journalists: Protect Source Identities | Protect sources and bystanders in interviews, footage, and documents. | Published (new) |
| `/industries/real-estate` | real estate document redaction | redact closing documents; redact purchase agreements; lease redaction; title document redaction | Real Estate Document Redaction for Transaction Files | Redaction for transaction files, contracts, and leases. | **Draft**: 404, not in navigation or sitemap |
| `/industries/ai-data-teams` | redact training data sources | review source data before annotation; redact recordings before reuse; personal data in source files | Reviewing Sensitive Source Material for AI Teams | Review sensitive source material before authorized downstream use. | **Draft**: 404, not in navigation or sitemap |
| `/how-it-works` | how redaction software works | redaction workflow; redaction process steps; how to redact audio and video; redaction review process | How Redaction Review Works, Step by Step | How OpenRedakt takes a file from source to reviewed output. | Published (new) |
| `/why-openredakt` | multi-format redaction software | document, audio, and video redaction in one tool; review-led redaction; redaction software comparison criteria; desktop redaction software for Windows | Why OpenRedakt for Multi-Format Redaction | Why OpenRedakt: one review-led workflow for every format. | Published (new) |
| `/contact` | redaction software demo | contact OpenRedakt; redaction software evaluation; book a redaction demo | Contact OpenRedakt or Request a Redaction Demo | Contact OpenRedakt or request a demo. | Published (new) |
| `/blog` and articles | redaction insights and guides | document redaction guide; data privacy | Insights (Stage A) | Insights hub (unchanged) | Published (Stage A) |

### Draft decisions

- **Real Estate**: the fit is document-only, with no audio or video differentiation. A dedicated page would add little beyond `/features/document-redaction` until it is validated against representative closing, title, and lease documents.
- **AI & Data Teams**: OpenRedakt reviews files one at a time. Without verified batch processing or dataset-level de-identification evidence, the page would risk implying automated dataset anonymisation.

Drafts are kept in the registry so they can be finished and promoted by changing `publicationStatus`. Validation still rejects blocked claims and wording in drafts, so a draft cannot be promoted with one.

## 4. Sitemap and indexing

- `src/app/sitemap.ts` builds marketing URLs from `marketingRoutes()` (`src/lib/marketing/site-routes.ts`), so draft industries cannot be listed.
- `lastmod` comes from each entry's `lastReviewed` date rather than the request time, so it changes only when content is reviewed.
- Draft industry slugs return 404 through `notFound()` and are excluded from `generateStaticParams`.
- `robots.ts` is unchanged: staff and API paths stay disallowed.
- Homepage anchors (`#services`, `#how-it-works`, `#why-saferedact`, `#industries`, `#faq`, `#demo-enquiry`) remain in place for inbound links. No redirects were needed because no previous `/industries/*` routes existed.

Final XML sitemap (marketing portion, in order): `/`, `/features`, `/features/document-redaction`, `/features/audio-redaction`, `/features/video-redaction`, `/industries`, `/industries/legal`, `/industries/government`, `/industries/local-government`, `/industries/healthcare`, `/industries/finance`, `/industries/insurance`, `/industries/education`, `/industries/human-resources`, `/industries/media-journalism`, `/how-it-works`, `/why-openredakt`, `/contact`. Insights URLs follow: `/blog`, the `?type=` filter views, category pages, and published articles.

## 5. Internal-linking relationships

```
Header (every page)
  Home · Features ▾ (All, Document, Audio, Video) · Industries ▾ (Legal, Government,
  Healthcare, Finance, Insurance, View All) · How It Works · Insights · Contact · Request a Demo

Homepage sections ──► /features (Services) · /how-it-works (workflow) · /why-openredakt · /industries
/industries hub   ──► every live industry page · 3 feature pages · /how-it-works · /why-openredakt · /contact
/industries/<x>   ──► feature page per workflow (in primary-format order)
                  ──► 3 related live industries · /industries · /how-it-works
                  ──► related Insights article where one exists · /contact
/features/<x>     ──► related features · industries that use that format · /contact
/how-it-works     ──► 3 feature pages · /industries · Insights document guide · /contact
/why-openredakt   ──► /how-it-works · /features · every live industry · /contact
/contact          ──► /features · /industries (form posts to the existing /api/contact)
Footer (every page) ──► all features, How it works, Why OpenRedakt, every live industry,
                        All industries, Insights, homepage anchors, Contact, mailto
```

Every internal link on the marketing routes is fetched by `tests/site-routes.test.mjs`, which fails if any returns something other than 200.

## 6. Content gaps

1. **Insights coverage.** Only one public article exists (document redaction). Audio, video, and sector guides are needed to give industry pages relevant editorial links. Three industry pages (Local Government, Insurance, Media & Journalism) currently show an "in preparation" note instead.
2. **Approved imagery.** No sector imagery has been approved; industry heroes use an original text-based panel. The registry has an optional `image` field ready for approved assets.
3. **Representative-file acceptance.** Several register entries are conditional, including OCR quality, codec coverage, and configured-engine behaviour. Industry pages repeat those conditions, but owner acceptance with sector-representative files is still a pre-deployment gate.
4. **Real Estate and AI & Data Teams** remain drafts for the reasons above.
5. **Search Console validation.** Primary intents are editorial hypotheses. Validate them against impressions and queries 6–8 weeks after launch, then adjust titles.
6. **Organisation schema.** The root layout emits `SoftwareApplication` only. Add `Organization` with approved logo and contact data once official OpenRedakt coordinates replace the legacy `saferedact.io` destinations.
7. **Social images.** No Open Graph image is defined. This is deliberate until branded assets are approved.

## 7. Guards that keep this true

| Guard | Where |
|---|---|
| Industry registry validation: unique slug, title, description, and H1; canonical match; title 30–52 and description 120–165 characters; 450-word minimum; at least 4 FAQs and 3 challenges; primary media first; related links only to live pages; blocked claims and wording; near-duplicate similarity at most 0.12 | `validateIndustryContent()` in `src/lib/marketing/industries.ts`, run in prebuild via `scripts/validate-content.ts` |
| Cross-registry uniqueness of titles, descriptions, and H1s; draft paths never indexable | `validateMarketingRoutes()` |
| Supporting-page wording and cited claims | `validateSupportingContent()` |
| Navigation and footer destinations resolve to published routes or preserved anchors | `tests/navigation.test.ts` |
| Rendered H1, canonical, Open Graph, BreadcrumbList JSON-LD with CSP nonce, draft 404s, sitemap inclusion and exclusion, dropdown markup, and link resolution | `tests/site-routes.test.mjs` |
