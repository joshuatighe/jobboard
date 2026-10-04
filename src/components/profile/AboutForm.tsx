import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { FormFooter } from '@/components/profile/FormFooter'
import { ProfileSection } from '@/components/profile/ProfileSection'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { TagInput } from '@/components/ui/tag-input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useUpdateSeekerProfile } from '@/lib/queries/seekers'
import type { Profile, SeekerProfile } from '@/lib/types'

const BIO_MAX = 2000

const schema = z.object({
  fullName: z.string().trim().min(2, 'Enter your name').max(80, 'Keep it under 80 characters'),
  headline: z.string().trim().max(120, 'Keep it under 120 characters'),
  location: z.string().trim().max(80, 'Keep it under 80 characters'),
  bio: z.string().trim().max(BIO_MAX, `Keep it under ${BIO_MAX.toLocaleString('en-US')} characters`),
  skills: z.array(z.string()).max(30, 'Up to 30 skills'),
})

type Values = z.infer<typeof schema>

const toValues = (profile: Profile, seeker: SeekerProfile): Values => ({
  fullName: profile.full_name,
  headline: seeker.headline ?? '',
  location: seeker.location ?? '',
  bio: seeker.bio ?? '',
  skills: seeker.skills,
})

/** R2: who you are. Name lives on `profiles`, the rest on `seeker_profiles`. */
export function AboutForm({ profile, seeker }: { profile: Profile; seeker: SeekerProfile }) {
  const { refreshProfile } = useAuth()
  const save = useUpdateSeekerProfile(seeker.user_id)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: toValues(profile, seeker) })

  async function onSubmit(values: Values) {
    try {
      const updated = await save.mutateAsync({
        fullName: dirtyFields.fullName ? values.fullName : undefined,
        patch: {
          headline: values.headline || null,
          location: values.location || null,
          bio: values.bio || null,
          skills: values.skills,
        },
      })
      if (dirtyFields.fullName) await refreshProfile()
      reset({ ...toValues(profile, updated), fullName: values.fullName })
      toast.success('Profile saved')
    } catch (error) {
      toast.error("Couldn't save your profile", {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  return (
    <ProfileSection
      id="about"
      title="About you"
      description="What recruiters see first when you apply."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
        <div className="grid items-start gap-5 sm:grid-cols-2">
          <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
            <Input
              id="fullName"
              autoComplete="name"
              aria-invalid={!!errors.fullName}
              {...register('fullName')}
            />
          </FormField>
          <FormField id="location" label="Location" error={errors.location?.message}>
            <Input
              id="location"
              autoComplete="address-level2"
              placeholder="Brooklyn, NY"
              aria-invalid={!!errors.location}
              {...register('location')}
            />
          </FormField>
        </div>
        <FormField id="headline" label="Headline" error={errors.headline?.message}>
          <Input
            id="headline"
            placeholder="Frontend engineer who loves design systems"
            aria-invalid={!!errors.headline}
            {...register('headline')}
          />
        </FormField>
        <FormField id="bio" label="Bio" error={errors.bio?.message}>
          <Textarea
            id="bio"
            rows={5}
            placeholder="A few sentences about what you've built and what you want to work on next."
            aria-invalid={!!errors.bio}
            className="max-h-80 min-h-28"
            {...register('bio')}
          />
        </FormField>
        <FormField
          id="skills"
          label="Skills"
          error={errors.skills?.message}
          hint={<span className="text-xs text-muted-foreground">Press Enter or comma to add</span>}
        >
          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <TagInput
                id="skills"
                value={field.value}
                onChange={field.onChange}
                placeholder="React, TypeScript, Figma…"
                aria-invalid={!!errors.skills}
              />
            )}
          />
        </FormField>
        <FormFooter isDirty={isDirty} isSubmitting={isSubmitting} onDiscard={() => reset()} />
      </form>
    </ProfileSection>
  )
}
