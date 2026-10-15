import { createReportCommentHandler } from "@/lib/comments/http";

export async function POST(request: Request) {
  return createReportCommentHandler()(request);
}
