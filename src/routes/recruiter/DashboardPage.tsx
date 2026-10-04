import { useState } from 'react'
import { BriefcaseBusiness, FilePlus2, Plus, TriangleAlert } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'

import { EmptyState } from '@/components/layout/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { SetupNotice } from '@/components/layout/SetupNotice'
import { ConfirmPostingAction, type ConfirmableAction } from '@/components/postings/ConfirmPostingAction'
import { PostingCard } from '@/components/postings/PostingCard'
import { PostingsSummary } from '@/components/postings/PostingsSummary'
import { PostingsTable } from '@/components/postings/PostingsTable'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'
import { usePostingAction } from '@/hooks/usePostingAction'
import type { Posting } from '@/lib/api/postings'
import {
  countApplicants,
  countPostingTabs,
  parsePostingTab,
  POSTING_TABS,
  sortPostings,
  type PostingAction,
  type PostingTab,
} from '@/lib/postings'
import { useCompanyPostings, useMyCompany } from '@/lib/queries/postings'
import { isSupabaseConfigured } from '@/lib/supabase'

const TAB_LABELS: Record<PostingTab, string> = { all: 'All', open: 'Open', draft: 'Drafts', closed: 'Closed' }

const EMPTY_TAB: Record<Exclude<PostingTab, 'all'>, { title: string; description: string }> = {
  open: { title: 'Nothing open right now', description: 'Publish a draft or reopen a closed posting to start hiring.' },
  draft: { title: 'No drafts', description: 'Postings you save without publishing wait here.' },
  closed: { title: 'Nothing closed', description: "Postings you close stop taking applications and land here." },
}

/** R11: every posting at the recruiter's company, with applicant counts and quick actions. */
export function DashboardPage() {
  const { profile } = useAuth()
  const company = useMyCompany(profile?.id)
  const companyId = company.data?.id
  const postings = useCompanyPostings(companyId)
  const [params, setParams] = useSearchParams()
  const tab = parsePostingTab(params.get('status'))
  const { perform, isPending } = usePostingAction(companyId ?? '')
  // Kept after closing so the dialog doesn't go blank while it animates out.
  const [confirming, setConfirming] = useState<{ posting: Posting; action: ConfirmableAction }>()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const header = (
    <PageHeader
      title="Postings"
      description={
        company.data ? `Every ${company.data.name} job, and who's applied.` : 'Your company’s jobs and who’s applied.'
      }
      actions={
        <Button asChild>
          <Link to="/postings/new">
            <Plus /> Post a job
          </Link>
        </Button>
      }
    />
  )

  if (!isSupabaseConfigured) return <SetupNotice />

  if (company.isPending || (companyId && postings.isPending)) {
    return (
      <>
        {header}
        <div aria-busy="true" aria-label="Loading postings" className="space-y-6">
          <Skeleton className="h-[104px]" />
          <Skeleton className="h-10 w-full sm:w-80" />
          <div className="divide-y border-b">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-6 py-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="hidden h-4 w-14 md:block" />
                <Skeleton className="hidden h-9 w-28 md:block" />
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  if (!companyId || !postings.isSuccess) {
    const noCompany = company.isSuccess && !companyId
    return (
      <>
        {header}
        <EmptyState
          tone="error"
          icon={TriangleAlert}
          title={noCompany ? "Your account isn't linked to a company" : "We couldn't load your postings"}
          description={
            noCompany
              ? 'Recruiter accounts belong to a company. Sign up again with your company name.'
              : 'Check your connection and try again.'
          }
          action={
            noCompany ? undefined : (
              <Button onClick={() => void (company.isError ? company.refetch() : postings.refetch())}>
                Try again
              </Button>
            )
          }
        />
      </>
    )
  }

  if (postings.data.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={BriefcaseBusiness}
          title="Post your first job"
          description="Describe the role, set the pay and publish it. Applicants show up here as they apply."
          action={
            <Button asChild>
              <Link to="/postings/new">
                <FilePlus2 /> Post a job
              </Link>
            </Button>
          }
        />
      </>
    )
  }

  const all = sortPostings(postings.data)
  const counts = countPostingTabs(all)
  const visible = all.filter((posting) => tab === 'all' || posting.status === tab)
  const applicants = countApplicants(all.flatMap((posting) => posting.applications))

  function handleAction(posting: Posting, action: PostingAction) {
    if (action === 'close' || action === 'delete') {
      setConfirming({ posting, action })
      setConfirmOpen(true)
    } else if (!isPending) {
      void perform(posting, action)
    }
  }

  const changeTab = (value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === 'all') next.delete('status')
        else next.set('status', value)
        return next
      },
      { replace: true },
    )

  return (
    <>
      {header}
      <div className="space-y-6">
        <PostingsSummary
          open={counts.open}
          applicants={applicants.total}
          awaitingReview={applicants.applied}
          interviewing={applicants.interviewing}
        />

        <Tabs value={tab} onValueChange={changeTab} className="gap-0">
          <TabsList className="w-full gap-6 sm:w-fit" aria-label="Filter postings by status">
            {POSTING_TABS.map((value) => (
              <TabsTrigger key={value} value={value}>
                {TAB_LABELS[value]}
                <span className="meta text-muted-foreground">{counts[value]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={tab}>
            {visible.length === 0 && tab !== 'all' ? (
              <EmptyState icon={BriefcaseBusiness} {...EMPTY_TAB[tab]} className="border-b py-12" />
            ) : (
              <>
                <div className="hidden md:block">
                  <PostingsTable postings={visible} onAction={handleAction} />
                </div>
                <ul className="divide-y border-b md:hidden">
                  {visible.map((posting) => (
                    <li key={posting.id}>
                      <PostingCard posting={posting} onAction={(action) => handleAction(posting, action)} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmPostingAction
        companyId={companyId}
        posting={confirming?.posting}
        action={confirming?.action}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
      />
    </>
  )
}
