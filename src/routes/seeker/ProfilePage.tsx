import { UserRound } from 'lucide-react'

import { ComingSoon } from '@/components/layout/ComingSoon'
import { PageHeader } from '@/components/layout/PageHeader'

export function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Your experience, skills, resume and job preferences." />
      <ComingSoon
        icon={UserRound}
        title="Profile is on the way"
        description="Edit your profile, upload your resume and set the preferences that power your feed."
        requirements={['R2', 'R3']}
      />
    </>
  )
}
