import { toast } from 'sonner'

import type { Posting } from '@/lib/api/postings'
import { ACTION_TARGET, type PostingAction } from '@/lib/postings'
import { useDeletePosting, useUpdatePosting } from '@/lib/queries/postings'

const SUCCESS: Record<PostingAction, { title: string; description: (title: string) => string }> = {
  publish: { title: 'Posting published', description: (t) => `${t} is live in search and taking applications.` },
  close: { title: 'Posting closed', description: (t) => `${t} no longer takes applications.` },
  reopen: { title: 'Posting reopened', description: (t) => `${t} is back in search.` },
  unpublish: { title: 'Moved back to drafts', description: (t) => `${t} is hidden from search.` },
  delete: { title: 'Draft deleted', description: (t) => t },
}

const FAILURE: Record<PostingAction, string> = {
  publish: "Couldn't publish the posting",
  close: "Couldn't close the posting",
  reopen: "Couldn't reopen the posting",
  unpublish: "Couldn't move the posting to drafts",
  delete: "Couldn't delete the draft",
}

/** R11: publish, close, reopen, unpublish or delete a posting, with a toast either way. */
export function usePostingAction(companyId: string) {
  const update = useUpdatePosting(companyId)
  const remove = useDeletePosting(companyId)

  async function perform(posting: Pick<Posting, 'id' | 'title'>, action: PostingAction): Promise<boolean> {
    try {
      if (action === 'delete') await remove.mutateAsync(posting.id)
      else await update.mutateAsync({ jobId: posting.id, patch: { status: ACTION_TARGET[action] } })
      toast.success(SUCCESS[action].title, { description: SUCCESS[action].description(posting.title) })
      return true
    } catch (error) {
      toast.error(FAILURE[action], {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
      return false
    }
  }

  return { perform, isPending: update.isPending || remove.isPending }
}
