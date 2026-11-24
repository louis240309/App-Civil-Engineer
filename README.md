# MediPulse 2.0

AI-powered hospital locator and emergency triage platform. College hackathon project.

This is **milestone 8 of 10**: Supabase authentication and account foundations — email/password
sign-in, registration, password reset, session persistence, protected patient routes, self and
family health profiles, DEMO insurance policy records, profile switching across booking and
appointments, and RLS-backed schema migrations — layered on top of the admin operations
console, dashboard, hospital directory, comparison, rule-based triage, specialist discovery,
and demo booking from earlier milestones. All hospital, bed, facility, specialist,
availability, appointment, insurance, and patient data is simulated demo data. Triage results
come from a local transparent ruleset, not a live AI model. Without Supabase credentials the
whole app runs in clearly labeled demo mode; demo appointments and admin edits stay in this
browser and no real hospital or insurer is contacted. Supabase integration code and SQL are
prepared but not yet verified against a live project.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Lucide React |
| Backend | Node.js, Express 5, TypeScript (REST) |
| Database | Supabase PostgreSQL (migrations, seeds, and RLS written; needs a project to run) |

## Structure

```
MediPulse-2.0/
├── frontend/                 React SPA
│   ├── public/
│   ├── src/
│   │   ├── assets/           Brand mark
│   │   ├── components/
│   │   │   ├── account/      Profile forms, avatar, profile switcher, policy sheet
│   │   │   ├── admin/        Admin shell, nav, forms, confirmations, charts, activity
│   │   │   ├── auth/         Auth shell, fields, RequireAuth guard
│   │   │   ├── appointments/ AppointmentCard
│   │   │   ├── booking/      Patient, hospital, date, slot, consultation,
│   │   │   │                 review, summary, and confirmation steps
│   │   │   ├── common/       PageHeader, PageSectionHeader, DemoNotice,
│   │   │   │                 PlaceholderPanel, StepProgress, FlowStepCard
│   │   │   ├── dashboard/    StatCard, AvailabilityDistribution, InsightCard
│   │   │   ├── hospitals/    HospitalCard, HospitalComparison, CompareBar,
│   │   │   │                 BedAvailabilityBar, HospitalFacilityCard
│   │   │   ├── layout/       AppLayout, AppHeader, BottomNavigation, sheets, navigation
│   │   │   ├── map/          MapPlaceholder, HospitalMarker
│   │   │   ├── specialists/  SpecialistCard, DoctorAvatar
│   │   │   ├── triage/       TriageProgress, TriageQuestionCard, SymptomSelector,
│   │   │   │                 ChoiceSelector, SeveritySelector, EmergencyAlert,
│   │   │   │                 EmergencyWarningList, TriageResultCard, RecommendationCard
│   │   │   └── ui/           Card, Badge, BottomSheet, SearchBar, FilterChip,
│   │   │                     AvailabilityBadge, QuickActionCard
│   │   ├── context/          Location, catalog, auth, account, and appointment stores
│   │   ├── pages/            Home, Hospitals, HospitalDetail, Triage, Specialists,
│   │   │                     SpecialistProfile, Booking, Appointments, Account,
│   │   │                     FamilyProfiles, InsurancePolicies, About, Emergency,
│   │   │                     Settings, NotFound
│   │   ├── pages/auth/       Login, Register, ForgotPassword, ResetPassword
│   │   ├── pages/admin/      Overview, Hospitals, Doctors, Appointments, Patients,
│   │   │                     Insurance, Activity, Settings
│   │   ├── hooks/            useApiHealth
│   │   ├── services/         API client, Supabase client, auth adapters, account and
│   │   │                     appointment repositories, local storage adapters
│   │   ├── types/            API, domain, appointment, insurance, admin, account contracts
│   │   ├── utils/            Demo data, doctors, patients, admin catalog seeds/parsing,
│   │   │                     admin insights, facilities, availability, specialist search,
│   │   │                     appointment helpers, profile/policy helpers, date/time,
│   │   │                     triage rules, cn()
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── .env.example
├── backend/                  Express API
│   ├── src/
│   │   ├── config/           Environment parsing
│   │   ├── controllers/      Health controller
│   │   ├── routes/           /api router
│   │   ├── middleware/       Error handling
│   │   ├── services/         Reserved for business logic
│   │   ├── utils/            Logger
│   │   ├── types/            API contracts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── .env.example
├── database/                 Supabase SQL (see database/README.md)
│   ├── migrations/           Tables, constraints, indexes, RLS policies
│   ├── seeds/                Idempotent simulated catalog
│   └── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   └── SUPABASE_SETUP.md
├── .gitignore
└── README.md
```

## Prerequisites

Node.js 20+ and npm 10+.

## Getting started

Install and run each app independently. Env files are optional in development (defaults
match localhost).

```bash
# Terminal 1 — API on http://localhost:4000
cd backend
npm install
npm run dev

# Terminal 2 — app on http://localhost:5173
cd frontend
npm install
npm run dev
```

To override defaults, copy the example files locally (never commit them):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

In development the frontend calls `/api` and Vite proxies it to the backend. If
`VITE_API_URL` is set, the browser calls that URL directly and the backend's `CORS_ORIGIN`
must allow it.

