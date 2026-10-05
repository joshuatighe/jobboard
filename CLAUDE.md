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
| Fonts | `@fontsource-variable/newsreader` (serif, opsz axis), `@fontsource-variable/instrument-sans` (UI), `@fontsource-variable/geist-mono` (metadata). Latin subsets only, no italics |
| Components | **shadcn/ui** (Radix primitives; component source lives in `src/components/ui`) |
| Icons | **@carbon/icons-react** (IBM Carbon), the only icon set |
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
    postings.ts (+ .test.ts) # posting form schema, allowed status actions, dashboard counts/sorting (pure)
    pipeline.ts (+ .test.ts) # applicants board: stages, grouping, allowed recruiter moves (pure)
    feed.ts (+ .test.ts)     # For-you feed: which preferences count, match tiers, hiding applied jobs
    applications.ts (+ .test.ts) # tracker grouping, timeline and pipeline-progress helpers (pure)
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
- Open jobs are readable by anyone. Drafts are readable only by the owning company's recruiters; closed jobs by
  those recruiters and by seekers who applied to them (so the R8 tracker keeps the title and company).
- Seekers read and write only their own profile, experiences and applications.
- Recruiters read applications (and the applicant's profile, experiences and resume) only for their company's jobs,
  and may update `status` only.
- Recruiters insert, update and close their company's jobs, and may delete only **drafts** (deleting a published job
  would cascade to its applications).
- Column grants back RLS up where a row is writable but some columns must not be (migration
  `20261004190000_restrict_client_writes.sql`): users update only `full_name` / `avatar_url` on `profiles` (never
  `role`), and seekers insert applications with only `job_id`, `seeker_id` and `cover_note` (status, resume snapshot
  and timestamps come from the database). `seeker_profiles.resume_path` must sit in the seeker's own folder (check
  constraint). On `jobs` (migration `20261004210000_restrict_job_writes.sql`), recruiters insert and update only the
  posting fields and `status`; `company_id` / `recruiter_id` default to the signed-in recruiter's company and id, and
  `created_at` / `updated_at` / `search` come from the database. When adding a table or column clients can write,
  decide which columns they may set.
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

