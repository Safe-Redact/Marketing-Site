# SafeRedact Marketing Site Repository Audit

Audit date: 2026-10-13  
Scope: inspection and planning only; no production source files were modified.

## Executive summary

The repository is a compact, single-page Next.js marketing site. The implementation is structurally sound and is a good base for the redesign: content is separated from section components, shared UI primitives already exist, the homepage is statically rendered, and the interactive pieces are isolated client components. A redesign does not justify changing the framework or introducing a component library.

The biggest constraints are content and assets rather than engineering. The repository contains no full wordmark, product screenshots, customer logos, or approved illustration library. It also contains several strong service, security, compliance, and performance claims that are present only as marketing copy and are not corroborated by code or supporting documents. Those claims must be approved, softened, or removed before launch.

## Git and working tree

- Repository: `https://github.com/Safe-Redact/Marketing-Site.git`
- Current branch: `master`
- Upstream: `origin/master`
- HEAD: `31a4305 add readme`
- History: two commits (`a6461bf` initial implementation, `31a4305` README)
- Initial status: clean; no staged, unstaged, or untracked files.
- Audit output is limited to `docs/marketing-revamp/`.
- No commit, push, merge, reset, or history rewrite was performed.

## Framework and architecture

| Area | Finding |
| --- | --- |
| Framework | Next.js App Router, declared `^15.3.4`; lockfile currently resolves Next.js `15.5.23` |
| Runtime | React/React DOM declared `^19.1.0`; installed `19.2.8` |
| Language | TypeScript, strict mode, `@/*` alias to `src/*` |
| Styling | Tailwind CSS 3 with a custom token extension plus global CSS utilities |
| Rendering | One statically generated homepage; one dynamic contact API route |
| Package manager | npm with `package-lock.json` |
| Tests | No unit, component, accessibility, or browser test harness is configured |
| External UI library | None; icons are local inline SVG paths |

The repository follows a simple three-layer page architecture:

1. `src/content/` holds page copy and structured lists.
2. `src/components/sections/` renders homepage sections.
3. `src/components/ui/` and `src/components/layout/` provide primitives and site chrome.

This separation should be retained. The redesign can be implemented by evolving tokens and primitives, then migrating sections in page order.

## Routes and layouts

| Route | File | Behavior |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Composes the full marketing homepage |
| `/api/contact` | `src/app/api/contact/route.ts` | Validates required JSON fields, logs the submission, returns success |
| `/robots.txt` | `src/app/robots.ts` | Allows all crawlers and points to the sitemap |
| `/sitemap.xml` | `src/app/sitemap.ts` | Lists only the homepage |

`src/app/layout.tsx` loads Inter through `next/font/google`, defines global metadata, and injects `ProfessionalService` JSON-LD. There are no nested layouts and no additional marketing routes.

## Existing homepage inventory

Current order in `src/app/page.tsx`:

1. Fixed header and mobile drawer
2. Hero with two CTAs, trust statements, and a CSS-built processing dashboard
3. Four-item trust bar
4. Video/audio/document service overview
5. Why professional redaction matters
6. Three-step service process
7. Industry cards
8. SafeRedact differentiators
9. Quality and confidentiality
10. Desktop software alternative
11. FAQ accordion
12. Contact CTA and inquiry form
13. Footer

## Existing functionality to preserve

- In-page navigation anchors and the `#main-content` skip link.
- Fixed navigation with a visually distinct scrolled state.
- Responsive mobile navigation, body-scroll lock, and Escape-to-close behavior.
- FAQ accordion state and `aria-expanded` signaling.
- Contact form fields, required-field behavior, loading state, success state, and failure fallback.
- Direct `mailto:support@saferedact.io` contact path.
- Desktop software download link to `https://saferedact.io/download`.
- Content/data separation in `src/content/`.
- Reduced-motion CSS handling.
- Metadata, JSON-LD, robots route, and sitemap route.
- Offline-friendly local SVG icon approach.

## Components and reuse assessment

| Component | Assessment | Redesign action |
| --- | --- | --- |
| `Header` / `MobileNav` | Behavior is useful; visuals differ from reference | Preserve behavior, restyle, improve focus management |
| `Footer` | Reusable structure; placeholder legal links are not production-ready | Restyle and connect only verified destinations |
| `Button` | Useful abstraction with variant/size API | Keep API, replace visual tokens and add disabled/hover consistency |
| `Heading` | Useful semantic wrapper; current scale is too rigid | Keep semantic API, adopt fluid type tokens |
| `SectionWrapper` | Good container boundary | Extend with new dark/gradient variants and responsive spacing |
| `Card` / `Badge` | Reusable but currently tied to light warm palette | Retokenize for dark translucent surfaces |
| `Icon` | Good local dependency-free inventory | Keep; add only original SafeRedact-specific symbols if needed |
| `AnimateOnScroll` | Functional reveal pattern with reduced-motion CSS fallback | Keep concept; simplify state logic and avoid hiding meaningful content too long |
| Section components | Correctly separated, but some layouts are one-off | Recompose around a smaller set of shared section patterns |

## Assets, fonts, and brand inventory

### Assets

The only file under `public/` is `public/favicon.svg`. It is an original dark rounded-square mark with three coral redaction bars.

