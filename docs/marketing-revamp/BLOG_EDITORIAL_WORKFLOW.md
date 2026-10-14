# Blog Editorial Workflow

## Roles

- **Author:** prepares factual article text and approved media.
- **Reviewer:** verifies claims, product accuracy, link destinations, accessibility, licensing, and metadata.
- **Publisher:** authorized to approve/merge after checks pass. This may be the reviewer only if the approved governance model permits it.
- **Repository administrator:** maintains OAuth, branch protection, access, and CI; does not bypass editorial review.

Use named identities only. Shared GitHub or CMS credentials are not approved.

## Create and review

1. Sign in through the approved Decap/GitHub OAuth flow.
2. Create a Blog article entry. Keep `status` as `draft` while writing.
3. Use a stable lowercase kebab-case slug that matches the intended URL.
4. Enter a real staff byline, factual excerpt, reusable category, publication date, and SEO description.
5. Upload only approved publication-safe media. Supply meaningful alt text whenever an image exists.
6. Use Markdown; do not paste raw HTML, scripts, iframes, executable embeds, remote images, download CTAs, or unverified product claims.
7. Move the entry into review through Decap's editorial workflow.
8. Inspect the generated pull request, including the raw Markdown and every added binary asset.

## Reviewer checklist

- Title, excerpt, body, and SEO description are factual and consistent.
- Product capabilities agree with approved SafeRedact material/application behavior.
- No invented release, customer, certification, testimonial, benchmark, compliance guarantee, or integration appears.
- Author identity is authorized; no biography is implied unless separately approved.
- Slug is stable and filename matches it.
- Category spelling matches an existing approved category when appropriate.
- Publication date and `status` express the intended visibility.
- Images are licensed/owned, free of sensitive information, stored under `/images/blog/`, and have useful alt text.
- Links use safe destinations and do not expose downloads, installers, application portals, or administrative routes.
- Typecheck, lint, build, content tests, route tests, and regressions pass.

## Publish

An article is publicly eligible only when its reviewed change is merged to `master`, `status` is `published`, and `date` is not in the future. A successful production build must follow the merge. Merge completion alone is not proof that the article is live.

After deployment, verify the article route, listing/card, category, canonical/social metadata, Article JSON-LD, sitemap entry, image/alt text, links, and mobile readability through an authorized browser method.

## Featured articles

`featured: true` makes an eligible article a feature candidate. If more than one published file is marked featured, the newest eligible article is selected because the loader sorts by publication date. Editorial policy should normally keep one featured article to avoid ambiguity.

## Scheduling limitation

A future `date` prevents public eligibility, but this implementation does not run an independent publishing scheduler. The site must rebuild or render after the intended time for a future-dated article to appear. Do not promise time-exact scheduling until hosting behavior is tested.

## Correct, archive, or remove

- **Correction:** edit through a reviewed change and set `updatedDate` to the factual update time. Add a visible correction note when editorial policy requires one.
- **Archive:** set `status: archived` through review. After deployment, the article disappears from public routes and sitemap.
- **Remove:** delete through an authorized reviewed Git change when policy requires deletion. Consider a redirect before changing/removing a previously indexed slug.
- **Rollback:** revert through normal Git review; never reset, rebase, force-push, or rewrite publication history.

## Incident handling

For sensitive information, unsafe claims, compromised accounts, or malicious content:

1. Revoke or disable the affected staff/OAuth access.
2. Make a reviewed archive/removal/revert change using the fastest approved path.
3. Deploy and verify public removal.
4. Preserve audit evidence without copying sensitive material into general logs.
5. Rotate relevant OAuth credentials and review access.
6. Document cause and preventive action.

## Phase 4B boundary

Do not add visitor comments, replies, reports, personal information, or moderation records to article Markdown. Those records require a separately approved store and security/privacy workflow.
