-- JobBoard initial schema: tables, triggers, RLS policies, and the private resumes bucket.
-- Requirement IDs (R1–R13) refer to CLAUDE.md.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('seeker', 'recruiter');
create type public.experience_level as enum ('intern', 'entry', 'mid', 'senior', 'lead');
create type public.employment_type as enum ('full_time', 'part_time', 'contract', 'internship');
create type public.pay_period as enum ('year', 'hour');
create type public.job_status as enum ('draft', 'open', 'closed');
create type public.application_status as enum (
  'applied', 'reviewing', 'interviewing', 'offer', 'rejected', 'withdrawn'
);

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  website text,
  tagline text,
  description text,
  headquarters text,
  size text,
  created_at timestamptz not null default now()
);
create unique index companies_name_lower_idx on public.companies (lower(name));

create table public.recruiters (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  title text
);
create index recruiters_company_id_idx on public.recruiters (company_id);

-- R2, R3
create table public.seeker_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  headline text,
  location text,
  bio text,
  skills text[] not null default '{}',
  resume_path text,
  resume_filename text,
  pref_locations text[] not null default '{}',
  pref_remote boolean not null default true,
  pref_min_pay integer check (pref_min_pay is null or pref_min_pay >= 0),
  pref_experience_level public.experience_level,
  pref_employment_types public.employment_type[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- R2
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  company text not null,
  location text,
  start_date date not null,
  end_date date,
  description text,
  created_at timestamptz not null default now(),
  constraint experiences_dates_check check (end_date is null or end_date >= start_date)
);
create index experiences_user_id_idx on public.experiences (user_id);

-- R10
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  recruiter_id uuid references public.profiles (id) on delete set null,
  title text not null,
  description text not null,
  location text not null,
  is_remote boolean not null default false,
  pay_min integer not null check (pay_min >= 0),
  pay_max integer not null,
  pay_period public.pay_period not null default 'year',
  experience_level public.experience_level not null,
  employment_type public.employment_type not null default 'full_time',
  skills text[] not null default '{}',
  status public.job_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- R4: keyword search over title + description
  search tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) stored,
  constraint jobs_pay_range_check check (pay_max >= pay_min)
);
create index jobs_company_id_idx on public.jobs (company_id);
create index jobs_status_created_at_idx on public.jobs (status, created_at desc);
create index jobs_search_idx on public.jobs using gin (search);

-- R7, R8, R13
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  seeker_id uuid not null references public.profiles (id) on delete cascade,
  status public.application_status not null default 'applied',
  cover_note text,
  resume_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, seeker_id)
);
create index applications_seeker_id_idx on public.applications (seeker_id);

create table public.application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  from_status public.application_status,
  to_status public.application_status not null,
  changed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index application_events_application_id_idx on public.application_events (application_id);

-- ---------------------------------------------------------------------------
-- Helper functions (security definer so RLS policies can use them without recursion)
-- ---------------------------------------------------------------------------

create function public.my_company_id()
returns uuid
language sql stable security definer set search_path = ''
as $$
  select company_id from public.recruiters where user_id = auth.uid()
$$;

create function public.is_company_recruiter(target_company uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.recruiters
    where user_id = auth.uid() and company_id = target_company
  )
$$;

-- True when the current user is a recruiter at a company the seeker has applied to.
create function public.can_view_seeker(target_seeker uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.applications a
    join public.jobs j on j.id = a.job_id
    join public.recruiters r on r.company_id = j.company_id
    where a.seeker_id = target_seeker and r.user_id = auth.uid()
  )
$$;

create function public.can_view_application(target_application uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.applications a
    join public.jobs j on j.id = a.job_id
    where a.id = target_application
      and (
        a.seeker_id = auth.uid()
        or exists (
          select 1 from public.recruiters r
          where r.user_id = auth.uid() and r.company_id = j.company_id
        )
      )
  )
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger seeker_profiles_set_updated_at before update on public.seeker_profiles
  for each row execute function public.set_updated_at();
create trigger jobs_set_updated_at before update on public.jobs
  for each row execute function public.set_updated_at();
create trigger applications_set_updated_at before update on public.applications
  for each row execute function public.set_updated_at();

-- R1, R9: create the profile (and seeker/recruiter rows) when a user signs up.
-- Expects raw_user_meta_data: { role: 'seeker' | 'recruiter', full_name, company_name? }
create function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  user_role public.user_role := coalesce(
    (new.raw_user_meta_data ->> 'role')::public.user_role, 'seeker'
  );
  company_name text := nullif(trim(new.raw_user_meta_data ->> 'company_name'), '');
  target_company uuid;
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, user_role, coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  if user_role = 'seeker' then
    insert into public.seeker_profiles (user_id) values (new.id);
  else
    if company_name is null then
      raise exception 'company_name is required for recruiter signups';
    end if;

    select id into target_company from public.companies where lower(name) = lower(company_name);
    if target_company is null then
      insert into public.companies (name, slug)
      values (
        company_name,
        trim(both '-' from regexp_replace(lower(company_name), '[^a-z0-9]+', '-', 'g'))
          || '-' || substr(md5(random()::text), 1, 6)
      )
      returning id into target_company;
    end if;

    insert into public.recruiters (user_id, company_id) values (new.id, target_company);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- R13: enforce who may change an application's status, and to what.
