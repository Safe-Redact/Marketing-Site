# Phase 5 implementation plan

Date: 2026-10-14  
Status: implemented and verified locally; external controls remain blocked

## Workstream A: provider-neutral CI

1. Add a RED infrastructure contract test that requires a least-privilege, non-deploying workflow and rejects provider deployment commands and secret-bearing pull-request behavior.
2. Add reviewed package scripts that run the complete existing test inventory consistently.
3. Add the GitHub Actions workflow with immutable action references and `contents: read`.
4. Add a deterministic tracked-file secret policy check without introducing a licence-bearing service or workflow secret.
5. Run the contract test GREEN, then typecheck, lint, build, regression tests, production audit, and `git diff --check`.

## Workstream B: portable Decap readiness

1. Extend the RED contract to reject `api.netlify.com` and any other Netlify authentication assumption in active CMS files.
2. Move Decap's schema into a provider-neutral source template.
3. Add a small build-time renderer for the public CMS config using validated non-secret environment variables.
4. Make missing production configuration fail closed without preventing provider-neutral CI from testing the public site.
5. Generate the CMS shell security policy from the approved public GitHub and configured broker origins, or otherwise remove hardcoded Netlify allowances while keeping the exact-origin policy.
6. Preserve `github`, `master`, and `editorial_workflow` behavior.
7. Test malicious URLs, embedded credentials, invalid repository/branch values, and secret-like input rejection.
8. Do not add an OAuth broker package or implement the callback in this repository.

## Workstream C: documentation and operational gates

1. Complete `GITHUB_CI_AND_BRANCH_PROTECTION.md` with exact check names and administrator-only settings.
2. Complete `DECAP_NETLIFY_AUTH_PLAN.md` as a provider-neutral auth plan and explicitly scope Netlify to previews.
3. Complete `COMMENTS_IMPLEMENTATION_PLAN.md` with the repository interface and provider comparison.
4. Complete `LAUNCH_BLOCKERS.md` with owners, evidence, and blocked browser checks.
5. Produce `PHASE5_IMPLEMENTATION_REPORT.md` only after code/configuration verification.

## RED/GREEN sequence

1. Write Phase 5 infrastructure tests.
2. Run them and record the expected failures caused by the absent workflow and current Netlify-default CMS configuration.
3. Implement only enough workflow/configuration to satisfy the contracts.
4. Run targeted tests until green.
5. Run the complete suite from a clean install/build state.
6. Review the final diff for accidental production deployment, secrets, generated output, or homepage changes.

## Files expected to change after approval

- `.github/workflows/ci.yml`
- `package.json`
- `.gitignore` if generated CMS output requires it
- `public/admin/index.html` or a provider-neutral generated equivalent
- `public/admin/config.yml` or its replacement template/output path
- `scripts/` for deterministic CMS rendering and CI test orchestration
- `tests/` for Phase 5 infrastructure/security contracts
- requested Phase 5 documents

No comments endpoint, database client, homepage component, or deployment configuration is expected.

## Stop conditions

Stop without bypassing the issue if:

- the branch base no longer matches the reviewed `origin/master` state;
- a secret or unrelated change appears;
- a proposed CMS configuration requires a Netlify runtime or hardcoded production host;
- complete tests cannot run without an unavailable external credential;
- a dependency or broker candidate fails security review;
- implementation would activate public comments or production publishing.
