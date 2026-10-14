# Phase 2 section mapping

Date: 2026-10-13
Reference: Elloe TruthChecker, inspected at 1440×900, 768×1024, and 390×844
Product authority: `APP_CAPABILITY_AUDIT.md` and the read-only application source at `M:\Safaridesk\redact`

## Page-level composition

Phase 2 replaces the alternating inherited light templates with a continuous SafeRedact navy canvas. The approved Phase 1 header, hero, and capability strip remain the opening composition. The remaining narrative follows the reference rhythm without copying its text or artwork:

1. Non-quantitative outcome band and sparse platform capabilities.
2. Product workflow with an original workbench preview and accessible accordion.
3. Format-aware product panel with keyboard-accessible tabs.
4. Three use-case resource cards.
5. Dark FAQ disclosures.
6. Saturated conversion panel plus the preserved contact form.
7. Real-destination multi-column footer.

The 1232px container, 20px mobile gutters, Poppins/Inter typography, coral action color, cyan detection accent, shared radii, and reduced-motion behavior remain canonical.

## 1. Capabilities

- **Reference pattern:** a short three-column proof band followed by a large left-aligned heading and a sparse two-column feature grid with icon, title, and concise body copy.
- **SafeRedact content:** `Detect candidates`, `Review decisions`, and `Create outputs` replace unsupported statistics. The capability grid covers document and image review, video review, audio and transcript review, and the verified review/export controls from the capability audit.
- **Desktop:** three equal outcome columns separated by subtle hairlines; a major heading constrained to roughly 720px; capabilities in a two-column grid with generous vertical gaps rather than boxed cards.
- **Mobile:** outcomes stack with horizontal dividers; capability items become one column. Text remains left aligned and no decorative element creates overflow.
- **Typography:** 48px-class major heading on desktop and 28px-class mobile heading; 18–20px feature titles; 16px body copy; 13px uppercase eyebrow.
- **Surface:** canvas background, quiet blue-gray borders, cyan icon tiles, coral emphasis on selected phrases only.
- **Illustration:** no large illustration; local line icons communicate the capability families.
- **Interaction/motion:** restrained one-time opacity/translate reveal through the existing motion-safe wrapper; hover changes border/icon tone only.

## 2. Product workflow

- **Reference pattern:** an approximately equal two-column layout with a large media panel on the left and a vertical accordion on the right.
- **SafeRedact content:** `Open`, `Detect and review`, and `Export and inspect`, limited to implemented project, review-state, adjustment, and export paths.
- **Desktop:** original workflow preview occupies roughly 55% of the row; accordion occupies 45%. The preview shows a document canvas, candidate findings, approved/rejected states, and output status using React/CSS/SVG.
- **Mobile:** heading first, preview second, accordion third. Preview controls simplify at narrow widths while retaining their labels.
- **Typography:** 42px-class section heading desktop, 28px mobile; 18px accordion labels; 15–16px descriptions.
- **Surface:** raised navy preview and accordion rows with 1px blue-gray borders and 8–16px radii.
- **Illustration:** original SafeRedact workflow preview; no reference imagery or product screenshot is copied.
- **Interaction/motion:** one accordion item open at a time. Buttons expose `aria-expanded` and `aria-controls`; collapsed panels are hidden. Preview content follows the selected workflow step. Transition is opacity/color only under normal motion and effectively static under reduced motion.

## 3. Industries and use cases

- **Reference pattern:** three equal resource cards below a broad heading and short supporting sentence.
- **SafeRedact content:** three grouped use-case cards: legal and public records; healthcare and research records; financial, corporate, and investigative material. Copy describes preparation and review work, not compliance outcomes.
- **Desktop:** three equal cards with a shallow original CSS/SVG header visual and consistent title/body/footer geometry.
- **Mobile:** one card per row; visuals keep a fixed aspect ratio and text is never truncated.
- **Typography:** 42px-class heading desktop; 19px card titles; 15–16px body copy.
- **Surface:** `surface-raised` cards, quiet border, subtle cool shadow, 8px radius.
- **Illustration:** abstract record stacks, review markers, and redaction bars generated with CSS/SVG.
- **Interaction/motion:** cards are informational rather than false links. Hover may lift border luminance without translating the card.

