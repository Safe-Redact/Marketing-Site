# SafeRedact Phase 2.5 — Visual Acceptance and Browser QA

Date: 2026-10-14
Branch: `feat/saferedact-marketing-revamp`
Acceptance status: **BLOCKED**

## 1. Browser tool authorization findings

### Production server

The existing optimized build was started with `npm run start` and reported ready at `http://localhost:3000`. An independent HTTP request to `http://127.0.0.1:3000/` returned status 200 with 131,679 response bytes. This establishes that the application server was available during the browser-control diagnosis.

### Rejected mechanism

The rejected mechanism is the Codex in-app Browser Use control layer exposed through `cua_repl`, specifically `cua.getTab` while attaching to the existing in-app browser tab.

The in-app browser inventory exposed:

- an existing tab whose requested URL was `http://localhost:3000/`;
- a second failed-navigation tab represented by a generated `data:text/html` browser error page for `http://127.0.0.1:3000/`.

After the production server was live, attaching to the HTTP localhost tab was attempted once by its returned tab ID. Browser Use rejected the request with its URL-policy gate and stated:

> Browser Use rejected this action due to browser security policy. The browser URL policy blocks this action. Browser use cannot visit the requested page. The requested URL protocol is not allowed. Allowed protocols: `http:`, `https:`.

The message is internally inconsistent because the returned tab URL uses `http:`. The rejection occurred at the control-policy boundary before page inspection; it was not an HTTP or Next.js connection failure.

The same policy response expressly prohibited attempting the same outcome through a workaround, indirect execution, raw CDP/browser commands, or an alternate browser surface.

### Independent Playwright runner

Diagnostic inspection found a preinstalled Python Playwright environment:

- Playwright CLI: 1.60.0
- Python package: `C:\Users\User\AppData\Local\Programs\Python\Python312\Lib\site-packages\playwright`
- locally cached Chromium, Chromium headless shell, Firefox, WebKit, and FFmpeg binaries
- no Playwright, Puppeteer, Cypress, or Selenium dependency declared by this repository

The runner is technically available. It is **not authorized for this capture attempt** because the immediately preceding Browser Use policy response explicitly forbids switching to an alternate browser surface for the same blocked operation. Running it would turn a diagnostic into a prohibited policy workaround. No Playwright browser was launched.

No proxy, tunnel, alternate hostname, public forwarding service, raw CDP session, browser extension, or security-setting change was attempted.

## 2. Screenshot inventory

Authorized Phase 2.5 captures produced: **none**.

The requested output directory is present at `docs/marketing-revamp/phase-2-acceptance-screenshots/`, with a manifest explaining the blocker. None of the following files is claimed:

- Desktop 1440×900
- Tablet 768×1024
- Mobile 390×844
- Narrow mobile 320×700
- Full-page desktop
- Full-page mobile

Existing Phase 1, baseline, and Elloe reference captures were preserved and were not relabelled as Phase 2.5 evidence.

## 3. Section-by-section visual comparison

No final section-by-section fidelity verdict can be issued without inspected screenshots from the final production build.

The existing reference analysis and earlier implementation measurements remain available in:

- `REFERENCE_DESIGN_SPEC.md`
- `PHASE2_SECTION_MAPPING.md`
- `PHASE2_VISUAL_QA.md`

They establish the intended comparison criteria for header/hero geometry, section sequence, typography, container widths, dark-canvas continuity, illustration composition, workflow/tabs/cards, CTA/footer, and mobile stacking. They do not substitute for the requested Phase 2.5 captures.

Intentional SafeRedact differences already documented include original product illustrations, SafeRedact's coral/cyan/mint palette, longer caveat copy needed for product accuracy, and retention of the contact form beneath the saturated CTA.

## 4. Issues discovered and corrected

No new visual or interaction defect was confirmed in this phase because browser inspection could not begin. In accordance with the requirement to fix only verified defects, no production source file was changed.

The only files added are this acceptance report and the screenshot-directory manifest.

## 5. Outstanding limitations

- No current production screenshots at any required viewport.
- No inspected comparison of final pixels against the Elloe captures.
- No browser measurement of horizontal overflow or text/control clipping.
- No browser console or hydration-log inspection.
- No final browser-based validation of font settlement or animation state.
- No final mobile/narrow-screen layout inspection.

The installed local Playwright runtime cannot be treated as an approved fallback while the explicit Browser Use prohibition remains in force.

## 6. Browser interaction results

| Acceptance check | Result |
| --- | --- |
| Desktop navigation | Blocked — not executed in an authorized browser session |
| Mobile navigation and keyboard behavior | Blocked |
| Format tabs and keyboard operation | Blocked |
| FAQ accordion behavior | Blocked |
| Contact form browser validation | Blocked |
| Anchor navigation | Blocked |
| Reduced-motion behavior | Blocked |
| Horizontal overflow at required widths | Blocked |
| Essential text/control clipping | Blocked |
| Browser console and hydration errors | Blocked |

Earlier source and HTTP regression evidence remains valid but is not presented as browser interaction acceptance.

## 7. Acceptance decision

**BLOCKED**

Phase 2.5 visual acceptance cannot be established under the current browser-control policy. The production server is reachable and an independent Playwright runtime exists, but the controlling policy explicitly prohibits using that alternate browser surface after rejecting the localhost tab.

Phase 3 must not begin unless either:

1. the Browser Use policy permits attaching to the localhost production tab, or
2. the environment supplies a separately authorized capture mechanism that does not conflict with the explicit restriction.

When that condition changes, rerun the requested six captures, inspect them, perform the complete interaction matrix, correct only confirmed defects, and replace this BLOCKED decision with PASS or CONDITIONAL PASS based on evidence.
