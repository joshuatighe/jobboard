<div align="center">

# JobBoard

**Hiring, minus the noise.**

The job board that actually knows what you're looking for, and the recruiter pipeline that doesn't need a spreadsheet.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## Why JobBoard

Job boards are a firehose and applicant tracking systems are a maze. JobBoard puts both sides of hiring in one
calm, fast product: seekers get a feed tuned to them, recruiters get a pipeline that updates in real time.

## Features

### For job seekers
- **A feed made for you.** Jobs ranked by fit against your preferences, experience and skills, with the reasons shown.
- **Search that respects your time.** Keyword search with filters for pay, location / remote and experience level.
- **One profile, every application.** Experience, skills, preferences and a resume you upload once.
- **Apply in seconds.** Your resume is attached automatically; add a note if you want.
- **Always know where you stand.** Every application's status and timeline in one tracker.

### For recruiters
- **Post in minutes.** Pay range, location, level, type and a rich description.
- **Every posting at a glance.** Open, closed and draft roles with live applicant counts.
- **A real pipeline.** Review candidates and their resumes, then move them from *Applied* to *Offer*.

## Stack

| | |
| --- | --- |
| **Frontend** | Vite · React · TypeScript · Tailwind CSS · shadcn/ui · Lucide |
| **Data** | TanStack Query · react-hook-form · zod |
| **Backend** | Supabase: Postgres, Auth, Storage, Row Level Security |
| **Tooling** | pnpm · Supabase CLI · oxlint · Vitest |
| **Hosting** | Vercel |

## Getting started

### 1. Prerequisites
- Node.js 20+ and [pnpm](https://pnpm.io) 9+ (`corepack enable`)
- A free [Supabase](https://supabase.com) project

### 2. Install

```bash
git clone https://github.com/joshuatighe/jobboard.git
cd jobboard
pnpm install
cp .env.example .env.local   # then fill in your Supabase keys
```

### 3. Set up the database

```bash
pnpm supabase link --project-ref <your-project-ref>
pnpm supabase db push     # apply schema, RLS policies, and storage bucket
pnpm db:seed              # demo companies, jobs, users, and applications
```

> **Tip:** for instant demo signups, turn off **Authentication → Sign In / Providers → Email → Confirm email** in Supabase.

### Or run Supabase locally

With Docker running, skip the hosted project entirely:

```bash
pnpm db:start                         # Postgres, Auth, REST and Storage in Docker; applies migrations
pnpm supabase status -o env           # copy API_URL / ANON_KEY into .env.local as VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY> pnpm db:seed
```

### 4. Run

```bash
pnpm dev
```

Open [localhost:5173](http://localhost:5173).

### Demo accounts

After seeding, sign in as either side of the marketplace:

| Role | Email | Password |
| --- | --- | --- |
| Job seeker | `seeker@jobboard.dev` | `jobboard-demo` |
| Recruiter | `recruiter@jobboard.dev` | `jobboard-demo` |

## Environment

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key (access is enforced by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Used **only** by the local seed script. Never deploy it |

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Typecheck and build for production |
| `pnpm lint` | Lint the codebase |
| `pnpm test` | Run unit tests |
| `pnpm db:start` / `db:stop` | Start or stop local Supabase (Docker) |
| `pnpm db:reset` | Re-apply migrations to the local database |
| `pnpm db:types` | Regenerate TypeScript types from the hosted database |
| `pnpm db:types:local` | Regenerate TypeScript types from the local database |
| `pnpm db:seed` | Seed demo data |

## Deploy

1. Import the repo into [Vercel](https://vercel.com/new). The framework preset is **Vite**.
2. Vercel detects pnpm from `pnpm-lock.yaml`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
3. In Supabase → **Authentication → URL Configuration**, add your Vercel domain as the Site URL.
4. Deploy. Client-side routes are handled by `vercel.json`.

## Project structure

```
src/
  routes/        pages: marketing, auth, seeker, recruiter
  components/    ui (shadcn), layout, and feature components
  lib/           supabase client, typed API, query hooks, matching
supabase/
  migrations/    schema, triggers, RLS, storage bucket
scripts/         idempotent seed script + demo data
```

See [`CLAUDE.md`](./CLAUDE.md) for the full requirements, data model and conventions.

---

<div align="center">
<sub>Built for a software engineering course · Requirements by our client team · 2026</sub>
</div>
