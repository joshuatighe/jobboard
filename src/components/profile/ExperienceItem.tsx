import { Building2, Pencil, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatMonthYear, formatTenure } from '@/lib/profile'
import type { Experience } from '@/lib/types'

/** One work-history entry. Edit and delete actions show when both handlers are given (the owner's profile). */
export function ExperienceItem({
  experience,
  onEdit,
  onDelete,
}: {
  experience: Experience
  onEdit?: () => void
  onDelete?: () => void
}) {
  const { title, company, location, start_date, end_date, description } = experience

  return (
    <li className="group flex gap-3 py-4 first:pt-0 last:pb-0">
      <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
        <Building2 className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="flex flex-wrap items-center gap-2 font-medium">
              {title}
              {!end_date && <Badge variant="brand">Current</Badge>}
            </h3>
            <p className="text-sm text-muted-foreground">
              {company}
              {location && <> · {location}</>}
            </p>
          </div>
          {onEdit && onDelete && (
          <div className="-mt-1 -mr-2 flex shrink-0 sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
            <Button variant="ghost" size="icon-sm" aria-label={`Edit ${title} at ${company}`} onClick={onEdit}>
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete ${title} at ${company}`}
              onClick={onDelete}
              className="hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </div>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatMonthYear(start_date)} – {end_date ? formatMonthYear(end_date) : 'Present'} ·{' '}
          {formatTenure(start_date, end_date)}
        </p>
        {description && (
          <p className="mt-2 text-sm whitespace-pre-line text-muted-foreground">{description}</p>
        )}
      </div>
    </li>
  )
}
