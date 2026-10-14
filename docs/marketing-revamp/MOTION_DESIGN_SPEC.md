# Phase 3 Motion Design Specification

## Principles

SafeRedact motion supports orientation and feedback. It does not take control of scrolling, delay navigation, or conceal essential content. Native browser scrolling, touch momentum, URL hashes, and browser history remain authoritative.

## Anchor navigation

- `html` uses native CSS `scroll-behavior: smooth`.
- `scroll-padding-top` and target `scroll-margin-top` use the shared `--anchor-offset` custom property.
- The offset is `6.75rem` below 992px and `7.75rem` at or above 992px, clearing the 78px and 94px fixed-header variants with additional reading space.
- The rule covers section targets, `#main-content`, and explicit `data-scroll-target` regions such as `#demo-enquiry`.
- No click handler prevents default anchor navigation or rewrites history.
- Under `prefers-reduced-motion: reduce`, scrolling is immediate.

## Viewport reveals

`AnimateOnScroll` is a progressive one-time enhancement:

- Content is visible in server-rendered HTML and by default in CSS.
- JavaScript only applies the pending state after IntersectionObserver has confirmed that an element is outside the viewport.
- Elements initially visible, reduced-motion users, and browsers without IntersectionObserver remain visible.
- Revealed elements are unobserved and do not replay when the user scrolls back.
- The observer uses a 12% lower viewport margin and a `0.12` threshold.
- The standard reveal is 18px upward over 400ms using `cubic-bezier(0.22, 1, 0.36, 1)`.
- Existing component delays provide restrained 80–100ms staggering.

Because the hidden state requires a runtime-applied `data-reveal-ready` attribute, a script failure cannot leave content hidden.

## Component motion

| Interaction | Treatment |
| --- | --- |
| Header | Existing 300ms border, background, shadow, and backdrop transition |
| Primary/secondary buttons | 200ms transition, 2px hover lift, subtle `0.99` pressed scale |
| Hero illustration | Initial 450ms fade/up entrance |
| Mobile navigation | Optional 300ms fade; native focus and Escape behavior remain authoritative |
| Tabs | Existing 300ms color and border state transition; keyboard arrow/Home/End behavior retained |
| Accordions | Existing 300ms border, background, and chevron rotation; collapsed content remains semantically hidden |
| Footer | No entrance animation |

All nonessential animation and transitions collapse under the existing reduced-motion media query. No Lenis, GSAP, Framer Motion, or other animation runtime is used.

## Active navigation

Active-section styling is an orientation aid, not navigation state stored in the URL. A passive scroll listener schedules at most one calculation per animation frame. The active section is the section crossing a reading line below the current header. Desktop navigation receives a cyan underline and white label; mobile navigation receives a cyan left edge and raised background. Both expose `aria-current="location"`.

The active-navigation logic does not call `pushState`, `replaceState`, or assign `location.hash`, so normal anchor clicks, repeated clicks, Back, and Forward remain browser-controlled.

## Browser acceptance

Direct visual and interaction acceptance remains **BLOCKED** by the existing browser-access restriction. Automated contracts cover implementation invariants, but they are not represented as evidence of visual fidelity or real-browser timing.
