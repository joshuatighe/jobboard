import { Search } from 'lucide-react'

import { ComingSoon } from '@/components/layout/ComingSoon'
import { PageHeader } from '@/components/layout/PageHeader'

export function JobSearchPage() {
  return (
    <>
      <PageHeader title="Find your next role" description="Search open jobs and filter by pay, location and experience level." />
      <ComingSoon
        icon={Search}
        title="Find your next role is on the way"
        description="Keyword search with filters for pay, location, remote and experience level."
        requirements={['R4', 'R5']}
      />
    </>
  )
}
