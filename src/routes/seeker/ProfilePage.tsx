import { TriangleAlert } from 'lucide-react'

import { EmptyState } from '@/components/layout/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { SetupNotice } from '@/components/layout/SetupNotice'
import { AboutForm } from '@/components/profile/AboutForm'
import { ExperienceSection } from '@/components/profile/ExperienceSection'
import { PreferencesForm } from '@/components/profile/PreferencesForm'
import { ProfilePageSkeleton } from '@/components/profile/ProfilePageSkeleton'
import { ProfileStrength } from '@/components/profile/ProfileStrength'
import { ResumeCard } from '@/components/profile/ResumeCard'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { profileSteps } from '@/lib/profile'
import { useExperiences, useSeekerProfile } from '@/lib/queries/seekers'
import { isSupabaseConfigured } from '@/lib/supabase'

/** R2 profile, experience and preferences; R3 resume. */
export function ProfilePage() {
  const { profile } = useAuth()
  const seeker = useSeekerProfile(profile?.id)
  const experiences = useExperiences(profile?.id)

  const header = (
    <PageHeader
      title="Profile"
      description="Your experience, skills, resume and job preferences."
    />
  )

  if (!isSupabaseConfigured) return <SetupNotice />
  if (!profile || seeker.isPending) {
    return (
      <>
        {header}
        <ProfilePageSkeleton />
      </>
    )
  }

  if (seeker.isError || !seeker.data) {
    return (
      <>
        {header}
        <EmptyState
          tone="error"
          icon={TriangleAlert}
          title="We couldn't load your profile"
          description="Check your connection and try again."
          action={<Button onClick={() => void seeker.refetch()}>Try again</Button>}
        />
      </>
    )
  }

  const steps = profileSteps(seeker.data, experiences.data?.length ?? 0)

  return (
    <>
      {header}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-6">
          <AboutForm profile={profile} seeker={seeker.data} />
          <ExperienceSection userId={profile.id} />
          <PreferencesForm seeker={seeker.data} />
        </div>
        <aside className="order-first grid gap-6 lg:sticky lg:top-20 lg:order-none">
          <ResumeCard seeker={seeker.data} />
          {experiences.isSuccess && <ProfileStrength steps={steps} />}
        </aside>
      </div>
    </>
  )
}
