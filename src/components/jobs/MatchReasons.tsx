import { matchTier } from '@/lib/feed'
import type { MatchResult } from '@/lib/matching'
import { cn } from '@/lib/utils'

const SCORE_STYLES = {
  strong: 'highlight',
  good: 'text-foreground',
  weak: 'text-muted-foreground',
} as const

/** R6: the match score, set like a price, and the reasons the job earned it as a plain line of text. */
export function MatchReasons({ match }: { match: MatchResult }) {
  const tier = matchTier(match.score)

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <p className="flex items-baseline gap-1.5" title={tier.label}>
        <span className={cn('font-serif text-2xl leading-none tracking-tight tabular-nums', SCORE_STYLES[tier.tone])}>
          {match.score}
          <span className="text-base">%</span>
        </span>
        <span className="meta text-muted-foreground">{tier.label}</span>
      </p>
      {match.reasons.length > 0 && (
        <ul className="flex flex-wrap gap-x-1 text-sm" aria-label="Why this matches">
          {match.reasons.map((reason, i) => (
            <li key={reason.criterion}>
              {i > 0 && (
                <span aria-hidden className="mr-1 text-muted-foreground">
                  ·
                </span>
              )}
              {reason.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
