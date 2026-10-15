import { createListThreadHandler, createSubmitCommentHandler } from "@/lib/comments/http";

// Next permits only route handlers to be exported here, so the pipeline lives in
// @/lib/comments/http where it can be constructed with test doubles.
export async function GET(request: Request) {
  return createListThreadHandler()(request);
}

export async function POST(request: Request) {
  return createSubmitCommentHandler()(request);
}
