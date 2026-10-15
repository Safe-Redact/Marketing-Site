# Phase 5B publishing acceptance plan

Date: 2026-10-15  
Status: **test plan only — no live OAuth or publishing test executed**

## Purpose

This plan verifies the complete non-production path from a named staff login through a reviewed Git pull request and deployed public article. Passing repository tests alone is not sufficient. The broker, GitHub OAuth application, branch protection, staff authorization, and isolated hosting environment must exist before execution.

## Current verified state

- Decap uses the GitHub backend and editorial workflow targeting `master`.
- The generated CMS configuration is disabled by default with reserved `.invalid` origins.
- Published loaders exclude draft, archived, malformed, and future-dated articles.
- GitHub reported `master` as **not protected** on 2026-10-15.
- No broker, OAuth application, credential, staff allowlist, or accepted deployment exists.
- Therefore all live scenarios below are currently **BLOCKED**, not failed or passed.

## Preconditions

Before starting, record:

- marketing commit SHA;
- broker commit and immutable deployment digest;
- exact marketing and broker HTTPS origins;
- exact registered callback URL with wildcard matching disabled;
- non-production OAuth application identity;
- approved staff GitHub user IDs and roles;
- dedicated unauthorized test identity;
- active `master` protection evidence and required check names;
- non-production build/deployment revision mapping;
- redacted log and monitoring locations;
- cleanup owner and expiry time for test content and credentials.

Use factual test content clearly labeled as non-production. Do not use a real announcement, customer name, confidential draft, personal data, or unsupported product claim.

## Evidence rules

For each scenario retain the date, tester, environment, relevant commit/digest, expected result, actual result, and sanitized evidence. Screenshots and logs must not contain tokens, codes, cookies, state values, secrets, or private account information. A scenario is PASS only when its observable outcome and server-side evidence agree.

## Scenario 1: Authorized staff login

**Purpose:** prove exact-origin authentication for a named approved editor.

1. Open the non-production `/admin/` URL over HTTPS from the exact allowed origin.
2. Start GitHub authentication using the approved identity.
3. Complete consent and return through the exact broker callback.
4. Verify Decap loads the configured repository and article collection.
5. Verify broker logs contain only an approved outcome code/correlation ID and no sensitive values.
6. Verify the browser receives no token through URL, storage outside Decap's expected session handling, wildcard message, or console output.

Expected: login succeeds only on the exact origin, the identity and repository permission are confirmed, and no credential appears in retained evidence.

## Scenario 2: Unauthorized login rejection

Run separately with:

- a valid GitHub user absent from the staff allowlist;
- an approved identity whose repository write access has been removed;
- a signed-out/denied-consent flow.

Expected: each attempt fails before token delivery, Decap cannot read or write repository content, the response is generic, and logs contain no token or personal detail beyond the approved audit identifier.

## Scenario 3: Draft creation

1. Log in as an authorized author.
2. Create a uniquely named non-production article with `status: draft`.
3. Save it through editorial workflow.
4. Inspect GitHub activity.
5. Query the production-style blog listing, direct slug, categories, sitemap, and metadata.

Expected: Decap creates a `cms/...` branch and pull request; it does not commit directly to `master`. The draft is absent from public routes and sitemap. Because the repository is public, acknowledge that the branch/PR content is publicly readable on GitHub and contains no confidential material.

## Scenario 4: Article editing

1. Edit the draft title/body/metadata without changing its approved slug.
2. Save again.
3. Inspect the same editorial branch and pull request.

Expected: a new commit updates the existing review change, checks rerun on the latest commit, and no public route changes before merge.

## Scenario 5: Editorial review

1. Submit the draft for review.
2. Have a different authorized reviewer inspect Markdown, media, links, claims, author, date, slug, status, and preview.
3. Introduce a controlled invalid edit on the editorial branch, such as an unsafe remote image, and confirm CI blocks it.
4. Correct the edit and obtain fresh passing checks.

Expected: the author cannot bypass review; stale approval is dismissed after the new commit; all three required checks apply to the latest SHA; unresolved review conversations block merge.

## Scenario 6: Approved publishing

