import { useState } from 'react'
import { Recommend, Search, Task, WarningAlt } from '@carbon/icons-react'
import { Link, useSearchParams } from 'react-router'

import { ApplicationRow } from '@/components/applications/ApplicationRow'
import { ApplicationRowSkeleton } from '@/components/applications/ApplicationRowSkeleton'
import { ApplicationSheet } from '@/components/applications/ApplicationSheet'
import { ApplicationsSummary } from '@/components/applications/ApplicationsSummary'
import { EmptyState } from '@/components/layout/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { SetupNotice } from '@/components/layout/SetupNotice'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'
import {
  APPLICATION_GROUPS,
  countByTab,
  inTab,
  parseTrackerTab,
  sortByActivity,
  TRACKER_TABS,
  type TrackerTab,
} from '@/lib/applications'
import { useMyApplications } from '@/lib/queries/applications'
import { isSupabaseConfigured } from '@/lib/supabase'

const TAB_LABELS: Record<TrackerTab, string> = {
  all: 'All',
  active: APPLICATION_GROUPS.active.label,
  offers: APPLICATION_GROUPS.offers.label,
  closed: APPLICATION_GROUPS.closed.label,
}

const EMPTY_TAB: Record<Exclude<TrackerTab, 'all'>, { title: string; description: string }> = {
  active: {
    title: 'Nothing in progress',
    description: 'Applications waiting on a recruiter or in interviews show up here.',
  },
  offers: {
    title: 'No offers yet',
    description: "When a team makes you an offer, it'll land here. Keep going.",
  },
  closed: {
    title: 'Nothing closed',
    description: 'Applications that were declined or that you withdrew show up here.',
  },
}

/** R8: every application the seeker has sent, where it stands, and how it got there. */
export function ApplicationsPage() {
  const { profile } = useAuth()
  const seekerId = profile?.id
  const applications = useMyApplications(seekerId)
  const [params, setParams] = useSearchParams()
  const tab = parseTrackerTab(params.get('tab'))
  // Kept after closing so the sheet doesn't go blank while it animates out.
  const [selectedId, setSelectedId] = useState<string>()
  const [sheetOpen, setSheetOpen] = useState(false)

  const header = (
    <PageHeader
      title="Applications"
      description="Every job you've applied to and where it stands."
      actions={
        <Button asChild variant="outline">
          <Link to="/jobs">
            <Search /> Find more jobs
          </Link>
        </Button>
      }
    />
  )

  if (!isSupabaseConfigured) return <SetupNotice />

  if (!seekerId || applications.isPending) {
    return (
      <>
        {header}
        <div aria-busy="true" aria-label="Loading applications" className="space-y-6">
          <Skeleton className="h-[104px]" />
          <Skeleton className="h-10 w-full sm:w-80" />
          <div className="divide-y border-y">
            {[0, 1, 2].map((i) => (
              <ApplicationRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </>
    )
  }

  if (applications.isError) {
    return (
      <>
        {header}
        <EmptyState
          tone="error"
          icon={WarningAlt}
          title="We couldn't load your applications"
          description="Check your connection and try again."
          action={<Button onClick={() => void applications.refetch()}>Try again</Button>}
        />
      </>
    )
  }

  if (applications.data.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={Task}
          title="No applications yet"
          description="When you apply to a job, you'll be able to follow it from first look to offer right here."
          action={
            <>
              <Button asChild>
                <Link to="/jobs">
                  <Search /> Search jobs
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/for-you">
                  <Recommend /> See your matches
                </Link>
              </Button>
            </>
          }
        />
      </>
    )
  }

  const all = sortByActivity(applications.data)
  const counts = countByTab(all)
  const visible = all.filter((application) => inTab(application.status, tab))
  const selected = all.find((application) => application.id === selectedId)

  const changeTab = (value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === 'all') next.delete('tab')
        else next.set('tab', value)
        return next
      },
      { replace: true },
    )

  return (
    <>
      {header}
      <div className="space-y-6">
        <ApplicationsSummary applications={all} />

        <Tabs value={tab} onValueChange={changeTab} className="gap-0">
          <TabsList className="w-full gap-6 sm:w-fit" aria-label="Filter applications by status">
            {TRACKER_TABS.map((value) => (
              <TabsTrigger key={value} value={value}>
                {TAB_LABELS[value]}
                <span className="meta text-muted-foreground">{counts[value]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={tab}>
            {visible.length === 0 && tab !== 'all' ? (
              <EmptyState icon={Task} {...EMPTY_TAB[tab]} className="border-b py-12" />
            ) : (
              <ul className="divide-y border-b">
                {visible.map((application) => (
                  <ApplicationRow
                    key={application.id}
                    application={application}
                    onOpen={() => {
                      setSelectedId(application.id)
                      setSheetOpen(true)
                    }}
                  />
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ApplicationSheet
        application={selected}
        seekerId={seekerId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