**Concept: "Classifieds, reissued."** The job board's ancestor is the classifieds page: listings in a ruled column,
a serif title on each, small monospace metadata, and a highlighter dragged across the one you want. JobBoard takes
that and sets it like a well-made newspaper, not a SaaS template. Someone should recognise a cropped screenshot from
the paper tone, the serif titles, the hairline rules and the yellow mark. The concept and the alternatives it beat
are recorded under [Decisions & assumptions](#decisions--assumptions).

The system lives in `src/index.css` (tokens, type sizes, the `page-x`, `meta` and `highlight` utilities) and in
`src/components/ui`. Components use tokens only; nothing is hard-coded.

- **Type.** Three families, all variable, latin subsets only (about 190 KB):
  - `Newsreader` (serif, with its optical-size axis) for every heading, listing title, page title, big number and
    pull quote. `h1`–`h3` are serif by default. Weight 500, tight tracking at display sizes.
  - `Instrument Sans` for UI and body copy. 15–16px body, 14px in dense recruiter views.
  - `Geist Mono` for metadata: the `meta` utility (11px, uppercase, 0.08em tracking, tabular figures) is used for
    column headers, dates, counts, section labels in sheets and the back links. Badges are mono too.
  - Display sizes are tokens: `text-display` (hero), `text-headline` (section and detail titles), `text-title`
    (page titles, 28px, stepping to `text-4xl` from `sm`).
- **Colour.** Paper and ink, no accent hue. Light is warm off-white paper (`oklch(0.982 0.004 85)`) with warm
  near-black ink; dark is ink paper (`oklch(0.165 0.008 55)`) with the same hues at different lightness. Primary
  actions are ink on paper (paper on ink in dark). The only colour is the **highlighter**: `--highlight` /
  `--highlight-foreground`, always yellow with ink text in both themes, applied with the `highlight` utility to the
  few things worth marking: the match score when it is a strong match, unreviewed applicant counts, an offer, the
  "Current" role, one phrase in a headline, and "Job" in the wordmark. It is a flat fill, never outlined (an
  outline turns it into a box, and reads as grey in dark mode). Status colours (`success`, `warning`,
  `info`, `destructive`) are semantic and appear only in badges, dots and the progress bar. Every text pair was
  checked against WCAG AA in both themes (muted text ≥ 6.2:1, status text on its 12% tint ≥ 4.5:1).
- **Spacing and grid.** One column: `page-x` (max 72rem, 20px gutters, 32px from `sm`) for the masthead, every
  page and every landing section. 4px base; section rhythm on 8. Landing sections are `py-20 sm:py-28`, separated
  by a hairline, and lay out on a 12-column grid. Page headers end in a hairline (`PageHeader`); lists start under
  it with `divide-y`, and tables and stat strips are ruled the same way.
- **Surfaces.** Hairline rules instead of cards wherever something is a list: job results, the For-you feed, the
  tracker, postings. A hairline panel (`Card`, `rounded-xl border`, no shadow) is reserved for things that are
  genuinely a unit: forms, the apply panel, candidate cards on the board. Shadows exist only on things that float
  (menus, dialogs, sheets). **No rounded corners anywhere**: every radius token is 0, no component carries a
  `rounded-*` class, and avatars, status dots, progress bars and the switch are square. Company marks and avatars
  are serif monograms on a hairline square, centred on their capitals with the `caps-center` utility on an inner
  span (CSS `text-box` trim; plain flex centring leaves Newsreader capitals about 1.5px high). Stat strips are one
  bordered grid with serif numerals, not four cards.
- **Navigation.** The masthead is a 56px bar with a hairline. The current section is underlined with a 2px ink
  bar, in the app nav and in every tab list (`Tabs` is underline-style, no grey pill group).
- **Motion.** 150ms colour and border transitions; dialogs and sheets use tw-animate's fade/slide at 200ms.
  `prefers-reduced-motion` collapses every animation and transition and turns off smooth scrolling. Skeletons while
  loading, never spinners on full pages. Hover on a listing underlines the title; nothing lifts or glows.
- **Focus.** A 1px ink hairline, never thicker. Buttons never grow when focused, so they stay level with their
  neighbours: ghost and secondary buttons get an inset hairline at their edge, outline buttons turn their border
  ink, and solid buttons get a paper hairline 4px inside the fill. Links, tabs, checkboxes and the switch get a 1px
  ring with a 2px offset; rows and cards that stretch a link over themselves get it inset; inputs turn their border
  to ink and add a soft 3px ring.
- **Density.** Recruiter views are denser (ledger table, five-column board at `lg`); seeker views are roomier
  (listings with 20px vertical padding).
- **Copy.** Plain, specific sentences about what the product does. No slogans, no eyebrow labels over every
  heading, no emoji. Mono labels and numbered lists ("01", "02") carry the editorial feel instead.
- Icons come only from `@carbon/icons-react`: square terminals and mitred corners, drawn on a 16px grid. 16px inline,
  20px in the mobile menu and empty states. They are filled shapes, so there is no `strokeWidth`; size them with
  `size-*` classes. The type for an icon prop is `CarbonIconType`. Spinners are `CircleDash` with `animate-spin`.

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
- **Applying requires a resume on file** (revised once R3 shipped; it used to warn and allow). R7 is "apply with the
  resume on file", so an application without one isn't useful to recruiters. The apply dialog offers an inline PDF
  upload, so nobody has to leave the job to apply. This is a UI rule, not a database constraint: it's product
  validation, not authorization.
- **Resumes are never overwritten.** Each upload goes to a new path, `{user_id}/{slugified-name}-{base36 timestamp}.pdf`,
  and `seeker_profiles.resume_path` / `resume_filename` (the original name, for display) point at the current one.
  Applications keep the path they snapshotted, so replacing a resume never changes what a recruiter sees on an
  application already sent. After a replace, the previous file is deleted only if no application references it
  (best effort, client-side; a leftover file only costs storage). Files are checked client-side for type, size and
  the `%PDF-` header; the bucket enforces type and the 5 MB limit server-side.
- Experience dates are month-granular (stored as the 1st of the month), picked with month + year selects rather than
  `<input type="month">`, which Safari and Firefox don't render as a picker. A null `end_date` means current role.
- **Application tracker (R8)** groups statuses into tabs, **Active** (applied, in review, interviewing), **Offers** and
  **Closed** (not selected, withdrawn), plus **All**. The tab lives in the URL (`?tab=`). Rows sort by last activity
  (the newest `application_events` row, not `updated_at`), and a 4-step bar shows how far each one got; a closed
  application's bar is greyed at the furthest stage it reached. Details (timeline, resume sent, cover note) open in a
  side sheet, so the list stays scannable on mobile.
- Seekers can **withdraw any application that isn't already final, including an offer** (that's how they decline
  one). It's confirmed first and is final: the unique `(job_id, seeker_id)` means they can't reapply to that job.
- **Applicants keep seeing closed jobs they applied to** (migration `20261004200000`, policy "Applicants see closed
  jobs they applied to"). Otherwise the tracker lost the title and company of every role that closed after they
  applied, often the ones with an offer. Drafts stay hidden. If a job still can't be read (deleted, or the migration
  isn't applied yet), the tracker shows "Role no longer listed" with the full timeline instead of failing.
- The "resume sent" on an application is the snapshot path. It's labelled "Your current resume" when it matches the
  profile's resume, otherwise "An earlier version" (shown by its object name, since only the current file's original
  name is stored).
