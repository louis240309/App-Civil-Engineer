# MediPulse 2.0 — Architecture

MediPulse is a hospital locator and emergency triage platform. The foundation milestone
establishes a three-tier architecture where each layer can be developed and run independently.

```
React SPA (Vite)  ──HTTP/JSON──▶  Express REST API  ──▶  Supabase PostgreSQL
frontend/                        backend/                 database/
```

The REST API is not yet connected to Supabase or Gemini. When Supabase credentials are
present, the browser talks to Supabase Auth and Postgres directly through RLS-protected
queries for patient accounts, family profiles, policies, and appointments; otherwise every
feature runs in labeled local demo mode. Triage guidance is generated in the browser by a
transparent demo ruleset, not a live AI model.

## Responsibilities

### Frontend (`frontend/`)

Presentation only. Renders routes, holds UI state, and calls the REST API.

- `components/layout/` — app shell: top bar for desktop, fixed five-item bottom bar for
  mobile (Home, Hospitals, Triage, Specialists, More). More opens a sheet that includes
  My appointments.
- `components/admin/` — admin-only shell and navigation, form sheets, confirm dialogs,
  feedback banners, activity list, appointment chart, and bed distribution card.
- `components/common/`, `components/ui/` — reusable presentational pieces (`PageHeader`,
  `PlaceholderPanel`, `Card`, `Badge`, `StepProgress`, `FlowStepCard`).
- `components/triage/` — guided triage controls, safety alert, result card, and
  recommendation card.
- `components/specialists/` — specialist result cards and fictional doctor avatars.
- `components/auth/` — auth shell, fields, and the `RequireAuth` route guard.
- `components/account/` — profile forms, patient avatar, header profile switcher, and
  insurance policy sheet.
- `components/booking/` — patient, hospital, date, slot, consultation, review, summary,
  and confirmation views for the guided demo booking flow.
- `components/appointments/` — local demo appointment cards.
- `pages/` — one component per route. Triage, specialist profile, booking, and appointments
  pages orchestrate their respective flows; `pages/admin/` holds the eight admin sections;
  `pages/auth/` holds login, register, forgot-password, and reset-password.
- `services/` — typed API client, appointment and admin-catalog storage adapters, the
  `supabaseClient` singleton, auth adapters (`demoAuth`, `supabaseAuth`), and account
  repositories (`demoAccountRepository`, `supabaseAccountRepository`, `appointmentRemote`).
  The API client is the single place that knows `VITE_API_URL`; each adapter is the single
  place that knows its local demo key or Supabase table.
- `hooks/` — reusable React state (e.g. `useApiHealth`).
- `types/` — API contracts plus domain, appointment, insurance, admin, and account types.
- `utils/` — pure helpers with no React dependency: demo doctors, patients, hospitals,
  admin catalog seeds/parsing/normalization, admin insights, specialist filtering and slot
  availability, appointment IDs/formatting, date/time formatting, profile/policy
  validation and formatting, and the demo triage rules.

Routes: `/`, `/hospitals`, `/hospitals/:id`, `/triage`, `/specialists`,
`/specialists/:id`, `/login`, `/register`, `/forgot-password`, `/reset-password`,
`/about`, `/emergency`, `/settings`, and `/admin` with nested overview, `hospitals`,
`doctors`, `appointments`, `patients`, `insurance`, `activity`, and `settings` sections,
plus a catch-all 404. Patient-only routes — `/specialists/:id/book`, `/appointments`,
`/account`, `/family`, `/insurance` — are wrapped in `RequireAuth`, which redirects to
`/login?next=…` and back. Deep links from triage (`?specialty=`) and hospital profiles
(`?hospital=`) preselect directory filters.

### Authentication and accounts

`context/AuthContext.tsx` owns the auth state machine (`initializing`, `signed-in`,
`signed-out`) and exposes `useAuth()`. Demo mode signs in a local demo household
synchronously with no password and restores it on reload; a signed-out flag keeps the
composer-independent session honest. With Supabase configured, the provider subscribes to
`onAuthStateChange`, reads the role from `user_roles`, and offers email/password sign-in,
sign-up, password reset, and password update. Errors are mapped to safe user-facing copy;
no password or medical value is logged.

`context/AccountContext.tsx` loads self profile, family members, policies, and provider
options through the account repository, which is selected from `isSupabaseConfigured`.
Active patient selection is per owner and persists in `localStorage`. Booking, My
Appointments, account pages, and the header switcher all read from this context.

When Supabase is configured, writes go through `supabaseAccountRepository` and
`appointmentRemote` and are protected by RLS. In demo mode they go through the local
repositories and `localStorage` (`medipulse.demo.patient-accounts.v1`,
`medipulse.demo.appointments.v1`). Demo records are clearly labeled; no real insurer is
contacted or verified.

### Admin console and demo catalog

