import { useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { updateFullName } from '@/lib/api/auth'
import {
  deleteExperience,
  fetchExperiences,
  fetchSeekerProfile,
  resumeUrl,
  saveExperience,
  updateSeekerProfile,
  uploadResume,
  type ExperienceInput,
  type SeekerProfileUpdate,
} from '@/lib/api/seekers'
import type { Experience } from '@/lib/types'

export const seekerKeys = {
  profile: (userId: string) => ['seeker-profile', userId] as const,
  experiences: (userId: string) => ['experiences', userId] as const,
  resumeUrl: (path: string) => ['resume-url', path] as const,
  uploadResume: (userId: string) => ['upload-resume', userId] as const,
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

/** R2: save seeker fields, and the account name when `fullName` is given. */
export function useUpdateSeekerProfile(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ fullName, patch }: { fullName?: string; patch: SeekerProfileUpdate }) => {
      if (fullName !== undefined) await updateFullName(userId, fullName)
      return updateSeekerProfile(userId, patch)
    },
    onSuccess: (profile) => queryClient.setQueryData(seekerKeys.profile(userId), profile),
  })
}

/** R3 */
export function useUploadResume(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: seekerKeys.uploadResume(userId),
    mutationFn: (file: File) => uploadResume(userId, file),
    onSuccess: (profile) => queryClient.setQueryData(seekerKeys.profile(userId), profile),
  })
}

/** True while any resume upload for this user is in flight, from whichever component started it. */
export function useIsUploadingResume(userId: string) {
  return useIsMutating({ mutationKey: seekerKeys.uploadResume(userId) }) > 0
}

export function useExperiences(userId: string | undefined) {
  return useQuery({
    queryKey: seekerKeys.experiences(userId ?? ''),
    queryFn: () => fetchExperiences(userId!),
    enabled: Boolean(userId),
  })
}

export function useSaveExperience(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ input, id }: { input: ExperienceInput; id?: string }) =>
      saveExperience(userId, input, id),
    onSuccess: (saved) => {
      queryClient.setQueryData<Experience[]>(seekerKeys.experiences(userId), (items = []) =>
        items.some((e) => e.id === saved.id)
          ? items.map((e) => (e.id === saved.id ? saved : e))
          : [saved, ...items],
      )
    },
  })
}

export function useDeleteExperience(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteExperience,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Experience[]>(seekerKeys.experiences(userId), (items = []) =>
        items.filter((e) => e.id !== id),
      )
    },
  })
}
