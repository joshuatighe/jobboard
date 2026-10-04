-- R10/R11: which columns recruiters may write on `jobs`, and the rules for moving a posting between
-- statuses. RLS still decides which rows (their own company's jobs). Service-role access (seed script)
-- is unaffected by the grants, and the trigger skips it.

-- The company and the posting recruiter come from the signed-in user, so clients never send them.
-- The insert policy still checks both.
alter table public.jobs alter column company_id set default public.my_company_id();
alter table public.jobs alter column recruiter_id set default auth.uid();

-- Recruiters write the posting itself and its status. `company_id` and `recruiter_id` are set above,
-- `created_at` / `updated_at` by the database, and `search` is generated. Without this, a recruiter could
-- backdate a posting so it sorts as newer or older than it is, or reassign it to a colleague.
revoke insert, update on public.jobs from anon, authenticated;
grant insert (
  title, description, location, is_remote, pay_min, pay_max, pay_period,
  experience_level, employment_type, skills, status
) on public.jobs to authenticated;
grant update (
  title, description, location, is_remote, pay_min, pay_max, pay_period,
  experience_level, employment_type, skills, status
) on public.jobs to authenticated;

-- Only drafts can be deleted. Deleting a published job would cascade to its applications and erase them
-- from every applicant's tracker; close it instead. Drafts never have applications (see below).
drop policy "Recruiters delete their company's jobs" on public.jobs;
create policy "Recruiters delete their company's draft jobs"
  on public.jobs for delete to authenticated
  using (public.is_company_recruiter(company_id) and status = 'draft');

-- Security definer so the applications check sees every application, whatever the caller's RLS.
create function public.check_job_status()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  -- Service role / direct DB access (auth.uid() is null) is unrestricted, like check_application_update.
  if auth.uid() is null then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.status = 'closed' then
      raise exception 'A new posting starts as a draft or open';
    end if;
    return new;
  end if;

  if new.status = old.status then
    return new;
  end if;

  -- Applicants can't see drafts, so a posting with applications can't go back to draft: their tracker
  -- would lose it. Close it instead.
  if new.status = 'draft' and exists (select 1 from public.applications where job_id = old.id) then
    raise exception 'This posting has applicants, so it can''t go back to draft. Close it instead.';
  end if;

  -- A draft's "posted" date is when it's published, not when the draft was started.
  if old.status = 'draft' and new.status = 'open' then
    new.created_at := now();
  end if;

  return new;
end;
$$;

-- Named to sort before `jobs_set_updated_at`; both are BEFORE triggers and they don't interact.
create trigger jobs_check_status before insert or update on public.jobs
  for each row execute function public.check_job_status();