- **For-you feed (R6)** ranks every open job client-side with `matching.ts` (one query, capped at 500 rows, which
  is plenty at seed scale). Jobs the seeker already applied to are **hidden**, with a count and a link to the tracker
  under the list, since the tracker is where those live. The list shows 10 at a time ("Show more matches").
- A profile counts as **too sparse to rank** when level, locations, minimum pay, job types and skills are all empty.
  "Remote OK" alone doesn't count, because it defaults to on. The feed then shows a "Tell us what you're looking for"
  prompt (to `/profile#preferences`) instead of a ranking. With some but not all of them filled, it ranks and shows a
  one-line nudge naming what's missing (linking to `#about` when only skills are missing, since skills live there).
- Each match shows its score as "N% match" (80+ strong, brand tint; 50+ good; below that partial) and one chip per
  criterion it meets. Unmet criteria aren't listed: the chips explain the score rather than critique the job.
- `/profile#section` links scroll to the section once the profile has loaded (it renders a skeleton first).
- Profile sections (About, Experience, Preferences, Resume) save independently, each with its own save button and
  toast, rather than one big form. A "Profile strength" checklist links to whatever is still missing.
- **Posting statuses (R10/R11).** A new posting is saved as a draft or published. Drafts publish or get deleted; open
  postings close; closed postings reopen. An open posting can go **back to draft only while nobody has applied**:
  applicants can't see drafts, so their tracker would lose it. Published postings are never deleted, only closed.
  These rules live in the `check_job_status` trigger and the delete policy, and `postingActions` in `lib/postings.ts`
  mirrors them for the UI.
- **Closing asks first** (an `AlertDialog` explaining that applicants keep it in their tracker); publishing, reopening
  and moving back to drafts happen straight away with a toast, since they're easy to undo. Deleting a draft asks first.
- **A draft's "Posted" date is when it's published.** The first draft → open change sets `created_at` to now
  (database-side), so a draft started last month doesn't appear as an old posting in search. Reopening a closed
  posting keeps its original date.
- The recruiter dashboard (`/dashboard`) lists every posting at the company, sorted open → drafts → closed, then by
  last update, with a status filter in the URL (`?status=`). A table on desktop, cards below `md`. Applicant counts
  show the total plus a breakdown of new / in review / interviewing / offer. Draft titles link to the editor, others
  to the applicants pipeline.
- The posting form validates pay against its period: an hourly rate over $1,000 or an annual salary under $1,000 is
  flagged as likely the wrong period. The same number twice is a single figure. Drafts are validated like published
  postings (the database needs pay, location and a description anyway). The description has a Write / Preview toggle
  that renders through `JobDescription`, plus a "Start from an outline" template in that format. Leaving the editor
  with unsaved changes asks first.
- **Applicants pipeline (R12/R13)** at `/postings/:jobId`: a five-column board on desktop (New, In review,
  Interviewing, Offer, and **Closed** for rejected + withdrawn), and one stage at a time in scrollable tabs below `lg`
  (`?stage=` in the URL, defaulting to the first stage with someone in it). Within a column, whoever has waited
  longest in that status comes first, so the queue is fair.
- Recruiters can move a candidate **to any stage, forward or back, or reject them**, mirroring
  `check_application_update` (nothing to or from `withdrawn`). The sheet's primary action is the next stage. A
  rejected candidate gets "Reconsider", which returns them to the stage they were rejected from.
- **Rejecting and marking as offer ask first**: the candidate sees both as a decision in their tracker right away.
  Moves between New, In review and Interviewing are one click with a toast. Every move is reversible except a
  withdrawal.
- The candidate sheet shows the resume **snapshotted on the application** (labelled "The resume on their profile" when
  it's still current), the cover note, bio and skills, work history (read-only `ExperienceItem`) and the status
  timeline. `ApplicationTimeline` and `SentResume` take `audience="recruiter"` for recruiter wording.
- A draft posting's applicants page explains that drafts can't receive applicants and links to the editor. A job id
  that doesn't exist or belongs to another company shows "Posting not found" (applicants aren't queried at all).

- **Hard corners (Oct 2026).** Every corner is square: the radius tokens in `src/index.css` are all `0`, the
  `rounded-*` classes were removed from every component (avatars, dots, bars and the switch included), the
  highlighter and toasts have no radius, and the favicon is a plain square. A print page has no rounded corners,
  and the ruled, typeset look reads sharper without them. If a radius is ever wanted again, change the tokens;
  don't add classes.