All mutable demo records — hospitals, fictional doctors, insurance providers, patient
accounts, and activity — live in one `DemoCatalogProvider` seeded from the existing demo data.
Every admin form writes through this context, so edits propagate immediately to the home
dashboard, hospital directory/detail, specialist directory/profile, and booking flow. Bed
writes pass through a clamp, and stored data is parsed and normalized on read; invalid
snapshots are re-seeded.

`services/adminCatalogStorage.ts` persists the catalog under
`medipulse.demo.admin-catalog.v1` and validates records on read. Appointments keep their own
adapter (`medipulse.demo.appointments.v1`), extended only with a restore/cancel status action,
so no duplicate appointment records are created by the admin views. Both adapters are the
intended seams for Supabase.

`AdminLayout` uses `useAuth()`: the console opens in demo mode, otherwise it requires a
signed-in user whose `user_roles` role is `admin`. This UI check is a convenience only —
database RLS policies call a `security definer` `is_admin()` function, and role changes can
only be made with the service-role key or the SQL editor.

### Demo appointment persistence

`services/appointmentStorage.ts` exposes a minimal `load`/`save` adapter backed by
`localStorage` under `medipulse.demo.appointments.v1`. Stored records are validated on read
and written through a React context, so the UI is unaware of the storage mechanism. A future
Supabase implementation can replace the adapter without changing the booking or appointment
screens. Demo appointments never leave the browser and make no real booking.

### Backend (`backend/`)

Owns business logic, validation, authorization, secrets, and all database access.

```
server.ts → app.ts (middleware) → routes/ → controllers/ → services/ → data access
```

- `config/` — environment parsing. Throws fast on invalid values.
- `routes/` — URL mapping only.
- `controllers/` — request/response translation.
- `services/` — business logic (empty in this milestone; reserved for directory and triage
  logic).
- `middleware/` — centralized 404 and error handling.
- `utils/` — logging and small shared helpers.
- `types/` — API contract types.

### Database (`database/`)

Versioned PostgreSQL migrations and idempotent seed data for Supabase. See
[`database/README.md`](../database/README.md) for naming, ordering, RLS, and credential rules,
and [`docs/SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for project setup.

Migrations create `user_roles`, `profiles`, `family_members`, `insurance_policies`,
`hospitals`, `doctors`, `doctor_hospitals`, `appointments`, `insurance_providers`,
`insurance_hospital_network`, and `activity_logs`. Every table has RLS enabled in the same
migration: owner-only rows for patient data, public read/catalog admin write for the
directory, and admin-only access to activity. Seeds use the frontend demo codes so bookings
can resolve catalog rows.

## API conventions

Every JSON response uses one envelope, so clients handle success and failure uniformly:

```json
{ "success": true, "data": { "...": "..." } }
{ "success": false, "error": { "code": "not_found", "message": "..." } }
```

- `GET /api/health` → `200` with service name, version, environment, timestamp, uptime.
- Unknown routes → `404` with `code: "not_found"`.
- Malformed JSON → `400` with `code: "invalid_json"`.
- Unexpected failures → `500` with `code: "internal_error"`; stacks are logged, never returned.

The frontend calls every endpoint through `frontend/src/services/api.ts`, which unwraps the
envelope and throws a typed `ApiError` on failure.

## Environment and secrets

| Concern | Where it lives | Notes |
| --- | --- | --- |
| API base URL | `frontend/.env` → `VITE_API_URL` | Public. Defaults to `/api` via the Vite dev proxy. |
| Supabase URL + anon key | `frontend/.env` → `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Public by design and protected by RLS. Blank means demo mode. |
| Port, CORS, mode | `backend/.env` | `PORT`, `NODE_ENV`, `CORS_ORIGIN` (comma-separated). |
| Supabase service role | `backend/.env` only | Bypasses RLS. Never leaves the server, never in a `VITE_` variable. |
| Gemini key | `backend/.env` only | Reserved for a later milestone. |

`VITE_*` values are compiled into the browser bundle and must never contain secrets. All
`.env` files are git-ignored; only `.env.example` files are committed. In development, Vite
proxies `/api` to `http://localhost:4000`, so no env file is required to run the app.

CORS is restricted to `CORS_ORIGIN` (default `http://localhost:5173`). `x-powered-by` is
disabled, JSON bodies are capped at 1 MB, and errors are logged server-side.

## Design system

Mobile-first. White surfaces, navy (`#0a2038`) text and brand, teal (`#0f9d9d`) accents,
defined as Tailwind v4 theme tokens in `frontend/src/index.css`. The mobile shell uses a
fixed bottom navigation with safe-area padding; desktop switches to a top navigation bar.

## Boundaries for upcoming milestones

Supabase integrations are built but unverified against a live project: no project URL, anon
key, email settings, or admin role has been configured here, so the app runs in labeled demo
mode. RLS policies and cross-account restrictions are written but not yet exercised with two
real accounts. Gemini-backed triage, backend-owned account APIs, and admin catalog writes
from Supabase remain future work. Demo mode never calls Supabase, and no real credentials,
insurer verification, or security guarantees are claimed.
