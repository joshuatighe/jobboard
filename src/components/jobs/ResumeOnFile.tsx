import { ExternalLink, FileText, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useResumeUrl, useSeekerProfile } from '@/lib/queries/seekers'

/** The resume an application will snapshot (R3, R7), or a nudge to upload one. */
export function ResumeOnFile({ seekerId }: { seekerId: string }) {
  const profile = useSeekerProfile(seekerId)
  const path = profile.data?.resume_path
  const url = useResumeUrl(path)

  if (profile.isPending) return <Skeleton className="h-14 rounded-lg" />

  if (profile.isError) {
    return (
      <p className="rounded-lg border px-3 py-2.5 text-sm text-muted-foreground">
        We couldn't check your resume. You can still apply; your resume on file is attached
        automatically.
      </p>
    )
  }

  if (!path) {
    return (
      <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/8 px-3 py-2.5 text-sm">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
        <p>
          <span className="font-medium">No resume on file.</span>{' '}
          <span className="text-muted-foreground">
            You can still apply, but a resume makes a much stronger application.{' '}
            <Link to="/profile" className="font-medium text-foreground underline-offset-4 hover:underline">
              Upload one
            </Link>
          </span>
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
      <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
        <FileText className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{path.split('/').at(-1)}</p>
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