1. Set the reviewed article to `status: published` with a current/past date.
2. Obtain independent approval after final changes.
3. Merge through the protected-branch workflow.
4. Confirm the hosting provider builds the exact merge commit.
5. Verify listing, article, category, canonical metadata, structured data, sitemap, image alt text, links, keyboard behavior, and mobile layout.

Expected: only the reviewed merge enters `master`; the article becomes public only after a successful build of that revision. CI itself performs no deployment.

## Scenario 7: Article withdrawal and recovery

Test both archive and deletion paths:

1. Submit a reviewed change setting the article to `archived`.
2. Merge and deploy, then verify route and sitemap removal.
3. Restore the article with a reviewed revert/restore commit and verify recovery.
4. Separately delete a test article through a reviewed pull request, deploy, and restore it from Git history.

Expected: no history rewrite is used. Removal and restoration are auditable. Previously indexed slugs have an approved redirect or documented intentional 404 decision before production use.

## Scenario 8: Authentication failure

Exercise:

- broker unavailable;
- missing broker environment variable;
- missing client secret;
- GitHub token endpoint timeout or non-JSON response;
- GitHub API rate limit or identity lookup failure;
- revoked OAuth application.

Expected: authentication fails closed, no fallback provider is contacted, the marketing website remains available, the CMS does not claim publication, and no secret appears in browser or logs.

## Scenario 9: Token expiry and revocation

1. Confirm the OAuth application token-expiry setting and document its effective lifetime.
2. Authenticate and save a draft before expiry.
3. Allow or simulate access-token expiry without exposing token material.
4. Attempt another repository operation.
5. Reauthenticate and confirm the existing Git branch/PR remains recoverable.
6. Revoke the OAuth grant and repeat the operation.

Expected: expired/revoked tokens fail, Decap requests a fresh login, no refresh token is exposed, and saved Git content is not lost. Browser-only unsaved-edit behavior must be documented for editors.

## Scenario 10: Invalid callback and origin rejection

Test each variant independently:

- HTTP instead of HTTPS;
- allowed hostname with a different scheme;
- allowed hostname with a different port;
- sibling or lookalike subdomain;
- path/query/fragment variation in callback;
- wildcard/subdirectory callback behavior;
- missing, expired, replayed, or tampered state;
- wrong PKCE verifier;
- popup message from the wrong origin or window;
- omitted allowed-origin configuration.

Expected: every variant is rejected before token delivery. The valid transaction cannot be replayed afterward. GitHub OAuth callback wildcard matching is confirmed disabled.

## Publishing lifecycle verification

| Lifecycle event | Git behavior | Public behavior | Recovery |
| --- | --- | --- | --- |
| Save draft | Commit on `cms/...` branch; PR created | Not public | Continue or close PR |
| Edit draft | New commit on same review branch | Not public | Revert draft commit or close PR |
| Reject | PR remains unmerged or is closed | Not public | Reopen or create reviewed replacement |
| Publish | Protected merge into `master` after checks/review | Public only after successful build and eligibility checks | Reviewed revert/archive |
| Archive | Reviewed `status: archived` commit | Removed after deployment | Reviewed restore |
| Delete | Reviewed file deletion | Removed after deployment | Restore from Git with reviewed commit |
| Slug change | New path plus approved redirect plan | Old path redirects or intentionally 404s | Revert slug/redirect change |

## Required GitHub controls

The acceptance run must verify, rather than assume:

- pull requests are required for `master`;
- the latest commit requires independent approval;
- stale approvals and unresolved conversations block merge;
- `quality / verify`, `security / production-audit`, and `security / tracked-secret-policy` are required;
- direct and force pushes and branch deletion are blocked;
- neither the editor nor broker identity has a routine bypass;
- content and media receive designated review once real CODEOWNERS identities are approved.

## Exit criteria

Publishing readiness is PASS only when all ten scenarios pass against the same pinned broker revision and recorded non-production environment, the branch protections remain active, and no high-severity security or content-control defect remains. Any code/configuration change to OAuth, Decap, branch rules, or the publication loader invalidates the affected evidence and requires rerun.

No scenario in this document has been executed live as of 2026-10-15.
