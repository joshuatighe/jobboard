import { Inbox } from 'lucide-react'

import { ComingSoon } from '@/components/layout/ComingSoon'
import { PageHeader } from '@/components/layout/PageHeader'

export function ApplicationsPage() {
  return (
    <>
      <PageHeader title="Applications" description="Every job you've applied to and where it stands." />
      <ComingSoon
        icon={Inbox}
        title="Applications is on the way"
        description="Track the status and timeline of every application in one place."
        requirements={['R8']}
      />
    </>
  )
}
