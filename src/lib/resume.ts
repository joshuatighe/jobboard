import { z } from 'zod'

/** Matches the `resumes` bucket's `file_size_limit` in the init migration. */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024

/** R3: PDF only, at most 5 MB. The bucket enforces the same rules server-side. */
export const resumeFileSchema = z
  .instanceof(File)
  .refine((file) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name), {
    message: 'Resumes must be PDF files.',
  })
  .refine((file) => file.size > 0, { message: 'That file is empty.' })
  .refine((file) => file.size <= RESUME_MAX_BYTES, {
    message: 'Resumes can be at most 5 MB.',
  })

/** The first validation error for a resume file, or null when it can be uploaded. */
export function resumeFileError(file: File): string | null {
  const result = resumeFileSchema.safeParse(file)
  return result.success ? null : (result.error.issues[0]?.message ?? 'That file can’t be uploaded.')
}

/** Every real PDF starts with `%PDF-`. Catches files that are only named `.pdf`. */
export async function looksLikePdf(file: Blob): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer())
  return String.fromCharCode(...header) === '%PDF-'
}

/**
 * Where a new resume upload lives: `{user_id}/{slug}-{stamp}.pdf`. Every upload gets a fresh path
 * instead of overwriting, so applications keep pointing at the resume they were sent with.
 */
export function resumeObjectPath(userId: string, fileName: string, now: Date = new Date()): string {
  const slug =
    fileName
      .replace(/\.pdf$/i, '')
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
      .replace(/-+$/, '') || 'resume'
  return `${userId}/${slug}-${now.getTime().toString(36)}.pdf`
}

/** A readable name for a resume: the original filename when we have it, else the object name. */
export function resumeDisplayName(path: string, filename?: string | null): string {
  return filename || path.split('/').at(-1) || 'Resume.pdf'
}

const sizeFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

/** "240 KB", "1.2 MB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${sizeFormat.format(Math.max(1, Math.round(bytes / 1024)))} KB`
  return `${sizeFormat.format(bytes / (1024 * 1024))} MB`
}
