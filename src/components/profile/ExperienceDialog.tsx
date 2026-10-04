import { zodResolver } from '@hookform/resolvers/zod'
import { CircleDash } from '@carbon/icons-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { MonthPicker } from '@/components/ui/month-picker'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { monthToDate, toMonthValue } from '@/lib/profile'
import { useSaveExperience } from '@/lib/queries/seekers'
import type { Experience } from '@/lib/types'

const DESCRIPTION_MAX = 2000

const schema = z
  .object({
    title: z.string().trim().min(1, 'Enter your title').max(100, 'Keep it under 100 characters'),
    company: z.string().trim().min(1, 'Enter the company').max(100, 'Keep it under 100 characters'),
    location: z.string().trim().max(80, 'Keep it under 80 characters'),
    start: z.string().regex(/^\d{4}-\d{2}$/, 'Pick a month and year'),
    current: z.boolean(),
    end: z.string(),
    description: z
      .string()
      .trim()
      .max(DESCRIPTION_MAX, `Keep it under ${DESCRIPTION_MAX.toLocaleString('en-US')} characters`),
  })
  .superRefine((v, ctx) => {
    if (v.current) return
    if (!/^\d{4}-\d{2}$/.test(v.end)) {
      ctx.addIssue({ code: 'custom', path: ['end'], message: 'Pick a month and year, or mark this as your current role' })
    } else if (v.end < v.start) {
      ctx.addIssue({ code: 'custom', path: ['end'], message: "End date can't be before the start date" })
    }
  })

type Values = z.infer<typeof schema>

const toValues = (experience?: Experience): Values => ({
  title: experience?.title ?? '',
  company: experience?.company ?? '',
  location: experience?.location ?? '',
  start: toMonthValue(experience?.start_date),
  current: experience ? experience.end_date === null : false,
  end: toMonthValue(experience?.end_date),
  description: experience?.description ?? '',
})

/** R2: add or edit a work-history entry. Mount it fresh for each entry (key it by id). */
export function ExperienceDialog({
  userId,
  experience,
  open,
  onOpenChange,
}: {
  userId: string
  /** The entry to edit. Omit to add a new one. */
  experience?: Experience
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const save = useSaveExperience(userId)
  const editing = Boolean(experience)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: toValues(experience) })
  const current = useWatch({ control, name: 'current' })

  async function onSubmit(values: Values) {
    try {
      await save.mutateAsync({
        id: experience?.id,
        input: {
          title: values.title,
          company: values.company,
          location: values.location || null,
          start_date: monthToDate(values.start),
          end_date: values.current ? null : monthToDate(values.end),
          description: values.description || null,
        },
      })
      onOpenChange(false)
      toast.success(editing ? 'Experience updated' : 'Experience added')
    } catch (error) {
      toast.error("Couldn't save this role", {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit experience' : 'Add experience'}</DialogTitle>
          <DialogDescription>Recruiters you apply to see your work history.</DialogDescription>
        </DialogHeader>

        <form id="experience-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <FormField id="exp-title" label="Title" error={errors.title?.message}>
            <Input
              id="exp-title"
              placeholder="Senior Product Engineer"
              aria-invalid={!!errors.title}
              {...register('title')}
            />
          </FormField>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <FormField id="exp-company" label="Company" error={errors.company?.message}>
              <Input
                id="exp-company"
                placeholder="Acme Inc."
                autoComplete="organization"
                aria-invalid={!!errors.company}
                {...register('company')}
              />
            </FormField>
            <FormField
              id="exp-location"
              label="Location"
              error={errors.location?.message}
              hint={<span className="text-xs text-muted-foreground">Optional</span>}
            >
              <Input
                id="exp-location"
                placeholder="Remote"
                aria-invalid={!!errors.location}
                {...register('location')}
              />
            </FormField>
          </div>

          <div className="flex items-center gap-2.5">
            <Controller
              control={control}
              name="current"
              render={({ field }) => (
                <Switch id="exp-current" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="exp-current" className="font-normal">
              I currently work here
            </Label>
          </div>

          <div className="grid items-start gap-4 sm:grid-cols-2">
            <FormField id="exp-start" label="Start date" error={errors.start?.message}>
              <Controller
                control={control}
                name="start"
                render={({ field }) => (
                  <MonthPicker
                    id="exp-start"
                    label="Start date"
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={!!errors.start}
                  />
                )}
              />
            </FormField>
            <FormField id="exp-end" label="End date" error={current ? undefined : errors.end?.message}>
              {current ? (
                <p className="flex h-9 items-center border border-dashed px-3 text-sm text-muted-foreground">
                  Present
                </p>
              ) : (
                <Controller
                  control={control}
                  name="end"
                  render={({ field }) => (
                    <MonthPicker
                      id="exp-end"
                      label="End date"
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={!!errors.end}
                    />
                  )}
                />
              )}
            </FormField>
          </div>

          <FormField
            id="exp-description"
            label="What did you do?"
            error={errors.description?.message}
            hint={<span className="text-xs text-muted-foreground">Optional</span>}
          >
            <Textarea
              id="exp-description"
              rows={4}
              placeholder="What you owned, shipped and moved. Numbers help."
              className="max-h-64 min-h-24"
              aria-invalid={!!errors.description}
              {...register('description')}
            />
          </FormField>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="experience-form" disabled={isSubmitting}>
            {isSubmitting && <CircleDash className="animate-spin" />}
            {editing ? 'Save changes' : 'Add experience'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
