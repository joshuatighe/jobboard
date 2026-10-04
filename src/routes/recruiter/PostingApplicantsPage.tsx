import { KanbanSquare } from 'lucide-react'

import { ComingSoon } from '@/components/layout/ComingSoon'
import { PageHeader } from '@/components/layout/PageHeader'

export function PostingApplicantsPage() {
  return (
    <>
      <PageHeader title="Applicants" description="Review candidates and move them through your pipeline." />
      <ComingSoon
        icon={KanbanSquare}
        title="Applicants is on the way"
        description="A pipeline board with every applicant's profile, resume and cover note."
        requirements={['R12', 'R13']}
      />
    </>
  )
}
