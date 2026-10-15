import { createBroker } from "./broker.mjs";
import { loadConfig } from "./config.mjs";
import { createHttpsBrokerServer } from "./server.mjs";

try {
  const config = loadConfig(process.env);
  const handler = createBroker({
    config,
    logger: ({ event, outcome, correlationId }) => {
      console.info(JSON.stringify({ event, outcome, correlationId }));
    },
  });
  const { server, serverConfig } = createHttpsBrokerServer({
    environment: process.env,
    handler,
  });
  server.listen(serverConfig.port, serverConfig.host, () => {
    console.info(JSON.stringify({
      event: "oauth.server",
      outcome: "listening",
      host: serverConfig.host,
      port: serverConfig.port,
    }));
  });
} catch {
  console.error("OAuth broker failed to start because its configuration is incomplete or invalid.");
  process.exitCode = 1;
}
