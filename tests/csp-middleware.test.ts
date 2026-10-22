import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { middleware } from "../src/middleware";

function policyFor(environment: "development" | "production") {
  const mutableEnvironment = process.env as Record<string, string | undefined>;
  const original = mutableEnvironment.NODE_ENV;
  mutableEnvironment.NODE_ENV = environment;

  try {
    const response = middleware(new NextRequest("https://www.saferedact.io/"));
    return response.headers.get("content-security-policy") ?? "";
  } finally {
    mutableEnvironment.NODE_ENV = original;
  }
}

test("the public CSP permits the Next development runtime without weakening production", () => {
  const developmentPolicy = policyFor("development");
  const productionPolicy = policyFor("production");

  assert.match(developmentPolicy, /script-src [^;]*'unsafe-eval'/);
  assert.doesNotMatch(productionPolicy, /unsafe-eval/);
  assert.match(productionPolicy, /script-src 'self' 'nonce-[A-Za-z0-9+/]{22}=='/);
});
