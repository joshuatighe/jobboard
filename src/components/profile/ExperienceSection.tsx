import { useState } from 'react'
import { BriefcaseBusiness, Loader2, Plus, TriangleAlert } from 'lucide-react'
import { toast } from 'sonner'

import { EmptyState } from '@/components/layout/EmptyState'
import { ExperienceDialog } from '@/components/profile/ExperienceDialog'
import { ExperienceItem } from '@/components/profile/ExperienceItem'
import { ProfileSection } from '@/components/profile/ProfileSection'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { sortExperiences } from '@/lib/profile'
import { useDeleteExperience, useExperiences } from '@/lib/queries/seekers'
import type { Experience } from '@/lib/types'

type Editing = { mode: 'add' } | { mode: 'edit'; experience: Experience }

/** R2: work history, with add, edit and delete. */
export function ExperienceSection({ userId }: { userId: string }) {
  const experiences = useExperiences(userId)
  const remove = useDeleteExperience(userId)
  const [editing, setEditing] = useState<Editing>()
  const [dialogOpen, setDialogOpen] = useState(false)
  // A fresh key per open, so the form starts from the entry's current values every time.
  const [dialogKey, setDialogKey] = useState(0)
  // Kept after closing so the dialogs don't go blank while they animate out.
  const [deleting, setDeleting] = useState<Experience>()
  const [deleteOpen, setDeleteOpen] = useState(false)

  function openDialog(next: Editing) {
    setEditing(next)
    setDialogKey((k) => k + 1)
    setDialogOpen(true)
  }

  function confirmDelete() {
    if (!deleting || remove.isPending) return
    remove.mutate(deleting.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        toast.success('Experience removed')
      },
      onError: (error) =>
        toast.error("Couldn't remove this role", {
          description: error instanceof Error ? error.message : 'Please try again.',
        }),
    })
  }

  const items = experiences.data ? sortExperiences(experiences.data) : []

  return (
    <ProfileSection
      id="experience"
      title="Experience"
      description="Your work history, most recent first."
      action={
        items.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => openDialog({ mode: 'add' })}>
            <Plus /> Add
          </Button>
        )
      }
    >
      {experiences.isPending ? (
        <div className="grid gap-5" aria-busy="true" aria-label="Loading experience">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : experiences.isError ? (
        <EmptyState
          tone="error"
          icon={TriangleAlert}
          title="We couldn't load your experience"
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={() => void experiences.refetch()}>
              Try again
            </Button>
          }
          className="py-10"
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No experience yet"
          description="Add the roles you've held. Recruiters look here first, and it helps us match you."
          action={
            <Button onClick={() => openDialog({ mode: 'add' })}>
              <Plus /> Add experience
            </Button>
          }
          className="py-10"
        />
      ) : (
        <ul className="divide-y">
          {items.map((experience) => (
            <ExperienceItem
              key={experience.id}
              experience={experience}
              onEdit={() => openDialog({ mode: 'edit', experience })}
              onDelete={() => {
                setDeleting(experience)
                setDeleteOpen(true)
              }}
            />
          ))}
        </ul>
      )}

      {editing && (
        <ExperienceDialog
          key={dialogKey}
          userId={userId}
          experience={editing.mode === 'edit' ? editing.experience : undefined}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this role?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && (
                <>
                  <span className="font-medium text-foreground">
                    {deleting.title} at {deleting.company}
                  </span>{' '}
                  will be removed from your profile. This can't be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={confirmDelete} disabled={remove.isPending}>
              {remove.isPending && <Loader2 className="animate-spin" />}
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProfileSection>
  )
}
