import type {
  ApplicationStatus,
  EmploymentType,
  ExperienceLevel,
  JobStatus,
} from '@/lib/types'

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'intern', label: 'Intern' },
  { value: 'entry', label: 'Entry level' },
  { value: 'mid', label: 'Mid level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Staff' },
]

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
]

type BadgeTone = 'secondary' | 'info' | 'highlight' | 'warning' | 'success' | 'destructive' | 'outline'

export const APPLICATION_STATUSES: Record<
  ApplicationStatus,
  { label: string; tone: BadgeTone; description: string }
> = {
  applied: { label: 'Applied', tone: 'secondary', description: 'Submitted and waiting for review' },
  reviewing: { label: 'In review', tone: 'info', description: 'The team is reviewing your application' },
  interviewing: { label: 'Interviewing', tone: 'highlight', description: "You're in the interview process" },
  offer: { label: 'Offer', tone: 'success', description: 'You received an offer' },
  rejected: { label: 'Not selected', tone: 'destructive', description: 'The team moved forward with others' },
  withdrawn: { label: 'Withdrawn', tone: 'outline', description: 'You withdrew this application' },
}

/** The order candidates move through a recruiter's pipeline. */
export const PIPELINE: ApplicationStatus[] = ['applied', 'reviewing', 'interviewing', 'offer']

export const JOB_STATUSES: Record<JobStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Draft', tone: 'outline' },
  open: { label: 'Open', tone: 'success' },
  closed: { label: 'Closed', tone: 'secondary' },
}

export const labelFor = {
  experienceLevel: (v: ExperienceLevel) => EXPERIENCE_LEVELS.find((l) => l.value === v)?.label ?? v,
  employmentType: (v: EmploymentType) => EMPLOYMENT_TYPES.find((t) => t.value === v)?.label ?? v,
}

/** Hours in a full-time working year, used to compare hourly and salaried pay. */
export const HOURS_PER_YEAR = 2080
