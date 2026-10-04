import { useQuery } from '@tanstack/react-query'

import { fetchSeekerProfile, resumeUrl } from '@/lib/api/seekers'

export const seekerKeys = {
  profile: (userId: string) => ['seeker-profile', userId] as const,
  resumeUrl: (path: string) => ['resume-url', path] as const,
}

export function useSeekerProfile(userId: string | undefined) {
  return useQuery({
    queryKey: seekerKeys.profile(userId ?? ''),
    queryFn: () => fetchSeekerProfile(userId!),
    enabled: Boolean(userId),
  })
}

/** Signed URLs expire after 5 minutes, so refresh them a little before that. */
export function useResumeUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: seekerKeys.resumeUrl(path ?? ''),
    queryFn: () => resumeUrl(path!),
    enabled: Boolean(path),
    staleTime: 4 * 60 * 1000,
  })
}
