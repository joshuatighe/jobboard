import { SquarePen } from 'lucide-react'

import { ComingSoon } from '@/components/layout/ComingSoon'
import { PageHeader } from '@/components/layout/PageHeader'

export function PostingEditorPage() {
  return (
    <>
      <PageHeader title="Post a job" description="Describe the role. You can save it as a draft or publish it right away." />
      <ComingSoon
        icon={SquarePen}
        title="Post a job is on the way"
        description="Create and edit postings with pay, location, level, type and description."
        requirements={['R10']}
      />
    </>
  )
}
