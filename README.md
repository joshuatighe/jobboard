<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/logo-dark.svg">
  <img src=".github/assets/logo-light.svg" alt="JobBoard" width="300">
</picture>

<br>

**Every open role, ranked by how well it fits you.**

A two-sided job board. Seekers get a feed scored against their profile, with the reasons shown.<br>
Recruiters get a pipeline whose stages their candidates can see.

<p>
  <a href="https://jobboard-eta-two.vercel.app"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/live_demo-jobboard--eta--two.vercel.app-fad53b?style=flat-square&logo=vercel&logoColor=white&labelColor=5a544f"><img alt="Live demo" src="https://img.shields.io/badge/live_demo-jobboard--eta--two.vercel.app-ffe84a?style=flat-square&logo=vercel&logoColor=white&labelColor=1d1713"></picture></a>
  <a href="https://github.com/joshuatighe/jobboard/deployments"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/deployments/joshuatighe/jobboard/Production?style=flat-square&logo=vercel&label=production&logoColor=white&labelColor=5a544f"><img alt="Production deployment" src="https://img.shields.io/github/deployments/joshuatighe/jobboard/Production?style=flat-square&logo=vercel&label=production&logoColor=white&labelColor=1d1713"></picture></a>
  <a href="https://github.com/joshuatighe/jobboard/commits/main"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/last-commit/joshuatighe/jobboard/main?style=flat-square&logo=github&label=last%20commit&color=393430&logoColor=white&labelColor=5a544f"><img alt="Last commit" src="https://img.shields.io/github/last-commit/joshuatighe/jobboard/main?style=flat-square&logo=github&label=last%20commit&color=d4d0ca&logoColor=white&labelColor=1d1713"></picture></a>
  <a href="https://github.com/joshuatighe/jobboard/pulls?q=is%3Apr+is%3Amerged"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/issues-pr-closed/joshuatighe/jobboard?style=flat-square&logo=github&label=pull%20requests&color=393430&logoColor=white&labelColor=5a544f"><img alt="Pull requests" src="https://img.shields.io/github/issues-pr-closed/joshuatighe/jobboard?style=flat-square&logo=github&label=pull%20requests&color=d4d0ca&logoColor=white&labelColor=1d1713"></picture></a>
</p>

<p>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/React-19-393430?style=flat-square&logo=react&logoColor=white&labelColor=5a544f"><img alt="React 19" src="https://img.shields.io/badge/React-19-d4d0ca?style=flat-square&logo=react&logoColor=white&labelColor=1d1713"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/TypeScript-6-393430?style=flat-square&logo=typescript&logoColor=white&labelColor=5a544f"><img alt="TypeScript 6" src="https://img.shields.io/badge/TypeScript-6-d4d0ca?style=flat-square&logo=typescript&logoColor=white&labelColor=1d1713"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Vite-8-393430?style=flat-square&logo=vite&logoColor=white&labelColor=5a544f"><img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-d4d0ca?style=flat-square&logo=vite&logoColor=white&labelColor=1d1713"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Tailwind_CSS-4-393430?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=5a544f"><img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-d4d0ca?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=1d1713"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/TanStack_Query-5-393430?style=flat-square&logo=reactquery&logoColor=white&labelColor=5a544f"><img alt="TanStack Query 5" src="https://img.shields.io/badge/TanStack_Query-5-d4d0ca?style=flat-square&logo=reactquery&logoColor=white&labelColor=1d1713"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Supabase-Postgres_%2B_RLS-393430?style=flat-square&logo=supabase&logoColor=white&labelColor=5a544f"><img alt="Supabase" src="https://img.shields.io/badge/Supabase-Postgres_%2B_RLS-d4d0ca?style=flat-square&logo=supabase&logoColor=white&labelColor=1d1713"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/pnpm-10-393430?style=flat-square&logo=pnpm&logoColor=white&labelColor=5a544f"><img alt="pnpm 10" src="https://img.shields.io/badge/pnpm-10-d4d0ca?style=flat-square&logo=pnpm&logoColor=white&labelColor=1d1713"></picture>
</p>

