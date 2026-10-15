import { createModerationHistoryHandler } from "@/lib/comments/moderation-http";

export async function GET(request: Request) {
  return createModerationHistoryHandler()(request);
}
