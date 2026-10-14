# SafeRedact Content Mapping

> Implementation update (2026-10-13): the approved product direction is software-first. The desktop source at `M:\Safaridesk\redact` is now the authority for capability copy; see `APP_CAPABILITY_AUDIT.md`. Managed services, service turnaround, service review, and quote-led positioning are excluded because no production-ready managed-service workflow was verified. Where this original planning document presents alternatives, that approved ruling supersedes them.

## Positioning decision

The current site mixes two offers:

- A managed professional redaction service with human specialists and quote-based delivery
- A Windows desktop product that performs offline AI-assisted redaction

The user brief describes SafeRedact as an AI-powered sensitive-information detection and redaction platform. Until the product owner clarifies the primary commercial model, the safest architecture is a platform-led homepage with two clear paths:

1. `Explore the platform` / product-led narrative
2. `Request managed redaction` / service-led conversion

The homepage should not imply that the software, service, and every capability share identical workflows or guarantees.

## Evidence levels

| Level | Meaning |
| --- | --- |
| A — code-evidenced | A working UI/route or local asset demonstrates the capability |
| B — repository copy | The claim exists in structured project content but has no independent evidence |
| C — blocked | Quantitative, compliance, integration, guarantee, or operational claim requiring approval |

The repository provides strong evidence for the marketing site's current behavior, but only Level B evidence for most product/service capabilities.

## Reference-to-SafeRedact mapping

| Reference section/function | Proposed SafeRedact section | Content source | Status and notes |
| --- | --- | --- | --- |
| Fixed platform header | SafeRedact header with Product, Capabilities, Workflow, Security, FAQ | `site.ts`, current anchors | A for navigation; labels may change |
| Split hero + product visual | `Detect sensitive information. Redact with confidence.` plus original redaction workbench visual | `hero.ts`, `software.ts`, `services.ts` | B; avoid hero percentages and guarantees |
| Integration logo strip | Capability strip: Documents & images, Video, Audio, Offline Windows | Desktop app sources cited in `APP_CAPABILITY_AUDIT.md` | A; use icons/text, not third-party logos |
| Three proof statistics | Three workflow outcomes without numbers: Find, Review, Permanently redact | `services.ts`, `why-saferedact.ts` | B; omit unverified metrics |
| Sparse capability grid | Sensitive-information detection, multi-format review, permanent output | `why-saferedact.ts`, `quality.ts` | B; phrase carefully |
| Product media + accordion | Interactive `From detection to verified output` workflow | `how-it-works.ts`, `services.ts` | B; map tabs to Detect, Review, Export |
| Platform tabs | Format workflows: Documents, Email & attachments, Audio & transcript, Video | docs/video/audio supported in repository; email absent | Email/attachments is blocked pending product confirmation |
| Resource cards | Use cases: Legal, Healthcare, Government/FOI, Financial/Corporate | `industries.ts` | B; remove compliance guarantees |
| Gradient CTA | Two-path CTA: Download for Windows / Request a quote | `software.ts`, `final-cta.ts` | A for links/UI, B for availability promises |
| Multi-column footer | Product, Use cases, Resources, Company/contact | current footer/site config | Only include real routes/anchors |

## Proposed page narrative

### 1. Header

Recommended labels:

- Platform
- Capabilities
- How it works
- Security
- FAQ
- Primary CTA: `Request a quote`
- Secondary product CTA where space permits: `Download for Windows`

Do not add dropdown depth until real destination pages exist.

### 2. Hero

Recommended direction:

**Eyebrow:** AI-powered redaction
**Headline:** Detect sensitive information. Redact with confidence.
**Supporting copy:** SafeRedact helps teams find and remove sensitive information across documents, audio, and video, with review controls before export.

This copy is a synthesis of existing repository claims. Final wording must be checked against the actual product. Avoid `automatic`, `guaranteed`, `compliant`, or numerical accuracy language unless approved.

Primary CTA should reflect the approved business model:

- Platform-first: `Explore SafeRedact`
- Service-first: `Request a quote`

Secondary CTA may remain `See how it works`.

### 3. Capability strip

Replace the reference's third-party integration logos with four original icon-label pairs:

- Documents
- Video
- Audio
- Offline Windows app

All four appear in existing repository copy. File-type details remain subject to validation.

### 4. Outcome trio

Use non-quantitative outcomes instead of the reference's statistics:

- Detect sensitive content
- Review every proposed redaction
- Export permanently redacted files

