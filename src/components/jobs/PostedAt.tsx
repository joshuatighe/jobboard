import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatDate, formatRelative } from '@/lib/format'

/** "Posted 3d ago", with the exact date in a tooltip. */
export function PostedAt({ date, prefix = 'Posted' }: { date: string; prefix?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <time dateTime={date} className="whitespace-nowrap">
          {prefix} {formatRelative(date)}
        </time>
      </TooltipTrigger>
      <TooltipContent>{formatDate(date)}</TooltipContent>
    </Tooltip>
  )
}
