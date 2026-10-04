import { ExternalLink, FileText, FileX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useResumeUrl, useSeekerProfile } from '@/lib/queries/seekers'
import { resumeDisplayName } from '@/lib/resume'

/**
 * The resume snapshotted on an application (R3, R7). It may be an older version than the one on
 * the profile now, which is exactly the point: this is what the recruiter sees.
 */
export function SentResume({
  path,
  seekerId,
  audience = 'seeker',
}: {
  path: string | null
  seekerId: string
  /** The candidate reads "your resume"; a recruiter reads "their resume". */
  audience?: 'seeker' | 'recruiter'
}) {
  const profile = useSeekerProfile(seekerId)
  const url = useResumeUrl(path)

  if (!path) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 text-sm text-muted-foreground">
        <FileX className="size-4 shrink-0" />
        No resume was attached to this application.
      </div>
    )
  }

  const isCurrent = profile.data?.resume_path === path
  const name = resumeDisplayName(path, isCurrent ? profile.data?.resume_filename : null)

  return (
    <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
      <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
        <FileText className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {audience === 'recruiter'
            ? isCurrent
              ? 'The resume on their profile'
              : "Sent with this application. They've uploaded a newer one since."
            : isCurrent
              ? 'Your current resume'
              : 'An earlier version of your resume'}
        </p>
      </div>
      {url.data ? (
        <Button asChild variant="ghost" size="sm">
          <a href={url.data} target="_blank" rel="noreferrer">
            View <ExternalLink />
          </a>
        </Button>
      ) : url.isError ? (
        <span className="text-xs text-muted-foreground">Unavailable</span>
      ) : null}
    </div>
  )
}
