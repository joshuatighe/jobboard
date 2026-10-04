# CLAUDE.md

Guidance for Claude (and humans) working in this repo. Read this before writing code.

## What this is

**JobBoard** is a two-sided job marketplace connecting **job seekers** and **recruiters**. This is a class
project (Round 2 of a requirements-exchange assignment): another team wrote the requirements and acted as the
users in interviews, and we build the app. The requirements below are the source of truth. Where they are
vague, use good product judgement and record the decision under [Decisions & assumptions](#decisions--assumptions).

The bar is **"overfunded San Francisco YC startup"**: polished, fast, confident, a little opinionated.

## Users

| Role | Priority | Goal |
| --- | --- | --- |
| **Job seeker** | Primary | Find relevant jobs, apply quickly, track every application in one place |
| **Recruiter** | Secondary | Post jobs, review applicants, move candidates through a pipeline |

A user account has exactly one role, chosen at signup.

## Requirements (from the client interview)

Each requirement has an ID. Reference the ID in commits and PRs where relevant (e.g. `feat(search): R5 filters`).

### Job seekers
- **R1 Register / sign in** with email and password.
- **R2 Profile**: headline, location, bio, skills, **experience** (work history entries), and **preferences**:
  desired locations, remote OK, minimum pay, experience level, employment types.
- **R3 Resume upload**: PDF, stored privately, replaceable, viewable by the seeker and by recruiters they've applied to.
- **R4 Search jobs** by keyword.
- **R5 Filter jobs** by **pay**, **location** (incl. remote), and **experience level**. The job description is
  covered by the keyword search.
- **R6 Personalized feed**: a "For you" list ranked by how well jobs match the seeker's preferences and profile.
- **R7 Apply to a job** with the resume on file and an optional cover note. One application per job.
- **R8 Application tracker**: see the status of every application they have submitted.

### Recruiters
- **R9 Register / sign in** as a recruiter, tied to a company.
- **R10 Post jobs** with title, description, pay range, location / remote, experience level, employment type.
- **R11 Manage postings**: edit, open/close, view applicant counts per posting.
- **R12 Review applicants** per posting: profile, experience, resume, cover note.
- **R13 Manage application status**, moving candidates through the pipeline. Seekers see the change (R8).

### Non-functional
- Responsive down to mobile (375px).
- Light **and** dark mode.
- Every list has loading, empty and error states. No blank screens.
- Accessible: keyboard navigable, labelled inputs, visible focus rings (shadcn/Radix covers most of this).
- Realistic seed data so every screen looks alive on a fresh deploy.

## Tech stack

| Concern | Choice |
| --- | --- |
| Package manager | **pnpm**, the only package manager. Commit `pnpm-lock.yaml`; never `npm`/`yarn` or their lockfiles |
| Build | **Vite** |
| Language | **TypeScript** (strict) |
| UI | **React** |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` |
| Components | **shadcn/ui** (Radix primitives; component source lives in `src/components/ui`) |
| Icons | **lucide-react**, the only icon set |
| Routing | **React Router** |
| Server state | **TanStack Query** wraps every Supabase call |
| Forms | **react-hook-form** + **zod** |
| Backend | **Supabase**: Postgres, Auth, Storage, Row Level Security |
| Toasts | **sonner** (shadcn's toast) |
| Theme | Small custom `ThemeProvider` (`.dark` class on `<html>`; light / dark / system). No `next-themes` |
| Lint / test | **oxlint** (Vite template default) · **Vitest** |
| DB tooling | **Supabase CLI** as a devDependency, run via `pnpm supabase ...` |
| Hosting | **Vercel** (static SPA; `vercel.json` rewrites all routes to `index.html`) |

Don't add new dependencies when one of the above already covers the need.

## Architecture

```
src/
  main.tsx                   # entry: <AppProviders> + <RouterProvider>
  router.tsx                 # all routes; pages are lazy-loaded (code-split) except the landing page
  index.css                  # Tailwind + design tokens (light/dark CSS variables, brand color)
  routes/                    # one file per page, grouped by area
    marketing/               # landing page
    auth/                    # sign in, sign up (role picker)
    seeker/                  # for-you feed, job search, job detail, applications, profile
    recruiter/               # dashboard, posting editor, applicants pipeline
  components/
    ui/                      # shadcn components (edit freely, but keep the API)
    layout/                  # app shell, marketing/auth layouts, RequireRole guard, page header
    providers/               # AppProviders, AuthProvider, ThemeProvider
    marketing/, jobs/, ...   # feature components
  hooks/                     # useAuth, useTheme
  lib/
    supabase.ts              # the single Supabase client + isSupabaseConfigured
    api/                     # typed data access (auth.ts, jobs.ts, applications.ts, ...)
    queries/                 # TanStack Query hooks wrapping lib/api (useJobs, useApply, ...)
    matching.ts (+ .test.ts) # personalized-feed scoring (pure, unit-tested)
    constants.ts             # enum labels, status → badge tone, pipeline order
    format.ts                # pay ranges, relative dates, initials
    types.ts                 # row/enum aliases (Job, Application, ExperienceLevel, ...)
    routes.ts                # homeFor(role)
    utils.ts                 # cn()
  types/database.ts          # Supabase-generated types (`pnpm db:types`). Do not hand-edit.
supabase/
  config.toml                # Supabase CLI config
  migrations/                # schema, triggers, RLS policies, storage bucket. Source of truth for the DB.
scripts/
  seed.ts                    # idempotent demo-data seeder (service-role key)
  seed/                      # seed data: companies, jobs, people/applications, PDF resume generator
```

Rules:
- **Components never call `supabase` directly.** They go through `lib/queries` hooks, which call `lib/api`.
- **Schema changes go through a new migration file.** Never edit an applied migration. Regenerate
  `types/database.ts` after any schema change.
- **Authorization lives in RLS**, not in the UI. Route guards are for UX only.
- The service-role key is used **only** by `scripts/`. It must never be imported in `src/` or prefixed with `VITE_`.

## Data model

```
profiles            id (= auth.users.id), role ('seeker' | 'recruiter'), full_name, avatar_url, created_at
seeker_profiles     user_id, headline, location, bio, skills text[], resume_path,
                    pref_locations text[], pref_remote bool, pref_min_pay int,
                    pref_experience_level, pref_employment_types text[]
experiences         id, user_id, title, company, start_date, end_date (null = current), description
companies           id, name, logo_url, website, description
recruiters          user_id, company_id
jobs                id, company_id, recruiter_id, title, description, location, is_remote,
                    pay_min, pay_max, pay_period ('year' | 'hour'), experience_level, employment_type,
                    skills text[], status ('draft' | 'open' | 'closed'), created_at, updated_at
applications        id, job_id, seeker_id, status, cover_note, resume_path (snapshot at apply time),
                    created_at, updated_at, unique (job_id, seeker_id)
application_events  id, application_id, from_status, to_status, changed_by, created_at   # timeline for R8/R13
```

Enums:
- `experience_level`: `intern`, `entry`, `mid`, `senior`, `lead`
- `employment_type`: `full_time`, `part_time`, `contract`, `internship`
- `application_status`: `applied` → `reviewing` → `interviewing` → `offer`, plus terminal `rejected` and
  `withdrawn` (seeker-only action)

RLS summary:
- Open jobs are readable by anyone. Drafts and closed jobs are readable only by the owning company's recruiters.
- Seekers read and write only their own profile, experiences and applications.
- Recruiters read applications (and the applicant's profile, experiences and resume) only for their company's jobs,
  and may update `status` only.
- Storage bucket `resumes` is private. The path is `{user_id}/{filename}.pdf`. Access is via signed URLs, granted
  to the owner and to recruiters with an application from that user.

## Personalized feed (R6)

`lib/matching.ts` scores each open job from 0 to 100 against the seeker's profile, and the feed shows the best
matches with a "why this matches" chip row:
- experience level match (exact or adjacent)
- location in preferences, or remote when `pref_remote`
- `pay_max >= pref_min_pay`
- employment type in preferences
- overlap between job `skills` and seeker `skills`

Keep the function pure with explicit weights so it is easy to explain and test. Scoring runs client-side over the
open-jobs query. That is fine at seed-data scale. If it ever needs to scale, move it to a Postgres function.

## Design language

Target the look of Linear, Vercel, Ramp and Ashby: restrained, crisp, expensive-feeling.
- **Typography**: `Inter` (or `Geist`) for UI, tight tracking on headings, big confident hero type on the landing page.
- **Color**: neutral zinc base, **one** brand accent (indigo/violet) used sparingly for primary actions and highlights.
  Status colors are semantic and consistent everywhere (see the status badge).
- **Surfaces**: subtle 1px borders, soft shadows, `rounded-xl` cards, generous whitespace, a faint grid or gradient
  glow on the hero only.
- **Motion**: small and quick (150–200ms), no bouncy animations. Skeletons while loading, never spinners on full pages.
- **Density**: recruiter views can be denser (table/kanban); seeker views are roomier (cards).
- Both themes must look intentional. Use CSS variables / shadcn tokens, never hard-coded colors in components.
- Icons come only from `lucide-react`, at a consistent size per context (16px inline, 20px nav).

## Commands

```bash
pnpm install
pnpm dev                 # Vite dev server
pnpm build               # typecheck + production build (must pass before pushing)
pnpm lint                # oxlint
pnpm typecheck           # tsc --noEmit
pnpm test                # Vitest (unit tests for lib/, e.g. matching.ts)
pnpm db:types            # regenerate src/types/database.ts from Supabase
pnpm db:seed             # run scripts/seed.ts (needs SUPABASE_SERVICE_ROLE_KEY)
pnpm supabase db push    # apply migrations to the linked project
pnpm add <pkg>           # add a dependency (-D for dev). Never npm/yarn
```

## Environment variables

| Name | Where | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `.env.local`, Vercel | Supabase project URL (public) |
| `VITE_SUPABASE_ANON_KEY` | `.env.local`, Vercel | Public anon key. Safe in the browser because RLS enforces access |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` only | Seeding script only. **Never** in Vercel client env, never committed |

`.env.local` is gitignored. `.env.example` lists every variable with placeholder values.

## Conventions

- Function components with named exports. One component per file; the file name matches the component (`JobCard.tsx`).
- Use `@/` path aliases (`@/components/...`, `@/lib/...`).
- Format money with `Intl.NumberFormat`. Show pay ranges as `$120k – $160k` / `$35 – $45/hr`.
- Use relative dates for recency ("Posted 3d ago"), absolute dates in tooltips.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`) and reference requirement IDs
  where it applies.
- Before pushing, `pnpm build` and `pnpm lint` must pass.

## Decisions & assumptions

Interview answers were brief, so we made these calls. Add to this list when you make another one.
- One role per account; no switching. A recruiter belongs to exactly one company, picked or created at signup.
- "Preferences" means: locations, remote OK, minimum pay, experience level, employment types.
- "Experiences" means work-history entries (title, company, dates, description). Skills are tags on the profile.
- Resumes are PDF only, max 5 MB, one active resume per seeker. Each application snapshots the resume path at
  apply time.
- Applicants are pipeline-managed by recruiters. Seekers can withdraw but can't change any other status.
- No messaging, payments, email notifications or admin panel in v1. In-app status changes are the notification.
- Seed data: 8 fictional companies, 40 jobs across levels, locations and pay, 2 demo users (one per role) plus 6
  extra applicants, each with a profile, experience and generated PDF resume, and 16 applications with backdated
  status timelines. The demo recruiter works at Lumen AI.
- Recruiter signup creates the company if no company with that name (case-insensitive) exists, otherwise joins it.
- Job search and job detail pages are public. Applying requires a seeker account.

## Status

**Scaffold done** (app shell, auth, routing, theme, landing page, schema, RLS, seed). Feature pages are placeholders.

- [x] Vite + React + TS (strict) + Tailwind v4 + shadcn-style components, light/dark theme
- [x] Landing page, sign in / sign up with role picker, role-based route guards, app shell
- [x] Migration `20261004000000_init.sql`: schema, triggers, RLS, `resumes` bucket. Verified against local Postgres
      with Supabase `auth`/`storage` stubs.
- [x] `lib/matching.ts` with unit tests
- [x] Seed script and data
- [ ] Apply migration and seed the real Supabase project, then regenerate `types/database.ts` (it's currently
      hand-written in generated format)
- [ ] R4/R5 job search + filters · R7 job detail + apply
- [ ] R2/R3 profile, experience, resume upload
- [ ] R6 For-you feed · R8 application tracker
- [ ] R10/R11 recruiter dashboard + posting editor · R12/R13 applicants pipeline

## Environment notes (Claude cloud sessions)

- `ui.shadcn.com` is blocked by the default network policy, so `shadcn add` fails. Components in
  `src/components/ui` were written by hand in shadcn's new-york style over the `radix-ui` package. Add new ones the
  same way, or add the domain to the environment's allowed hosts.
- Supabase hosts (`*.supabase.co`, `*.supabase.com`) must be allowed in the environment's network settings.
  `supabase db push` needs a direct Postgres connection, which the HTTPS proxy may block. If it does, apply the
  migration through the Management API (`POST https://api.supabase.com/v1/projects/{ref}/database/query` with
  `SUPABASE_ACCESS_TOKEN`).
- Docker isn't running, so `supabase start` and local type generation don't work. Postgres 16 binaries are
  installed (`/usr/lib/postgresql/16/bin`) for testing SQL.
