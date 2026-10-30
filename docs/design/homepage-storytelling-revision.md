# Homepage storytelling revision

Date: 2026-10-30 · Branch: `feat/openredakt-stage-b-features` (uncommitted, not deployed)

## 1. GitBook reference (gitbook.com, measured at 1440px and 390px)

Principles were borrowed. No GitBook copy, graphics, logos or assets were used.

| # | Section | Purpose | Heading | Text : visual | Background | Width / image scale | New idea? |
|---|---|---|---|---|---|---|---|
| 1 | Hero | Promise, then proof | Pill chip → 45px/700 two-line H1 with a coloured second clause → one-line sub → 2 CTAs | ~40 words : one large app window | White, with an orange ribbon behind the window | H1 721px wide; app window 1,123px (≈78% of the viewport), with traffic-light dots and tabs above | Yes |
| 2 | Logo row | Social proof | none | — | White | Full width | Yes (not applicable to OpenRedakt: no customer logos) |
| 3 | "Get started with AI" | Entry points | 32px H3, centred | Short strip | White | Narrow | Yes |
| 4 | Problem rows ×2 | Name the pain | 32px H2, left-aligned, 2–3 line paragraph | ≈1:1, alternating sides | White; visuals on soft off-white panels | Text ≈530px; visual 460–570px | Yes, a different problem each row |
| 5 | System | The answer | 38px H2, centred | Diagram, then 4 feature cards | White | 790px heading; 4-column cards | Yes |
| 6 | Testimonial | Proof | Quote | — | White | — | (not applicable: no fabricated quotes) |
| 7 | Enterprise | Scale and trust | 38px H2 + CTA | Feature grid around a visual | White | Centred visual ≈570px | Yes |
| 8 | Customers | Proof | 38px H2 | Logo carousel | White | — | (not applicable) |
| 9 | Closing | Restated promise | 45px centred | No visual | **Warm off-white `rgb(250 250 249)`** | 485px heading | Restatement |
| 10 | Footer | Navigation | — | — | White | — | — |

Takeaways:
- **Structure.** Each section carries one idea. Product proof comes immediately after the promise, at large scale.
- **Text.** Headings are short (5–9 words), and paragraphs never exceed three lines.
- **Rhythm.** Alternating rows give movement, and one centred "system" section breaks the alternation.
- **Background.** Warm near-white is the background change, not black.
- **Mobile.** Everything stacks to one column with full-width visuals.

## 2. OpenRedakt homepage before (rendered 2026-10-30)

| # | Section | Finding |
|---|---|---|
| 1 | Hero: ember field, then the showcase in a **white card with a "Review in context" header**, inside a pale stage | **Dark-theme** capture of an older build; a pale block around the window; plain hero with no context |
| 2 | TrustBar: 4 icon columns (Documents, Audio, Review before export, Windows desktop) | Generic icon grid; repeats ideas told again in §4 |
| 3 | ReviewStatement: centred statement + 3 principles | Good idea, but abstract; repeats §7's message; very tall band (`pb-40`) |
| 4 | Formats band (**black** `theme-dark`): intro + document row + audio row | Black storytelling area (no longer approved); screenshots ≈430–650px wide inside ≈1,160px of black, so the **audio window was tiny**; row bullet lists duplicate the feature pages |
| 5 | Workflow (**black**): accordion + step visual | Useful and interactive; black background; step 2 used the dark capture |
| 6 | Platform: 3 outcomes + 4 pillars | Repeats §3 ("decisions, not detections"); mentions "frame" (video) |
| 7 | Industries: 4 sector groups | Distinct (who it is for); keep |
| 8 | Blog panel | Approved; keep |
| 9 | FAQ | Distinct (objections); keep |
| 10 | Footer invitation + footer | Approved; keep |

## 3. After

| # | Section | Change | Why |
|---|---|---|---|
| 1 | **Hero** | Chip ("Windows desktop app · Documents and audio") + mono eyebrow + two-line H1 "Redact with confidence. / Every decision stays yours." The showcase is a **light app window** with traffic-light chrome showing the masked project library (`home pag workspace.png`). The white card, its header and the pale block are removed. Gradient and scroll zoom kept. | Real current product in the first screen; less plain without clutter |
| 2 | **The problem**: "Information moves. Risk follows." | Replaces TrustBar + ReviewStatement. Editorial two-column composition with what is at stake in documents and in audio. No icons. | One new idea (why redaction review matters); removes the icon grid and the duplicate statement |
| 3 | **Document**: "Find it. Review it. Redact it." | Warm near-white band. Short copy and one link, then a **full-width** product visual (document workspace). | Large, readable product evidence |
| 4 | **Audio**: "Every second matters." | Same band, **identical frame** (same component, crop ratio and width) with the audio workspace | Fixes the tiny audio screenshot; equal prominence |
| 5 | **Workflow**: "From sensitive to shareable." | Light. The accordion is kept; step visuals are light captures in the same app window (files being prepared → manual tools → export dialog). | Interactive, and distinct from §3–4 |
| 6 | **Why OpenRedakt** | Replaces Platform. A 2×2 set of verified differentiators on the warm band: review before export, documents and audio in one app, optional audit report, Windows desktop with exports written to a folder you choose. | Distinct from earlier sections; every claim verified in the app (§5) |
| 7 | Industries | Kept | Sector navigation; distinct idea |
| 8 | FAQ | Kept | Objection handling |
| 9 | Blog | Kept | Approved design, real CMS data |
| 10 | Footer invitation + footer | Kept | Approved |

