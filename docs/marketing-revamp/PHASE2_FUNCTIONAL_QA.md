# SafeRedact Marketing Revamp — Phase 2 Functional QA

Date: 2026-10-14  
Environment: Windows, Node/Next.js local optimized production server

## Automated verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass; no warnings or errors from project lint rules |
| `npm run build` | Pass |
| `node --test tests/*.test.mjs` | Pass, 14/14 against the final production server |
| `git diff --check` | Pass; only line-ending notices |
| Production homepage request | HTTP 200 |
| Production incomplete contact request | HTTP 400 |
| Production complete contact request | HTTP 200 |

Build summary:

- `/` route size: 26 kB
- first-load JS: 129 kB
- homepage is statically generated
- contact endpoint is server-rendered

The only build warning is the pre-existing multiple-lockfile workspace-root inference (`M:\Safaridesk\package-lock.json` and the repository lockfile). No lockfile was removed or changed to suppress it.

## Regression coverage

The source and HTTP tests confirm:

- the approved Phase 1 hero and platform narrative remain rendered;
- the complete Phase 2 section sequence is present;
- structured copy exports exist for outcomes, capabilities, workflow, format tabs, use cases, and workbench labels;
- prohibited claims are absent from Phase 2 platform content;
- shared accordion triggers expose `aria-expanded` and `aria-controls` and hide collapsed panels;
- format tabs point to a stable tab panel;
- the fixed-header scroll margin is present;
- outcome-grid edge and divider selectors are attached to actual grid siblings;
- the selected format panel is keyboard focusable;
- the contact form discloses its server-log-only behavior before submission and provides a direct email link after acceptance;
- the footer contains only real in-page, download, and email destinations;
- all production section anchors exist;
- exactly one H1 is emitted;
- no dead hash destination is emitted;
- the mobile menu includes an in-dialog close control;
- coral action labels meet the recorded Phase 1 contrast checks.

## Interaction implementation

- Header collapses below 992px.
- Mobile navigation locks body scrolling, traps Tab focus, closes on Escape or backdrop activation, and restores focus to its trigger.
- Workflow accordion updates the associated original product illustration and does not collapse to an undefined state.
- Format tabs support click, ArrowLeft, ArrowRight, Home, and End selection/focus behavior.
- FAQ uses the shared disclosure component and allows items to collapse.
- Contact fields retain native required and email validation.
- Submission state uses an accessible status or alert instead of a browser alert.
- Reduced-motion users receive near-zero animation/transition duration and non-smooth scrolling.

## Contact-delivery limitation

The current endpoint validates the request and writes it to the server log. It does not send email, write to a CRM, or persist to a database. A 200 response therefore means only that this site accepted the request. The success message directs users to `support@saferedact.io` when delivery matters.

## Manual browser QA limitation

Keyboard execution, responsive overflow measurements, console inspection, and final screenshot validation could not be repeated after the final corrections because the computer-control layer rejected localhost access under its browser URL policy. Earlier browser inspection established the initial geometry and absence of desktop horizontal overflow; it is not represented here as a post-build final check.

No external integration, download-host availability, detector accuracy, exhaustive file compatibility, or broad browser matrix was certified.
