-- Tighten which columns clients can write. RLS decides which rows a user may touch; these grants decide
-- which columns. Service-role access (seed script) is unaffected.

-- profiles: users edit their name and avatar only. `role` is fixed at signup (one role per account), and
-- `created_at` is set by the database.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

-- applications (R7): a seeker supplies the job, themselves and a cover note. Everything else comes from the
-- database: status starts at 'applied', the resume is snapshotted by `prepare_application`, and timestamps
-- are defaults. Without this, a client could insert an application that starts at 'offer', is backdated,
-- or points at any resume path.
revoke insert on public.applications from anon, authenticated;
grant insert (job_id, seeker_id, cover_note) on public.applications to authenticated;

-- seeker_profiles (R3): the resume on file must live in the seeker's own folder, so a seeker can't attach
-- another seeker's resume to their applications.
alter table public.seeker_profiles
  add constraint seeker_profiles_resume_path_owner
  check (resume_path is null or resume_path like user_id::text || '/%');
