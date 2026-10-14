# Production Readiness Checklist

Status values: **PASS**, **PENDING**, or **BLOCKED**.

## Application and content

- **PASS** — Marketing-only navigation, CTAs, active imports, rendered links, and sitemap remain free of application distribution destinations.
- **PASS** — Product copy remains within the verified SafeRedact capability audit.
- **PASS** — Legacy baseline `31a4305` and inactive legacy modules remain preserved.
- **PASS** — No new dependency or second application was introduced.

## Navigation and motion

- **PASS** — Native anchors retain URL hash and browser-history behavior.
- **PASS** — Shared mobile/desktop fixed-header offsets cover direct targets.
- **PASS** — Reduced motion disables smooth scrolling and nonessential reveal transitions.
- **PASS** — Reveal content is visible by default, one-time, and progressively enhanced.
- **PASS** — Active navigation exposes `aria-current="location"` without URL mutation.
- **BLOCKED** — Real-browser verification of repeated anchor clicks, Back/Forward, touch momentum, and exact landing geometry.

## Accessibility

- **PASS** — One page-level `h1`; section content uses semantic headings and landmarks.
- **PASS** — Skip link, navigation labels, tab semantics, accordion disclosure semantics, form labels, live status, and visible focus treatment are present.
- **PASS** — Mobile navigation retains focus trapping, Escape close, explicit close control, and focus restoration for dismiss actions.
- **PASS** — Decorative illustrations are hidden from assistive technology; informative figures carry text labels.
- **PASS** — Form exposes native autocomplete and `aria-busy` submission state.
- **BLOCKED** — Screen-reader and full keyboard acceptance in an authorized browser/device environment.
- **BLOCKED** — Measured color-contrast audit with rendered fonts and final compositing.

## SEO

- **PASS** — Descriptive title, description, Open Graph, Twitter, robots, and `SoftwareApplication` structured data remain present.
- **PASS** — Canonical homepage metadata is explicit.
- **PASS** — Sitemap contains only the marketing homepage.
- **PENDING** — Approved Open Graph image asset; none was invented or referenced.
- **PENDING** — Search Console/Bing ownership and production crawl verification.

## Performance

- **PASS** — Fonts use `next/font` with swap behavior.
- **PASS** — Motion uses CSS transforms/opacity and one short-lived IntersectionObserver per reveal wrapper.
- **PASS** — Active-section calculation is passive and animation-frame throttled.
- **PASS** — No scroll-animation package was added.
- **PENDING** — Production Lighthouse/Core Web Vitals measurements.
- **BLOCKED** — Real-browser layout-shift, main-thread, and mobile viewport profiling.

## Lead delivery and privacy

- **PASS** — Current log-only behavior is disclosed before and after submission.
- **PASS** — Direct email fallback is available.
- **PENDING** — Approved mailbox or CRM destination and provider.
- **PENDING** — Server-side validation hardening, abuse controls, provider error handling, and operational monitoring.
- **PENDING** — Removal of full enquiry data from routine production logs when real delivery is implemented.
- **PENDING** — Approved privacy notice, retention schedule, processor inventory, rights process, and legal terms.
- **PASS** — Unapproved legal destinations remain absent from public navigation.

## Deployment

- **PENDING** — Confirm production Node/Next.js hosting target and environment configuration.
- **PENDING** — Resolve or explicitly accept Next.js workspace-root inference caused by multiple lockfiles above this repository.
- **PENDING** — Migrate from deprecated `next lint` to the ESLint CLI before Next.js 16.
- **PENDING** — Configure lead-delivery secrets only after integration approval.
- **BLOCKED** — Final browser visual and interaction acceptance.