## 4. Palette

| Role | Value |
|---|---|
| Storytelling band | `#F7F6F4` (warm near-white, between the site's raised `#FAFAF9` and active `#F5F5F4`). The band fades from and back to white over 160px, so there is no hard seam. |
| Product stage | `#EFEDE9`, inside the band |
| Headings | `#1C1917`; body `#57534E`; accents coral `#FF735C` / ink `#C2412A` |
| App-window chrome | `#ECEAE6` with traffic-light dots `#FF5F57`, `#FEBC2E`, `#28C840` |

The black `theme-dark` storytelling and workflow bands are removed from the homepage. No other page used them.

## 5. Claims checked for the new copy

| Claim | Evidence |
|---|---|
| Review before export | DOC-REVIEW and AUD-TIMELINE (register: Publishable) |
| Documents and audio in one application | Both workflows ship (register) |
| Optional audit report | Visible in the document export dialog ("Off by default"); DOC-REPORT Publishable |
| Exports written to a folder you choose on your PC | Audio export dialog text "Exported on this PC… written to the folder you choose". Not phrased as offline processing (blocked claim). |
| Masking effects | Captions say "mute, tone, silence or noise", per AUD-EFFECTS |

## 6. Light-theme-only audit (site-wide)

The dark captures (`hero-document-review.png`, `format-documents.png`) are retired from the site, unpublished from `public/` and removed from the media registry. Their masters stay in `assets/product-screenshots/raw/` (not served).

| Page | Was dark | Now |
|---|---|---|
| Homepage hero | `hero-document-review` | Project library (light) |
| Homepage workflow step 2 | `format-documents` | Manual redaction tools (light) |
| Document page hero | `format-documents` | Document workspace (light). Caption: no document open. |
| Document page "Start with evidence" | `format-documents` | **Text only (safe fallback):** no light capture shows the findings list |
| `/features` document overview row | `format-documents` | Workspace files panel (light) |
| How It Works 03–04 | `format-documents` | Manual redaction tools (light), labelled "Review and mark" |
| Industry pages (rotation) | 2 dark options | Light options only |
| Blog fallback cover | Derived from the dark hero | Re-derived from `document interface.png` (light) |

Gap: a light capture of a document under review (marks and findings) would restore findings-list evidence (CAP-DOC-01L, optional).

## 7. Revision 2 (2026-10-30, owner feedback)

| Area | Before (revision 1) | After | Why |
|---|---|---|---|
| Problem | Two-column editorial text: heading left, "in documents / in audio" rows right | Centred chip "Why review matters", one-line statement "Information moves. **Risk follows.**", and a short lede. Below it, an illustrative composition: four cards connected by dotted lines to one central review step ("Reviewed before export"). The cards show a scanned statement with highlighted "Account number" and "Signature", an interview recording with a highlighted spoken range, an investigation report with "Name" and "Home address", and the recipients copies go to. On phones the review step comes first and the cards stack. | Owner asked for a stronger, more visual problem section (Clarasight-style). The cards show *where detail sits and where it goes*, without product claims. The composition is decorative (`aria-hidden`); the heading and lede carry the meaning. |
| Document / audio | Full-width product stage: an 1160px cream slab with a 1080px window inside, text above | Balanced two-column rows (GitBook-style). The text column has a coral number chip, heading, short copy, highlight chips and a link. The window sits in the other column, mirrored for audio. **No backing slab.** Both windows use crops of one ratio (1.396: document 955×684, audio 990×709) in equal-width columns, so they render at the same size (658×504 at 1440). | Owner found the showcases oversized and isolated, and did not want the cream slab |
| Band | Gradient fade from and back to white | Solid `#F7F6F4` with 1px `rgb(28 25 23 / 0.1)` dividers at top and bottom (`.story-surface`) | Owner asked for a visible start and end to the product-story band |
| Blog | Panel at full container width (≈1160×610), large padding and heading, 0.85:1.15 thumbnail column | Panel max 64rem (1024×452 at 1440), tighter padding, a smaller heading whose second clause sits on its own line, a 0.62:1.38 thumbnail column, a smaller title, and reduced space before the footer invitation | Owner found the blog block oversized |

The page is about 1,000px shorter at 1440 (10,193 → about 9,200).
