import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "../src/app/api/contact/route";
import { createContactHandler } from "../src/lib/leads/contact";

const validEnquiry = {
  name: "Test Visitor",
  email: "visitor@example.com",
  organization: "Example Organization",
  fileType: "PDF documents",
  message: "We would like to evaluate the documented review workflow.",
};

function request(body: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers,
    body,
  });
}

test("contact endpoint validates without logging or claiming delivery of personal data", async () => {
  const captured: unknown[][] = [];
  const originalInfo = console.info;
  console.info = (...args: unknown[]) => captured.push(args);

  try {
    const response = await POST(
      request(JSON.stringify(validEnquiry), { "content-type": "application/json" })
    );
    const result = await response.json();

    assert.equal(response.status, 202);
    assert.equal(result.accepted, true);
    assert.equal(result.delivered, false);
    assert.match(result.referenceId, /^[0-9a-f-]{36}$/i);
    const logged = JSON.stringify(captured);
    assert.doesNotMatch(logged, /visitor@example\.com|Test Visitor|review workflow/);
  } finally {
    console.info = originalInfo;
  }
});

test("contact endpoint rejects unsupported media types and invalid values", async () => {
  const wrongType = await POST(request(JSON.stringify(validEnquiry), { "content-type": "text/plain" }));
  const invalid = await POST(
    request(JSON.stringify({ ...validEnquiry, fileType: "Executable archive" }), {
      "content-type": "application/json",
    })
  );

  assert.equal(wrongType.status, 415);
  assert.equal(invalid.status, 400);
});

test("contact endpoint rejects bodies larger than the application limit", async () => {
  const response = await POST(
    request(JSON.stringify({ ...validEnquiry, message: "x".repeat(20_000) }), {
      "content-type": "application/json",
    })
  );

  assert.equal(response.status, 413);
});

function enquiryRequest(body: Record<string, unknown> = validEnquiry, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function stubTransport(
  overrides: Partial<{ configured: boolean; deliver: (...args: never[]) => Promise<unknown> }> = {}
) {
  return {
    name: "stub",
    configured: overrides.configured ?? true,
    deliver: overrides.deliver ?? (async () => ({ delivered: true, providerReference: "stub-1" })),
  } as never;
}

const allowAll = () => ({ allowed: true, retryAfterSeconds: 0 });

test("a delivered enquiry is reported as delivered, not merely accepted", async () => {
  const delivered: unknown[] = [];
  const handle = createContactHandler({
    transport: stubTransport({
      deliver: (async (...args: unknown[]) => {
        delivered.push(args);
        return { delivered: true, providerReference: "stub-1" };
      }) as never,
    }),
    rateLimit: allowAll,
  });

  const response = await handle(enquiryRequest());
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.accepted, true);
  assert.equal(result.delivered, true);
  assert.match(result.referenceId, /^[0-9a-f-]{36}$/i);
  assert.equal(delivered.length, 1);
});

test("an unconfigured transport still accepts but never claims delivery", async () => {
  const handle = createContactHandler({
    transport: stubTransport({ configured: false }),
    rateLimit: allowAll,
  });

  const response = await handle(enquiryRequest());
  const result = await response.json();

  assert.equal(response.status, 202);
  assert.equal(result.accepted, true);
  assert.equal(result.delivered, false);
});

test("a failing provider is an explicit failure, not a silent acceptance", async () => {
  const handle = createContactHandler({
    transport: stubTransport({
      deliver: async () => {
        throw new Error("provider exploded while quoting visitor@example.com");
      },
    }),
    rateLimit: allowAll,
  });

  const response = await handle(enquiryRequest());
  const result = await response.json();

  assert.equal(response.status, 502);
  assert.equal(result.accepted, false);
  assert.equal(result.delivered, false);
  assert.match(result.error, /could not be delivered/i);
  // The provider's wording may quote the enquiry, so it must not reach the visitor.
  assert.doesNotMatch(JSON.stringify(result), /exploded|visitor@example\.com/);
});

