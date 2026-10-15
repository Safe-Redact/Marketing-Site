import { createContactHandler } from "@/lib/leads/contact";

// Next permits only route handlers to be exported here, so the enquiry pipeline
// lives in @/lib/leads/contact where it can be constructed with test doubles.
export async function POST(request: Request) {
  return createContactHandler()(request);
}
