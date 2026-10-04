import { LayoutDashboard } from 'lucide-react'

import { ComingSoon } from '@/components/layout/ComingSoon'
import { PageHeader } from '@/components/layout/PageHeader'

export function DashboardPage() {
  return (
    <>
      <PageHeader title="Postings" description="Manage your company's jobs and applicants." />
      <ComingSoon
        icon={LayoutDashboard}
        title="Postings is on the way"
        description="All your postings with status and live applicant counts."
        requirements={['R11']}
      />
    </>
  )
}
