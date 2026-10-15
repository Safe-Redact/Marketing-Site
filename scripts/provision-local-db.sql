-- One-time local development provisioning for the SafeRedact comments database.
--
-- Run this as a PostgreSQL superuser. It creates a dedicated database and a
-- least-privilege application role; it does not touch any existing database.
--
--   psql -U postgres -h 127.0.0.1 -p 5433 -v password=CHOOSE_ONE -f scripts/provision-local-db.sql
--
-- Pass the password with -v so it is never written into this file. Put the same
-- value in .env.local, which is git-ignored.

\set ON_ERROR_STOP on

-- The application role. It owns nothing and is granted only what the adapter needs.
select format('create role saferedact_app login password %L', :'password')
where not exists (select 1 from pg_roles where rolname = 'saferedact_app')
\gexec

-- The development database. Owned by postgres, not by the application role, so the
-- application cannot drop it.
select 'create database saferedact_comments_dev owner postgres'
where not exists (select 1 from pg_database where datname = 'saferedact_comments_dev')
\gexec

\connect saferedact_comments_dev

-- pgcrypto supplies gen_random_uuid(); creating it needs a superuser, so it is done
-- here rather than by the migration running as the application role.
create extension if not exists "pgcrypto";

-- Least privilege: connect and use the public schema, create tables for the
-- migration, and read/write its own rows. No superuser, no database-level rights.
grant connect on database saferedact_comments_dev to saferedact_app;
grant usage, create on schema public to saferedact_app;
alter default privileges in schema public
  grant select, insert, update, delete on tables to saferedact_app;
alter default privileges in schema public grant usage, select on sequences to saferedact_app;

-- Anything the migration already created (on a re-run) is granted explicitly too.
grant select, insert, update, delete on all tables in schema public to saferedact_app;
grant usage, select on all sequences in schema public to saferedact_app;

\echo 'Provisioned saferedact_comments_dev and role saferedact_app.'
