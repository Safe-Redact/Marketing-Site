# Final feature acceptance

Branch `feat/saferedact-publishing-and-comments`, working from commit `dc5da93`.
Nothing in this pass is committed or pushed.

Status vocabulary: **Implemented** (code exists and is reviewed), **Tested locally**
(automated tests and/or a real browser against a production build), **Tested against real
external services**, **Pending external configuration**, **Blocked**.

## Summary

| # | Feature | Implemented | Tested locally | Real external services | Status |
|---|---|---|---|---|---|
| 1 | Professional marketing homepage | yes | yes | n/a | Complete |
| 2 | Staff content-management interface | yes | yes | login only | **Blocked** on org OAuth approval |
| 3 | Blog publishing (content pipeline) | yes | yes | no | Pipeline complete; CMS write blocked by #2 |
| 4 | Company news and announcements | yes | yes | n/a | **Complete this pass** |
| 5 | Visitor comments and replies | no | no | no | **Not started** |
| 6 | Staff comment moderation | no | no | no | **Not started** |
| 7 | Contact and demo enquiries | yes | yes | no | Pipeline complete; **pending external configuration** |
| 8 | Responsive, accessible, polished UI | yes | yes | n/a | Maintained; one regression found and fixed |

## 4. Company news and announcements — delivered in this pass

Implemented:

- Four content types (`article`, `guide`, `news`, `product-update`) on the existing content
  model, defaulting to `article` so every pre-existing entry keeps loading unchanged.
- Article tags: up to six, de-duplicated by slug so "Redaction" and "redaction" cannot create
  two archives of the same topic, each validated to produce a usable URL slug.
- `queryArticles` filters by content type (single or set) and by tag, and search now covers tags.
- `/news` listing for announcements, `/blog` scoped to editorial writing. Both link to each
  other; article detail pages stay at `/blog/<slug>` so canonical URLs do not change.
- Coral `ArticleTypeBadge` on announcement cards only — a badge on every card would be noise
  rather than a distinction.
- Staff-editable in Decap: content type select and a bounded tags list, plus a view filter
  per kind for triage.
- `/news` added to the primary navigation, the footer, and the sitemap.

Tested locally:

- Content model: 4 new unit tests written RED first (type default, the four approved kinds,
  tag bounds/de-duplication/slugs, type and tag query filters).
- Live routes: 3 new tests against a real `next start` (canonical URL, separation from
  `/blog`, strict CSP with zero unnonced scripts, navigation and sitemap presence,
  out-of-range pages 404).
- Real browser, production build, with development fixtures of all four types:
  `/news` listed only the two announcements and `/blog` only the two editorial entries;
  article detail rendered with 23/23 scripts nonced, zero inline style elements, React
  hydrated, and an empty console.

## 8. UI regression found and fixed

Adding a seventh primary navigation item overflowed the nav by 7px at exactly 992px, the
breakpoint where the desktop navigation appears. Measured, not eyeballed
(`nav.scrollWidth - nav.clientWidth`). Fixed by tightening the link gap in the 992–1120px
band only; the design is byte-identical from 1120px up. Re-measured at 992px and 1024px:
0px overflow, no horizontal page scroll. Mobile at 375px: no horizontal scroll.

## 2. Staff CMS — exact external action required

GitHub returns **403 on `POST /repos/Safe-Redact/Marketing-Site/git/blobs`** during article
save. Established without handling any token:

- The repository is **public**, so `public_repo` is the correct scope and is sufficient for
  write. It must not be broadened.
- The owner is an **Organization** (`Safe-Redact`, created 2025-11-24).
- `POST /git/blobs` is a repository write and is not branch-scoped, so a missing branch
  cannot cause it; a missing ref returns 404.

Leading cause: **the organization has OAuth App access restrictions enabled and this app is
not approved**. It fits every observation — login succeeds (user-level read), `git push`
works (a different credential), org-owned writes 403.

**Action required by an organization owner**, in order:

1. `https://github.com/organizations/Safe-Redact/settings/oauth_application_policy` — if it
   reads "Access restricted", grant this OAuth app. The app should already be in pending
   requests, since the staff account completed authorization.
2. If it reads "Access is unrestricted", the cause is repository permission instead: confirm
   `maverick254-coder` (id 199049931) holds Write or Admin at
   `https://github.com/Safe-Redact/Marketing-Site/settings/access`.

The `/git/blobs` response body names the cause outright and contains no secret. **This was
not verified against GitHub**, because reading it requires an authenticated request.

Publishing branch: `feat/saferedact-publishing-and-comments` now exists on the remote at
`012d3dd`, so editorial workflow has a base to branch `cms/articles/<slug>` from, and
`master` stays out of it.

The create / save / edit / upload / submit / publish / unpublish / delete cycle is
**untested**. It cannot be exercised until the 403 clears, and mocked requests would not
constitute evidence.

## 5 and 6. Comments and moderation — not started

No code was written. One design finding worth recording before anyone starts:

