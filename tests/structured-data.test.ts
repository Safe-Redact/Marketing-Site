import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBreadcrumbJsonLd,
  serializeJsonLd,
} from "../src/lib/seo/structured-data";

test("breadcrumb structured data uses ordered absolute URLs", () => {
  const data = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Audio redaction", path: "/features/audio-redaction" },
  ]);

  assert.equal(data["@type"], "BreadcrumbList");
  assert.deepEqual(
    data.itemListElement.map((item) => [item.position, item.name, item.item]),
    [
      [1, "Home", "https://saferedact.io/"],
      [2, "Features", "https://saferedact.io/features"],
      [3, "Audio redaction", "https://saferedact.io/features/audio-redaction"],
    ]
  );
});

test("JSON-LD serialization cannot terminate its script element", () => {
  const serialized = serializeJsonLd({ value: "</script><script>alert(1)</script>" });
  assert.doesNotMatch(serialized, /<\/script>/i);
  assert.match(serialized, /\\u003c/);
});