create function public.check_application_update()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  if new.job_id <> old.job_id or new.seeker_id <> old.seeker_id then
    raise exception 'job_id and seeker_id are immutable';
  end if;

  -- Service role / direct DB access (auth.uid() is null) is unrestricted.
  if auth.uid() is null or new.status = old.status then
    return new;
  end if;

  if auth.uid() = old.seeker_id then
    if new.status <> 'withdrawn' or old.status in ('rejected', 'withdrawn') then
      raise exception 'Candidates can only withdraw an active application';
    end if;
  elsif new.status = 'withdrawn' then
    raise exception 'Only the candidate can withdraw an application';
  elsif old.status = 'withdrawn' then
    raise exception 'This application was withdrawn by the candidate';
  end if;

  return new;
end;
$$;

create trigger applications_check_update before update on public.applications
  for each row execute function public.check_application_update();

-- R7: only seekers can apply, only to open jobs; snapshot their resume.
create function public.prepare_application()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (select 1 from public.profiles where id = new.seeker_id and role = 'seeker') then
    raise exception 'Only job seekers can apply to jobs';
  end if;
  if not exists (select 1 from public.jobs where id = new.job_id and status = 'open') then
    raise exception 'This job is not accepting applications';
  end if;

  if new.resume_path is null then
    select resume_path into new.resume_path
    from public.seeker_profiles where user_id = new.seeker_id;
  end if;

  return new;
end;
$$;

create trigger applications_prepare before insert on public.applications
  for each row execute function public.prepare_application();

-- R8: timeline of status changes.
create function public.log_application_event()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.application_events (application_id, from_status, to_status, changed_by)
    values (new.id, null, new.status, auth.uid());
  elsif new.status <> old.status then
    insert into public.application_events (application_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger applications_log_event after insert or update on public.applications
  for each row execute function public.log_application_event();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.recruiters enable row level security;
alter table public.seeker_profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.application_events enable row level security;

-- profiles
create policy "Profiles visible to owner and their recruiters"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.can_view_seeker(id));
create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- companies
create policy "Companies are public"
  on public.companies for select to anon, authenticated
  using (true);
create policy "Recruiters update their own company"
  on public.companies for update to authenticated
  using (public.is_company_recruiter(id)) with check (public.is_company_recruiter(id));

-- recruiters
create policy "Recruiters see their own membership"
  on public.recruiters for select to authenticated
  using (user_id = (select auth.uid()));

-- seeker_profiles
create policy "Seeker profiles visible to owner and their recruiters"
  on public.seeker_profiles for select to authenticated
  using (user_id = (select auth.uid()) or public.can_view_seeker(user_id));
create policy "Seekers update their own profile"
  on public.seeker_profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- experiences
create policy "Experiences visible to owner and their recruiters"
  on public.experiences for select to authenticated
  using (user_id = (select auth.uid()) or public.can_view_seeker(user_id));
create policy "Seekers add their own experiences"
  on public.experiences for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Seekers update their own experiences"
  on public.experiences for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Seekers delete their own experiences"
  on public.experiences for delete to authenticated
  using (user_id = (select auth.uid()));

-- jobs
create policy "Open jobs are public"
  on public.jobs for select to anon, authenticated
  using (status = 'open');
create policy "Recruiters see all of their company's jobs"
  on public.jobs for select to authenticated
  using (public.is_company_recruiter(company_id));
create policy "Recruiters post jobs for their company"
  on public.jobs for insert to authenticated
  with check (public.is_company_recruiter(company_id) and recruiter_id = (select auth.uid()));
create policy "Recruiters update their company's jobs"
  on public.jobs for update to authenticated
  using (public.is_company_recruiter(company_id))
  with check (public.is_company_recruiter(company_id));
create policy "Recruiters delete their company's jobs"
  on public.jobs for delete to authenticated
  using (public.is_company_recruiter(company_id));

-- applications
create policy "Seekers see their applications"
  on public.applications for select to authenticated
  using (seeker_id = (select auth.uid()));
create policy "Recruiters see applications to their company's jobs"
  on public.applications for select to authenticated
  using (exists (
    select 1 from public.jobs j
    where j.id = job_id and public.is_company_recruiter(j.company_id)
  ));
create policy "Seekers apply as themselves"
  on public.applications for insert to authenticated
  with check (seeker_id = (select auth.uid()));
create policy "Seekers update their applications"
  on public.applications for update to authenticated
  using (seeker_id = (select auth.uid())) with check (seeker_id = (select auth.uid()));
create policy "Recruiters update applications to their company's jobs"
  on public.applications for update to authenticated
  using (exists (
    select 1 from public.jobs j
    where j.id = job_id and public.is_company_recruiter(j.company_id)
  ));

-- Only `status` is writable after an application is created (transitions checked by trigger).
revoke update on public.applications from anon, authenticated;
grant update (status) on public.applications to authenticated;

-- application_events (written only by trigger)
create policy "Application events follow application visibility"
  on public.application_events for select to authenticated
  using (public.can_view_application(application_id));

-- ---------------------------------------------------------------------------
-- Storage: private resumes bucket (R3)
-- Objects live at `{user_id}/{filename}.pdf`.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880, array['application/pdf'])
on conflict (id) do nothing;

create policy "Seekers read their own resumes"
  on storage.objects for select to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Seekers upload their own resumes"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Seekers replace their own resumes"
  on storage.objects for update to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Seekers delete their own resumes"
  on storage.objects for delete to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Recruiters read resumes of their applicants"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'resumes'
    and public.can_view_seeker(((storage.foldername(name))[1])::uuid)
  );
