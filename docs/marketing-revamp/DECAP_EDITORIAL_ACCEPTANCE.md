# Decap editorial acceptance procedure

Date: 2026-10-15  
Status: **procedure only — not executed**

## Preconditions

Record the marketing commit, broker source digest, non-production deployment digest, exact CMS and broker origins, exact callback, OAuth application identity, named staff IDs, unauthorized test ID, test branch, and active GitHub ruleset. Evidence must be sanitized: never capture tokens, authorization codes, cookies, state, PKCE values, client secrets, or private identity data.

Before testing:

- protect `master` with required pull requests, independent approval, current CI checks, stale-approval dismissal, conversation resolution, and blocked force push/deletion;
- use a separately approved non-production publishing branch/environment so the stakeholder-review branch and live marketing site cannot change;
- confirm OAuth callback wildcard matching is disabled and expiring tokens are enabled;
- confirm platform logs redact callback query strings and cookies;
- use factual, obviously non-production content with no customer data, unsupported claims, personal information, or confidential material;
- remember that editorial branches in this public repository are publicly readable.

## Acceptance scenarios

### 1. Staff login

Open the exact HTTPS `/admin/` origin, authenticate as an allowlisted numeric GitHub identity, and verify Decap loads the expected repository and collection. Confirm the broker reports only a sanitized accepted event and that no credential appears in URL history, console, screenshots, analytics, or retained logs.

### 2. Create article

Create a uniquely named non-production article with complete validated metadata, safe Markdown, and `status: draft`. Do not use a real announcement. Confirm Decap works against `Safe-Redact/Marketing-Site` only.

### 3. Save draft

Save through `editorial_workflow`. Verify a `cms/...` branch and pull request are created and no direct commit reaches the protected target. Verify listing, direct route, category, sitemap, RSS, metadata, and structured data do not expose the draft.

### 4. Edit article

Change title/body/metadata on the same editorial item without changing the slug. Confirm a new commit updates the existing review branch and required checks rerun on the latest SHA. Confirm the article remains non-public.

### 5. Submit for review

Move the editorial item to review. A different authorized reviewer must verify content accuracy, claims, byline, media rights and alt text, links, dates, status, slug, and preview. Add a controlled invalid value, confirm CI blocks it, correct it, and obtain fresh checks and approval.

### 6. Approve and publish

Set `status: published` with a current/past date, obtain independent approval after the final change, and merge through the protected workflow. Confirm the non-production host builds the exact merge SHA. Verify listing, article, category, metadata, canonical, structured data, sitemap/RSS, links, keyboard use, mobile layout, and no draft leakage. CI must not deploy automatically.

### 7. Verify public visibility

Confirm the article appears only after the reviewed merge and successful non-production build. Confirm an unmerged draft with the same process remains absent. Record sanitized route and revision evidence.

### 8. Unpublish or archive

Submit a new reviewed change setting the article to `archived`. After approved merge/build, confirm removal from public routes and discovery outputs. Restore through a reviewed Git revert or status change to prove recovery without history rewriting, then remove all test content through the same controlled workflow.

## Negative security scenarios

Repeat authentication with an unlisted GitHub user, an allowlisted user without repository write permission, an expired transaction, a replayed callback, a wrong port/scheme/lookalike origin, a wrong callback path, a modified state, a wrong PKCE verifier, a token-exchange failure, an expired/revoked token, and a message from the wrong origin/window. Every case must deny token delivery and produce only a generic user-visible failure.

## Pass criteria

Acceptance is PASS only when every positive and negative scenario succeeds against one recorded broker build and environment; `master` protections and current CI checks are independently verified; logs and evidence contain no sensitive values; and cleanup/recovery is demonstrated. A broker, Decap, OAuth, branch-rule, or content-loader change invalidates affected evidence.

Phase 5C has not performed these browser or external-service scenarios. They remain blocked on authorized credentials, exact HTTPS environments, protected branch settings, deployment, and named test identities.