`Review every proposed redaction` is a recommended interaction principle, not currently proven product behavior. If the software lacks a review step, use `Combine AI-assisted detection with human review` only for the managed service.

### 5. Capability grid

Map the reference's sparse feature grid to:

- AI-assisted detection
- Multi-format workflows
- Permanent redaction
- Audit-ready review history

The audit-report/history item is Level B and must be confirmed. If not approved, replace it with a verified capability from the product team.

### 6. Workflow feature

Use a large original UI visual paired with three accordion rows:

1. Detect — identify candidate sensitive information
2. Review — confirm or adjust proposed redactions
3. Export — create the final redacted file

Each row should describe only the selected media type. Do not claim live collaboration, approval routing, or version history unless product material confirms them.

### 7. Format workflows

Use horizontally scrollable tabs on mobile and inline pills on desktop:

- Documents
- Video
- Audio & transcripts
- Optional: Email & attachments

Email and attachment redaction is mentioned in the user brief as a potential topic but is absent from the repository. It must not ship without approval and supporting product copy.

### 8. Privacy and security

Use process language rather than certification language:

- Local/offline processing for the Windows application — repository copy supports this at Level B.
- Controlled review — confirm actual access model.
- Permanent removal — confirm implementation details by file type.
- Data handling — link to a real policy or omit detailed retention promises.

Do not state HIPAA, FISMA, GDPR, GLBA, SOC 2, ISO 27001, encryption-at-rest, encryption-in-transit, or zero-retention guarantees without reviewed evidence.

### 9. Use cases

Keep the current sectors but rephrase outcomes:

- Legal: prepare case files and discovery materials for disclosure
- Healthcare: remove patient information from records shared outside the care context
- Government: prepare public records for release
- Financial/corporate: remove personal and confidential business information

These are use-case descriptions, not compliance guarantees.

### 10. FAQ

Preserve the accordion and update answers to distinguish:

- Managed redaction service versus desktop product
- Supported file types
- How review works
- Whether processing is offline or uploaded
- What happens to submitted service files
- How to obtain pricing

Each answer must be approved against real operational behavior.

### 11. Final CTA

Recommended split CTA:

- `Download SafeRedact for Windows`
- `Talk to the redaction team`

Keep the contact form only if there is a real lead destination. Until then, the mailto fallback is the only dependable contact path.

## Claims register

| Claim family | Current source | Recommendation |
| --- | --- | --- |
| Video, audio, document support | `services.ts`, `software.ts`, FAQ | Retain provisionally; validate exact formats |
| AI-powered/assisted detection | `software.ts`, `why-saferedact.ts` | Retain provisionally; specify what it detects only after confirmation |
| Offline Windows processing | `software.ts`, FAQ | Retain provisionally; verify supported Windows versions and whether all media stay local |
| Human specialist review | hero, trust bar, process copy | Keep only in managed-service content |
| Secure transfer/encryption | hero, quality, FAQ | Block pending architecture/security evidence |
| Access logging | `quality.ts` | Block pending operational evidence |
| No retention/secure deletion | `quality.ts`, FAQ | Block pending approved retention policy |
| Accuracy guarantee / 99.8% | hero/trust bar | Remove unless substantiated and legally approved |
| 24-hour turnaround | hero visual | Remove; current copy elsewhere says timing varies |
| 100% confidential | hero visual | Remove; absolute claim |
| HIPAA/FISMA/GDPR/GLBA compliant | industries/why copy | Replace with neutral use-case language |
| Audit report for every project | process/differentiator copy | Confirm; otherwise remove |
| PDF/A export | `services.ts` | Confirm exact export support |
| Email and attachment redaction | User brief only | Do not include until approved |
| Review and approval workflows | User brief only | Do not imply multi-user approval routing until approved |

## Content approval checklist

Before implementation begins, obtain written answers for:

1. Is SafeRedact primarily a software platform, a managed service, or both with equal prominence?
2. Which media/file formats are currently supported in production?
3. Which sensitive-data classes are actually detected by AI?
4. Does every workflow include human review, and is that service-only or product functionality?
5. Is all Windows-app processing offline for every supported workflow?
6. What is the real service upload/transfer mechanism?
7. What retention and deletion policy is approved for public marketing copy?
8. Are audit reports or review histories generated, and in which product/service tier?
9. Is email/attachment redaction available?
10. Which legal, privacy, security, or compliance statements have counsel approval?
