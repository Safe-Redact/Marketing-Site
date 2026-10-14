import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "../src/app/api/contact/route";

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
