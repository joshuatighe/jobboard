import { ArrowLeft, Search, WarningAlt } from '@carbon/icons-react'
import { Link, useParams } from 'react-router'

import { EmptyState } from '@/components/layout/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { SetupNotice } from '@/components/layout/SetupNotice'
import { PostingDates } from '@/components/postings/PostingDates'
import { PostingForm } from '@/components/postings/PostingForm'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useMyCompany, usePosting } from '@/lib/queries/postings'
import { isSupabaseConfigured } from '@/lib/supabase'

function BackLink() {
  return (
    <Link
      to="/dashboard"
      className="mb-6 inline-flex items-center gap-1.5 meta text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ArrowLeft className="size-3.5" /> All postings
    </Link>
  )
}

function EditorSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading posting" className="grid items-start gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="grid gap-6">
        <Skeleton className="h-52" />
        <Skeleton className="h-72" />
        <Skeleton className="h-96" />
      </div>
      <Skeleton className="h-48" />
    </div>
  )
}

/** R10: `/postings/new` creates a posting; `/postings/:jobId/edit` edits one of the company's. */
export function PostingEditorPage() {
  const { jobId } = useParams()
  const { profile } = useAuth()
  const company = useMyCompany(profile?.id)
  const companyId = company.data?.id
  const posting = usePosting(companyId, jobId)
  const isNew = !jobId

  if (!isSupabaseConfigured) return <SetupNotice />

  const loading = company.isPending || (!isNew && Boolean(companyId) && posting.isPending)
  const failed = company.isError || (!isNew && posting.isError)

  let body
  if (loading) {
    body = <EditorSkeleton />
  } else if (failed || !companyId) {
    body = (
      <EmptyState
        tone="error"
        icon={WarningAlt}
        title={companyId || failed ? "We couldn't load this posting" : "Your account isn't linked to a company"}
        description={companyId || failed ? 'Check your connection and try again.' : 'Recruiter accounts belong to a company.'}
        action={
          failed ? (
            <Button onClick={() => void (company.isError ? company.refetch() : posting.refetch())}>Try again</Button>
          ) : undefined
        }
      />
    )
  } else if (!isNew && !posting.data) {
    body = (
      <EmptyState
        icon={Search}
        title="Posting not found"
        description="It may have been deleted, or it belongs to another company."
        action={
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to postings</Link>
          </Button>
        }
      />
    )
  } else {
    // Keyed so switching between postings starts a fresh form.
    body = <PostingForm key={posting.data?.id ?? 'new'} companyId={companyId} posting={posting.data ?? undefined} />
  }

  const existing = posting.data
  return (
    <>
      <BackLink />
      <PageHeader
        title={isNew ? 'Post a job' : existing ? 'Edit posting' : 'Posting'}
        description={
          isNew ? (
            'Describe the role. Save it as a draft or publish it right away.'
          ) : existing ? (
            <>
              <span className="font-medium text-foreground">{existing.title}</span>
              <span aria-hidden className="hidden sm:inline"> · </span>
              <PostingDates posting={existing} className="flex text-sm sm:inline-flex" />
            </>
          ) : undefined
        }
      />
      {body}
    </>
  )
}
