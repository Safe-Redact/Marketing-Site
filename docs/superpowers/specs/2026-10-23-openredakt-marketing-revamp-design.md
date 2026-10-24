# OpenRedakt Marketing Revamp: Inspection and Design Specification

**Date:** 2026-10-23

**Status:** Proposed for design approval; no implementation has started

**Working branch:** `feat/saferedact-marketing-revamp` at updated `origin/master` (`19986ea`)

**Scope:** Marketing website only. The SafeRedact/OpenRedakt desktop application was inspected for evidence but is out of implementation scope.

## Executive recommendation

OpenRedakt already has a sound technical and visual foundation: a restrained dark design system, a real product-led homepage, an accessible header, a carefully validated Git-backed Insights CMS, a fail-closed moderated comment system, a defensive contact flow, and a privacy-conscious SafariChat integration. The revamp should extend that foundation, not replace it.

The highest-value direction is:

1. Establish a claim/evidence register and replace the one unsuitable video screenshot before increasing traffic to product pages.
2. Redesign Insights into a stronger editorial system while preserving all existing articles, URLs, search, filters, categories, tags, Markdown, comments, metadata, and CMS workflows.
3. Add a scalable `/features` architecture with three evidence-backed pages: document, audio, and video redaction.
4. Add an `/industries` overview and initially publish the three most differentiated, defensible pages: legal services, government and public records, and media/journalism/investigations.
5. Add healthcare, financial services, and insurance only after claim review and relevant workflow evidence. Defer a dedicated education page until there is stronger evidence and distinct content.
6. Refine the homepage after the new destinations exist, so it can tell a shorter story and route visitors to substantive pages rather than duplicating them.
7. Complete schema, internal linking, sitemap, domain-migration, and editorial work as an integrated final stage.

This order differs slightly from a pure “Insights first” sequence because a small evidence and shared-foundation stage reduces risk across every later page. Insights remains the first visible redesign.

## Inspection basis and limitations

### Evidence inspected

