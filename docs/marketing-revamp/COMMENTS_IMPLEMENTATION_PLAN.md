# Moderated comments implementation plan

Date: 2026-10-14  
Status: architecture only; comment collection remains disabled

## Recommendation

Use Supabase PostgreSQL as the initial persistent store under its available no-CMS-licence-cost tier, accessed only from server-side application code. Isolate it behind a provider-neutral `CommentsRepository` interface so storage can move to another PostgreSQL service or adapter without changing public routes and moderation rules.

No Supabase account, project, dependency, environment variable, API, or user interface is created in Phase 5.

## Provider comparison

| Option | Advantages | Trade-offs | Decision |
| --- | --- | --- | --- |
| Supabase PostgreSQL | Standard PostgreSQL, RLS, managed backups/tooling, mature free starting tier | Free limits and inactivity policy require monitoring; privileged server key bypasses RLS | Recommended initial adapter |
| Neon PostgreSQL | Portable PostgreSQL, branching and serverless connectivity | Authentication/moderation tooling must be assembled separately | Viable fallback |
| Netlify Database | Preview-oriented integration | Credit-based, hosting-coupled, conflicts with provider-neutral direction | Not selected |

## Application boundary

Future domain code depends on:

```ts
interface CommentsRepository {
  createPendingComment(input: NewComment): Promise<StoredComment>;
  listApprovedThread(articleId: string): Promise<CommentThread[]>;
  createReport(input: NewReport): Promise<void>;
  listModerationQueue(query: ModerationQuery): Promise<ModerationItem[]>;
  recordDecision(input: ModerationDecision): Promise<void>;
}
```

Supabase types, query builders, and credentials stay inside one infrastructure adapter. Route handlers call a moderation/comment service that enforces policy before using the repository.

## Required data model

- `articles`: immutable UUID plus current public slug; prevents comment loss after slug changes.
- `comments`: article ID, optional approved parent ID, sanitized display name, normalized body, status, timestamps, and opaque abuse key.
- `comment_reports`: comment ID, reason category, optional safe detail, status, and timestamps.
- `moderation_events`: immutable actor, action, reason, prior/new status, and timestamp.
- `staff_identities`: approved external identity subject and role; no shared accounts.

Statuses include `pending`, `approved`, `rejected`, `removed`, and `spam`. Replies follow the same pending-by-default rule, including staff replies until the authorized moderation action is recorded.

## Privacy and abuse controls

- Do not store raw visitor IP addresses.
- Derive a rotating, keyed HMAC abuse identifier server-side for rate limiting and investigation.
- Collect no email unless a reviewed product need and privacy notice are approved.
- Validate length, Unicode normalization, parent/article relationships, and allowed text server-side.
- Render comments as text; no raw HTML or Markdown execution.
- Apply per-origin, per-article, and abuse-key rate limits.
- Verify anti-bot tokens server-side before persistence.
- Keep rejected/spam content inaccessible from public queries.
- Define retention for pending, rejected, abuse, and moderation records before launch.
- Provide report, removal, correction, and data-request procedures.

## Authorization model

Public visitors may eventually submit comments and reports only. They cannot choose status, impersonate staff, list pending records, or access moderation history.

Staff moderation requires an authenticated, allowlisted identity and role checked on every server mutation. No public `/admin` application will be created. The eventual moderation experience may be an authenticated internal tool or provider console, but its selection requires a separate design and threat review.

## Staged implementation

1. Approve privacy text, retention, moderation policy, and staff ownership.
2. Add immutable article IDs and migration tests.
3. Define domain types, repository contract, and in-memory contract tests.
4. Provision an isolated non-production database and least-privilege schema.
5. Implement the Supabase adapter and migrations.
6. Implement submission, listing, reporting, and moderation services with server-side authorization.
7. Add rate limiting and server-verified anti-bot controls.
8. Build public UI only after persistence and moderation acceptance.
9. Run security, privacy, load, accessibility, and authorized browser acceptance.

## Launch gate

Do not collect or display visitor comments until persistence, backups, privacy disclosure, retention, moderation queue, staff authentication, rate limits, abuse handling, reporting, deletion, and incident response are all operational and tested.
