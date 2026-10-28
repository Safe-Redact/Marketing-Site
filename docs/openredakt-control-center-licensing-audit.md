# OpenRedakt Control Center Licensing and Entitlement Audit

Audit date: 28 October 2026

## Scope and repository integrity

This audit treats the Control Center and desktop repositories as read-only references. No source, configuration, database, or licensing record was changed.

| Repository | Branch | HEAD at audit start | Initial status |
| --- | --- | --- | --- |
| `M:\Safaridesk\Admin-panel` | `feat/desktop-download-ui` | `9bc263b3e50bd4f36a0a9577731d5510ff667d3c` | Clean |
| `M:\Safaridesk\redact` | `develop` | `be61394c58bfa6fdc23c27c52be01f71bd941f77` | Clean |

The desktop project prefers the sibling `M:\Safaridesk\control-center` licensing source when both sibling checkouts exist, then falls back to `Admin-panel`, or to the versioned NuGet package. The ten source files in `SafeRedact.Licensing` were SHA-256 identical between the two sibling Control Center checkouts during this audit (`M:\Safaridesk\redact\src\Presentation\Redactor.App\Redactor.App.csproj:22-56`).

## Executive finding

The Control Center has a real named-user licensing architecture: an organisation receives a subscription, a seat is assigned to an email address, one or more computers are bound within a plan-defined limit, and the desktop receives a signed device-bound token containing a snapshot of the seat's format entitlements. Customer owners/admins can manage people, seat assignments, and online devices.

The approved Essential, Advanced, and Complete Suite packages do not exist as predefined licence types. The current demo seed creates legacy `Doc Suite` (Document + Image), `Media Suite` (Audio + Video), `Ultimate Suite` (all four), and an uncapped Agency plan (`M:\Safaridesk\Admin-panel\src\SafeRedact.ControlCenter.Infrastructure\DemoSeeder.cs:41-93`). The catalogue UI can create the exact approved entitlement combinations, but the desktop does not yet enforce Document versus Audio at local workflow entry points. Cloud service endpoints do enforce those flags.

The pricing page may therefore publish the commercially approved package scope and verified package-neutral management workflow, but the format separation is a commercial proposal with launch-blocking configuration and desktop enforcement work still required.

## Evidence-based licensing matrix

