import {
  createModerationDecisionHandler,
  createModerationQueueHandler,
} from "@/lib/comments/moderation-http";

// Privileged. Authorized by a verified GitHub bearer token on every request, never
// by a cookie — see the CSRF note in @/lib/comments/moderation-http.
export async function GET(request: Request) {
  return createModerationQueueHandler()(request);
}

export async function POST(request: Request) {
  return createModerationDecisionHandler()(request);
}
