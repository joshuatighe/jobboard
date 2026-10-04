-- R8: applicants keep seeing the jobs they applied to after those jobs close.
--
-- "Open jobs are public" hides closed jobs from seekers, so their application tracker lost the
-- title and company of any role that closed after they applied (often the ones with an offer or a
-- rejection). Drafts stay hidden: a seeker only ever applied to an open role.

-- Security definer so the policy can read applications without recursing through the
-- applications policies (which themselves read jobs).
create function public.has_applied_to_job(target_job uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.applications
    where job_id = target_job and seeker_id = auth.uid()
  )
$$;

create policy "Applicants see closed jobs they applied to"
  on public.jobs for select to authenticated
  using (status = 'closed' and public.has_applied_to_job(id));
