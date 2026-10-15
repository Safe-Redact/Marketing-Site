# GitHub CI and branch protection

Date: 2026-10-14  
Status: workflow implemented locally; repository settings unchanged

## Workflow design

One provider-neutral verification workflow is implemented for pull requests targeting `master` and for non-deployment validation on relevant branch pushes. It contains no hosting tokens, deployment actions, webhooks, or provider CLI commands. It has not run remotely because this branch has not been pushed.

Security requirements:

- top-level `permissions: contents: read`;
- `pull_request`, not `pull_request_target`;
- no secrets passed to pull-request jobs;
- third-party actions pinned to full commit SHAs;
- `actions/checkout` configured not to persist credentials;
- concurrency cancellation for superseded commits;
- npm lifecycle scripts run only from the reviewed lockfile through `npm ci`;
- no write permission, release, package publishing, or deployment job.

Planned required check names:

- `quality / verify`
- `security / production-audit`
- `security / tracked-secret-policy`

These names are implemented and may be used by repository administrators when separately authorized to configure required checks.

## Verification inventory

The complete gate must include:

- TypeScript: `npm run typecheck`;
- ESLint: `npm run lint`;
- production build: `npm run build`;
- all repository Node and TypeScript tests;
- production-server HTTP regression tests;
- production dependency audit with zero known production vulnerabilities;
- deterministic tracked-file secret-pattern and forbidden-file checks;
- whitespace/error-marker validation with `git diff --check`.

GitHub native secret scanning and push protection should be enabled separately by an authorized repository administrator. The local CI check is defense in depth and not a substitute for GitHub's partner-pattern scanning or credential revocation.

## Recommended `master` ruleset

An authorized administrator should configure, but Phase 5 will not change:

- pull requests required;
- at least one independent approval;
- stale approvals dismissed after changes;
- review conversations resolved;
- the documented CI checks required;
- branch must be current if merge-queue semantics require it;
- force pushes and branch deletion blocked;
- no routine bypass actors;
- code-owner review for workflow, CMS configuration, content, and security-sensitive paths once verified owner identities are available.

Do not add a speculative `CODEOWNERS` file until actual GitHub users or teams are approved.

## Content pull requests

Decap editorial branches receive the same checks as code pull requests. Content validation must block:

- draft or archived content entering public discovery;
- malformed or duplicate slugs;
- raw HTML and executable content;
- remote images and unsafe URL schemes;
- application-download links;
- secret-like values;
- unsupported product claims not caught by automated validation but identified in required human review.

## Deployment separation

CI ends after verification. A future production host may observe merges to `master` and rebuild the site, but that integration is outside this workflow. Temporary Netlify deploy previews may continue through existing repository integration and are neither invoked nor required by CI.

## Recovery

Workflow failures must be fixed through a normal reviewed commit. Do not disable the check, expose a secret, use `pull_request_target`, or add a deployment credential to make a pull request pass.
