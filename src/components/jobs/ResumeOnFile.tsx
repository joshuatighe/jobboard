import { ExternalLink, FileText, Upload } from 'lucide-react'

import { ResumeUploadButton } from '@/components/profile/ResumeUploadButton'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useResumeUrl, useSeekerProfile } from '@/lib/queries/seekers'
import { resumeDisplayName } from '@/lib/resume'

/**
 * The resume an application will snapshot (R3, R7). Applying needs one, so without it this
 * offers an upload right here instead of sending the seeker away from the job.
 */
export function ResumeOnFile({ seekerId }: { seekerId: string }) {
  const profile = useSeekerProfile(seekerId)
  const path = profile.data?.resume_path
  const url = useResumeUrl(path)

  if (profile.isPending) return <Skeleton className="h-14 rounded-lg" />

  if (profile.isError) {
    return (
      <p className="rounded-lg border px-3 py-2.5 text-sm text-muted-foreground">
        We couldn't check your resume. Your resume on file is attached automatically when you apply.
      </p>
    )
  }

  if (!path) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-dashed px-3 py-3 sm:flex-row sm:items-center">
        <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
          <Upload className="size-4" />
        </div>
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-medium">Add your resume to apply</p>
          <p className="text-xs text-muted-foreground">
            PDF up to 5 MB. It's saved to your profile for next time.
          </p>
        </div>
        <ResumeUploadButton userId={seekerId} size="sm" variant="brand">
          Upload PDF
        </ResumeUploadButton>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
      <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
        <FileText className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {resumeDisplayName(path, profile.data?.resume_filename)}
        </p>
        <p className="text-xs text-muted-foreground">Your resume on file</p>
      </div>
      {url.data && (
        <Button asChild variant="ghost" size="sm">
          <a href={url.data} target="_blank" rel="noreferrer">
            View <ExternalLink />
          </a>
        </Button>
      )}
    </div>
  )
}