- **Sharp icons (Oct 2026).** After the hard-corners change, Lucide's round caps, round joins and rounded
  rectangles were the last soft shapes on the page. Lucide has no sharp variant (forcing `strokeLinecap="square"`
  still leaves its rounded `rect`s), so icons moved to IBM Carbon (`@carbon/icons-react`), which is drawn with
  square ends and mitred corners and suits the ruled, typeset look. Phosphor, Tabler and Iconoir were passed over
  (rounded strokes); Material Symbols Sharp reads as Google; pixel sets are a gimmick. Notable mappings: the For-you
  feed is `Recommend`, the tracker is `Task`, postings are `Dashboard`, briefcases are `Portfolio`, warnings are
  `WarningAlt`, "not found" is `Search` or `DocumentUnknown`, external links are `Launch`.
- **Hairline focus (Oct 2026).** The original 2px ring with a 2px offset made a focused button 8px bigger than its
  neighbour (the theme toggle stood taller than "Open app" after the menu returned focus to it) and looked heavy
  against hairline rules. Focus is now 1px everywhere, and buttons draw it inside their own box. It stays a solid,
  high-contrast ink (or paper on ink) line, so it is still clearly visible.
- **Visual identity (Oct 2026): "Classifieds, reissued".** The first version was the default SaaS template
  (gradient headline, purple glow and grid, fake browser chrome, logo strip, icon-in-tinted-square feature grids,
  dark CTA box, Inter and one violet accent on `rounded-xl` cards). Four concepts were sketched and three thrown out:
  a personnel-file look (manila folders, stamps, typewriter) for being skeuomorphic and hard to make feel expensive;
  a split-flap departures board for being a gimmick that hurts readability at density; and a mirrored two-sided
  "seam" layout for being abstract and not surviving into the app screens. The classifieds concept won because it
  is rooted in what the product is (listings people mark up), it carries into every app screen (lists become ruled
  columns, stats become "by the numbers" strips, the board becomes ruled columns), and it answers the accent
  problem by removing the accent: buttons are ink and the one colour is a highlighter. Fonts: Newsreader was chosen
  over Instrument Serif for its optical-size axis (titles at 17px and 88px from one file); Instrument Sans replaces
  Inter; Geist Mono carries metadata. Italic files were left out to keep the payload near 190 KB. The `brand` button
  variant stays as an alias of `default`, and the badge tone `brand` was renamed `highlight`. The light-mode input
  border was darkened to 2:1 against paper (the shadcn default is 1.3:1); it is identified by its label and its ink
  focus border rather than by border contrast alone.

## Status

**Scaffold done** (app shell, auth, routing, theme, landing page, schema, RLS, seed). The seeker side is built (search, job detail, apply, profile, application tracker, For-you feed); the recruiter side is built (postings dashboard, posting editor, applicants pipeline).

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
- [x] R2/R3 profile, experience, preferences, resume upload / replace / view
- [x] R8 application tracker: status tabs, summary, timeline, resume sent, withdraw. Migration
      `20261004200000_applicants_see_closed_jobs.sql` verified locally and applied to hosted (Management API)
- [x] R6 For-you feed: ranked open jobs with match score and "why this matches" chips, sparse-profile prompt
- [x] R10/R11 recruiter dashboard + posting editor: status tabs, applicant counts, create / edit / publish / close /
      reopen / delete draft. Migration `20261004210000_restrict_job_writes.sql` verified locally and applied to hosted
      (Management API), then re-checked through the hosted API as recruiter@ and seeker@
- [x] R12/R13 applicants pipeline: kanban board / mobile stage tabs, candidate sheet (profile, experience, snapshot
      resume, cover note, timeline), status moves with confirmation for offer/reject. Verified R13 → R8 end to end

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
- `components.json` still says `"iconLibrary": "lucide"` (shadcn has no Carbon option). Components added with
  `pnpm dlx shadcn add` import from `lucide-react`: swap those imports for Carbon and don't commit the dependency.
- `pnpm dlx shadcn add` can rewrite the `cn` import to a stray npm package called `cn`. Point it back at
  `@/lib/utils` and don't commit the dependency.
- `ui.shadcn.com` is allowed, so `pnpm dlx shadcn@latest add <component>` works. Existing components in
  `src/components/ui` were hand-written in the new-york style before that, so review generated diffs if
  re-adding one.
- The environment's `SUPABASE_DB_PASSWORD` is the hosted one. `db:types:local` unsets it (`env -u`); without that the
  CLI writes a connection error into `src/types/database.ts`.
- Postgres 16 binaries are also installed (`/usr/lib/postgresql/16/bin`) for quick SQL experiments.
