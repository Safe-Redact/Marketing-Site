# Phase 5C OAuth security test results

Date: 2026-10-15  
Status: **automated development controls pass; live OAuth blocked**

## RED/GREEN record

Tests were written before each implementation boundary and run in isolation.

| Boundary | RED evidence | GREEN evidence |
| --- | --- | --- |
| Configuration | Module absent; test process failed to resolve it | 7/7 configuration tests pass |
| Transaction/state/PKCE | Module absent; test process failed to resolve it | 9/9 transaction tests pass |
| GitHub exchange/staff gate | Module absent, then one strict-header failure | 5/5 exchange and authorization tests pass |
| Popup messaging/headers | Module absent; test process failed to resolve it | 4/4 popup tests pass |
| Broker routing/integration | Module absent; test process failed to resolve it | 6/6 broker integration tests pass |
| HTTPS server configuration | Module absent; test process failed to resolve it | 1/1 server configuration test passes |
| Exact transaction expiry | Boundary-time test failed at exactly ten minutes | Boundary now expires at ten minutes; transaction suite passes |
| Decap port binding | `site_domain` omitted the development port | Renderer preserves host and port; Phase 5 contract passes |
| CI/service isolation | Root test and CI did not include the broker | Root orchestration and CI contracts pass |
| Pending-transaction resource bound | Capacity/default tests and duplicate-state test failed against the initial implementation | Expired records are pruned, active records are capped, duplicate state parameters are denied, and the broker suite passes |

## Automated coverage

The broker suite currently contains 32 passing tests covering:

- required configuration and secret-safe errors;
- exact allowed origins, exact callback, duplicate/wildcard/HTTP rejection;
- fixed GitHub endpoints, exact `public_repo`, repository and immutable user IDs;
- random state and PKCE S256 generation;
- signed secure host-only cookie;
- expiry, proactive pruning, bounded pending capacity, tampering, mismatch, duplicate parameters, concurrency, single use, and replay denial;
- explicit callback, verifier, and server-side secret in the token request;
- provider status/media type/size/schema/scope/type/expiry validation;
- bounded network errors with generic failures;
- approved staff and current repository write permission;
- unauthorized, removed, malformed, and unavailable identities;
- exact-origin popup handshake, opener-source check, no wildcard messaging;
- no-store, CSP, no-referrer, no-sniff, and frame-denial headers;
- malformed paths/methods and callback failures;
- absence of tokens, codes, or secrets from emitted logs and response headers;
- mandatory TLS server inputs and bounded listen settings.

The broader Phase 5 contract also verifies provider-neutral source, no hardcoded hosting domains, no wildcard popup target, no credential patterns, fail-closed Decap generation, and CI installation/auditing of the isolated service.

## Not tested live

The following require separate authorization and external configuration and therefore are not claimed as passed:

- GitHub consent, exact callback enforcement, organization OAuth approval, or real token exchange;
- GitHub's effective expiring-token setting and browser reauthentication after eight hours;
- authorized and unauthorized real staff identities;
- Decap popup compatibility in a real browser;
- draft branch/pull-request creation, review, merge, publish, withdrawal, or rollback;
- deployment TLS, edge rate limiting, redacted platform access logs, monitoring, or secret rotation;
- multi-instance/shared transaction storage;
- protected `master` and required repository rules;
- browser-dependent accessibility and interaction acceptance.

No production credential was used or exposed.

## Security diff review

The immutable pre-remediation security snapshot reported one medium availability finding: unauthenticated initialization could retain abandoned transactions without a bound. The implementation was corrected with expiry pruning, a configurable hard capacity, fail-closed initialization at capacity, and RED/GREEN regression tests. Deployment-edge rate limiting remains mandatory because an in-process capacity is a backstop, not a traffic-control substitute.

A focused post-fix reproduction attempted 20,000 active abandoned transactions against a store capped at 1,024. Exactly 1,024 were accepted and 18,976 were rejected. The focused transaction and broker suites passed 15/15, proving the original unbounded path is closed while normal initialization, callback, expiry, and replay behavior remains intact.

## Final automated verification

| Gate | Result |
| --- | --- |
| `npm ci` | PASS; lockfile installation completed |
| Broker `npm ci` | PASS; zero dependencies with advisories |
| TypeScript | PASS |
| ESLint | PASS; zero warnings/errors (the existing Next.js CLI emitted its deprecation notice) |
| Production build | PASS; all nine application routes built |
| Complete regression suite | PASS; 88/88 tests (32 static, 11 content/contact, 13 route, 32 OAuth) |
| Broker syntax check | PASS |
| Deterministic secret-pattern scan | PASS; 176 repository files checked |
| Root production audit | PASS; zero vulnerabilities |
| Broker production audit | PASS; zero vulnerabilities |
| `git diff --check` | PASS; line-ending conversion warnings only |

The full development audit still reports nine toolchain-only vulnerable package entries: seven high (`@next/eslint-plugin-next`, `braces`, `chokidar`, `eslint-config-next`, `fast-glob`, `micromatch`, and `tailwindcss`) and two moderate (`postcss-nested` and `postcss-selector-parser`). They are absent from the production audit. The offered remediations include major-version or incompatible toolchain changes, so Phase 5C does not apply a forced upgrade.

