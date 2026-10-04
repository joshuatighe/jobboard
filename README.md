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
| **Hosting** | Vercel |

## Getting started

### 1. Prerequisites
- Node.js 20+
- A free [Supabase](https://supabase.com) project
- The [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm i -g supabase`)

### 2. Install

```bash
git clone https://github.com/joshuatighe/jobboard.git
cd jobboard
npm install
cp .env.example .env.local   # then fill in your Supabase keys
```

### 3. Set up the database

```bash
supabase link --project-ref <your-project-ref>
supabase db push          # apply schema, RLS policies, and storage bucket
npm run db:seed           # demo companies, jobs, users, and applications
```

### 4. Run

```bash
npm run dev
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
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build for production |
| `npm run lint` | Lint the codebase |
| `npm run test` | Run unit tests |
| `npm run db:types` | Regenerate TypeScript types from the database |
| `npm run db:seed` | Seed demo data |

## Deploy

1. Import the repo into [Vercel](https://vercel.com/new). The framework preset is **Vite**.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
3. In Supabase → **Authentication → URL Configuration**, add your Vercel domain as the Site URL.
4. Deploy. Client-side routes are handled by `vercel.json`.

## Project structure

```
src/
  routes/        pages: marketing, auth, seeker, recruiter
  components/    ui (shadcn), layout, and feature components
  lib/           supabase client, typed API, query hooks, matching
supabase/
  migrations/    schema + RLS + storage
scripts/         seed script
```

See [`CLAUDE.md`](./CLAUDE.md) for the full requirements, data model and conventions.

---

<div align="center">
<sub>Built for a software engineering course · Requirements by our client team · 2026</sub>
</div>