| Area | Confirmed current implementation | Supported but incomplete or inconsistent | Proposed commercial packaging | Missing work before launch |
| --- | --- | --- | --- | --- |
| Licence types | Staff Admin/Owner can create and edit a plan with any combination of Document, Audio, Image, and Video flags; capped/uncapped seats; device limit; active state; currency; and per-user/month price (`VendorPlans.razor:139-223`, `422-474`). | Retiring a plan is described as harmless to existing customers, but server proof validation rejects inactive plans (`VendorPlans.razor:494-508`; `LicenseProofValidator.cs:116-124`). | Create Essential = Document, Advanced = Audio, Complete Suite = Document + Audio. | Add and test the three exact plan records; resolve retired-plan renewal behavior; do not reuse legacy bundles containing Image/Video. |
| Entitlement flow | Plan flags are copied to the seat on assignment, then into the signed token and issued-token snapshot (`LicensingService.cs:154-169`, `455-500`). | Existing seat entitlements do not automatically change when a plan is edited; that snapshot behavior is intentional but needs an explicit migration path for package changes. | The public comparison can state the approved included formats. | Define migration/re-provisioning behavior when customers change package. |
| Desktop enforcement | Release builds validate a signed device-bound token at startup; `LicenseCheck.Allows(...)` exists (`LicenseGate.cs:88-187`; `LicenseValidator.cs:29-48`). | No local desktop workflow calls `Allows(Entitlements.Document)` or `Allows(Entitlements.Audio)`. Project documentation explicitly records that new-job and per-domain gating are not wired (`Docs/TESTING.md:327-332`). | Sell separate format packages only after local entry points enforce their flags. | Gate every new Document and Audio workflow, preserve export of completed work after expiry, and add desktop tests for both allowed and denied cases. |
| Cloud enforcement | Cloud entitlement mapping requires Document for document analysis, Audio for audio transcription/detection, and both for transcript translation (`Cloud.cs:153-164`). Proof validation rejects missing flags (`LicenseProofValidator.cs:123-124`; `CloudAuthenticationTests.cs:214-223`). | Cloud quotas are separate policy records and are not automatically an included benefit of a format entitlement. | No cloud allowance is approved for any public package. | Decide commercially whether managed cloud services are included, then configure and publish quotas separately if approved. |
| Seat identity | A seat is an email address inside a tenant; `UserId` may be null until first sign-in (`Licensing.cs:62-85`). | The UI generally assumes one active subscription per organisation by using `FirstOrDefault`; the model permits a list of subscriptions (`Tenancy.cs:37-39`; `Organisation.razor:340-348`). | One public "license" should mean one named-user seat assigned to an email. | Enforce one active subscription per organisation or implement deterministic multi-subscription/seat selection before promising mixed package types in one organisation. |
| Seat quantity | Capped subscriptions refuse assignment above `SeatsPurchased`; released seats free capacity (`LicensingService.cs:141-169`, `365-385`; `LicensingServiceTests.cs:140-164`, `344-359`). | Additional quantities are changed by OpenRedakt staff, not purchased through billing/self-service (`VendorTenant.razor:619-649`). Uncapped domain enforcement ships in lenient mode (`LicensingPolicy.cs:8-40`). | Sales collects the requested licence quantity; OpenRedakt provisions it. | Set the seat model and catalogue maximum for each package. Do not sell uncapped access until strict domain enforcement is enabled and tested. |
| User management | Customer Owner/Admin can invite/remove users, change Member/Admin roles, grant/revoke seats, and release online devices (`Organisation.razor:313-472`, `544-575`). | Ownership transfer is staff-mediated; air-gapped devices cannot normally be released by the customer. | Include Control Center organisation management as a package-neutral capability. | No package-specific change required; decide whether ownership transfer and air-gapped administration are public benefits. |
| Device activation | A device is bound by fingerprint to a named-user seat. The server enforces the plan's device cap and a 24-hour replacement cooldown (`Licensing.cs:103-150`; `LicensingService.cs:172-252`; `LicensingServiceTests.cs:259-319`). | The maximum is configurable per plan (UI allows 1-10; seeded plans use 2), but no number is commercially approved for the new packages. An account may have multiple licensed computers while only one online sign-in is current (`DesktopSessionTests.cs:48-75`). | Say activation is managed per named user and exact allowances are confirmed in the quote. | Decide and configure the device allowance per new plan; add exact package acceptance tests. |
| Deactivation/transfer | The desktop can deactivate its own online device; customer admins can release an online device; the same fingerprint can recover immediately, while a different replacement waits 24 hours (`ActivationApi.cs:203-215`; `LicensingService.cs:191-233`, `337-363`). | Air-gapped keys cannot be remotely revoked before their expiry; staff can release a destroyed air-gapped machine's slot with explicit risk (`LicensingService.cs:331-363`). | Do not advertise transfer rights or air-gapped activation as included package benefits. | Make a commercial policy decision and customer-facing terms for transfers, cooldown, and air-gapped deployments. |
| Organisation status | Tenant status supports Pending, Active, and Suspended. Suspension blocks new seats, activation, and token renewal, while an already-issued token works until expiry (`Tenancy.cs:12`; `LicensingService.cs:64-77`, `419-433`; `VendorTenant.razor:693-717`). | Suspension is not an instant kill for an offline signed token. | No special tier claim; this is an administrative control. | Ensure contracts and support procedures explain delayed effect on already-issued/offline tokens. |
| Terms and expiry | Subscription has start/end dates and Active/Expired/Cancelled status. One-month trial, 3/6 months, 1/2 years, and custom end dates are supported (`Licensing.cs:43-60`; `LicenceTerm.cs:3-58`; `LicenceTermTests.cs:11-41`). | Expiry is often computed from date/status rather than a scheduled process changing status to `Expired`. | All three public prices are for a one-year organisation term. | Configure one-year terms for these packages and add package provisioning tests. |
| Technical token renewal | Online tokens last 30 days with 14-day grace, bounded by the organisation term; the desktop attempts a quiet refresh at startup (`LicensingService.cs:26-43`, `435-471`; `LicenseGate.cs:104-160`). | This is a technical token refresh, not evidence of automatic commercial subscription renewal. | Explain that the desktop checks in while the annual term is active; do not say the commercial subscription auto-renews. | Keep commercial renewal manual until billing/renewal product decisions and implementation exist. |
| Trial | Provisioning offers a labelled one-month trial term and token expiry is capped at the term (`LicenceTerm.cs:25-33`; `TenantOfflineKeyTests.cs:198-227`). | There is no distinct Trial subscription status, checkout, conversion, or automated expiry workflow. | Trial is not an approved package benefit. | Decide trial policy and conversion workflow before advertising it. |
| Upgrade/downgrade | Staff can change seats and term end. | No customer plan switch or explicit upgrade/downgrade service was found. Existing seats retain copied entitlements, so simply editing the plan does not migrate them. | Not advertised. | Implement audited plan-change semantics and seat/token migration before offering upgrades/downgrades. |
| Pricing/billing | `Plan` stores `PricePerSeat` and `Currency`; the UI labels it per user/month and supports USD (`Licensing.cs:24-41`; `VendorPlans.razor:205-220`). | There is no billing cadence field, invoice/checkout integration, or authoritative annual-price field. | Approved public prices are USD per licence billed annually: $1,500, $2,500, and proposed $3,500. | Add explicit annual price/billing-cadence representation or document a safe administrative convention; do not imply the Control Center charges customers. |

