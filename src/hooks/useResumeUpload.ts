import { toast } from 'sonner'

import { useIsUploadingResume, useUploadResume } from '@/lib/queries/seekers'
import { resumeFileError } from '@/lib/resume'

/** R3: validate a picked or dropped file, upload it, and toast the outcome. */
export function useResumeUpload(userId: string) {
  const mutation = useUploadResume(userId)
  const isPending = useIsUploadingResume(userId)

  function upload(file: File | undefined, { replacing = false } = {}) {
    if (!file || isPending) return
    const invalid = resumeFileError(file)
    if (invalid) {
      toast.error("Couldn't upload that file", { description: invalid })
      return
    }
    mutation.mutate(file, {
      onSuccess: () =>
        toast.success(replacing ? 'Resume replaced' : 'Resume uploaded', {
          description: replacing
            ? 'New applications use this file. Ones you already sent keep the resume they were sent with.'
            : 'It will be attached to every application you send.',
        }),
      onError: (error) =>
        toast.error("Couldn't upload your resume", {
          description: error instanceof Error ? error.message : 'Please try again.',
        }),
    })
  }

  return { upload, isPending }
}
