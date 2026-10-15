import assert from "node:assert/strict";
import test from "node:test";

import { loadServerConfig } from "../src/server.mjs";

test("server requires explicit TLS material and bounded network settings", () => {
  assert.throws(() => loadServerConfig({}), /OAUTH_TLS_CERT_PATH/);
  assert.throws(
    () => loadServerConfig({ OAUTH_TLS_CERT_PATH: "cert.pem", OAUTH_TLS_KEY_PATH: "key.pem", OAUTH_PORT: "0" }),
    /OAUTH_PORT/
  );
  assert.throws(
    () => loadServerConfig({ OAUTH_TLS_CERT_PATH: "cert.pem", OAUTH_TLS_KEY_PATH: "key.pem", OAUTH_BIND_HOST: "https://example.com" }),
    /OAUTH_BIND_HOST/
  );

  assert.deepEqual(loadServerConfig({
    OAUTH_TLS_CERT_PATH: "cert.pem",
    OAUTH_TLS_KEY_PATH: "key.pem",
    OAUTH_PORT: "8443",
    OAUTH_BIND_HOST: "127.0.0.1",
  }), {
    certificatePath: "cert.pem",
    privateKeyPath: "key.pem",
    port: 8443,
    host: "127.0.0.1",
  });
});
