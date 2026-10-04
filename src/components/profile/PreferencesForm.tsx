import { zodResolver } from '@hookform/resolvers/zod'
import { Checkmark } from '@carbon/icons-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { FormFooter } from '@/components/profile/FormFooter'
import { ProfileSection } from '@/components/profile/ProfileSection'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { TagInput } from '@/components/ui/tag-input'
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, HOURS_PER_YEAR } from '@/lib/constants'
import { useUpdateSeekerProfile } from '@/lib/queries/seekers'
import type { EmploymentType, ExperienceLevel, SeekerProfile } from '@/lib/types'
import { cn } from '@/lib/utils'

const ANY_LEVEL = 'any'

const schema = z.object({
  locations: z.array(z.string()).max(10, 'Up to 10 locations'),
  remote: z.boolean(),
  minPay: z
    .number({ error: 'Enter a whole number' })
    .int('Enter a whole number')
    .min(0, "Pay can't be negative")
    .max(5_000_000, 'That seems high. Enter an annual amount.')
    .nullable(),
  level: z.enum(EXPERIENCE_LEVELS.map((l) => l.value) as [ExperienceLevel, ...ExperienceLevel[]]).nullable(),
  types: z.array(z.enum(EMPLOYMENT_TYPES.map((t) => t.value) as [EmploymentType, ...EmploymentType[]])),
})

type Values = z.infer<typeof schema>

const toValues = (seeker: SeekerProfile): Values => ({
  locations: seeker.pref_locations,
  remote: seeker.pref_remote,
  minPay: seeker.pref_min_pay,
  level: seeker.pref_experience_level,
  types: seeker.pref_employment_types,
})

/** R2 preferences. These drive the For-you ranking (R6). */
export function PreferencesForm({ seeker }: { seeker: SeekerProfile }) {
  const save = useUpdateSeekerProfile(seeker.user_id)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: toValues(seeker) })

  async function onSubmit(values: Values) {
    try {
      const updated = await save.mutateAsync({
        patch: {
          pref_locations: values.locations,
          pref_remote: values.remote,
          pref_min_pay: values.minPay,
          pref_experience_level: values.level,
          pref_employment_types: values.types,
        },
      })
      reset(toValues(updated))
      toast.success('Preferences saved', { description: 'Your For-you feed now reflects them.' })
    } catch (error) {
      toast.error("Couldn't save your preferences", {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  return (
    <ProfileSection
      id="preferences"
      title="Job preferences"
      description="We use these to rank your For-you feed. Recruiters don't see them."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
        <FormField
          id="pref-locations"
          label="Where do you want to work?"
          error={errors.locations?.message}
        >
          <Controller
            control={control}
            name="locations"
            render={({ field }) => (
              <TagInput
                id="pref-locations"
                value={field.value}
                onChange={field.onChange}
                maxTags={10}
                placeholder="San Francisco, CA · New York, NY"
                aria-invalid={!!errors.locations}
              />
            )}
          />
        </FormField>

        <Controller
          control={control}
          name="remote"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 border px-3 py-2.5">
              <div className="grid gap-0.5">
                <Label htmlFor="pref-remote">Open to remote roles</Label>
                <p id="pref-remote-hint" className="text-xs text-muted-foreground">
                  Remote jobs match wherever you are.
                </p>
              </div>
              <Switch
                id="pref-remote"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-describedby="pref-remote-hint"
              />
            </div>
          )}
        />

        <div className="grid items-start gap-5 sm:grid-cols-2">
          <FormField id="pref-min-pay" label="Minimum pay" error={errors.minPay?.message}>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="pref-min-pay"
                type="number"
                inputMode="numeric"
                min={0}
                step={5000}
                placeholder="120000"
                className="pr-16 pl-7 tabular-nums"
                aria-invalid={!!errors.minPay}
                aria-describedby="pref-min-pay-hint"
                {...register('minPay', {
                  setValueAs: (v: string) => (v === '' || v == null ? null : Number(v)),
                })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                / year
              </span>
            </div>
            <p id="pref-min-pay-hint" className="text-xs text-muted-foreground">
              Hourly roles count at {HOURS_PER_YEAR.toLocaleString('en-US')} hours a year.
            </p>
          </FormField>

          <FormField id="pref-level" label="Experience level">
            <Controller
              control={control}
              name="level"
              render={({ field }) => (
                <Select
                  value={field.value ?? ANY_LEVEL}
                  onValueChange={(v) => field.onChange(v === ANY_LEVEL ? null : v)}
                >
                  <SelectTrigger id="pref-level" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY_LEVEL}>Any level</SelectItem>
                    {EXPERIENCE_LEVELS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>

        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-medium">Employment type</legend>
          <Controller
            control={control}
            name="types"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_TYPES.map((type) => {
                  const checked = field.value.includes(type.value)
                  return (
                    <button
                      key={type.value}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() =>
                        field.onChange(
                          checked
                            ? field.value.filter((t) => t !== type.value)
                            : [...field.value, type.value],
                        )
                      }
                      className={cn(
                        'inline-flex h-8 cursor-pointer items-center gap-1.5 border px-3 text-sm transition-colors duration-150 outline-none hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        checked
                          ? 'border-foreground bg-foreground text-background hover:bg-foreground/90'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {checked && <Checkmark className="size-3.5" />}
                      {type.label}
                    </button>
                  )
                })}
              </div>
            )}
          />
          <p className="text-xs text-muted-foreground">Leave all unselected to see every type.</p>
        </fieldset>

        <FormFooter isDirty={isDirty} isSubmitting={isSubmitting} onDiscard={() => reset()} />
      </form>
    </ProfileSection>
  )
}
