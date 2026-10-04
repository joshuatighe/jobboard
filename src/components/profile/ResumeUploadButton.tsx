import { useRef, type ComponentProps } from 'react'
import { CircleDash, Upload } from '@carbon/icons-react'

import { Button } from '@/components/ui/button'
import { useResumeUpload } from '@/hooks/useResumeUpload'

/** A button that opens the file picker and uploads the chosen PDF (R3). */
export function ResumeUploadButton({
  userId,
  replacing = false,
  disabled,
  children,
  ...props
}: {
  userId: string
  replacing?: boolean
} & Omit<ComponentProps<typeof Button>, 'onClick' | 'type'>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, isPending } = useResumeUpload(userId)

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          upload(event.target.files?.[0], { replacing })
          event.target.value = ''
        }}
      />
      <Button
        {...props}
        type="button"
        disabled={isPending || disabled}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? <CircleDash className="animate-spin" /> : <Upload />}
        {isPending ? 'Uploading…' : children}
      </Button>
    </>
  )
}