## 4. Why SafeRedact

- **Reference pattern:** a major gradient-accented heading, compact pill-tab row, and a split descriptive/product panel.
- **SafeRedact content:** format-aware views for `Documents & images`, `Audio & transcripts`, and `Video`. Each tab uses only capability-audit language. Windows availability and on-device options are supporting facts, not separate unverified promises.
- **Desktop:** tabs remain inline. Selected format displays concise copy and verified review points on the left with an original format-specific visual on the right.
- **Mobile:** tab list is a labeled horizontally scrollable region; panel stacks copy over the visual. A visible edge/fade cue indicates additional tabs without hiding labels.
- **Typography:** 48px-class major heading with cyan-to-blue accent phrase; 18–20px panel title; 16px body.
- **Surface:** canvas section with a large raised split panel; selected tab uses cyan border plus text, not color alone.
- **Illustration:** CSS/SVG page regions, waveform/time ranges, or video frame/timeline according to the selected format.
- **Interaction/motion:** ARIA tab pattern, click plus Left/Right/Home/End keyboard support, and a non-animated content swap under reduced motion.

## 5. Final CTA

- **Reference pattern:** the only strongly saturated panel, using a cyan/blue field, dark text, two actions, and large internal spacing.
- **SafeRedact content:** download SafeRedact for Windows or evaluate a workflow through the existing contact path. Copy states that the site can accept a submission but does not claim external delivery.
- **Desktop:** rounded gradient introduction panel above a dark two-column contact area; CTA copy/actions left, original SafeRedact redaction mark right. Contact details and form remain balanced beneath it.
- **Mobile:** single-column gradient panel; actions stack to full width; form follows in one column.
- **Typography:** dark 42–48px CTA heading on the saturated field; white 32–42px contact heading below; 16–18px supporting copy.
- **Surface:** original mint-to-cyan/blue gradient used only here; contact form uses raised navy controls with explicit labels and visible focus states.
- **Illustration:** oversized SafeRedact redaction-bar motif constructed with CSS/SVG.
- **Interaction/motion:** normal link/button states; form loading prevents duplicate submit; status and errors use `role=status`/`aria-live`; no delivery promise beyond the API response.

## 6. Footer

- **Reference pattern:** logo/brand column plus multiple compact link columns and a separated legal row.
- **SafeRedact content:** brand summary, homepage anchors, Windows download, support email, and the existing copyright statement. Terms/privacy links are omitted until real routes exist.
- **Desktop:** four columns within 1232px: brand, platform, workflows, contact. Copyright and product availability note sit below a divider.
- **Mobile:** columns stack with 32–40px gaps; links retain at least 44px touch rows where practical; legal row becomes a simple vertical block.
- **Typography:** 16px column headings, 14–15px links, 12–13px legal text.
- **Surface:** same canvas as the page, with a single top border rather than a separate black block.
- **Illustration:** existing local favicon/redaction mark only.
- **Interaction/motion:** real anchors and destinations only; standard focus/hover states, no decorative animation.

## Preserved supporting section

The FAQ remains between use cases and conversion. It adopts the shared dark accordion geometry and accessibility behavior so it belongs to the same visual system. Existing verified answers remain structured in `src/content/faq.ts`.

## Component migration

- Create `src/content/platform.ts` for outcomes, capabilities, workflow steps, format tabs, use-case groups, and structured illustration labels.
- Create a reusable accessible `Accordion` primitive.
- Create original `WorkflowPreview` and format/use-case visuals in `src/components/visuals/`.
- Recompose `Services`, `HowItWorks`, `WhySafeRedact`, `Industries`, `Faq`, `FinalCta`, and `Footer` around Phase 1 `Container`, `Eyebrow`, `SectionHeading`, `Button`, `Card`, `Icon`, and motion tokens.
- Remove redundant `WhyRedaction`, `QualitySecurity`, and `SoftwareAlternative` instances from the homepage composition after their verified concepts have been absorbed into the new structured sections. Preserve their source files unless deletion is necessary; no unrelated cleanup is part of this phase.
