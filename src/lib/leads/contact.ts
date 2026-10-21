import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, createRateLimiter, looksAutomated } from "./abuse";
import { leadTransport } from "./delivery";
import { LEAD_KINDS, LeadDeliveryError } from "./types";
import type { LeadEnquiry, LeadTransport } from "./types";

const MAX_REQUEST_BYTES = 16 * 1024;
const supportedFileTypes = [
  "Video files",
  "Audio files",
  "PDF documents",
  "Word documents",
  "Scanned images",
  "Multiple formats",
  "Not sure",
] as const;

const contactSchema = z
  .object({
    kind: z.enum(LEAD_KINDS).default("demo"),
    // Honeypot. A real visitor never sees this control, so any value in it marks an
    // unattended submission. It is accepted by the schema and refused below, so a
    // bot cannot tell the field apart from a validation miss.
    website: z.string().max(200).optional(),
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    organization: z.string().trim().max(120).optional().default(""),
    fileType: z.enum(supportedFileTypes),
    message: z.string().trim().min(10).max(2_000),
  })
  .strict();

class PayloadTooLargeError extends Error {}

const ENQUIRIES_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const checkRateLimit = createRateLimiter({
  limit: ENQUIRIES_PER_WINDOW,
  windowMs: RATE_LIMIT_WINDOW_MS,
});

const noStore = { "Cache-Control": "no-store" } as const;

/**
 * Logs carry the correlation reference and the outcome only. An enquiry is personal
 * data and never reaches an ordinary log line, so a reference is the only way to tie
 * a support question back to a request.
 */
function logOutcome(referenceId: string, outcome: string, transport: string) {
  console.info("Contact enquiry", { referenceId, outcome, transport });
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new TypeError("UNSUPPORTED_MEDIA_TYPE");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    throw new PayloadTooLargeError();
  }

  if (!request.body) return null;

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let decoded = "";
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    receivedBytes += value.byteLength;
    if (receivedBytes > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    decoded += decoder.decode(value, { stream: true });
  }

  decoded += decoder.decode();
  return JSON.parse(decoded);
}

export interface ContactHandlerDependencies {
  transport?: LeadTransport;
  rateLimit?: (key: string, now?: number) => { allowed: boolean; retryAfterSeconds: number };
}

export function createContactHandler({
  transport = leadTransport(),
  rateLimit = checkRateLimit,
}: ContactHandlerDependencies = {}) {
  return async function handle(request: Request) {
    try {
      const limit = rateLimit(clientKey(request));
      if (!limit.allowed) {
        return NextResponse.json(
          { accepted: false, error: "Too many enquiries from this network. Please try again later." },
          {
            status: 429,
            headers: { ...noStore, "Retry-After": String(limit.retryAfterSeconds) },
          }
        );
      }

      const parsed = contactSchema.safeParse(await readBoundedJson(request));
      if (!parsed.success) {
        return NextResponse.json(
          { accepted: false, error: "Invalid enquiry details" },
          { status: 400, headers: noStore }
        );
      }

      const { website, ...enquiry } = parsed.data;
      // The honeypot and the content heuristics answer exactly like a validation
      // miss, so an unattended sender learns nothing about which control caught it.
      if (website?.trim() || looksAutomated(enquiry)) {
        return NextResponse.json(
          { accepted: false, error: "Invalid enquiry details" },
          { status: 400, headers: noStore }
        );
      }

      const referenceId = crypto.randomUUID();

      if (!transport.configured) {
        logOutcome(referenceId, "accepted-not-delivered", transport.name);
        return NextResponse.json(
          { accepted: true, delivered: false, referenceId },
          { status: 202, headers: noStore }
        );
      }

      try {
        const receipt = await transport.deliver(enquiry as LeadEnquiry, { referenceId });
        logOutcome(referenceId, receipt.delivered ? "delivered" : "accepted-not-delivered", transport.name);
        return NextResponse.json(
          { accepted: true, delivered: receipt.delivered, referenceId },
          { status: receipt.delivered ? 200 : 202, headers: noStore }
        );
      } catch (error) {
        // A configured transport that failed is an outage, not an accepted enquiry:
        // answering 202 here would tell the visitor their message is on its way.
        const retryable = error instanceof LeadDeliveryError ? error.retryable : true;
        logOutcome(referenceId, retryable ? "delivery-failed" : "delivery-refused", transport.name);
        return NextResponse.json(
          {
            accepted: false,
            delivered: false,
            referenceId,
            error: "Your enquiry could not be delivered. Please use the direct contact option.",
          },
          { status: 502, headers: noStore }
        );
      }
    } catch (error) {
      if (error instanceof PayloadTooLargeError) {
        return NextResponse.json(
          { accepted: false, error: "Request body is too large" },
          { status: 413, headers: noStore }
        );
      }
      if (error instanceof TypeError && error.message === "UNSUPPORTED_MEDIA_TYPE") {
        return NextResponse.json(
          { accepted: false, error: "Content-Type must be application/json" },
          { status: 415, headers: noStore }
        );
      }
      return NextResponse.json(
        { accepted: false, error: "Invalid JSON request" },
        { status: 400, headers: noStore }
      );
    }
  };
}

