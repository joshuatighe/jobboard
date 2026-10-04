import { Banknote, BriefcaseBusiness, Globe, MapPin, Sparkles, TrendingUp, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { matchTier } from '@/lib/feed'
import type { MatchCriterion, MatchReason, MatchResult } from '@/lib/matching'
import { cn } from '@/lib/utils'

const ICONS: Record<MatchCriterion, LucideIcon> = {
  experience: TrendingUp,
  location: MapPin,
  pay: Banknote,
  employmentType: BriefcaseBusiness,
  skills: Wrench,
}

const iconFor = (reason: MatchReason) =>
  reason.criterion === 'location' && reason.label === 'Remote' ? Globe : ICONS[reason.criterion]

const TIER_STYLES = {
  strong: 'border-transparent bg-brand-soft text-brand',
  good: 'border-transparent bg-secondary text-secondary-foreground',
  weak: 'text-muted-foreground',
} as const

/** R6: the match score and a "why this matches" chip per criterion the job meets. */
export function MatchReasons({ match }: { match: MatchResult }) {
  const tier = matchTier(match.score)

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums',
          TIER_STYLES[tier.tone],
        )}
        title={tier.label}
      >
        <Sparkles className="size-3" />
        {match.score}% match
        <span className="sr-only">: {tier.label}</span>
      </span>
      {match.reasons.length > 0 && (
        <ul className="contents" aria-label="Why this matches">
          {match.reasons.map((reason) => {
            const Icon = iconFor(reason)
            return (
              <li
                key={reason.criterion}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                <Icon className="size-3" />
                {reason.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