## Seats and users

- One seat represents one named user identified by email within one organisation, not a device or activation.
- A capped subscription owns a purchased quantity. Assignment is refused when every purchased seat is assigned.
- The plan entitlement snapshot is copied to each newly assigned seat. This makes per-seat entitlements technically possible, although the current service selects the organisation's first active subscription rather than offering an explicit package choice.
- Customer Owner/Admin roles may add or remove users and assign or revoke seats. Removing a user releases the seat and unbinds that user's devices.
- A released seat remains recorded for audit/revocation and is not silently restored by self-service activation. An administrator can deliberately reinstate it.
- SafeRedact Support can inspect and help with identity but cannot change licensing; Staff Admin can provision and manage catalogue; Staff Owner additionally manages cloud policy and staff (`StaffPermissionTests.cs:8-33`).

## Devices and activation

- Online activation authenticates the user, ensures an assigned seat (or allocates one if the plan allows), binds the fingerprinted computer, and signs a device-bound token (`ActivationApi.cs:79-200`; `LicensingService.cs:399-510`).
- Copying the token to another computer fails because the token includes and validates the fingerprint (`LicenseToken.cs:19-29`; `LicenseValidator.cs:72-108`).
- Device limits are per named-user seat and configured on the plan. The new packages have no approved numeric allowance yet.
- Licensed-device count and signed-in-session count are separate: a user may have more than one activated computer but only one current online desktop sign-in. A second sign-in displaces the first.
- Online devices can be deactivated/released. A different replacement machine is delayed for 24 hours; the same fingerprint can recover without consuming another slot.
- Air-gapped keys are supported but cannot be remotely revoked during their signed term. This is operationally real but is excluded from public package benefits pending a commercial decision.

## Organisations, roles, and access

