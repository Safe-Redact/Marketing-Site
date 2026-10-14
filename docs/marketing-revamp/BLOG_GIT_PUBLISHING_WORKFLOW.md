# Blog Git publishing workflow

Date: 2026-10-14
Status: proposed protected workflow; remote protections were not changed

## Verified repository state

- Remote: `https://github.com/Safe-Redact/Marketing-Site.git`
- Public repository: yes (GitHub repository metadata, checked 2026-10-14)
- Remote/default branch: `master`
- Local working branch: `feat/saferedact-marketing-revamp`
- Preserved baseline: `31a4305`
- Decap publication target: `master`
- Decap mode: `editorial_workflow`
- Local `.github/workflows`: absent
- GitHub Actions workflows reported by the public API: 0
- Publicly visible repository rulesets: none
- Classic branch protection: not verifiable anonymously; GitHub returned 401

This means the configuration names the correct default branch, but a protected publishing workflow is **not established by available evidence**.

## Required branch strategy

Keep one public website and one production content branch:

```text
staff editor
  -> Decap workflow branch
  -> pull request into master
  -> automated checks
  -> independent editorial/technical approval
  -> merge to master
  -> hosting-provider build
  -> published article and sitemap update
```

Do not point Decap at the feature branch. Do not permit the OAuth broker, editor accounts, or a CMS service identity to bypass protected `master`. `editorial_workflow` is useful, but the authoritative control is a GitHub ruleset/branch protection that requires pull requests and checks.

## Proposed GitHub ruleset for `master`

An authorized repository administrator should create or verify an active ruleset targeting the default branch with:

- require a pull request before merge;
- at least one approving review from someone other than the latest pusher;
- dismiss stale approvals when new commits are pushed;
- require review-thread resolution;
- require designated content ownership for `content/blog/**` and `public/images/blog/**`;
- require status checks for typecheck, lint, production build, content/security contracts, and link/route regressions;
- require the branch to be up to date before merge if deployment sequencing depends on it;
- block force pushes and branch deletion;
- no broad bypass actor; emergency bypass limited to named administrators with audit review.

GitHub documents these controls in [available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets). No external setting was changed during Phase 4A.1.

## Proposed CI checks

No workflow file was added because the task authorizes design, not activation of remote automation. A separately reviewed workflow should run on pull requests to `master`:

1. clean install from `package-lock.json` using `npm ci`;
2. `npm audit --omit=dev` with a production-vulnerability blocking policy;
3. full audit reported as a visible non-production/tooling risk gate according to team policy;
4. `npm run typecheck`;
5. `npm run lint`;
6. `npm run build`;
7. `npx tsx --test tests/phase4a-content.test.ts tests/contact-route.test.ts`;
8. `node --test tests/phase4a1-security.test.mjs`;
9. production-server route/regression tests;
10. `git diff --check` or an equivalent whitespace check in contributor tooling.

Pin third-party Actions by immutable commit SHA and grant the workflow read-only repository contents unless a specific job needs more. Do not expose OAuth or deployment secrets to pull requests from forks.

## Review responsibilities

Content review must confirm:

- factual SafeRedact capabilities against approved product material;
- no invented customers, results, certifications, compliance promises, or announcements;
- approved staff byline and publication date;
- image ownership, accessibility text, and local media path;
- safe outbound links and no installers/download destinations;
- appropriate draft/published/archive state and canonical slug.

Technical review must confirm:

- schema/content tests pass;
- no raw HTML, remote image, unsafe scheme, secret, executable asset, or application-distribution link;
- preview output is expected and contains no draft in sitemap/search;
- dependency and build gates remain green.

## Publishing and rollback

- Merge only after all required checks and approvals pass.
- Treat the merged Git revision as the publishing record.
- Confirm the hosting provider deployed that exact revision before announcing publication.
- If content is incorrect but not sensitive, use a reviewed corrective PR.
- If content exposes sensitive information or creates legal/security risk, unpublish by setting `status: archived` or reverting through a reviewed emergency PR, trigger a rebuild, and verify removal from article routes and sitemap.
- Never rewrite Git history to hide an incident. Rotate any exposed secret and follow the incident process because Git retains history.

## Operational gate

The workflow is ready for implementation planning but not operational acceptance. It remains blocked until branch protections, CI checks, OAuth, staff authorization, deployment hooks, and an end-to-end non-production publishing exercise are verified.