There are no:

- Wordmark or horizontal logo files
- Product screenshots
- Source UI mockups
- Customer or integration logos
- Photography
- Illustration source files
- Open Graph image
- Video assets

The current hero and software visuals are built entirely with HTML, Tailwind classes, and the local `Icon` component. This is valuable because it can be redesigned without licensing concerns.

### Fonts

- Current site: Inter from Google Fonts via `next/font/google`.
- Reference: measured Poppins for major headings and most copy, with Satoshi Variable used selectively for buttons/accordion labels and Roboto as a base/fallback.
- Recommendation: keep a single locally optimized webfont pipeline. Use Poppins for SafeRedact if brand approval allows; otherwise keep Inter and reproduce the hierarchy through size, weight, and spacing. Do not import the reference site's font assets.

### Current brand colors

| Token | Value | Use |
| --- | --- | --- |
| `accent` | `#D97757` | Primary CTA, highlights, icons |
| `accent-dark` | `#B85C3F` | CTA hover |
| `primary-700` | `#1A1A2E` | Core dark background/text |
| `primary-800` | `#14142A` | Deep dark surface |
| `primary-900` | `#0E0E1F` | Footer/gradient depth |
| `surface-50` | `#FDFCFA` | Light page background |
| `surface-100` | `#F8F7F4` | Warm section background |
| `success` | `#4FAE68` | Positive states |

The coral/navy identity is already close enough to the reference's orange/near-black language that it should be refined, not replaced.

## SEO configuration

Present:

- Title template and homepage title
- Meta description
- Open Graph title/description/site URL
- Twitter card metadata
- Canonical metadata base
- Search-engine directives
- JSON-LD for a professional service and three service categories
- Robots and sitemap routes

Gaps and risks:

- No Open Graph or Twitter image asset.
- No canonical URL field is explicitly set for the homepage.
- Structured data describes a service business while the requested positioning is an AI redaction platform; this needs product clarification.
- No privacy or terms routes exist, although the footer displays links with `href="#"`.
- Metadata repeats service-centric positioning and must be aligned with the approved platform/service narrative.
- Sitemap `lastModified` changes on every build, reducing signal quality.

## Forms, analytics, and integrations

### Contact form

The form POSTs JSON to `/api/contact` with `name`, `email`, `organization`, `fileType`, and `message`. Required fields are checked only for presence. The endpoint currently writes submitted data to the server console and returns `{ success: true }`; it does not deliver mail, store a lead, rate-limit requests, validate email structure server-side, protect against spam, or provide durable failure reporting.

This is a prototype endpoint, not a completed lead integration. The redesign must preserve the UI contract while avoiding any claim that inquiries are actually delivered until a backend destination is approved.

### Analytics and third parties

- No analytics, tag manager, session replay, consent manager, CRM, or marketing automation integration is present.
- No environment-variable-backed service integration is present.
- The only external user destinations are the download URL and mailto link.
- The Google font is fetched through Next.js at build time, not loaded from a runtime stylesheet.

## Content verification status

The repository is the only provided product source. It supports the existence of copy about document, video, and audio redaction; an offline Windows application; AI-assisted detection; human review; and quote-based services. It does not independently prove operational or compliance claims.

Claims requiring explicit product-owner/legal approval before reuse include:

- `99.8% Accuracy`, `24h Turnaround`, and `100% Confidential` in the hero visual
- `Accuracy Guaranteed`
- HIPAA-, FISMA-, GDPR-, or GLBA-compliant outcomes
- Encrypted transfer systems and logged access controls
- Guaranteed no-retention/deletion practices
- Every-project audit reports
- Raster reconstruction as the universal redaction method
- Rush processing availability
- Response within one business day
- The exact list of file formats and archival/PDF-A export support

See `CONTENT_MAPPING.md` for the proposed safe handling of each claim family.

## Baseline quality checks

Commands run on 2026-10-13:

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass, with Next.js deprecation warning for `next lint` |
| `npm run build` | Pass |

Build output reports the homepage at 15.4 kB route size and 118 kB first-load JavaScript. The build also warns that Next.js detected multiple lockfiles and inferred `M:\Safaridesk` as the workspace root. That warning should be resolved deliberately, not by deleting a parent lockfile from this task.

## Visual baseline captures

- [Current desktop, 1440×900](baseline-screenshots/saferedact-desktop-1440x900.png)
- [Current mobile, 390×844](baseline-screenshots/saferedact-mobile-390x844.png)

The full page was additionally inspected interactively at desktop and mobile widths. These captures are above-the-fold baselines for regression comparison.

## Preservation constraints

1. Do not change Next.js, React, TypeScript, or Tailwind versions as part of the redesign.
2. Do not replace the content-data pattern with hard-coded copy inside components.
3. Preserve form field names and the `/api/contact` request shape unless a backend integration is separately approved.
4. Preserve semantic heading order, keyboard access, skip navigation, reduced-motion behavior, and anchor targets.
5. Preserve original SafeRedact styling cues: dark navy, coral accent, redaction-bar motif, and plain-language privacy positioning.
6. Do not reuse Elloe artwork, logos, proprietary copy, customer marks, or quantitative claims.
7. Treat all unverified compliance, security, and performance claims as blocked content.

