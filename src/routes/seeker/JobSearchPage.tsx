import { useEffect, useRef, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { JobFiltersPanel } from '@/components/jobs/JobFiltersPanel'
import { JobResults } from '@/components/jobs/JobResults'
import { PageHeader } from '@/components/layout/PageHeader'
import { SetupNotice } from '@/components/layout/SetupNotice'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  activeFilterCount,
  EMPTY_FILTERS,
  filtersToParams,
  parseFilters,
  type JobFilters,
} from '@/lib/job-filters'
import { isSupabaseConfigured } from '@/lib/supabase'

/** How long typing has to pause before the keyword or location reaches the URL (and the query). */
const TYPING_DELAY = 250

type Text = Pick<JobFilters, 'q' | 'location'>

/** R4 keyword search + R5 filters. The URL is the source of truth, so searches are shareable. */
export function JobSearchPage() {
  const [params, setParams] = useSearchParams()
  const filters = parseFilters(params)

  // The text inputs update instantly and reach the URL once typing pauses.
  const [text, setText] = useState<Text>({ q: filters.q, location: filters.location })
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(typingTimer.current), [])

  /** Merges into the latest URL, so a delayed text update never undoes a newer filter change. */
  const commit = (patch: Partial<JobFilters>) =>
    setParams((prev) => filtersToParams({ ...parseFilters(prev), ...patch }), { replace: true })

  const changeText = (patch: Partial<Text>) => {
    const next = { ...text, ...patch }
    setText(next)
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(
      () => commit({ q: next.q.trim(), location: next.location.trim() }),
      TYPING_DELAY,
    )
  }

  // Back/forward navigation changes the URL under us: bring the inputs along. Our own commits
  // already match the inputs, so they're left alone.
  const paramsKey = params.toString()
  const [syncedKey, setSyncedKey] = useState(paramsKey)
  if (syncedKey !== paramsKey) {
    setSyncedKey(paramsKey)
    if (filters.q !== text.q.trim() || filters.location !== text.location.trim()) {
      setText({ q: filters.q, location: filters.location })
    }
  }

  const onChange = (patch: Partial<JobFilters>) => {
    const { location, ...rest } = patch
    if (location !== undefined) changeText({ location })
    if (Object.keys(rest).length) commit(rest)
  }

  const clearFilters = () => {
    clearTimeout(typingTimer.current)
    setText((t) => ({ ...t, location: '' }))
    commit({ ...EMPTY_FILTERS, q: text.q.trim() })
  }

  const clearAll = () => {
    clearTimeout(typingTimer.current)
    setText({ q: '', location: '' })
    commit(EMPTY_FILTERS)
  }

  const panelFilters = { ...filters, location: text.location }
  const filterCount = activeFilterCount(panelFilters)

  return (
    <>
      <PageHeader
        title="Find your next role"
        description="Search open jobs and filter by pay, location and experience level."
      />

      {!isSupabaseConfigured ? (
        <SetupNotice />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24">
              <JobFiltersPanel filters={panelFilters} onChange={onChange} onClear={clearFilters} />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  aria-label="Search jobs"
                  value={text.q}
                  onChange={(event) => changeText({ q: event.target.value })}
                  placeholder="Search by title, skill or keyword"
                  className="h-11 rounded-lg bg-card pr-10 pl-10 text-base shadow-xs md:text-sm [&::-webkit-search-cancel-button]:hidden"
                />
                {text.q && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Clear search"
                    onClick={() => changeText({ q: '' })}
                    className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
                  >
                    <X />
                  </Button>
                )}
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-11 rounded-lg bg-card lg:hidden">
                    <SlidersHorizontal />
                    <span className="sr-only sm:not-sr-only">Filters</span>
                    {filterCount > 0 && (
                      <Badge variant="brand" className="tabular-nums">
                        {filterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full overflow-y-auto sm:max-w-sm">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Results update as you go.</SheetDescription>
                  </SheetHeader>
                  <div className="px-4 pb-6">
                    <JobFiltersPanel
                      idPrefix="sheet-filters"
                      filters={panelFilters}
                      onChange={onChange}
                      onClear={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <JobResults filters={filters} onClearAll={clearAll} />
          </div>
        </div>
      )}
    </>
  )
}
