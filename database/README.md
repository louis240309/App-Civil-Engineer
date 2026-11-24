# Database

MediPulse uses **Supabase PostgreSQL** as its system of record. This directory holds the SQL
that defines and seeds the database. It is not connected to the application yet: the
foundation milestone ships the structure and conventions, not tables.

```
database/
├── migrations/   Versioned, forward-only schema changes
├── seeds/        Repeatable demo/reference data for local and staging environments
└── README.md
```

## Migrations

- File naming: `YYYYMMDDHHMMSS_short_description.sql` (Supabase CLI timestamp convention).
- Apply strictly in filename order. Every applied migration is immutable — fix mistakes with a
  new migration, never by editing an old one.
- One logical change per file (e.g. `create_hospitals_table`, `add_specialists_index`). Keep
  related constraints, indexes, and RLS policies for the same table in the same migration.
- Enable Row Level Security on every table that is ever exposed through Supabase's API, and
  write explicit policies in the same migration that creates the table.
- Migrations may be run with the Supabase CLI (`supabase db push`) or pasted into the
  Supabase SQL editor, one file at a time. Whatever the method, the remote schema must always
  match the files in `migrations/`.
- Destructive changes (dropping columns or tables) need a dedicated, reviewed migration and a
  backup, never a quiet edit.

## Seeds

- File naming: `NNN_subject.sql` (e.g. `001_hospitals.sql`), applied in numeric order.
- Seeds must be idempotent (`insert ... on conflict do nothing` / `on conflict ... do update`)
  so they can be re-run safely during development.
- Seed data is for local development and demos: synthetic hospitals, departments, and
  specialties. Never include real patient data, real credentials, or private staff details.
- Seeds are separate from migrations and are never applied automatically in production.

## Backend connection

- The Express API will own all database access. The browser never talks to Postgres directly,
  so validation, rate limiting, and authorization stay in one place.
- Planned server-side environment variables (see `backend/.env.example`):
  `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. These are reserved for
  a later milestone; the foundation build does not read them.
- Supabase's pooler connection string or the `supabase-js` server client will be initialized
  in `backend/src/config/` and used only from service modules. No database calls in routes or
  controllers.

## Credentials

- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security. It lives only in the backend
  environment and must never be exposed to the frontend, logs, or client bundles.
- Real values go in `.env` files, which are git-ignored. Only `.env.example` placeholders are
  committed.
- The frontend may only use the public Supabase URL and anon key if direct reads are added
  later, and only with RLS enforced.
- Rotate keys immediately in the Supabase dashboard if one is ever committed or shared.
