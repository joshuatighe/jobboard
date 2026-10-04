import type { Enums, Tables } from '@/types/database'

export type Profile = Tables<'profiles'>
export type SeekerProfile = Tables<'seeker_profiles'>
export type Experience = Tables<'experiences'>
export type Company = Tables<'companies'>
export type Job = Tables<'jobs'>
export type Application = Tables<'applications'>
export type ApplicationEvent = Tables<'application_events'>

export type UserRole = Enums<'user_role'>
export type ExperienceLevel = Enums<'experience_level'>
export type EmploymentType = Enums<'employment_type'>
export type PayPeriod = Enums<'pay_period'>
export type JobStatus = Enums<'job_status'>
export type ApplicationStatus = Enums<'application_status'>
