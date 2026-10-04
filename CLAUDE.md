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
| Theme | **next-themes** (`.dark` class on `<html>`; light / dark / system). The pre-paint script lives in `index.html`; see the `scriptProps` note in `AppProviders` |
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
    providers/               # AppProviders (theme, query, auth, toasts), AuthProvider
    marketing/, jobs/, ...   # feature components
  hooks/                     # useAuth
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
pnpm dev:local           # dev server against local Supabase (cloud sessions; uses SUPABASE_LOCAL_*)
pnpm build               # typecheck + production build (must pass before pushing)
pnpm lint                # oxlint
pnpm typecheck           # tsc --noEmit
pnpm test                # Vitest (unit tests for lib/, e.g. matching.ts)
pnpm db:start            # local Supabase in Docker (Postgres, Auth, REST, Storage); applies migrations
pnpm db:reset            # wipe local DB and re-apply migrations (then re-run db:seed)
pnpm db:types:local      # regenerate src/types/database.ts from the local DB
pnpm db:types            # regenerate src/types/database.ts from the hosted project
pnpm db:seed             # run scripts/seed.ts (needs SUPABASE_SERVICE_ROLE_KEY)
pnpm db:seed:local       # seed local Supabase (uses SUPABASE_LOCAL_*)
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
- **Branches**: `<type>/<short-kebab-description>` using the commit types, e.g. `feat/job-search`,
  `feat/recruiter-pipeline`, `fix/apply-button-state`, `chore/ci`. One branch and one PR per feature, branched from
  `main`. In Claude cloud sessions, don't use the auto-generated `claude/...` session branch: create a branch
  following this convention and push there (the repo owner has asked for this).
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
- Job search and job detail pages are public. Applying requires a seeker account. Signed-in users see them inside
  the app shell; visitors see the marketing header.
- Search filters live in the URL (`?q=&pay=&location=&remote=1&level=`), so searches are shareable and survive
  back/forward. Keyword search requires every word and prefix-matches the last one, so results update while typing.
- The pay filter is a minimum annual amount. A job matches when its `pay_max` meets it; hourly roles are annualized at
  2,080 hours.
- Location + remote: "Remote only" on its own shows remote roles; with a location typed it becomes "Include remote
  roles" (that location **or** remote), since remote roles can be done from anywhere.
- Seekers can apply without a resume on file (the apply dialog warns and links to the profile). Blocking would make
  applying impossible for new accounts until resume upload (R3) ships.

## Status

**Scaffold done** (app shell, auth, routing, theme, landing page, schema, RLS, seed). Feature pages are placeholders.

- [x] Vite + React + TS (strict) + Tailwind v4 + shadcn-style components, light/dark theme
- [x] Landing page, sign in / sign up with role picker, role-based route guards, app shell
- [x] Migration `20261004000000_init.sql`: schema, triggers, RLS, `resumes` bucket. Verified against local Postgres
      with Supabase `auth`/`storage` stubs.
- [x] `lib/matching.ts` with unit tests
- [x] Seed script and data
- [x] Verified end to end on local Supabase (Docker): migration applies, types generated, seed is idempotent, RLS
      checked through the API as each demo user, sign-in/out + role redirects checked in a browser
- [x] Migration applied and seed run on the hosted Supabase project (through the Management API; see below)
- [x] R4/R5 job search + filters · R7 job detail + apply
- [ ] R2/R3 profile, experience, resume upload
- [ ] R6 For-you feed · R8 application tracker
- [ ] R10/R11 recruiter dashboard + posting editor · R12/R13 applicants pipeline

## Environment notes (Claude cloud sessions)

- **Local Supabase starts automatically.** `.claude/hooks/session-start.sh` runs `pnpm install`, starts Docker and
  `pnpm db:start`, seeds demo data, and exports `SUPABASE_LOCAL_URL`, `SUPABASE_LOCAL_ANON_KEY` and
  `SUPABASE_LOCAL_SERVICE_ROLE_KEY`. Logs: `/tmp/dockerd.log`, `/tmp/supabase-start.log`, `/tmp/supabase-seed.log`.
  If it failed, the hook prints a warning and the session continues; start it by hand with `dockerd` + `pnpm db:start`.
- **Local vs hosted.** The environment's `VITE_SUPABASE_*` variables point at the hosted project and override
  `.env.local` (Vite gives real environment variables priority). Use `pnpm dev:local` / `pnpm db:seed:local` to target
  the local stack, and plain `pnpm dev` / `pnpm db:seed` for hosted. Test schema and RLS changes locally first.
- Image pulls from AWS ECR Public and GHCR need `d2glxqk2uabbnd.cloudfront.net` and
  `pkg-containers.githubusercontent.com` allowed. Without them the CLI falls back to Docker Hub, which works but
  rate-limits anonymous pulls (429s are retried).
- Hosted Supabase: `*.supabase.co` / `*.supabase.com` must be allowed. `supabase db push` needs a direct Postgres
  connection, which the HTTPS proxy may block. If it does, apply migrations through the Management API
  (`POST https://api.supabase.com/v1/projects/{ref}/database/query` with `SUPABASE_ACCESS_TOKEN`).
- `SUPABASE_PROJECT_REF` must be the bare project ref (e.g. `kctgfbswpvusjlxjsyug`), not a dashboard URL, and
  `VITE_SUPABASE_URL` must be the bare project URL (`https://<ref>.supabase.co`, no `/rest/v1/`). Otherwise
  `db:types`, `db:seed` and the app's client all fail.
- When applying a migration through the Management API, also insert its row into
  `supabase_migrations.schema_migrations` (`version`, `name`, `statements`) so `supabase migration list` / `db push`
  treat it as applied.
- `pnpm dlx shadcn add` can rewrite the `cn` import to a stray npm package called `cn`. Point it back at
  `@/lib/utils` and don't commit the dependency.
- `ui.shadcn.com` is allowed, so `pnpm dlx shadcn@latest add <component>` works. Existing components in
  `src/components/ui` were hand-written in the new-york style before that, so review generated diffs if
  re-adding one.
- Postgres 16 binaries are also installed (`/usr/lib/postgresql/16/bin`) for quick SQL experiments.
