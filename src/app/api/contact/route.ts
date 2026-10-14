import { NextResponse } from "next/server";
import { z } from "zod";

const MAX_REQUEST_BYTES = 16 * 1024;
const supportedFileTypes = [
  "Video files",
  "Audio files",
  "PDF documents",
  "Word documents",
  "Scanned images",
  "Multiple formats",
  "Not sure",
] as const;

const contactSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    organization: z.string().trim().max(120).optional().default(""),
    fileType: z.enum(supportedFileTypes),
    message: z.string().trim().min(10).max(2_000),
  })
  .strict();

class PayloadTooLargeError extends Error {}

async function readBoundedJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new TypeError("UNSUPPORTED_MEDIA_TYPE");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    throw new PayloadTooLargeError();
  }

  if (!request.body) return null;

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let decoded = "";
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    receivedBytes += value.byteLength;
    if (receivedBytes > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    decoded += decoder.decode(value, { stream: true });
  }

  decoded += decoder.decode();
  return JSON.parse(decoded);
}

export async function POST(request: Request) {
  try {
    const parsed = contactSchema.safeParse(await readBoundedJson(request));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid enquiry details" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const referenceId = crypto.randomUUID();
    console.info("Contact enquiry validated without delivery", {
      referenceId,
      outcome: "accepted-not-delivered",
    });

    return NextResponse.json(
      { accepted: true, delivered: false, referenceId },
      { status: 202, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json(
        { error: "Request body is too large" },
        { status: 413, headers: { "Cache-Control": "no-store" } }
      );
    }
    if (error instanceof TypeError && error.message === "UNSUPPORTED_MEDIA_TYPE") {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415, headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json(
      { error: "Invalid JSON request" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
}
