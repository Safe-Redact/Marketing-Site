# Lead Delivery Integration Plan

## Current state

`POST /api/contact` validates required fields, logs accepted values to the server console, and returns an acknowledgement. It does not deliver email, create a CRM record, or persist a lead. The form and confirmation explicitly disclose this limitation and provide `mailto:support@saferedact.io` when delivery matters.

No provider package, credential, mailbox authorization, CRM connection, persistence layer, rate limiter, or verified deployment destination exists in this repository.

## Recommended architecture

After the company approves a destination and provider, keep `/api/contact` as the public boundary and add a small server-only delivery adapter:

1. Parse and normalize the request on the server.
2. Validate required values, email syntax, enumerated file type, and bounded field lengths.
3. Apply abuse controls before any provider call.
4. Submit a minimal structured payload to the approved mailbox or CRM through its server-side API.
5. Treat only a verified provider acknowledgement as delivery success.
6. Return a stable public response without exposing provider details or credentials.

The browser must never call the provider directly or receive a secret. Avoid dual delivery until retry and duplicate-handling behavior is specified.

## Validation and abuse controls

- Trim all text fields and reject empty values after normalization.
- Validate email syntax and cap name, organization, message, and total request sizes.
- Accept only the file-type options rendered by the form.
- Reject unsupported content types and malformed JSON.
- Add an invisible honeypot and deployment-level IP/request throttling.
- Consider an approved challenge service only if measured abuse requires it; do not add one speculatively.
- Define whether duplicate enquiries should be accepted, suppressed, or tagged.

## Environment variables

Exact names depend on the approved provider. The implementation will need equivalents of:

- delivery provider or mode identifier;
- server-side API credential or signed webhook secret;
- approved destination mailbox, list, pipeline, or CRM object;
- verified sender identity when email delivery is selected;
- optional environment/application identifier for operational tracing.

Secrets belong in the deployment platform’s secret store, not `.env` files committed to Git. Preview and production environments should use separate credentials and destinations.

## Failure handling

- Provider rejection, timeout, or malformed acknowledgement must return a non-success status and keep the form available for retry.
- User copy should say the site could not deliver the enquiry and offer the direct email address; it must not claim that sales received it.
- Successful UI copy may state delivery only after the provider acknowledgement is verified.
- Server logs should record an opaque request/provider identifier and failure category, not the full message or unnecessary personal data.
- Retries require an idempotency strategy. Do not add background retries unless the deployment has a durable queue and monitoring.

## Deployment and operations requirements

- Written approval of the mailbox or CRM destination and provider.
- Authorized account, domain/sender verification where applicable, and least-privilege credentials.
- Secret configuration for preview and production.
- Rate-limiting capability at the host, edge, or application layer.
- Monitoring for delivery failures and a named operational owner.
- End-to-end tests in a non-production destination followed by a controlled production verification.
- A retention and deletion policy covering provider records and operational logs.

## Privacy implications

The form collects name, email, optional organization, intended file type, and free-form workflow details. Before production delivery is enabled, SafeRedact needs approved notices covering purpose, controller/contact identity, lawful basis where applicable, recipients/processors, retention, cross-border processing, user rights, and instructions not to submit source files or unnecessary sensitive data through the text field.

Implementation requires separate authorization after these product, legal, provider, and operational decisions are complete.
