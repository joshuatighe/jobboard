import { useRef, useState, type DragEvent } from 'react'
import { ExternalLink, FileText, Loader2, Lock, Upload } from 'lucide-react'

import { ProfileSection } from '@/components/profile/ProfileSection'
import { ResumeUploadButton } from '@/components/profile/ResumeUploadButton'
import { Button } from '@/components/ui/button'
import { useResumeUpload } from '@/hooks/useResumeUpload'
import { useResumeUrl } from '@/lib/queries/seekers'
import { resumeDisplayName } from '@/lib/resume'
import type { SeekerProfile } from '@/lib/types'
import { cn } from '@/lib/utils'

/** R3: upload, view and replace the resume on file. Drop a PDF anywhere on the card. */
export function ResumeCard({ seeker }: { seeker: SeekerProfile }) {
  const { upload, isPending } = useResumeUpload(seeker.user_id)
  const url = useResumeUrl(seeker.resume_path)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const hasResume = Boolean(seeker.resume_path)

  const dropHandlers = {
    onDragOver: (event: DragEvent) => {
      event.preventDefault()
      setDragging(true)
    },
    onDragLeave: (event: DragEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
    },
    onDrop: (event: DragEvent) => {
      event.preventDefault()
      setDragging(false)
      upload(event.dataTransfer.files[0], { replacing: hasResume })
    },
  }

  return (
    <ProfileSection
      id="resume"
      title="Resume"
      description={
        <span className="inline-flex items-center gap-1.5">
          <Lock className="size-3.5" /> Only you and companies you apply to can see it.
        </span>
      }
    >
      <div
        {...dropHandlers}
        className={cn(
          'rounded-lg transition-colors duration-150',
          dragging && 'bg-brand-soft/50 ring-2 ring-brand',
        )}
      >
        {hasResume ? (
          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
              <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {resumeDisplayName(seeker.resume_path!, seeker.resume_filename)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPending ? 'Uploading your new resume…' : 'PDF · attached to new applications'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {url.isError ? (
                <Button variant="outline" onClick={() => void url.refetch()}>
                  Retry link
                </Button>
              ) : (
                <Button asChild variant="outline" disabled={!url.data}>
                  <a
                    href={url.data}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!url.data}
                    className={cn(!url.data && 'pointer-events-none opacity-50')}
                  >
                    View <ExternalLink />
                  </a>
                </Button>
              )}
              <ResumeUploadButton userId={seeker.user_id} replacing variant="outline">
                Replace
              </ResumeUploadButton>
            </div>
            <p className="text-xs text-muted-foreground">
              Replacing won't change applications you've already sent.
            </p>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(event) => {
                upload(event.target.files?.[0])
                event.target.value = ''
              }}
            />
            <button
              type="button"
              disabled={isPending}
              onClick={() => inputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors outline-none hover:border-brand/50 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-wait"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                {isPending ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
              </span>
              <span className="text-sm font-medium">
                {isPending ? 'Uploading…' : 'Upload your resume'}
              </span>
              <span className="text-xs text-muted-foreground">Drop a PDF here or click to browse · max 5 MB</span>
            </button>
          </>
        )}
      </div>
    </ProfileSection>
  )
}
