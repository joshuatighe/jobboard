import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleDash } from '@carbon/icons-react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

import { ResumeOnFile } from '@/components/jobs/ResumeOnFile'
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
import { Textarea } from '@/components/ui/textarea'
import type { JobWithCompany } from '@/lib/api/jobs'
import { useApply } from '@/lib/queries/applications'
import { useSeekerProfile } from '@/lib/queries/seekers'

const COVER_NOTE_MAX = 2000

const schema = z.object({
  coverNote: z.string().max(COVER_NOTE_MAX, `Keep it under ${COVER_NOTE_MAX} characters`),
})

type Values = z.infer<typeof schema>

/** R7: apply with the resume on file and an optional cover note. */
export function ApplyDialog({
  job,
  seekerId,
  open,
  onOpenChange,
}: {
  job: JobWithCompany
  seekerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const apply = useApply()
  const seeker = useSeekerProfile(seekerId)
  // Applying needs a resume. If we couldn't check, let the attempt through; the DB snapshots
  // whatever is on file.
  const missingResume = seeker.isSuccess && !seeker.data?.resume_path
  const [formError, setFormError] = useState<string>()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { coverNote: '' } })
  const coverNote = useWatch({ control, name: 'coverNote' })

  async function onSubmit(values: Values) {
    setFormError(undefined)
    if (missingResume) {
      setFormError('Upload your resume before applying.')
      return
    }
    try {
      await apply.mutateAsync({ jobId: job.id, seekerId, coverNote: values.coverNote })
      onOpenChange(false)
      reset()
      toast.success('Application sent', {
        description: `${job.company.name} can now see your profile and resume.`,
        action: { label: 'Track it', onClick: () => navigate('/applications') },
      })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setFormError(undefined)
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply to {job.title}</DialogTitle>
          <DialogDescription>
            {job.company.name} will see your profile, experience and resume.
          </DialogDescription>
        </DialogHeader>

        <form id="apply-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
          <ResumeOnFile seekerId={seekerId} />

          <FormField
            id="cover-note"
            label="Cover note"
            error={errors.coverNote?.message}
            hint={<span className="text-xs text-muted-foreground">Optional</span>}
          >
            <Textarea
              id="cover-note"
              rows={5}
              placeholder={`Why ${job.company.name}, and why you? A few sentences is plenty.`}
              aria-invalid={!!errors.coverNote}
              aria-describedby="cover-note-count"
              className="max-h-64 min-h-28"
              {...register('coverNote')}
            />
            <p id="cover-note-count" className="text-right text-xs text-muted-foreground tabular-nums">
              {coverNote.length.toLocaleString('en-US')} / {COVER_NOTE_MAX.toLocaleString('en-US')}
            </p>
          </FormField>

          {formError && (
            <p role="alert" className="border border-destructive/30 bg-destructive/8 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="apply-form"
            disabled={isSubmitting || seeker.isPending || missingResume}
          >
            {isSubmitting && <CircleDash className="animate-spin" />}
            Send application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