test("the honeypot and bulk heuristics are refused like any invalid enquiry", async () => {
  const handle = createContactHandler({ transport: stubTransport(), rateLimit: allowAll });

  const honeypot = await handle(enquiryRequest({ ...validEnquiry, website: "http://spam.example" }));
  const linkStuffed = await handle(
    enquiryRequest({
      ...validEnquiry,
      message: "https://a.example https://b.example https://c.example www.d.example",
    })
  );

  for (const response of [honeypot, linkStuffed]) {
    const result = await response.json();
    assert.equal(response.status, 400);
    assert.equal(result.accepted, false);
    // Identical wording, so an unattended sender cannot tell which control caught it.
    assert.equal(result.error, "Invalid enquiry details");
  }
});

test("both enquiry kinds are accepted and the kind reaches the transport", async () => {
  const kinds: string[] = [];
  const handle = createContactHandler({
    transport: stubTransport({
      deliver: (async (enquiry: { kind: string }) => {
        kinds.push(enquiry.kind);
        return { delivered: true };
      }) as never,
    }),
    rateLimit: allowAll,
  });

  await handle(enquiryRequest(validEnquiry));
  await handle(enquiryRequest({ ...validEnquiry, kind: "contact" }));
  const rejected = await handle(enquiryRequest({ ...validEnquiry, kind: "newsletter" }));

  assert.deepEqual(kinds, ["demo", "contact"]);
  assert.equal(rejected.status, 400);
});

test("package interest and a bounded license count reach the existing lead transport", async () => {
  const enquiries: Array<Record<string, unknown>> = [];
  const handle = createContactHandler({
    transport: stubTransport({
      deliver: (async (enquiry: Record<string, unknown>) => {
        enquiries.push(enquiry);
        return { delivered: true };
      }) as never,
    }),
    rateLimit: allowAll,
  });

  const response = await handle(
    enquiryRequest({
      ...validEnquiry,
      packageInterest: "advanced",
      licenseCount: 24,
    })
  );

  assert.equal(response.status, 200);
  assert.equal(enquiries.length, 1);
  assert.equal(enquiries[0].packageInterest, "advanced");
  assert.equal(enquiries[0].licenseCount, 24);
});

test("invalid package and license-count values are refused before delivery", async () => {
  let deliveries = 0;
  const handle = createContactHandler({
    transport: stubTransport({
      deliver: async () => {
        deliveries += 1;
        return { delivered: true };
      },
    }),
    rateLimit: allowAll,
  });

  for (const override of [
    { packageInterest: "starter" },
    { licenseCount: 0 },
    { licenseCount: 1001 },
    { licenseCount: 1.5 },
  ]) {
    const response = await handle(enquiryRequest({ ...validEnquiry, ...override }));
    assert.equal(response.status, 400, JSON.stringify(override));
  }

  assert.equal(deliveries, 0);
});

test("rate-limited enquiries are refused with a retry hint and never delivered", async () => {
  let deliveries = 0;
  const handle = createContactHandler({
    transport: stubTransport({
      deliver: async () => {
        deliveries += 1;
        return { delivered: true };
      },
    }),
    rateLimit: () => ({ allowed: false, retryAfterSeconds: 42 }),
  });

  const response = await handle(enquiryRequest());
  const result = await response.json();

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "42");
  assert.equal(result.accepted, false);
  assert.equal(deliveries, 0);
});

test("ordinary logs carry the reference and outcome but never the enquiry", async () => {
  const captured: unknown[][] = [];
  const originalInfo = console.info;
  console.info = (...args: unknown[]) => captured.push(args);

  try {
    const handle = createContactHandler({ transport: stubTransport(), rateLimit: allowAll });
    await handle(enquiryRequest());
  } finally {
    console.info = originalInfo;
  }

  const logged = JSON.stringify(captured);
  assert.match(logged, /delivered/);
  assert.doesNotMatch(logged, /visitor@example\.com|Test Visitor|review workflow|Example Organization/);
});
