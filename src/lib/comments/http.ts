import { NextResponse } from "next/server";
import { requestAddress } from "./abuse";
import { isValidCommentId } from "./policy";
import { commentsRuntime, CommentsConfigurationError } from "./runtime";
import type { CommentsService } from "./service";
import type { Failure } from "./service";

const MAX_REQUEST_BYTES = 8 * 1024;

const noStore = { "Cache-Control": "no-store" } as const;

/** Maps a domain failure onto the narrowest honest status code. */
const statusByCode: Record<Failure["code"], number> = {
  invalid: 400,
  "unknown-article": 404,
  "unknown-parent": 404,
  "unknown-comment": 404,
  "too-deep": 422,
  "rate-limited": 429,
  duplicate: 409,
  conflict: 409,
};

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
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    decoded += decoder.decode(value, { stream: true });
  }
  decoded += decoder.decode();
  return JSON.parse(decoded);
}

function failureResponse(failure: Failure) {
  const status = statusByCode[failure.code] ?? 400;
  const headers: Record<string, string> = { ...noStore };
  if (failure.retryAfterSeconds) headers["Retry-After"] = String(failure.retryAfterSeconds);

  return NextResponse.json(
    {
      ok: false,
      code: failure.code,
      message: failure.message,
      // Field-level detail only for a genuine validation failure; the abuse codes
      // deliberately say nothing a sender could tune against.
      ...(failure.code === "invalid" && failure.issues ? { issues: failure.issues } : {}),
    },
    { status, headers }
  );
}

/** The single answer when comments are switched off for this deployment. */
function disabledResponse() {
  return NextResponse.json(
    {
      ok: false,
      code: "disabled",
      message: "Comments are not available on this site yet.",
    },
    { status: 503, headers: noStore }
  );
}

function configurationErrorResponse() {
  // The message names environment variables, so it stays server-side.
  return NextResponse.json(
    { ok: false, code: "disabled", message: "Comments are not available on this site yet." },
    { status: 503, headers: noStore }
  );
}

export interface CommentsHandlerDependencies {
  service?: CommentsService | null;
}

function resolveService(injected: CommentsHandlerDependencies): CommentsService | null | "error" {
  if (injected.service !== undefined) return injected.service;
  try {
    return commentsRuntime()?.service ?? null;
  } catch (error) {
    if (error instanceof CommentsConfigurationError) return "error";
    throw error;
  }
}

export function createSubmitCommentHandler(dependencies: CommentsHandlerDependencies = {}) {
  return async function handle(request: Request) {
    const service = resolveService(dependencies);
    if (service === "error") return configurationErrorResponse();
    if (!service) return disabledResponse();

    let payload: unknown;
    try {
      payload = await readBoundedJson(request);
    } catch (error) {
      if (error instanceof PayloadTooLargeError) {
        return NextResponse.json(
          { ok: false, code: "invalid", message: "This comment is too long." },
          { status: 413, headers: noStore }
        );
      }
      if (error instanceof TypeError && error.message === "UNSUPPORTED_MEDIA_TYPE") {
        return NextResponse.json(
          { ok: false, code: "invalid", message: "Content-Type must be application/json" },
          { status: 415, headers: noStore }
        );
      }
      return NextResponse.json(
        { ok: false, code: "invalid", message: "This comment could not be accepted." },
        { status: 400, headers: noStore }
      );
    }

    const result = await service.submit({ payload, address: requestAddress(request) });
    if (!result.ok) return failureResponse(result);

    // Accepted, never public. The id lets the page show the author their own
    // pending comment without exposing anyone else's.
    return NextResponse.json(
      {
        ok: true,
        id: result.id,
        status: result.status,
        message:
          "Thank you. Your comment has been sent for moderation and will appear once a moderator has approved it.",
      },
      { status: 202, headers: noStore }
    );
  };
}

export function createReportCommentHandler(dependencies: CommentsHandlerDependencies = {}) {
  return async function handle(request: Request) {
    const service = resolveService(dependencies);
    if (service === "error") return configurationErrorResponse();
    if (!service) return disabledResponse();

    let payload: unknown;
    try {
      payload = await readBoundedJson(request);
    } catch {
      return NextResponse.json(
        { ok: false, code: "invalid", message: "This report could not be accepted." },
        { status: 400, headers: noStore }
      );
    }

    const result = await service.report({ payload, address: requestAddress(request) });
    if (!result.ok) return failureResponse(result);

    return NextResponse.json(
      {
        ok: true,
        message: "Thank you. This comment has been reported for review.",
      },
      { status: 202, headers: noStore }
    );
  };
}

export function createListThreadHandler(dependencies: CommentsHandlerDependencies = {}) {
  return async function handle(request: Request) {
    const service = resolveService(dependencies);
    if (service === "error") return configurationErrorResponse();
    if (!service) return disabledResponse();

    const slug = new URL(request.url).searchParams.get("article")?.trim() ?? "";
    // Reuses the comment-id validator's sibling: an article slug that cannot be a
    // slug is a bad request, not an empty thread.
    if (!slug || slug.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        { ok: false, code: "invalid", message: "An article slug is required." },
        { status: 400, headers: noStore }
      );
    }

    const comments = await service.publicThread(slug);
    return NextResponse.json({ ok: true, comments }, { status: 200, headers: noStore });
  };
}

export { isValidCommentId };
