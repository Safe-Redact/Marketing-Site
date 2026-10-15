-- SafeRedact visitor comments — PostgreSQL schema.
--
-- Written for plain PostgreSQL. It runs unchanged on Supabase, Neon, RDS or a local
-- cluster: nothing here depends on a provider extension or a vendor API. Apply it
-- with `npm run comments:migrate`, which is idempotent.
--
-- No raw IP address is stored anywhere. author_key and reporter_key are keyed HMACs
-- derived per deployment secret, so the table cannot be reversed into a list of
-- visitor addresses even if it is disclosed.

create extension if not exists "pgcrypto";

-- Migration tracking. Every statement below is CREATE ... IF NOT EXISTS, so applying
-- the file twice is a no-op; this table records that it was applied and the checksum
-- of what was applied, so a schema that drifted from the file is detectable rather
-- than silently assumed.
create table if not exists schema_migrations (
  version    text        primary key,
  checksum   text        not null,
  applied_at timestamptz not null default now()
);

create table if not exists comments (
  id                uuid primary key default gen_random_uuid(),
  article_slug      text        not null,
  -- A removed parent is a tombstone and keeps its row, so replies are never
  -- orphaned. Cascade applies only to a hard purge under the retention policy.
  parent_id         uuid        references comments (id) on delete cascade,
  depth             integer     not null default 0 check (depth >= 0 and depth <= 2),
  author_name       text        not null,
  body              text        not null,
  status            text        not null
                    check (status in ('pending', 'approved', 'rejected', 'removed')),
  is_staff          boolean     not null default false,
  staff_login       text,
  author_key        text        not null,
  body_hash         text        not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  moderated_at      timestamptz,
  moderator_label   text,
  moderation_reason text
);

-- The public thread read: one article, approved and removed only.
create index if not exists comments_public_thread_idx
  on comments (article_slug, created_at)
  where status in ('approved', 'removed');

-- The moderation queue read, newest first.
create index if not exists comments_moderation_idx on comments (status, created_at desc);

-- The two abuse lookups: per-author rate limiting and duplicate detection.
create index if not exists comments_author_rate_idx on comments (author_key, created_at desc);
create index if not exists comments_duplicate_idx
  on comments (article_slug, author_key, body_hash, created_at desc);

create table if not exists comment_reports (
  id           uuid primary key default gen_random_uuid(),
  comment_id   uuid        not null references comments (id) on delete cascade,
  reason       text        not null
               check (reason in ('spam', 'abuse', 'off-topic', 'privacy', 'other')),
  detail       text,
  status       text        not null default 'open'
               check (status in ('open', 'reviewed', 'dismissed')),
  reporter_key text        not null,
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz
);

create index if not exists comment_reports_open_idx
  on comment_reports (comment_id) where status = 'open';
create index if not exists comment_reports_reporter_idx
  on comment_reports (reporter_key, created_at desc);

-- Append-only moderation audit. Rows are never updated or deleted, so a decision
-- can always be traced to the verified staff identity that made it.
create table if not exists comment_moderation_events (
  id          uuid primary key default gen_random_uuid(),
  comment_id  uuid        not null references comments (id) on delete cascade,
  action      text        not null check (action in ('approve', 'reject', 'remove')),
  from_status text        not null,
  to_status   text        not null,
  actor_label text        not null,
  reason      text,
  created_at  timestamptz not null default now()
);

create index if not exists comment_moderation_events_comment_idx
  on comment_moderation_events (comment_id, created_at);
