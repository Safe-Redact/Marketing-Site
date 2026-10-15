# SafeRedact launch blockers

Date: 2026-10-14  
Status: open items requiring evidence or separate authorization

## Critical blockers

| Area | Current evidence | Required resolution |
| --- | --- | --- |
| Contact lead delivery | Endpoint validates and logs accepted submissions but does not deliver email or create a CRM record | Approve and implement a real destination, failure handling, monitoring, privacy terms, and end-to-end test |
| Legal and privacy | No approved policy set covers lead handling, analytics, CMS staff data, and future comments | Legal owner approves privacy, terms, retention, contact, and community/moderation policy destinations |
| CMS authentication | No broker, OAuth app, credentials, callback, or staff acceptance test | Review and deploy independent broker in non-production; complete security checklist and staff tests |
| Repository protection | Required rules and checks are not verified as active | Authorized administrator enables reviewed `master` ruleset after CI check names stabilize |
| Production hosting | Final hosting provider, canonical production origin, build environment, rollback, and monitoring are not approved | Select a compatible Next.js host and document production/staging isolation |

The provider-neutral GitHub workflow is implemented locally but has not run remotely because no push was authorized. Required-check enforcement remains an external repository-setting blocker.

## High-priority blockers

### Mobile and browser acceptance

Browser automation remains blocked by the established access restriction. Automated source/HTTP checks do not establish screenshot fidelity, focus order, screen-reader output, mobile overflow, reduced-motion behavior, or hydration-console cleanliness.

Required: an authorized browser runner or documented manual QA at 1440×900, 768×1024, 390×844, and 320×700.

### Performance

The production build must remain green, but real-host field performance has not been measured. Required after host selection:

- production-origin Lighthouse/Web Vitals baseline;
- image/font caching verification;
- JavaScript and route payload review;
- cold-start and API latency monitoring;
- performance budget and regression ownership.

### SEO

Current metadata, sitemap, robots, canonical articles, and structured data are implemented, but final acceptance requires:

- canonical production origin supplied through approved configuration;
- published-article crawl test on the final host;
- redirect behavior for changed slugs;
- search-console ownership and sitemap submission by an authorized owner;
- no preview/staging indexing.

### Non-production isolation

Preview and staging environments must:

- use no production OAuth or comments secret;
- remain noindexed;
- use isolated OAuth applications/allowed origins if CMS login is enabled;
- use isolated comment storage if comments are later tested;
- never send test leads to a production destination without explicit labeling and approval.

## Operational dependencies

- Named owner for GitHub organization access and staff offboarding.
- Named owner for OAuth broker maintenance and secret rotation.
- Named editorial reviewer and factual-claims approval process.
- Named moderation/privacy owner before comments implementation.
- Final host support for Next.js 15, environment secrets, HTTPS, logs, monitoring, and rollback.
- Backup/recovery objectives for content Git history and future comments data.

## Temporary Netlify preview limitation

Existing Netlify deploy previews may continue for stakeholder review. They are not evidence of production-host readiness, CMS authentication readiness, or final browser acceptance, and no production architecture depends on them.