- OpenRedakt staff provision the organisation, owner, licence type, purchased seat quantity, and term. There is no public checkout or instant provisioning path (`Vendor.razor:248-415`).
- The customer accesses a separate organisation console. Owner/Admin can manage users, roles, named-user licences, and online device releases; Member sees their own licence and devices.
- Staff accounts are separate from customer accounts and cannot license a desktop device (`Tenancy.cs:72-127`; `ActivationApi.cs:124-132`).
- The desktop enforces signed-token authenticity, device binding, validity/grace, and startup activation. Cloud calls additionally enforce format entitlement. Local Document/Audio workflow enforcement is not yet wired.

## Proposed public package matrix

These rows are the maximum evidence-backed public comparison for this Marketing Site phase. "Included" means commercially included; launch still depends on the implementation work below.

| Public comparison row | Essential | Advanced | Complete Suite |
| --- | --- | --- | --- |
| Annual price per named-user licence | $1,500 | $2,500 | $3,500 proposed; confirm with sales |
| Included product formats | Documents | Audio | Documents + Audio |
| Organisation licence term | One year | One year | One year |
| Named-user assignment by email | Included | Included | Included |
| Customer Owner/Admin licence management | Included | Included | Included |
| Activated-computer visibility and release | Included | Included | Included |
| Device allowance | Confirmed in quote | Confirmed in quote | Confirmed in quote |
| Provisioning | OpenRedakt sales/admin led | OpenRedakt sales/admin led | OpenRedakt sales/admin led |

Essential and Advanced are separate capability packages, not cumulative tiers. Complete Suite combines both approved formats.

## Features excluded from public pricing

- Image and video redaction, despite internal flags and legacy catalogue entries.
- Exact devices per user, exact tier seat caps, uncapped users, or verified-domain licences.
- Cloud service quotas, storage, usage limits, managed-transcription allowances, or translation.
- Support response levels, installation services, onboarding SLAs, training, or maintenance promises.
- Self-service purchase, instant provisioning, invoices, automatic commercial renewal, or billing integrations.
- Customer self-service upgrades/downgrades, package mixing within one organisation, or automatic entitlement migration.
- Air-gapped activation, offline-key transfer rights, or immediate remote revocation.
- Taxes, cancellation, refund, reassignment, and contractual transfer terms.

## Required Control Center and desktop work before commercial launch

1. Create exact Essential, Advanced, and Complete Suite licence types with only the approved Document/Audio flag combinations. Do not derive them from the legacy Doc/Media/Ultimate bundles.
2. Decide and configure capped/uncapped seat model, catalogue maximum, purchased-seat rules, and device allowance for each package. Keep these off the public page until approved.
3. Represent USD annual pricing and billing cadence explicitly, or establish a documented administrative convention that cannot be mistaken for active billing.
4. Wire `LicenseGate.Current.Allows(Entitlements.Document)` and `.Allows(Entitlements.Audio)` into every local new-work entry point. Test allowed, denied, in-grace, and expired/export-only behavior.
5. Add end-to-end tests proving each exact package issues the correct seat/token flags and that both server/cloud and desktop entry points enforce them.
6. Define upgrade/downgrade behavior, including existing seat entitlement migration, token refresh/reissue, audit records, and rollback.
7. Either enforce a single active subscription per organisation or implement explicit subscription/package selection for seat assignment before promising mixed packages within one organisation.
8. Resolve the plan-retirement inconsistency: the UI says existing customers continue, while proof validation currently rejects inactive plans.
9. Keep uncapped licences out of sale until verified-domain enforcement is enabled, or remove that offer from the commercial catalogue.
10. Define commercial renewal, trial conversion, air-gapped licensing, support, and transfer policies before adding any corresponding public benefit.

## Marketing implementation rule

The Marketing Site may describe approved prices/formats and the verified sales-led, named-user, organisation-management workflow. It must not imply that the Control Center takes payment, automatically renews a commercial term, instantly provisions access, or currently enforces local Document-versus-Audio separation end to end. The last point is a launch blocker documented here, not a benefit to expose in customer-facing copy.
