import { NextResponse } from "next/server";
import { commentsRuntime, CommentsConfigurationError } from "./runtime";
import { authorizeStaffRequest } from "./staff-auth";
import type { AuthorizeOptions } from "./staff-auth";
import type { CommentsService, Failure } from "./service";
import type { StaffIdentity } from "./types";

const noStore = { "Cache-Control": "no-store" } as const;
const MAX_REQUEST_BYTES = 8 * 1024;

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

function failureResponse(failure: Failure) {
  return NextResponse.json(
    {
      ok: false,
      code: failure.code,
      message: failure.message,
      ...(failure.issues ? { issues: failure.issues } : {}),
    },
    { status: statusByCode[failure.code] ?? 400, headers: noStore }
  );
}

function deniedResponse() {
  // One answer for every authorization failure, so a caller cannot distinguish an
  // unknown token from a known token without write access.
  return NextResponse.json(
    { ok: false, code: "denied", message: "Moderation requires a verified staff account." },
    { status: 403, headers: { ...noStore, "WWW-Authenticate": "Bearer" } }
  );
}

function disabledResponse() {
  return NextResponse.json(
    { ok: false, code: "disabled", message: "Comment moderation is not available on this site." },
    { status: 503, headers: noStore }
  );
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") throw new TypeError("UNSUPPORTED_MEDIA_TYPE");

  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_REQUEST_BYTES) throw new RangeError("TOO_LARGE");
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
      throw new RangeError("TOO_LARGE");
    }
    decoded += decoder.decode(value, { stream: true });
  }
  decoded += decoder.decode();
  return JSON.parse(decoded);
}

export interface ModerationHandlerDependencies {
  service?: CommentsService | null;
  authorize?: (request: Request) => Promise<{ ok: true; staff: StaffIdentity } | { ok: false }>;
  authorizeOptions?: AuthorizeOptions;
}

function resolveService(dependencies: ModerationHandlerDependencies) {
  if (dependencies.service !== undefined) return dependencies.service;
  try {
    return commentsRuntime()?.service ?? null;
  } catch (error) {
    if (error instanceof CommentsConfigurationError) return null;
    throw error;
  }
}

/**
 * Wraps a moderation handler in authorization.
 *
 * **CSRF:** every privileged operation is authorized by a `Authorization: Bearer`
 * header and never by a cookie. A cross-site form or image cannot set that header,
 * and the browser attaches no ambient credential to this API, so there is nothing
 * for a forged cross-site request to ride on. That is the defence; no token pair is
 * needed, and none is invented here. If this API is ever given a cookie session,
 * this comment stops being true and an explicit CSRF token becomes required.
 */
function withStaff(
  dependencies: ModerationHandlerDependencies,
  work: (input: {
    request: Request;
    service: CommentsService;
    staff: StaffIdentity;
  }) => Promise<Response>
) {
  return async function handle(request: Request): Promise<Response> {
    const service = resolveService(dependencies);
    if (!service) return disabledResponse();

    const authorize =
      dependencies.authorize ??
      ((candidate: Request) => authorizeStaffRequest(candidate, dependencies.authorizeOptions));

    const authorization = await authorize(request);
    if (!authorization.ok) {
      const reason = (authorization as { reason?: string }).reason;
      if (reason === "unconfigured") return disabledResponse();
      return deniedResponse();
    }

    return work({ request, service, staff: authorization.staff });
  };
}

export function createModerationQueueHandler(dependencies: ModerationHandlerDependencies = {}) {
  return withStaff(dependencies, async ({ request, service }) => {
    const params = new URL(request.url).searchParams;
    const result = await service.listForModeration({
      status: params.get("status") ?? undefined,
      articleSlug: params.get("article") ?? undefined,
      search: params.get("search") ?? undefined,
      page: params.get("page") ? Number(params.get("page")) : undefined,
      pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : undefined,
    });
    if (!result.ok) return failureResponse(result);

    return NextResponse.json({ ok: true, page: result.page }, { status: 200, headers: noStore });
  });
}

export function createModerationDecisionHandler(dependencies: ModerationHandlerDependencies = {}) {
  return withStaff(dependencies, async ({ request, service, staff }) => {
    const commentId = new URL(request.url).searchParams.get("comment")?.trim() ?? "";
    let payload: unknown;
    try {
      payload = await readBoundedJson(request);
    } catch {
      return NextResponse.json(
        { ok: false, code: "invalid", message: "That moderation decision is not valid." },
        { status: 400, headers: noStore }
      );
    }

    const result = await service.decide(commentId, payload, staff);
    if (!result.ok) return failureResponse(result);

    return NextResponse.json({ ok: true, comment: result.comment }, { status: 200, headers: noStore });
  });
}

export function createStaffReplyHandler(dependencies: ModerationHandlerDependencies = {}) {
  return withStaff(dependencies, async ({ request, service, staff }) => {
    const parentId = new URL(request.url).searchParams.get("parent")?.trim() ?? "";
    let payload: unknown;
    try {
      payload = await readBoundedJson(request);
    } catch {
      return NextResponse.json(
        { ok: false, code: "invalid", message: "That reply is not valid." },
        { status: 400, headers: noStore }
      );
    }

    const result = await service.staffReply(parentId, payload, staff);
    if (!result.ok) return failureResponse(result);

    return NextResponse.json({ ok: true, comment: result.comment }, { status: 201, headers: noStore });
  });
}

export function createModerationHistoryHandler(dependencies: ModerationHandlerDependencies = {}) {
  return withStaff(dependencies, async ({ request, service }) => {
    const commentId = new URL(request.url).searchParams.get("comment")?.trim() ?? "";
    const result = await service.moderationHistory(commentId);
    if (!result.ok) return failureResponse(result);

    return NextResponse.json({ ok: true, events: result.events }, { status: 200, headers: noStore });
  });
}
