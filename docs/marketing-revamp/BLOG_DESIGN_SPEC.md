# SafeRedact Blog Design Specification

## Design intent

The Blog & Insights experience extends the Phase 1–3 marketing system. It uses the existing Poppins headings, Inter body copy, navy canvas, coral actions, cyan states, `77rem` content container, fixed header, focus treatment, and reduced-motion rules. It does not alter the homepage design.

No fabricated article, author biography, announcement, testimonial, certification, metric, or capability appears in production. With an empty `content/blog/` directory, `/blog` shows a polished publication-pending state.

## Information architecture

| Route | Composition | Discoverability |
| --- | --- | --- |
| `/blog` | Hero, labeled search, categories, optional featured article, article grid, pagination | Indexable canonical listing |
| `/blog?query=...` | Filtered results or accessible empty state | `noindex,follow`, canonical `/blog` |
| `/blog?page=N` | Paginated archive | Self-canonical; out-of-range pages return 404 |
| `/blog/category/[slug]` | Active category navigation, article grid, pagination | Indexable only for a real published category |
| `/blog/[slug]` | Article header, safe Markdown body, back link, related articles | Indexable only when published and date-eligible |
| `/admin` | Redirect to Decap studio shell | Noindex, disallowed, never linked publicly |

## Listing page

- Hero starts below the fixed header and uses the established subtle coral/cyan radial treatment.
- H1 scales from approximately 38px on mobile to 77px on wide screens.
- Introductory copy is limited to a readable two-column measure.
- Search has a visible label, native GET behavior, 100-character maximum, and a minimum 48px control height.
- Category controls are semantic links with 44px minimum height and `aria-current="page"`.
- A real featured article, when present, uses a split media/content panel on desktop and stacks on mobile.
- Remaining articles form one, two, or three columns according to width.
- Cards contain category, date, title, excerpt, author, and calculated reading time.
- Missing editorial images use an original CSS gradient visual, not placeholder stock art.
- Pagination preserves search queries and uses visible disabled states.

## Article page

- The header presents category, one H1, excerpt, verified author byline, publication date, and reading time.
- Prose remains near `50rem` maximum width with generous line height.
- H2–H4, lists, quotes, code, tables, links, and local images receive consistent dark-theme styling.
- Article images use their required alt text and responsive Next.js image rendering.
- Related articles are category-matched, exclude the current article, and appear only when real published matches exist.
- No comments, reply form, share tracker, rating, or social proof is rendered in Phase 4A.

## Navigation behavior

- Desktop and mobile navigation include `Insights` linking to `/blog`.
- Blog routes set `aria-current="page"`; homepage section tracking retains `aria-current="location"`.
- Homepage section links become `/#section` from blog routes and remain normal `#section` anchors on the homepage.
- Footer platform links include Blog & Insights.
- The content studio is deliberately absent from header and footer navigation.

## Responsive and motion behavior

- Mobile target: 320px and above, one-column cards, no required horizontal scrolling.
- Tablet target: two-column cards where space permits.
- Desktop target: three-column cards and split featured panel.
- All controls preserve the existing keyboard focus ring.
- Existing reduced-motion CSS reduces transitions and disables long animation; the blog does not add persistent animation or hidden-on-load content.
- Article tables and code blocks may scroll within their own bounds rather than forcing page-level overflow.

## Empty and error states

- Empty production copy states that no articles have been published yet.
- Empty search copy reports no matching articles and suggests another phrase.
- Unknown categories, unsafe slugs, missing articles, drafts, archives, and future publications return the standard 404 surface.
- Invalid content fails validation instead of being partially or unsafely rendered.

## Visual acceptance limitation

Automated source, build, and HTTP route checks are complete. Browser-dependent screenshot, zoom, keyboard, screen-reader, and overflow acceptance remains blocked by the previously documented browser-access restriction. Phase 4A does not claim screenshot-based visual acceptance.
