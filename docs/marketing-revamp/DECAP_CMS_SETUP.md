# Decap CMS Setup

## Current state

The repository serves Decap CMS 3.17.1 at `/admin/index.html` and redirects `/admin` there. The reviewed schema lives at `config/decap-cms.yml`. `scripts/render-cms-config.mjs` combines that schema with validated public deployment settings and generates `/admin/config.yml` before development, build, start, and tests. The generated file is ignored and is not a source-of-truth artifact.

Configured values:

- backend: `github`
- repository: `Safe-Redact/Marketing-Site`
- branch: `master`
- workflow: `editorial_workflow`
- article folder: `content/blog`
- media folder: `public/images/blog`
- public media path: `/images/blog`

Without an explicitly enabled deployment configuration, the generated file uses reserved `.invalid` site and broker origins. No authentication endpoint, application ID, or secret is operational. This fail-closed state is intentional and prevents Decap's Netlify OAuth default.

## Why authentication remains external

Decap's GitHub backend requires an authentication server to complete GitHub OAuth, and editors need suitable access to the repository. The browser cannot safely hold a GitHub client secret. Source configuration alone cannot complete this trust boundary.

Official references:

- GitHub backend: https://decapcms.org/docs/github-backend/
- Authentication backends: https://decapcms.org/docs/backends-overview/
- Editorial workflow: https://decapcms.org/docs/editorial-workflows/
- Configuration: https://decapcms.org/docs/configuration-options/

## Required launch decisions

Choose and security-review one maintained, independently deployed Decap-compatible OAuth broker. Do not couple authentication to the website hosting provider and do not implement an ad hoc OAuth callback inside this marketing application.

The selection must document data handling, token scope, availability, cost, callback behavior, staff offboarding, and secret rotation. This task did not choose a paid service or create an account.

## GitHub setup checklist

1. Confirm `master` is still the production source branch.
2. Create a GitHub OAuth application owned by the appropriate SafeRedact organization/account.
3. Set its homepage and callback to the exact HTTPS production values required by the chosen auth service.
4. Store the client secret only in that service's server-side secret manager.
5. Supply only the public broker origin, auth path, site origin, repository, branch, and approved scope through the documented build environment contract.
6. Invite named staff identities with the minimum repository role that supports the approved Decap workflow.
7. Protect `master`: require pull requests, at least one appropriate reviewer, passing build/tests, resolved conversations, and no force pushes or branch deletion.
8. Review GitHub App/OAuth scopes; do not grant organization-wide or unrelated repository access.
9. Document access removal and token revocation for staff departure or role changes.

## Hosting checklist

1. Deploy the same Next.js repository; do not create a second public admin application.
2. Confirm `/admin` redirects to `/admin/index.html` and remains noindexed.
3. Keep the static studio CSP provider-neutral. The broker runs in a separate popup and must enforce the exact initiating origin itself; do not add broad wildcard script, frame, or connection sources.
4. Verify reviewed merges trigger a production build and validation failure blocks release.
5. Confirm uploaded media size and repository-growth limits are operationally acceptable.
6. Configure build-failure alerts for invalid content.

## End-to-end acceptance

In a non-production environment, test all of the following before claiming the studio works:

- unauthorized user cannot obtain repository access;
- authorized user can sign in and sign out;
- new entries start as drafts;
- editorial workflow creates the expected branch and pull request;
- reviewer can inspect changed Markdown and images;
- publication merges only after required checks/review;
- approved content appears after a successful deployment;
- draft, archived, and future-dated content remain unavailable;
- archive and deletion use reviewed Git changes;
- revoked staff access no longer permits publishing;
- no OAuth token or secret appears in source, HTML, client bundles, or logs.

## Rollback

Disable access at the OAuth service and revoke affected tokens first. Revert the offending content through a reviewed Git change, then deploy. Do not rewrite Git history. If the studio is unavailable, editors can continue to propose reviewed Markdown pull requests without weakening the public content validator.
