import { describe, expect, it } from 'vitest'

import {
  formatFileSize,
  looksLikePdf,
  RESUME_MAX_BYTES,
  resumeDisplayName,
  resumeFileError,
  resumeObjectPath,
} from '@/lib/resume'

const pdf = (size: number, name = 'Resume.pdf', type = 'application/pdf') =>
  new File([new Uint8Array(size)], name, { type })

describe('resumeFileError', () => {
  it('accepts a PDF up to 5 MB', () => {
    expect(resumeFileError(pdf(1024))).toBeNull()
    expect(resumeFileError(pdf(RESUME_MAX_BYTES))).toBeNull()
  })

  it('accepts a .pdf name when the browser reports no type', () => {
    expect(resumeFileError(pdf(1024, 'cv.PDF', ''))).toBeNull()
  })

  it('rejects other file types', () => {
    expect(resumeFileError(pdf(1024, 'cv.docx', 'application/msword'))).toMatch(/PDF/)
  })

  it('rejects empty and oversized files', () => {
    expect(resumeFileError(pdf(0))).toMatch(/empty/)
    expect(resumeFileError(pdf(RESUME_MAX_BYTES + 1))).toMatch(/5 MB/)
  })
})

describe('looksLikePdf', () => {
  it('checks the PDF header', async () => {
    expect(await looksLikePdf(new Blob(['%PDF-1.7\n...']))).toBe(true)
    expect(await looksLikePdf(new Blob(['PK\u0003\u0004']))).toBe(false)
    expect(await looksLikePdf(new Blob([]))).toBe(false)
  })
})

describe('resumeObjectPath', () => {
  const now = new Date('2026-10-04T12:00:00Z')
  const stamp = now.getTime().toString(36)

  it('puts the file in the user folder with a unique, URL-safe name', () => {
    expect(resumeObjectPath('u1', 'Ada Lovelace – Résumé (2026).pdf', now)).toBe(
      `u1/ada-lovelace-resume-2026-${stamp}.pdf`,
    )
  })

  it('falls back to "resume" when nothing usable is left', () => {
    expect(resumeObjectPath('u1', '???.pdf', now)).toBe(`u1/resume-${stamp}.pdf`)
  })

  it('gives each upload a new path', () => {
    const later = new Date(now.getTime() + 1)
    expect(resumeObjectPath('u1', 'cv.pdf', now)).not.toBe(resumeObjectPath('u1', 'cv.pdf', later))
  })
})

describe('resumeDisplayName', () => {
  it('prefers the original filename', () => {
    expect(resumeDisplayName('u1/cv-abc.pdf', 'Ada_Resume.pdf')).toBe('Ada_Resume.pdf')
    expect(resumeDisplayName('u1/cv-abc.pdf', null)).toBe('cv-abc.pdf')
  })
})

describe('formatFileSize', () => {
  it('formats KB and MB', () => {
    expect(formatFileSize(240 * 1024)).toBe('240 KB')
    expect(formatFileSize(1.25 * 1024 * 1024)).toBe('1.3 MB')
  })
})
