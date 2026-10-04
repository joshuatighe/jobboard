import { BriefcaseBusiness } from 'lucide-react'

import { ComingSoon } from '@/components/layout/ComingSoon'
import { PageHeader } from '@/components/layout/PageHeader'

export function JobDetailPage() {
  return (
    <>
      <PageHeader title="Job details" description="Everything about the role, and one click to apply." />
      <ComingSoon
        icon={BriefcaseBusiness}
        title="Job details is on the way"
        description="The full posting with company info and a one-click apply flow."
        requirements={['R7']}
      />
    </>
  )
}
