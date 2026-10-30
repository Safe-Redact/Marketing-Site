# Stage B feature-page visual acceptance

Captured against the production build on 2026-10-25.

## Required viewport matrix

The following filename pattern is present for every route:

- `features-{viewport}.jpg`
- `document-redaction-{viewport}.jpg`
- `audio-redaction-{viewport}.jpg`
- `video-redaction-{viewport}.jpg`

Required viewport suffixes:

- `1440x900`
- `1024x900`
- `768x1024`
- `390x844`

All matrix images are viewport captures from scroll position zero. Browser measurements confirmed one H1 and no horizontal page overflow at every route/viewport combination.

## Interaction captures

- `features-1440x900-scrolled.jpg` — first overview feature revealed during scroll.
- `features-390x844-menu.jpg` — accessible mobile navigation dialog.
- `audio-redaction-1024x900-faq.jpg` — keyboard-expanded audio FAQ.

Below-fold composition was checked by deliberate scrolling rather than a single full-page capture, because scroll-reveal content is intentionally transparent until it intersects the viewport.
