import { createStaffReplyHandler } from "@/lib/comments/moderation-http";

export async function POST(request: Request) {
  return createStaffReplyHandler()(request);
}
