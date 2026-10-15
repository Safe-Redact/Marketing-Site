/**
 * The plain numeric limits of the comments policy.
 *
 * Separated from ./policy because the submission form is a client component and
 * policy.ts reaches for node:crypto to hash a body. Importing policy there would
 * drag a Node builtin into the browser bundle and fail the build, so the shared
 * constants live here and policy re-exports them for the server.
 */
export const MAX_THREAD_DEPTH = 3;
export const MAX_BODY_LENGTH = 2_000;
export const MIN_BODY_LENGTH = 2;
export const MAX_NAME_LENGTH = 60;
export const MIN_NAME_LENGTH = 2;
export const MAX_REPORT_DETAIL_LENGTH = 500;
export const MAX_LINKS_IN_BODY = 2;
