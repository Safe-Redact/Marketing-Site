import assert from "node:assert/strict";
import test from "node:test";

import { clientKey, createRateLimiter, looksAutomated } from "../src/lib/leads/abuse";
import { resolveLeadTransport } from "../src/lib/leads/delivery";
import { readHttpsEmailSettings } from "../src/lib/leads/transports/https-email";
import { LeadDeliveryError } from "../src/lib/leads/types";
import type { LeadEnquiry } from "../src/lib/leads/types";

const enquiry: LeadEnquiry = {
  kind: "demo",
  name: "Test Visitor",
  email: "visitor@example.com",
  organization: "Example Organization",
  fileType: "PDF documents",
  message: "We would like to evaluate the documented review workflow.",
};

const configured = {
  LEAD_DELIVERY_ENDPOINT: "https://api.provider.example/emails",
  LEAD_DELIVERY_TOKEN: "development-delivery-token",
  LEAD_DELIVERY_FROM: "site@saferedact.example",
  LEAD_DELIVERY_TO: "enquiries@saferedact.example",
};

test("an unconfigured environment yields a transport that claims nothing", async () => {
  const transport = resolveLeadTransport({});

  assert.equal(transport.configured, false);
  assert.equal(transport.name, "none");
  assert.deepEqual(await transport.deliver(enquiry, { referenceId: "r-1" }), { delivered: false });
});

test("a half-configured environment fails closed instead of dropping enquiries", () => {
  for (const missing of Object.keys(configured)) {
    const partial = { ...configured };
    delete (partial as Record<string, string>)[missing];
    assert.throws(() => readHttpsEmailSettings(partial), /must be set together/i, missing);
  }
});

test("delivery settings reject unsafe endpoints, addresses, and timeouts", () => {
  for (const override of [
    { LEAD_DELIVERY_ENDPOINT: "http://api.provider.example/emails" },
    { LEAD_DELIVERY_ENDPOINT: "https://user:password@api.provider.example/emails" },
    { LEAD_DELIVERY_ENDPOINT: "not-a-url" },
    { LEAD_DELIVERY_FROM: "not-an-address" },
    { LEAD_DELIVERY_TO: "two@example.com, three@example.com" },
    { LEAD_DELIVERY_TIMEOUT_MS: "20000" },
    { LEAD_DELIVERY_TIMEOUT_MS: "0" },
  ]) {
    assert.throws(
      () => readHttpsEmailSettings({ ...configured, ...override }),
      /configuration error/i,
      JSON.stringify(override)
    );
  }
});

test("a configured transport delivers over plain HTTPS and reports the provider reference", async () => {
  const seen: { url: string; init: RequestInit }[] = [];
  const transport = resolveLeadTransport(configured, (async (url: string, init: RequestInit) => {
    seen.push({ url, init });
    return new Response(JSON.stringify({ id: "provider-message-id" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as unknown as typeof fetch);

  const receipt = await transport.deliver(enquiry, { referenceId: "reference-1" });

  assert.equal(transport.configured, true);
  assert.deepEqual(receipt, { delivered: true, providerReference: "provider-message-id" });
  assert.equal(seen.length, 1);
  assert.equal(seen[0].url, "https://api.provider.example/emails");

  const headers = seen[0].init.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer development-delivery-token");

  // The enquiry reaches the provider intact, and the reference ties it to the request.
  const payload = JSON.parse(String(seen[0].init.body));
  assert.deepEqual(payload.to, ["enquiries@saferedact.example"]);
  assert.equal(payload.reply_to, "visitor@example.com");
  assert.match(payload.subject, /Demo enquiry/);
  assert.match(payload.text, /reference-1/);
  assert.match(payload.text, /review workflow/);
});

test("a refused or unreachable provider raises a delivery error rather than claiming success", async () => {
  const rejecting = resolveLeadTransport(configured, (async () =>
    new Response("nope", { status: 422 })) as unknown as typeof fetch);
  const unreachable = resolveLeadTransport(configured, (async () => {
    throw new Error("socket closed");
  }) as unknown as typeof fetch);
  const unavailable = resolveLeadTransport(configured, (async () =>
    new Response("busy", { status: 503 })) as unknown as typeof fetch);

  await assert.rejects(
    () => rejecting.deliver(enquiry, { referenceId: "r" }),
    (error: LeadDeliveryError) => error instanceof LeadDeliveryError && error.retryable === false
  );
  await assert.rejects(
    () => unreachable.deliver(enquiry, { referenceId: "r" }),
    (error: LeadDeliveryError) => error instanceof LeadDeliveryError && error.retryable === true
  );
  await assert.rejects(
    () => unavailable.deliver(enquiry, { referenceId: "r" }),
    (error: LeadDeliveryError) => error.retryable === true
  );

  // The provider's own wording may quote the payload, so it must not surface.
  await rejecting.deliver(enquiry, { referenceId: "r" }).catch((error: Error) => {
    assert.doesNotMatch(error.message, /nope|visitor@example\.com|review workflow/);
  });
});

test("the rate limiter bounds a single client and recovers after its window", () => {
  const check = createRateLimiter({ limit: 3, windowMs: 60_000 });
  const start = 1_000_000;

  for (let attempt = 1; attempt <= 3; attempt++) {
    assert.equal(check("198.51.100.7", start).allowed, true, `attempt ${attempt}`);
  }
  const refused = check("198.51.100.7", start);
  assert.equal(refused.allowed, false);
  assert.ok(refused.retryAfterSeconds > 0 && refused.retryAfterSeconds <= 60);

  // A different client is unaffected, and the window reopens.
  assert.equal(check("203.0.113.9", start).allowed, true);
  assert.equal(check("198.51.100.7", start + 60_001).allowed, true);
});

test("the rate-limit key trusts only the configured proxy suffix", () => {
  const keyOf = (headers: Record<string, string>, trustedProxyHops?: number) =>
    clientKey(new Request("http://localhost/api/contact", { headers }), trustedProxyHops);

  // With no trusted proxy configuration, caller-supplied forwarding headers are ignored.
  assert.equal(keyOf({ "x-forwarded-for": "198.51.100.7" }, 0), "unattributed");
  // A single trusted proxy appends the actual peer after anything the client supplied.
  assert.equal(
    keyOf({ "x-forwarded-for": "192.0.2.55, 198.51.100.7" }, 1),
    "198.51.100.7"
  );
  assert.equal(
    keyOf({ "x-forwarded-for": "198.51.100.7, 10.0.0.1" }, 2),
    "198.51.100.7"
  );
  assert.equal(keyOf({ "x-forwarded-for": "not-an-address" }, 1), "unattributed");
  assert.equal(keyOf({}, 1), "unattributed");
});

test("bulk submission heuristics reject link stuffing and non-names", () => {
  assert.equal(looksAutomated({ name: "Test Visitor", message: "A normal enquiry." }), false);
  assert.equal(
    looksAutomated({ name: "Test Visitor", message: "One https://a.example link is fine." }),
    false
  );
  assert.equal(
    looksAutomated({
      name: "Test Visitor",
      message: "https://a.example https://b.example https://c.example www.d.example",
    }),
    true
  );
  assert.equal(looksAutomated({ name: "!!! ###", message: "A normal enquiry." }), true);
});
