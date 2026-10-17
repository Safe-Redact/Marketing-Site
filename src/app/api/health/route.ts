import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const noStore = {
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
};

export async function GET() {
  return NextResponse.json(
    {
      status: "ready",
      contract: "saferedact-release/v1",
      releaseId: process.env.SAFEREDACT_RELEASE_ID?.trim() || "development",
      commitSha: process.env.SAFEREDACT_COMMIT_SHA?.trim() || "unknown",
    },
    { status: 200, headers: noStore }
  );
}
