import { Sparkles } from 'lucide-react'

import { ComingSoon } from '@/components/layout/ComingSoon'
import { PageHeader } from '@/components/layout/PageHeader'

export function ForYouPage() {
  return (
    <>
      <PageHeader title="For you" description="Jobs ranked by how well they match your profile." />
      <ComingSoon
        icon={Sparkles}
        title="For you is on the way"
        description="A personalized feed ranked by your level, pay, location, job type and skills."
        requirements={['R6']}
      />
    </>
  )
}