**No Supabase project is required to run or judge the app.** With
`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` blank, MediPulse runs in clearly labeled demo
mode: sign-in is a passwordless local demo household, profiles and policies are simulated
and browser-local, and admin access opens without registration. To connect a real project,
follow [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md): apply `database/migrations/` and
`database/seeds/`, set the two public frontend env values, configure email auth, and grant
an admin role with SQL. The service-role key belongs only in `backend/.env`.

## Scripts

| Where | Command | Purpose |
| --- | --- | --- |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Type-check (`tsc -b`) and production build |
| frontend | `npm run preview` | Serve the production build |
| backend | `npm run dev` | Express with watch mode (tsx) |
| backend | `npm run build` | Compile TypeScript to `dist/` |
| backend | `npm start` | Run the compiled server |
| backend | `npm run typecheck` | Type-check without emitting |

## API

Base URL: `http://localhost:4000/api`

```bash
curl http://localhost:4000/api/health
```

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "medipulse-api",
    "version": "0.1.0",
    "environment": "development",
    "timestamp": "2026-11-24T09:22:32.063Z",
    "uptimeSeconds": 1
  }
}
```

## Routes

| Path | Screen |
| --- | --- |
| `/` | Home — interactive dashboard, simulated map, availability insights, emergency access |
| `/hospitals` | Hospital directory with search, filters, sorting, and comparison |
| `/hospitals/:id` | Hospital profile with beds, facilities, and services |
| `/triage` | Guided demo triage with safety check, urgency result, and recommendations |
| `/specialists` | Specialist directory with search, filters, and sorting |
| `/specialists/:id` | Fictional doctor profile with simulated availability |
| `/specialists/:id/book` | Guided demo booking with local confirmation (protected) |
| `/appointments` | Account appointments: upcoming, completed, and cancelled (protected) |
| `/account` | Account settings and personal health profile (protected) |
| `/family` | Family health profiles: add, edit, remove, switch active patient |
| `/insurance` | Demo insurance policy records per patient profile |
| `/login` | Email/password sign-in or demo continue |
| `/register` | Email/password registration |
| `/forgot-password` | Request a Supabase password reset email |
| `/reset-password` | Set a new password from the email link |
| `/admin` | Admin overview with simulated operations metrics and quick actions |
| `/admin/hospitals` | Hospital search, add/edit/remove, bed validation, facilities |
| `/admin/doctors` | Fictional doctor search, add/edit, activation, and removal |
| `/admin/appointments` | Demo appointment filtering, details, cancellation, restore |
| `/admin/patients` | Simulated accounts, family profiles, and appointment summaries |
| `/admin/insurance` | Simulated provider coverage, hospital acceptance, activation |
| `/admin/activity` | Browser-local admin activity log with filters |
| `/admin/settings` | Access notes, local storage keys, and demo data reset |
| `/about` | About MediPulse |
| `/emergency` | Emergency information (112 / 108) |
| `/settings` | Location and app preferences |

Mobile keeps the fixed five-item bottom bar (Home, Hospitals, Triage, Specialists, More);
More opens a sheet with My appointments, Account & profiles, Family profiles, Insurance
policies, About, Emergency information, Settings, and Admin. Desktop uses a top navigation
bar with the same destinations.

Patient routes require sign-in. Demo mode starts with a clearly labeled local demo household
and no password; Supabase mode uses email/password auth with session persistence and a
`/login?next=…` return path. The header exposes profile switching between the account owner
and family members, and the active patient carries into booking and My Appointments.

Demo appointments and profiles persist in `localStorage` through small adapters, so they can
be swapped for Supabase without changing the UI. Supabase mode reads and writes RLS-protected
tables instead.

The admin console has an admin-only desktop sidebar and a horizontally scrollable mobile tab
bar. Its edits feed the public hospital, specialist, and insurance directory through a shared
demo catalog context. Bed writes are clamped so available beds can never exceed total beds or
become negative. Removing a hospital hides orphaned fictional doctors from the directory while
leaving existing appointment records intact. Admin edits persist under
`medipulse.demo.admin-catalog.v1`; **Reset demo data** in admin settings restores the seeded
catalog and clears local appointments.

## Security notes

- All `.env` files are git-ignored; only `.env.example` placeholders are tracked.
- Only public values are used in `VITE_*` variables: the Supabase URL and anon key. The
  service-role and Gemini keys are backend-only and are never bundled.
- Supabase Auth owns passwords; MediPulse stores none. Auth errors are mapped to safe
  messages, and medical or policy values are never logged.
- RLS is enabled on every table. Patients only reach their own profile, family members,
  policies, and appointments; catalog tables are public read and admin write. Admin checks
  run through a `security definer` function over `user_roles`, never a frontend claim.
- Policy records are user-entered demo data and are explicitly labeled as not insurer
  verified; they are never shared across accounts.
- Error responses never include stack traces.
- In demo mode the admin console is guarded by a permissive local demo guard and is not a
  security boundary. In Supabase mode the `admin` role is required and RLS enforces it.
- RLS and cross-account restrictions are implemented but **not yet verified against a live
  Supabase project**; no full security guarantee is claimed.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md),
[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md), and
[database/README.md](database/README.md).

MediPulse supports care navigation. It does not provide diagnoses or replace emergency
services.