<sub>[Live demo](https://jobboard-eta-two.vercel.app) · [Features](#features) · [Demo accounts](#demo-accounts) · [Getting started](#getting-started) · [Deploy](#deploy) · [Stack](#stack)</sub>

</div>

---

## Features

### For job seekers
- **For You feed.** Every open job is scored 0–100 against your level, locations, minimum pay, job types and skills.
  Each match shows its score and one chip per criterion it meets.
- **Search and filters.** Keyword search with filters for pay, location / remote and experience level. Filters live in
  the URL, so a search can be shared and survives back / forward.
- **One profile.** Headline, bio, skills, work history, preferences and a PDF resume. Each section saves on its own.
- **Apply in seconds.** The resume on file is attached and snapshotted with the application. Add a cover note if you
  want. If there's no resume yet, you can upload one in the apply dialog.
- **Application tracker.** Every application's status, a progress bar, the full timeline, the resume you sent, and
  withdrawal (including declining an offer).

### For recruiters
- **Postings dashboard.** Open, draft and closed roles with applicant counts by stage.
- **Posting editor.** Pay range, location / remote, level, type, skills and a description with a live preview. Save as
  a draft or publish; close and reopen later.
- **Applicants pipeline.** A board with columns for New, In review, Interviewing, Offer and Closed. Open a candidate to
  read their resume, cover note and work history, then move them to any stage. The seeker's tracker shows the change.

### Everywhere
- Light and dark mode, responsive down to 375px, keyboard navigable.
- Access is enforced by Postgres Row Level Security, not the UI. Resumes sit in a private bucket and are opened through
  signed URLs.

## Demo accounts

`pnpm db:seed` creates 8 companies, 40 jobs, 8 people and 16 applications with backdated timelines, so every screen
has data on a fresh deploy. Try them on the [live demo](https://jobboard-eta-two.vercel.app).

| Role | Email | Password |
| --- | --- | --- |
| Job seeker (Jordan Rivera) | `seeker@jobboard.dev` | `jobboard-demo` |
| Recruiter (Morgan Lee, Lumen AI) | `recruiter@jobboard.dev` | `jobboard-demo` |

> [!TIP]
> To be signed in as both at once, use two browser windows that don't share storage (a normal and a private window,
> or two browser profiles). Tabs in the same window share one session.

## Getting started

### 1. Prerequisites
- Node.js 20.19+ or 22.12+, and [pnpm](https://pnpm.io) 10 (`corepack enable` picks up the pinned version)
- A free [Supabase](https://supabase.com) project, or Docker to run Supabase locally

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
pnpm supabase db push     # schema, triggers, RLS policies, storage bucket
pnpm db:seed              # demo companies, jobs, users and applications
```

> [!TIP]
> For instant sign-ups, turn off **Authentication → Sign In / Providers → Email → Confirm email** in Supabase.

<details>
<summary><strong>Or run Supabase locally</strong></summary>

<br>

With Docker running, you can skip the hosted project entirely:

```bash
pnpm db:start                         # Postgres, Auth, REST and Storage in Docker; applies migrations
pnpm supabase status -o env           # copy API_URL / ANON_KEY into .env.local as VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY> pnpm db:seed
```

</details>

### 4. Run

```bash
pnpm dev
```

Open [localhost:5173](http://localhost:5173) and sign in with a [demo account](#demo-accounts).

## Environment

| Variable | Used by | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | App | Project URL, bare (`https://<ref>.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | App | Public anon key. Safe in the browser because RLS enforces access |
| `SUPABASE_SERVICE_ROLE_KEY` | `pnpm db:seed` | Seeding only. **Never** prefix with `VITE_` or set it in Vercel |
| `SUPABASE_PROJECT_REF` | `pnpm db:types` | Bare project ref, not a dashboard URL |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI | Personal access token for `link` / `db push` |
| `SUPABASE_DB_PASSWORD` | Supabase CLI | Database password for `db push` |

`.env.example` lists them all with placeholders. `.env.local` is gitignored.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Typecheck and build for production |
| `pnpm preview` | Serve the production build |
| `pnpm lint` | Lint with oxlint |
| `pnpm typecheck` | Typecheck only |
| `pnpm test` / `test:watch` | Run the Vitest unit tests (once / watch) |
| `pnpm db:start` / `db:stop` | Start or stop local Supabase (Docker) |
| `pnpm db:reset` | Wipe the local database and re-apply migrations |
| `pnpm db:seed` / `db:seed:local` | Seed demo data (hosted / local) |
| `pnpm db:types` / `db:types:local` | Regenerate `src/types/database.ts` (hosted / local) |

## Deploy

1. Import the repo into [Vercel](https://vercel.com/new). The framework preset is **Vite**, and pnpm is detected from
   `pnpm-lock.yaml`.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
3. In Supabase → **Authentication → URL Configuration**, set your Vercel domain as the Site URL.
4. Deploy. `vercel.json` rewrites every route to `index.html` for client-side routing.

## Stack

| | |
| --- | --- |
| **Frontend** | Vite · React · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui (Radix) · IBM Carbon icons |
| **Type** | Newsreader · Instrument Sans · Geist Mono |
| **Data** | TanStack Query · react-hook-form · zod |
| **Backend** | Supabase: Postgres, Auth, Storage, Row Level Security |
| **Tooling** | pnpm · Supabase CLI · oxlint · Vitest |
| **Hosting** | Vercel |

## Project structure

```
src/
  routes/          pages: marketing, auth, seeker, recruiter
  components/      ui (shadcn), layout, and feature components
  lib/
    api/           typed Supabase data access
    queries/       TanStack Query hooks over lib/api
    *.ts           pure, unit-tested logic: matching, feed, pipeline, postings, tracker
supabase/
  migrations/      schema, triggers, RLS, storage bucket
scripts/           idempotent seed script and demo data
```

See [`CLAUDE.md`](./CLAUDE.md) for the full requirements, data model, design language and decisions.

---

<div align="center">
<sub>Built for a software engineering course · Requirements by our client team · 2026</sub>
</div>