- The full marketing repository at `M:\Safaridesk\Marketing-Site`, including routes, components, content loaders, validation, middleware, security headers, APIs, tests, CMS configuration, assets, planning documents, and Git state.
- The site running locally in a browser, including the homepage, Insights listing, the published article, navigation, responsive navigation behavior, demo form, and support launcher.
- A production build and the complete test suite. The final result was 223 passing tests: 44 static checks, 113 content/backend checks, 29 route checks, and 37 OAuth checks.
- The sibling desktop application repository at `M:\Safaridesk\redact`, inspected read-only at commit `be26fcd` on `develop`, to distinguish implemented capabilities from aspirational marketing.
- Live reference pages on 2026-10-23:
  - [Cluely](https://cluely.com/)
  - [Cluely Blog](https://cluely.com/blog)
  - [Cluely article example](https://cluely.com/blog/otter-ai-alternatives)
  - [Redactable](https://www.redactable.com/)
  - [Redactable features](https://www.redactable.com/features)
  - Redactable industry pages for [legal](https://www.redactable.com/industries/legal), [healthcare](https://www.redactable.com/industries/healthcare), [state government](https://www.redactable.com/industries/state-government), [financial services](https://www.redactable.com/industries/financial-services), [insurance](https://www.redactable.com/industries/insurance), and [education](https://www.redactable.com/industries/education).

### Missing screen recording

No user-provided Cluely recording was present in either permitted workspace root. A filesystem search found no relevant video file. The Cluely findings below are therefore derived from the live site, not from the requested recording. Motion timing, exact recorded viewport behavior, and any states visible only in that recording remain unverified. The recording should be attached before visual approval if it contains interactions not represented on the live pages.

### Branch preparation

The requested local branch already existed but was 21 commits behind `origin/master` and had no unique commits. `origin/master` was fetched, local `master` was fast-forwarded, and `feat/saferedact-marketing-revamp` was fast-forwarded to the same commit. Its obsolete upstream reference was removed. No commits, pushes, merges, deployments, or application source changes were made.

## 1. Current-state website audit

### Architecture and routes

The website is a Next.js 15 App Router application using React 19, TypeScript, and Tailwind CSS. It is explicitly a marketing-only surface. Its public route set currently consists of:

- `/` — marketing homepage and demo enquiry form.
- `/blog` — Insights listing with search, content-type filters, categories, tags, featured content, and pagination.
- `/blog/[slug]` — Markdown article, metadata, comments, and conditional related content.
- `/blog/category/[slug]` — category archives.
- `/sitemap.xml` and `/robots.txt`.

Admin, moderation, health, and API routes support CMS and operational functions but are not marketing destinations. Existing tests enforce the absence of download, login, and application-access CTAs from public marketing routes.

### Homepage hierarchy

The current sequence is Header → Hero → TrustBar → Services → How It Works → Why OpenRedakt/format tabs → Industries → FAQ → Final CTA/demo form → Footer.

Strengths:

- The hero immediately explains the core task and shows a real product screenshot.
- The format tabs make the multimodal value proposition tangible.
- The workflow and FAQ reduce ambiguity without aggressive claims.
- The CTA hierarchy remains appropriate for a marketing-only site: explore and request a demo.
- Sections use shared tokens and components consistently.

Opportunities:

- Services and format capabilities partially repeat the same message.
- The page has no durable feature or industry destinations to support visitors who need detail.
- Trust is communicated mainly through copy, not a structured “proof by process” explanation.
- The homepage cannot yet hand off to an editorial resource journey.
- Some screenshots and stored acceptance references still use SafeRedact branding; runtime branding is OpenRedakt.
- The video screenshot `format-video.png` contains a third-party broadcast watermark and identifiable footage. It must not be used more broadly and should be replaced with owned or licensed test media.

### Header, navigation, and footer

The fixed header is a strong component worth preserving. It has a skip link, active-section tracking, a desktop breakpoint at 992px, an accessible mobile dialog, focus trapping, Escape handling, and inert treatment for background landmarks. It exposes only marketing-safe CTAs.

The limitation is architectural: anchor-based homepage navigation does not scale to feature and industry routes. The new navigation should become route-first while preserving the current accessibility behavior:

- Features: overview plus document, audio, and video.
- Industries: overview plus published priority industries.
- Insights.
- How it works, either as a homepage link or a concise dedicated anchor.
- Primary CTA: Request a demo.

Desktop can use two compact, keyboard-accessible dropdowns. Mobile should use simple disclosure sections rather than a visually dense mega-menu.

The footer structure is serviceable. It should gain the same feature and industry links and retain the legacy-domain status annotation until a real OpenRedakt domain migration is approved. Current `saferedact.io` and support-address references must not be silently changed.

### Typography and design tokens

The existing system is coherent and should remain the default:

- Canvas `#080914`, raised `#101525`, active `#151B2F`, border `#222B44`.
- Ink `#F7F8FC`, muted `#A7B0C9`.
- Warm accent `#E47755` with hover `#F08A66`.
- Cool `#33B7FF` and mint `#55E6D0` as supporting accents.
- Poppins for headings and Inter for body copy.
- Existing panel, card, control, and section spacing tokens.

The primary need is not a new design system. It is a more editorial use of the same system: larger type contrast, more whitespace, narrower reading measure, clearer metadata, asymmetric layouts, and fewer bordered cards per viewport.

### Responsive behavior

The current site has thoughtful desktop and mobile behavior, especially in navigation and hero composition. The revamp should preserve existing breakpoints unless a component demonstrates a specific failure. Required design targets are 390px mobile, 768px tablet, 1024px small desktop, and 1440px large desktop.

Current risks to verify during implementation:

- Filter and tag controls can become dense on small screens.
- New sticky sidebars must collapse to in-flow sections on tablet and mobile.
- Product screenshot text must remain legible without forcing horizontal page scrolling.
- Large editorial type must use `clamp()` and respect long titles.

### Product presentation and screenshots

The current product UI is a competitive advantage because it is real. The revamp should use annotated crops and short workflow sequences, not generic illustrations pretending to be the product. Every image should record:

- Source build/commit and operating system.
- Whether data is synthetic, owned, or licensed.
- Which capability and state it demonstrates.
- Accessible alt text and an optional longer caption.
- Whether the result shown has passed manual and output verification.

Do not use the current watermarked video capture in new pages. Do not show a failed export state, real personal data, customer files, third-party logos, or capabilities hidden behind unshipped dependencies.

### Contact/demo conversion flow

The current form is intentionally defensive: validation, a honeypot, request-size limits, rate limiting, explicit delivery states, and an email fallback are already implemented. It should be reused as the sole lead-generation mechanism.

Feature, industry, and article CTAs should link to `/#demo-enquiry` with contextual wording, not create new forms or imply product access. A dedicated `/contact` page is not required for the first release. If attribution is later needed, use a validated first-party query parameter or hidden context field rather than separate forms.

### SafariChat integration

SafariChat/Chatwoot is lazy-loaded, identity-free by default, configuration-gated, and does not enable file uploads. It is working and should be treated as a protected integration. New routes must retain the launcher and existing content-security-policy allowances without broadening them.

### Existing branch work

The previously checked-out publishing/comments work is already included in updated `master`. The worktree was clean before these planning documents. The moderated comments, CMS workflow, and related tests are not experimental debris; they are current functionality that the redesign must preserve.

## 2. Insights audit and Cluely design study

### Current OpenRedakt Insights

The current listing provides a compact hero, content-type pills, search, category and tag navigation, a featured card, a grid, and pagination. Only one article is publicly visible, so the page correctly renders that real article rather than placeholder cards. A second content record is archived.

The article template provides category, title, excerpt, author, publication date, reading time, Markdown body, tags, moderated comments, and conditional related articles. The published article has no featured image and no eligible related stories, so those areas are absent. The reading column is approximately 50rem wide and has no table of contents or side CTA.

Technical strengths that must be preserved:

- Stable published slugs and metadata.
- Decap CMS editorial workflow.
- Strict frontmatter and file validation.
- Publication modes for immediate, scheduled, and archived content.
- Safe Markdown rendering with raw HTML disabled.
- Safe link behavior and validated local images.
- Search, content types, categories, tags, and pagination.
- Fail-closed comments when the database is unavailable.
- Article structured data and canonical metadata.

### Live Cluely Blog breakdown

#### Listing page

- **Editorial header:** A quiet navigation gives way to a highly oversized page title and a short centered description. The abundant whitespace clearly changes the mode from product marketing to publishing.
- **Featured geometry:** One wide, image-led feature dominates the first viewport. Metadata and title are integrated into the visual, making the featured story feel intentionally selected rather than merely first in a grid.
- **Controls:** A prominent search field and a small set of category controls sit between the feature and archive.
- **Archive:** Stories are grouped by month. Large month labels create a chronological spine; individual rows are compact, typographically strong, and metadata-led.
- **Closing rhythm:** A simple subscription/follow CTA and a generous footer give the archive a deliberate ending.

#### Article page

- **Entry hierarchy:** Category pills, a large title, publication/read metadata, byline, summary, and a wide hero image create a clear editorial opening.
- **Reading layout:** The body uses a measured primary column with a secondary rail.
- **Side rail:** A high-contrast CTA and a sticky table of contents remain available during long-form reading.
- **Body rhythm:** Large section headings, comfortable leading, generous paragraph spacing, and strong separation around lists and media improve scanability.
- **Completion:** FAQ content, related stories, and a closing CTA turn the article into a complete journey rather than an isolated page.

#### Interaction and adaptation

Observed interactions include linked feature imagery, category controls, linked archive rows, a sticky table of contents, and a persistent contextual CTA. The live reference uses restrained state changes rather than theatrical motion. The requested recording was unavailable, so precise transition timings and recording-specific mobile behavior are not claimed here.

### Component-by-component comparison

| Area | Cluely reference | Current OpenRedakt | Recommended OpenRedakt direction |
|---|---|---|---|
| Listing hero | Oversized editorial wordmark and wide whitespace | Compact product-style header | Increase scale and whitespace while retaining OpenRedakt typography and dark canvas |
| Featured story | One cinematic, image-led feature | Functional featured card | Create a larger asymmetric feature using only a real article and owned image; gracefully handle no image |
| Search/categories | Clean, visually separated controls | More capable search/type/category/tag controls | Preserve functionality, simplify the visual hierarchy, and move secondary tags behind a clear “Topics” area |
| Archive | Month-grouped chronological rows | Card grid with pagination | Introduce semantic year/month groups and editorial rows; retain pagination and URL state |
| Row metadata | Thumbnail/icon, title, author/date | Card metadata and excerpt | Add type/category, title, date, author, and reading time without inventing avatars |
| Article header | Large title, rich meta, wide image | Strong title/meta, usually no image | Add more vertical air, optional full-width media, and retain text-first fallback |
| Body | Narrow measure with strong rhythm | Safe, readable Markdown | Refine type scale and spacing without changing Markdown behavior |
| Contents | Sticky generated TOC | None | Derive TOC from Markdown H2/H3 headings; no required CMS migration |
| Side CTA | Sticky commercial CTA | None | Add a compact “Discuss your redaction workflow” CTA to the existing demo form |
| Related content | Strong visual finish | Conditional and currently empty | Preserve truthful empty state; display only real related articles |
| Comments | Not central to reference | Moderated, tested comments | Preserve below editorial completion blocks |
| Theme | Pale editorial surface | Dark, high-contrast brand | Keep OpenRedakt’s dark tokens; use raised surfaces and whitespace rather than copying the reference palette |

### Proposed Insights listing specification

1. **Editorial hero:** Eyebrow “Insights”; H1 “Practical guidance for safer redaction”; a short promise covering documents, audio, video, privacy, and review. Avoid a decorative hero image until an owned editorial art direction exists.
2. **Featured story:** Render only when a currently published article is marked featured. Support an owned image when present and a branded typographic composition when absent. Never add dummy cards to fill the layout.
3. **Discovery toolbar:** Full-width search first, followed by content-type controls. Categories remain visible; tags become a secondary topic strip or disclosure to reduce density.
4. **Chronological archive:** Group published articles by year and month after filtering. Month labels are semantic H2 elements. Rows include type/category, title, optional excerpt, author, date, and read time. Pagination remains deterministic.
5. **Empty results:** Keep a clear result-specific empty state with a reset action. Do not imply that unpublished content exists.
6. **Closing block:** A low-pressure demo CTA relevant to the topics on the page, followed by the existing footer.

### Proposed article specification

1. Breadcrumbs: Insights → category → article.
2. Editorial header: category/type, H1, excerpt, author text, publication/update date, read time, and optional owned hero image.
3. Reading grid at desktop: article body plus a secondary rail. The rail becomes in-flow below the summary on smaller screens.
4. Generated TOC: H2/H3 headings only, stable slugs, keyboard-accessible links, visible active state, and no TOC for short articles.
5. Contextual side CTA: “Discuss your redaction workflow” linking to the existing demo enquiry section; no download, trial, or sign-in language.
6. Body measure: approximately 65–70 characters, with improved spacing for headings, lists, tables, code, blockquotes, and images.
7. FAQ presentation only when an article genuinely contains an FAQ section. Schema must match visible text exactly.
8. Related stories selected from real published content using category/type/topic relevance. Hide the module if fewer than one eligible story exists.
9. Comments remain after related content so the reading journey is not interrupted.
10. Closing CTA and footer preserve the site-wide conversion path.

### CMS compatibility

No required CMS schema change is needed for the first Insights redesign. Existing title, slug, excerpt, author, type, category, tags, publication dates, image, image alt, publication mode, featured state, SEO description, and Markdown body are sufficient.

The month archive and TOC should be derived at render time. Do not add author avatars, biographies, FAQ arrays, or CTA fields until real editorial operations require them. Optional author profiles may be introduced later as a separate validated registry so historical articles remain valid.

## 3. Redactable messaging and SEO analysis

### Structural approach worth learning from

Redactable uses a repeatable commercial structure:

1. Search-intent-specific hero and outcome.
2. Product view or workflow illustration.
3. Proof elements.
4. Concrete pain points.
5. Capabilities mapped to those pains.
6. A short workflow.
7. Use cases and security explanation.
8. Testimonials or customer proof.
9. FAQ.
10. Repeated lead-generation CTA and related resources.

Its industry pages reuse the same macro-structure but change the document types, protected data, job pressures, and workflow language. That is a good templating strategy when the body content remains genuinely specific.

### Marketing techniques OpenRedakt can use

- Lead with the buyer’s workflow, not a list of algorithms.
- Explain problem → review workflow → outcome in each section.
- Show the product state that substantiates each capability.
- Provide distinct pages for high-intent feature and industry searches.
- Use FAQs to answer practical objections and link to deeper educational content.
- Connect feature, industry, and Insights pages bidirectionally.
- Repeat a consistent, low-friction demo/contact CTA.
- Use “proof by process” when logos, benchmarks, and testimonials are unavailable.

### Claims OpenRedakt must not borrow or imply

Do not reuse competitor statistics, speed multipliers, accuracy figures, file-volume claims, customer logos, testimonials, certifications, compliance badges, integrations, pricing/trial language, or absolute security claims. In particular, OpenRedakt currently lacks publication-ready evidence for:

- A numeric accuracy, time-saved, or throughput promise.
- SOC 2, HIPAA, CJIS, GDPR, FERPA, or other compliance certification.
- “Permanent,” “irreversible,” “zero leak,” or “guaranteed” redaction.
- Universal local-only processing; optional AWS processing exists and release sign-in requires connectivity.
- Team collaboration, role-based access controls, or cloud integrations.
- Generic object tracking as a standard packaged capability.
- Any named-customer result.

Regulations may be discussed educationally, but product compliance claims and legal interpretations require legal approval.

## 4. Verified product capability envelope

The desktop application source supports a credible multimodal story. Marketing language should distinguish “detects candidates,” “supports review,” and “verifies output” rather than collapsing those stages into autonomous perfection.

### Demonstrable with representative test evidence

- Documents and images: PDF handling; conversion paths for common text, Office, OpenDocument, presentation, spreadsheet, and image formats; OCR; text and area selection; AI-assisted entity candidates; manual approve/reject review; export; output checks; audit/report generation.
- Audio: common audio inputs; transcription; candidate detection in transcripts; time-range redaction; mute, tone, audio-mask, and voice-disguise effects; transcript projection that masks redacted words; multiple export formats.
- Video: common video inputs; face, license-plate, and text detection; manual regions; timeline/time-range review; previewed redaction effects; audio redaction within video; output/residual checks.
- Processing model: local engines are available after setup, with optional per-job AWS paths in some workflows.
- Review and evidence: human review states, exemptions/logging, and CSV/PDF/JSON report generation.

### Conditional or evidence-gated

- File conversion depends on installed conversion tooling for some formats.
- Hardware acceleration and performance vary; CPU fallback exists.
- Generic-object tracking depends on a prototype worker not reliably packaged for every environment. Do not market it as standard.
- “Offline” must be qualified because release authentication can require internet access and optional AWS processing exists.
- Export verification should be regression-tested on each promoted workflow before claiming a verified result.
- Supported input lists should be documented accurately and not turned into “works with every file” language.

## 5. Feature-page information architecture

### Recommended initial routes

- `/features`
- `/features/document-redaction`
- `/features/audio-redaction`
- `/features/video-redaction`

Do not initially create separate pages for image redaction, offline redaction, audit reports, or review/verification. Image workflows fit the document and video pages; the others are strong sections but need clearer search demand or product evidence before receiving standalone URLs.

### `/features` overview

- **Audience:** Privacy, legal, records, compliance, investigation, and operations teams evaluating the overall product.
- **Intent:** Commercial investigation of multimodal redaction software.
- **H1:** “One review workflow for documents, audio, and video.”
- **SEO title:** “Redaction Software for Documents, Audio & Video | OpenRedakt”
- **Meta description:** “Explore OpenRedakt’s review-led redaction workflows for documents, recordings, and video, with AI-assisted detection, manual control, and output checks.”
- **Value proposition:** OpenRedakt brings multiple media types into a consistent candidate-detection, human-review, export, and verification model.
- **Sections:** Hero; three format pathways; shared review workflow; local/optional processing explanation; output verification and reporting; industry entry points; FAQ; demo CTA.
- **Screenshots:** One owned, synthetic-data screenshot per format and one review/report view.
- **FAQ:** Where processing occurs; whether review is required; supported media categories; what verification means; how to request a demo.
- **Internal links:** All feature pages, industry overview, verification article, demo form.
- **Evidence:** Cross-format workflow test, accurate format list, approved processing language, owned screenshots.

### `/features/document-redaction`

- **Audience:** Legal operations, records teams, healthcare/finance reviewers, and anyone handling PDFs or scanned files.
- **Intent:** Document/PDF redaction software, automatic redaction, OCR redaction, scanned-document redaction.
- **H1:** “Review and redact sensitive information across documents and scans.”
- **SEO title:** “Document Redaction Software for Windows | OpenRedakt”
- **Meta description:** “Find redaction candidates in PDFs, scans, and supported office files, review every selection, export the result, and check the output with OpenRedakt.”
- **Value proposition:** Speed up candidate discovery without removing human control over what is concealed or exempted.
- **Sections:** Workflow-specific hero; input and conversion caveats; OCR and candidate detection; manual text/area controls; approve/reject review; export and output verification; reporting; relevant industries; FAQ; CTA.
- **Demonstrable capabilities:** PDF; supported conversions; OCR; PII/entity candidates; manual regions; exemptions; reviewed export; document validation; reports.
- **Screenshots/diagrams:** Synthetic multi-page document; scan/OCR state; review queue; redacted export comparison; verification/report state.
- **FAQ:** Scanned PDFs; supported formats; review; local vs optional processing; whether original files are changed; reporting.
- **Internal links:** Legal, government, healthcare, finance; audio/video pages; OCR and verification articles.
- **CTA:** “Discuss your document-redaction workflow.”
- **Evidence before publication:** Representative native PDF, scanned PDF, and one converted Office file; verified export; format-dependency disclosure; approved privacy wording.

### `/features/audio-redaction`

- **Audience:** Investigation teams, journalists, legal teams, public-records teams, researchers, and contact/review operations.
- **Intent:** Audio redaction software, redact PII from audio, mute sensitive speech, transcript redaction.
- **H1:** “Find and review sensitive moments in audio before you share it.”
- **SEO title:** “Audio and Transcript Redaction Software | OpenRedakt”
- **Meta description:** “Transcribe supported recordings, review sensitive words and time ranges, apply audio redaction effects, and export reviewed audio and transcripts.”
- **Value proposition:** Connect transcript-level review to time-based audio effects so reviewers can understand context before export.
- **Sections:** Hero; transcription-to-timeline workflow; candidate detection; manual word/time-range review; effect choices; transcript export safety; supported formats; use cases; FAQ; CTA.
- **Demonstrable capabilities:** Transcription; transcript candidate detection; word/time ranges; mute, tone, audio mask, voice disguise; masked transcript export; common audio inputs/outputs.
- **Screenshots/diagrams:** Synthetic interview waveform and transcript; approved/rejected candidates; effect preview; safely projected transcript/export.
- **FAQ:** Accuracy and manual review; overlapping speakers; effect types; input/output formats; local/optional processing; transcript handling.
- **Internal links:** Government, legal, media/investigations; document/video pages; educational audio-redaction articles.
- **CTA:** “Discuss your audio-redaction workflow.”
- **Evidence before publication:** Test recording with synthetic PII; output playback inspection; transcript export regression test; approved effect names; representative format test.

### `/features/video-redaction`

- **Audience:** Public-records teams, investigators, media organizations, legal teams, and reviewers handling evidentiary footage.
- **Intent:** Video redaction software, face blur, license-plate redaction, redact text or audio in video.
- **H1:** “Review faces, plates, text, and audio across video timelines.”
- **SEO title:** “Video Redaction Software for Faces, Plates & Audio | OpenRedakt”
- **Meta description:** “Detect and review faces, license plates, visible text, and sensitive audio across supported video, with manual timeline controls and output checks.”
- **Value proposition:** Coordinate visual and audio review in one timeline while preserving manual control over the final result.
- **Sections:** Hero; supported detections; manual regions and timeline; visual effects; audio-within-video review; output checking; realistic performance caveats; use cases; FAQ; CTA.
- **Demonstrable capabilities:** Face/license-plate/text detection; manual regions; timeline ranges; effect preview; audio redaction; supported video inputs; output/residual validation.
- **Screenshots/diagrams:** Newly captured synthetic street/interview footage; timeline; detection review; before/after owned frames; verification result.
- **FAQ:** Face/plate detection vs automatic approval; manual tracking; long-video performance; supported formats; audio; processing location.
- **Internal links:** Government, media/investigations, legal; document/audio pages; video workflow articles.
- **CTA:** “Discuss your video-redaction workflow.”
- **Evidence before publication:** Replace watermarked asset; test faces, plates, visible text, and audio; verify export; qualify tracking; approve performance language.

## 6. Industry information architecture

### Prioritization

**Initial publication:** `/industries`, legal services, government and public records, and media/journalism/investigations. These have distinct multimodal workflows and can be explained without implying a certification.

**Second wave after evidence/legal review:** Healthcare, financial services, and insurance. These are strong commercial intents but carry greater regulatory-claim risk.

**Deferred dedicated page:** Education and research. It is defensible as a use case, but the initial evidence and content would overlap government, healthcare, and media. Mention it on the overview and validate demand before creating a full route.

**Do not initially split further:** Law enforcement/body-worn video belongs within government until there is evidence for a distinct page. Corporate/HR can appear as an overview use case but should not receive a thin doorway page.

### `/industries` overview

- **H1:** “Redaction workflows shaped around the information you handle.”
- **SEO title:** “Redaction Software by Industry | OpenRedakt”
- **Meta description:** “Explore review-led document, audio, and video redaction workflows for legal, public-records, media, healthcare, finance, and insurance teams.”
- **Structure:** Industry selection hero; media-format matrix; initial priority cards; second-wave use cases clearly described without dead links; shared review workflow; evidence and deployment notes; FAQ; demo CTA.
- **Avoiding doorway pages:** Each published industry page must have unique workflows, sensitive-data types, visuals, FAQs, and feature links—not merely a replaced industry name.

### Legal services — initial

- **Workflows:** Discovery and disclosure sets, court filings, contracts, client records, deposition audio/video, and evidentiary media.
- **Sensitive information:** PII, client identifiers, financial/medical details, witness identities, and reviewer-designated privileged material.
- **Pain:** Mixed media, tight deadlines, large review surfaces, and the need for consistent reviewer decisions.
- **Copy direction:** “Bring document and recorded evidence into a review-led redaction workflow.” Do not claim automatic privilege identification.
- **Features:** Documents first; audio and video for depositions/evidence; review/report sections.
- **FAQ/SEO:** Legal document redaction; redacting deposition recordings; review responsibility; audit records; processing options.
- **Evidence:** Synthetic legal packet and deposition; lawyer/compliance review of terminology; no promise of legal sufficiency.
- **Legal approval:** Privilege, discovery obligations, court filing rules, retention, and jurisdiction-specific language.

### Government and public records — initial

- **Workflows:** Public-records requests, case files, meeting recordings, body-worn or field video, scanned forms, and disclosure packages.
- **Sensitive information:** Citizen/employee identifiers, addresses, signatures, minors, plates, faces, spoken names, and agency-designated exempt information.
- **Pain:** Mixed formats, exemption decisions, response deadlines, and the need to explain review actions.
- **Copy direction:** “Review sensitive details across records and recordings before release.” Avoid claiming the software determines legal exemptions.
- **Features:** Document, audio, video, exemptions/logging, verification/reports.
- **FAQ/SEO:** Public-records redaction; FOIA as a US educational term only; body-worn video; meeting audio; scans; reviewer decisions.
- **Evidence:** Synthetic request package, meeting audio, owned street/bodycam-like footage, and report sample.
- **Legal approval:** FOIA/public-records statutes, retention, accessibility, CJIS, and jurisdiction-specific exemptions.

### Media, journalism, and investigations — initial

- **Workflows:** Source documents, recorded interviews, field footage, leaks/tip material, and publication review.
- **Sensitive information:** Source names, faces, voices, plates, addresses, identifiers, and visible screen/document text.
- **Pain:** Protecting people without destroying context, coordinating multiple formats, and reviewing under deadline.
- **Copy direction:** “Protect identities across source material, interviews, and footage while keeping editorial review in control.”
- **Features:** Audio and video first, then documents; manual review; effect choice; output verification.
- **FAQ/SEO:** Anonymizing interviews; face/plate redaction; transcript handling; local/optional processing; source protection limitations.
- **Evidence:** Fully owned synthetic newsroom scenario; no claim that voice disguise guarantees anonymity.
- **Legal approval:** Defamation, source protection, consent, copyright, and jurisdictional publication duties.

### Healthcare — second wave

- **Workflows:** Records requests, scanned charts, referral packets, recorded calls/interviews, and training/research media.
- **Sensitive information:** Patient identifiers, account numbers, contact details, clinical context, faces, and voices.
- **Pain:** Scanned input, mixed records, contextual identifiers, handoffs, and disclosure review.
- **Copy direction:** “Support careful review of sensitive patient information across records and recordings.”
- **Feature links:** Document and audio primarily; video where there is real evidence.
- **FAQ/SEO:** PHI redaction, scanned medical records, calls, review responsibility, processing model.
- **Evidence:** Synthetic healthcare records; domain review; documented processing and storage behavior.
- **Legal approval:** HIPAA/PHI, BAAs, regional privacy law, retention, and any “compliant” wording. Do not claim HIPAA compliance without formal evidence.

### Financial services — second wave

- **Workflows:** Statements, tax/loan documents, reports, recorded calls, fraud/investigation files, and disclosure packages.
- **Sensitive information:** Account/routing/tax identifiers, signatures, contact details, transaction context, and voice/video identifiers.
- **Pain:** Dense tables, scanned inputs, recurring identifiers, consistent policy, and review evidence.
- **Copy direction:** “Review financial identifiers across documents and recordings before controlled sharing.”
- **Feature links:** Document and audio; video for investigations only when evidenced.
- **FAQ/SEO:** Statement redaction, scanned forms, call redaction, table handling, audit reports.
- **Evidence:** Synthetic financial packet and recording; table/OCR verification; security review.
- **Legal approval:** GLBA, PCI DSS, regional banking rules, retention, and all certification language.

### Insurance — second wave

- **Workflows:** Claims forms, medical attachments, police reports, adjuster notes, witness calls, property images, and accident footage.
- **Sensitive information:** Policyholder/contact identifiers, medical details, payment data, plates, faces, and spoken names.
- **Pain:** Many handoffs, mixed-quality scans, mixed media, deadlines, and sensitive third-party data.
- **Copy direction:** “Coordinate review across the documents, calls, and footage attached to a claim.”
- **Feature links:** All three core feature pages.
- **FAQ/SEO:** Claims redaction; witness-call audio; accident video; medical attachments; reporting.
- **Evidence:** Synthetic claim package; claims-domain review; representative export verification.
- **Legal approval:** Medical-data rules, insurance regulations, retention, and any fraud/investigation claims.

### Education and research — defer pending evidence

- **Potential workflows:** Student records, transcripts, accommodations/IEPs, personnel/discipline files, research interviews, and classroom/research video.
- **Sensitive information:** Student/research-participant identifiers, disability/health details, faces, voices, and demographic/contextual identifiers.
- **Why defer:** The story is plausible but currently lacks differentiated product proof or customer evidence and risks duplicating healthcare/government content.
- **Validation needed:** Search demand, stakeholder interviews, synthetic workflow evidence, and legal review of FERPA/research-ethics language.

## 7. Homepage design improvements

### Message

Retain the current positioning but make the human-review model explicit. Recommended H1:

> Review and redact sensitive information across documents, audio, and video.

Recommended supporting direction: OpenRedakt helps reviewers find candidate information, decide what to conceal, export reviewed media, and check the result. Avoid absolute automation, privacy, and accuracy language.

### Recommended section sequence

1. Header with route-first navigation.
2. Hero with real product image, primary “Request a demo,” and secondary “Explore features.”
3. Compact format and process proof strip—no customer-logo theater.
4. Multimodal product story using the current format navigator, refined with owned screenshots.
5. Four-step workflow: detect candidates → review decisions → export → verify/report.
6. Proof-by-process section covering manual control, processing options, output checks, and reports.
7. Feature-page previews.
8. Priority industry previews.
9. Recent Insights using only real published stories.
10. FAQ.
11. Existing demo form and footer.

This consolidates the overlapping Services and format-capability sections without discarding their useful components or approved interactions.

### Visual storytelling and interaction

- Keep the existing dark palette, fonts, radii, and accent roles.
- Use larger visual crops and fewer same-weight cards.
- Prefer step-linked screenshots, annotations, and short captions over generic icon grids.
- Use subtle crossfades or slides for product tabs, 2–4px hover elevation, underline/arrow movement on editorial rows, and restrained section reveals.
- Preserve reduced-motion behavior and avoid scroll-jacking, autoplay background video, or cursor-dependent effects.
- On mobile, stack hero copy before media, keep one dominant CTA per viewport, make product controls horizontally scrollable only when keyboard/focus behavior remains obvious, and place proof captions below images.

### Trust without unsupported proof

Until verified customer proof exists, trust should be earned through transparent process:

- Explain when AI suggests versus when a reviewer decides.
- Show review states and an example report using synthetic data.
- Explain local and optional processing paths accurately.
- Link to security/privacy details already substantiated by the product.
- Never substitute fabricated logo walls, badges, ratings, or testimonial quotes.

## 8. SEO and editorial architecture

### Keyword and intent map

| Destination | Primary intent | Supporting clusters | Must not target as primary |
|---|---|---|---|
| `/features` | Multimodal redaction software | AI-assisted redaction, redaction workflow | Individual format terms |
| Document feature | Commercial document/PDF redaction | OCR, scanned PDF, office-file preparation, manual review | General “what is redaction” education |
| Audio feature | Commercial audio/transcript redaction | spoken PII, mute/tone, recording review | Broad transcription software |
| Video feature | Commercial video redaction | face blur, plate redaction, visible text, audio in video | Generic video editing |
| Industry pages | Commercial workflow by sector | Sector documents, recordings, review problems | Broad regulation explainers |
| Insights | Informational/how-to | Definitions, checklists, workflow guidance, limitations | Repeating feature-page sales copy |

### Cannibalization rules

- One commercial page owns each feature and industry head term.
- Insights articles answer narrower informational questions and link to the owning commercial page.
- Category/tag pages remain discovery surfaces and should not mimic the feature-page title/H1.
- Do not create city, jurisdiction, or minor-industry variants unless content and demand are truly distinct.
- Where an existing article overlaps a new page, preserve its slug and reposition it as educational rather than creating a replacement.

### Metadata and canonical strategy

- Every indexable route has one canonical URL, unique title, unique description, and one visible H1.
- Keep article canonicals and published slugs stable.
- Keep filtered search, tags, pagination, and internal search states `noindex` where they do not provide a durable landing page.
- Category pages may remain indexable when they contain enough unique content; deeper pagination should be evaluated for `noindex,follow`.
- Remove query-string filter URLs from the sitemap even if a deliberately canonical filter remains indexable. Prefer clean routes only if a future migration includes redirects and tests.
- Do not change `saferedact.io` canonical origins until the OpenRedakt production domain, redirects, and Search Console plan are approved.

### Structured data

- Preserve current `Article` data and ensure dates, author text, image, and canonical URL match the rendered page.
- Add `BreadcrumbList` to feature, industry, category, and article pages.
- Add `FAQPage` only when the exact questions and answers are visible and eligible; do not generate it for every accordion automatically.
- Review current `SoftwareApplication` claims before expanding them.
- Add organization data only after the official name, URL, logo, address/contact details, and social profiles are approved.

### Internal-linking map

```text
Homepage
├── Features overview
│   ├── Document ──> Legal / Government / Healthcare / Finance
│   ├── Audio ─────> Government / Legal / Media
│   └── Video ─────> Government / Media / Legal
├── Industries overview
│   └── Each published industry ──> relevant feature pages
└── Insights
    ├── Feature education ──> owning feature page
    ├── Industry guidance ──> owning industry page
    └── All articles ──> related real articles + contextual demo CTA
```

Feature and industry pages should link to two or three relevant Insights articles only when they exist. Do not publish empty “resources” modules.

### Topic clusters and initial editorial calendar

The following are briefs, not finished articles or scheduled publication dates:

1. What redaction is—and how it differs from visual masking (evaluate updating the existing article rather than duplicating it).
2. A document-redaction review checklist before external disclosure.
3. OCR and scanned documents: where automated detection needs human review.
4. An audio-redaction workflow from transcript candidate to reviewed export.
5. How to review spoken PII without removing necessary context.
6. A practical video review guide for faces, plates, visible text, and audio.
7. Preparing mixed-media public records for redaction and release (legal review required).
8. A legal disclosure redaction checklist across documents and depositions (legal review required).
9. Source-protection considerations for documents, interviews, and footage.
10. Local versus optional cloud-assisted detection: questions buyers should ask.
11. What output verification can and cannot prove.
12. Preparing common file types for a redaction workflow.

Publish only after each brief has an owner, product evidence, target query, differentiation check, review requirements, and a relevant conversion destination.

### Sitemap, indexing, and legacy domain migration

- Add only published feature and industry routes to the sitemap.
- Continue excluding admin, moderation, API, preview, and unpublished content.
- Validate scheduled/archived content remains absent from route generation and sitemap output.
- Inventory every `saferedact.io` canonical, Open Graph URL, structured-data URL, footer link, support address, CMS URL, and webhook/config reference.
- When an official OpenRedakt domain is ready: approve a path-preserving 301 map; update canonical/OG/schema/sitemap/robots/config together; verify both domain properties; submit the new sitemap; monitor indexing and redirect chains. Do not perform a piecemeal domain swap.

### Educational guidance versus product claims

Every page should label the distinction in its content model:

- **Educational:** Describes common workflows, regulations, or review considerations and may require legal/editorial review.
- **Demonstrated capability:** Backed by current code plus a reproducible test and owned screenshot.
- **Conditional capability:** Backed by code but dependent on configuration, external tools, hardware, or optional services; disclose the condition.
- **Unverified claim:** Do not publish.

## 9. Component strategy

### Reuse and refine

- `Header`, mobile navigation behavior, `Footer`.
- `Button`, `Container`, `Eyebrow`, `SectionHeading`, `Accordion`.
- `AnimateOnScroll` and its reduced-motion behavior.
- Hero/product preview, workflow, format-tab, FAQ, and final-CTA building blocks.
- `ArticleBody`, `ArticleSearch`, content-type/category/tag controls, pagination, current article cards, and comments.
- Existing metadata, nonce-aware JSON-LD, content validation, and URL helpers.

### New components or modules

- Route-first desktop dropdown and mobile disclosure navigation.
- `PageHero`, `Breadcrumbs`, and `ProofByProcess`.
- Validated `FeaturePageContent` and `IndustryPageContent` registries.
- Shared feature/industry page layout primitives, while keeping workflow-specific sections concrete.
- `EditorialHero`, `FeaturedStory`, `ArticleArchive`, `ArchiveMonth`, `ArchiveRow`.
- `ArticleMeta`, `ArticleTableOfContents`, `ArticleAsideCta`, and revised `RelatedStories`.
- Markdown heading extraction and stable heading IDs using existing parsing dependencies.
- Breadcrumb and optional FAQ schema helpers.
- A claim/evidence registry stored in documentation or validated content data.

Avoid building a generic page-builder or adding a motion/design-system dependency. The current stack can implement the proposal.

## 10. Content model impact

- Keep Insights in Decap CMS and `content/blog`.
- Keep marketing feature and industry copy in typed, reviewed source content initially; this reduces the risk of unsupported claims entering production through a general CMS workflow.
- Preserve every existing article filename, slug, publication state, and frontmatter contract.
- Derive archive groups, TOC, reading time, related content, and breadcrumbs from current data.
- If author profiles are later needed, add a separate validated registry and make references optional.
- If contextual CTAs need analytics, add an allowlisted context identifier—not free-form tracking parameters or a new backend.
- Do not alter CMS authentication, moderation authentication, comments persistence, or backend services as part of the visual redesign.

## 11. Accessibility, mobile, performance, and security

### Accessibility

- One H1 per page; logical H2/H3 structure; month headings at H2, not decorative H1s.
- Keyboard-operable dropdowns, disclosures, tabs, search, filters, TOC, accordions, and comments.
- Visible focus states using existing tokens; no hover-only information.
- Skip-link destination remains stable across templates.
- TOC active state cannot rely on color alone.
- Images need meaningful alt text; decorative imagery uses empty alt text.
- Maintain text/background contrast and 44px touch targets.
- Preserve reduced motion and zoom/reflow to 200%/400% as applicable.

### Mobile

- 390px: single-column header/body, full-width search, wrapping or accessible horizontal filter controls, in-flow TOC/CTA, no sticky side rail.
- 768px: editorial media and metadata remain readable; no clipped controls; side content stays in-flow unless width is demonstrably sufficient.
- 1024px+: enable two-column article layout and sticky rail with footer collision protection.
- Long titles, category labels, and URLs must wrap without overflow.

### Performance

- Reuse Next Image and provide responsive sizes for all new media.
- Avoid autoplay video in primary page loads; use optimized poster frames and user-initiated demos.
- Keep heading extraction server-side and avoid shipping the Markdown parser twice.
- Do not add a client animation package; existing CSS/observer patterns are sufficient.
- Limit font weights and preserve current local/font-loading strategy.
- Set route budgets and compare homepage/article JavaScript and image transfer before and after each stage.
- Resolve current Next image warnings for quality `92` and versioned local image patterns before upgrading to Next 16.

### Security and privacy

- Preserve CSP nonces, security headers, Markdown sanitization behavior, safe external link attributes, and asset-path validation.
- Keep SafariChat configuration-gated, lazy, identity-free, and without uploads.
- Preserve contact honeypot, validation, rate limits, request-size limits, and explicit failure states.
- Preserve comments moderation and fail-closed behavior.
- Never include real sensitive information in screenshots or sample files.
- New structured data must remain nonce-aware and serialize trusted typed data only.
- No new third-party embeds, analytics, form services, or dependencies without separate review.

## 12. Design acceptance criteria

The direction is ready for implementation only when the following are approved:

### Brand and visual quality

- OpenRedakt is spelled with K everywhere in visible marketing content.
- Existing colors, typefaces, radii, spacing, and core interactions remain recognizable.
- The work is editorially inspired by the references without reproducing their assets, copy, source, or distinctive branding.
- Every product screenshot is owned/synthetic, current, accessible, and evidence-linked.
- No empty article, testimonial, customer-logo, or proof placeholders appear.

### Information architecture and conversion

- Header and footer expose only published routes.
- All pages use demo/contact CTAs; none offer downloads, logins, trials, or application access.
- Feature and industry pages are mutually linked by genuine workflow relevance.
- The homepage is shorter in repeated copy and stronger in onward pathways.
- Insights discovery continues to support search, type, category, tags, and pagination.

### Editorial and SEO

- Existing published article URLs and metadata remain stable.
- Archive grouping uses actual publication dates and real content only.
- Articles maintain safe Markdown, comments, and CMS compatibility.
- Every indexable page has unique metadata, canonical URL, H1, breadcrumb path, and sitemap decision.
- Structured data matches visible content.
- No industry page is a near-duplicate template with nouns swapped.

### Quality and risk controls

- Full current test suite remains green; new routes and content rules gain focused tests.
- Keyboard, screen-reader landmarks, reduced motion, 390/768/1024/1440 layouts, and high zoom are reviewed.
- Contact, SafariChat, CMS authentication, moderation, scheduling, sitemap, and security headers are regression-tested.
- Capability and regulatory copy is traceable to evidence and required approvals.
- No new dependency or external service is introduced silently.

## 13. Scope estimate and principal risks

Estimate in focused engineering days, excluding content-owner/legal turnaround and net-new product screenshots:

| Stage | Scope | Estimate | Main regression risk |
|---|---|---:|---|
| 0 | Evidence register, IA/content contracts, screenshot plan | 2–3 | Claims become detached from product reality |
| 1 | Insights listing and article redesign | 5–8 | Filter URLs, CMS compatibility, Markdown headings, comments |
| 2 | Features overview and three detail pages | 6–9 | Unsupported claims, dynamic-route metadata, image weight |
| 3A | Industries overview + 3 priority pages | 6–9 | Repetitive content, legal terminology, route sprawl |
| 3B | Healthcare/finance/insurance after approval | 5–8 | Regulatory claims and insufficient evidence |
| 4 | Homepage/header/footer refinement | 4–6 | Existing anchor behavior, mobile navigation, conversion form |
| 5 | Schema, sitemap, internal links, editorial integration | 3–5 | Canonical/indexing mistakes and content cannibalization |
| 6 | Cross-browser/accessibility/performance/security QA | 3–5 | Late visual and integration regressions |

Initial approved scope (Stages 0–5 excluding 3B) is approximately 29–45 engineering days, plus content production, screenshot capture, design review, and legal/product approval. A smaller first release can stop after Insights, features, three priority industries, and navigation integration.

## 14. Decisions requested before implementation

1. Confirm the proposed visual direction: editorial hierarchy inspired by Cluely, expressed with the existing OpenRedakt design tokens.
2. Confirm initial industry priority: legal, government/public records, and media/journalism/investigations.
3. Confirm healthcare, finance, and insurance are held behind evidence/legal review, and education remains deferred.
4. Provide the missing Cluely recording if its motion or responsive behavior is part of the acceptance target.
5. Approve creation of owned synthetic screenshots, especially replacement of the watermarked video asset.
6. Confirm whether `saferedact.io` remains the production canonical for this release or whether a separately managed domain migration is planned.
7. Confirm the recommended homepage H1 direction and proof-by-process approach in lieu of unsupported customer/certification claims.

Implementation should not begin until these decisions and the companion implementation plan are approved.
