import { LeadDeliveryError } from "../types";
import type { DeliveryContext, DeliveryReceipt, LeadEnquiry, LeadTransport } from "../types";
import { pricingPackages } from "@/content/pricing";

export interface HttpsEmailSettings {
  endpoint: string;
  token: string;
  from: string;
  recipient: string;
  timeoutMs: number;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function exactHttpsEndpoint(value: string): string {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("Lead delivery configuration error: LEAD_DELIVERY_ENDPOINT must be an exact HTTPS URL.");
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.hash) {
    throw new Error("Lead delivery configuration error: LEAD_DELIVERY_ENDPOINT must be an exact credential-free HTTPS URL.");
  }
  return parsed.href;
}

function address(name: string, value: string): string {
  const trimmed = value.trim();
  if (!emailPattern.test(trimmed)) {
    throw new Error(`Lead delivery configuration error: ${name} must be a single email address.`);
  }
  return trimmed;
}

export function readHttpsEmailSettings(
  environment: Record<string, string | undefined>
): HttpsEmailSettings | null {
  const endpoint = environment.LEAD_DELIVERY_ENDPOINT?.trim();
  const token = environment.LEAD_DELIVERY_TOKEN?.trim();
  const from = environment.LEAD_DELIVERY_FROM?.trim();
  const recipient = environment.LEAD_DELIVERY_TO?.trim();

  // All four or none: a half-configured transport is a silent dead letter box.
  if (!endpoint && !token && !from && !recipient) return null;
  if (!endpoint || !token || !from || !recipient) {
    throw new Error(
      "Lead delivery configuration error: LEAD_DELIVERY_ENDPOINT, LEAD_DELIVERY_TOKEN, LEAD_DELIVERY_FROM and LEAD_DELIVERY_TO must be set together."
    );
  }
  if (/[\r\n]/.test(token)) {
    throw new Error("Lead delivery configuration error: LEAD_DELIVERY_TOKEN is malformed.");
  }

  const timeoutRaw = environment.LEAD_DELIVERY_TIMEOUT_MS?.trim() || "5000";
  const timeoutMs = Number(timeoutRaw);
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 500 || timeoutMs > 15_000) {
    throw new Error("Lead delivery configuration error: LEAD_DELIVERY_TIMEOUT_MS must be an integer from 500 to 15000.");
  }

  return {
    endpoint: exactHttpsEndpoint(endpoint),
    token,
    from: address("LEAD_DELIVERY_FROM", from),
    recipient: address("LEAD_DELIVERY_TO", recipient),
    timeoutMs,
  };
}

function subjectFor(enquiry: LeadEnquiry): string {
  const label = enquiry.kind === "demo" ? "Demo enquiry" : "Contact enquiry";
  // The organisation is operator-facing context, not a header injection vector:
  // newlines cannot survive the schema, and the value is JSON-encoded regardless.
  return enquiry.organization
    ? `${label} — ${enquiry.organization}`
    : `${label} — ${enquiry.name}`;
}

function bodyFor(enquiry: LeadEnquiry, referenceId: string): string {
  const packageName = enquiry.packageInterest
    ? pricingPackages.find((plan) => plan.slug === enquiry.packageInterest)?.name
    : undefined;

  return [
    `Reference: ${referenceId}`,
    `Kind: ${enquiry.kind}`,
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Organization: ${enquiry.organization || "(not provided)"}`,
    ...(packageName ? [`Package interest: ${packageName}`] : []),
    ...(enquiry.licenseCount ? [`Requested licenses: ${enquiry.licenseCount}`] : []),
    `Source formats: ${enquiry.fileType}`,
    "",
    enquiry.message,
  ].join("\n");
}

/**
 * Delivers over plain HTTPS and JSON, with no vendor SDK. The payload shape
 * ({from, to, subject, text}) is the one transactional email APIs such as Resend
 * accept directly; a provider with a different shape gets its own file here rather
 * than a change anywhere else.
 */
export function createHttpsEmailTransport(
  settings: HttpsEmailSettings,
  fetchImpl: typeof fetch = fetch
): LeadTransport {
  return {
    name: "https-email",
    configured: true,
    async deliver(enquiry: LeadEnquiry, context: DeliveryContext): Promise<DeliveryReceipt> {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), settings.timeoutMs);
      context.signal?.addEventListener("abort", () => controller.abort(), { once: true });

      let response: Response;
      try {
        response = await fetchImpl(settings.endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${settings.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            from: settings.from,
            to: [settings.recipient],
            reply_to: enquiry.email,
            subject: subjectFor(enquiry),
            text: bodyFor(enquiry, context.referenceId),
          }),
          signal: controller.signal,
        });
      } catch {
        // The provider's message may quote the payload, so it is never surfaced.
        throw new LeadDeliveryError("The delivery provider could not be reached.", true);
      } finally {
        clearTimeout(timer);
      }

      if (!response.ok) {
        // 4xx is a configuration fault and will fail again identically; 5xx may not.
        const retryable = response.status >= 500;
        throw new LeadDeliveryError(
          `The delivery provider rejected the enquiry (${response.status}).`,
          retryable
        );
      }

      let providerReference: string | undefined;
      try {
        const payload = (await response.json()) as { id?: unknown };
        if (typeof payload?.id === "string") providerReference = payload.id;
      } catch {
        // A provider that returns no JSON body still delivered.
      }

      return { delivered: true, providerReference };
    },
  };
}