**Decap's GitHub OAuth session does not authenticate custom API endpoints.** Decap stores a
GitHub user token in browser storage; it is not a session for this application. A moderation
API must verify it independently — exchange the bearer token for `GET /user` and check the id
against the staff allowlist, which is exactly what `authorizeStaff` in
`services/cms-oauth-broker/src/github.mjs` already does and already has tests for. That is
the natural place to reuse rather than invent a second authorization mechanism.

PostgreSQL credentials are not configured, so a persisted comments store cannot be exercised
in this environment either.

## 7. Lead delivery — pipeline built, provider not connected

Implemented in `src/lib/leads/`:

- `LeadTransport`, a three-member interface (`name`, `configured`, `deliver`). Keeping it
  this small is what stops a vendor's shape reaching the route: swapping providers means one
  more file in `transports/`, nothing else.
- `transports/https-email.ts` — delivery over plain HTTPS and JSON with **no vendor SDK**.
  The payload shape (`{from, to, subject, text}`) is the one Resend accepts directly.
- `transports/null.ts` — the fail-closed default, so an unconfigured deployment answers
  "accepted, not delivered" rather than implying a message reached someone.
- Configuration is all-or-nothing: four variables set together or none. A half-configured
  provider would otherwise be a silent dead letter box while the endpoint reported success.
  Endpoints must be exact credential-free HTTPS, addresses must be single mailboxes, and the
  timeout is bounded.
- `abuse.ts` — a fixed-window rate limiter (5 enquiries per 10 minutes per client), a
  forwarded-hop key that trusts only the first entry, and content heuristics for link
  stuffing and non-names.
- Both enquiry kinds (`demo`, `contact`) are carried through to the transport.
- A honeypot field, hidden from sight, the accessibility tree and the tab order. It and the
  heuristics answer **identically to a validation miss**, so an unattended sender learns
  nothing about which control caught it.

Three outcomes are now distinguished, where before there was one:

| Situation | Status | Body | What the visitor is told |
|---|---|---|---|
| Transport not configured | 202 | `accepted: true, delivered: false` | validated, nobody has received it |
| Delivered | 200 | `accepted: true, delivered: true` | sent to the team, we will reply |
| Configured but failed | 502 | `accepted: false, delivered: false` | could not be delivered, email support |

A configured transport that fails answers 502, not 202 — telling a visitor their enquiry is
on its way when the provider refused it is the failure mode this replaces. The provider's own
wording may quote the payload, so it never reaches the visitor or the logs.

Logs carry `{referenceId, outcome, transport}` only. No enquiry field reaches an ordinary log
line, asserted by test.

Tested locally: 8 delivery unit tests and 7 new route tests, written RED first — delivered vs
accepted vs failed, honeypot and heuristics, both kinds, rate limiting, and log redaction.
The static suite now pins the honeypot's accessibility semantics.

**Tested against real external services: no.** No provider is connected, so delivery has
never run against a real endpoint. The status is *pending external configuration*, not
complete.

### Exact activation step

Set these four together in the deployment's secret store (template in `.env.example`):

```
LEAD_DELIVERY_ENDPOINT=https://api.resend.com/emails   # or another JSON email API
LEAD_DELIVERY_TOKEN=<provider API token>               # SECRET
LEAD_DELIVERY_FROM=<sender on a domain the provider has verified>
LEAD_DELIVERY_TO=<the internal enquiries mailbox>
```

Then submit one enquiry and confirm the response is **200 with `delivered: true`** and that
the mailbox received it. Until that is observed, feature 7 must not be reported as complete.

A provider whose payload differs from `{from, to, subject, text}` needs its own file in
`src/lib/leads/transports/` and one line in `resolveLeadTransport`; nothing else changes.

### Known limitation

The rate limiter is per process. Behind more than one instance each replica enforces its own
window, so the effective limit multiplies by the replica count. It is documented in
`abuse.ts` and must be replaced by a shared store before this endpoint is fronted by several
instances.

## Verification run on this tree

`npm run typecheck`, `npm run lint`, `npm run build`, `npm run check:secrets`,
`npm audit --omit=dev` (0 vulnerabilities), and:

```
static   39 pass
content  64 pass   (includes the 34 comments domain tests)
routes   23 pass
broker   37 pass
         163 total, 0 fail
```

`tests/comments-domain.test.ts` was not reachable from `npm test` when it was written, so its
34 tests never ran in CI. It is now registered in `test:content` and passes there with no
database configured, which is the claim its own session made for it.

The live route suite needs sole ownership of `.next`. A `next dev` in this checkout
rewrites it continuously, so `next start` cannot get a stable production build and the suite
fails with missing webpack chunks rather than a real assertion. The run above was made with
the dev server stopped. The same contention applies to a second session working in this
directory at the same time: build and run the suite with one writer only.

`npm run test:routes` also has no `pretest` hook, unlike `test:static` and `test:content`, so
running it standalone uses whichever CMS profile happens to be on disk and fails the admin
assertion against the enabled one. Run the suite through `npm test`.

## Not done in this pass

Items 5, 6 and 7 are untouched, and item 2's publishing cycle is unverifiable here. The
remaining work is a persisted comments system with moderation, and a real lead-delivery
pipeline — each substantial enough to need its own pass, and item 2 needs an organization
owner before any of its acceptance criteria can be demonstrated.
