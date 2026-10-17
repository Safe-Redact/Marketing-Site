import { buildCmsConfig } from "../../../../scripts/render-cms-config.mjs";

export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "text/yaml; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

export async function GET() {
  try {
    return new Response(buildCmsConfig(process.env), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CMS configuration is unavailable.";
    return new Response(`# SafeRedact Content Studio disabled\n# ${message}\n`, {
      status: 503,
      headers: responseHeaders,
    });
  }
}
