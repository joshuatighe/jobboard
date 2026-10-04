import { MapPin } from 'lucide-react'

import { FilterCheckbox } from '@/components/jobs/FilterCheckbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EXPERIENCE_LEVELS, HOURS_PER_YEAR } from '@/lib/constants'
import { formatPay } from '@/lib/format'
import { activeFilterCount, PAY_OPTIONS, type JobFilters } from '@/lib/job-filters'

const ANY_PAY = 'any'

const payLabel = (amount: number) =>
  `${formatPay({ pay_min: amount, pay_max: amount, pay_period: 'year' })}+`

/**
 * R5: pay, location / remote and experience level. `filters.location` is the live input value;
 * the page debounces it into the URL.
 */
export function JobFiltersPanel({
  filters,
  onChange,
  onClear,
  idPrefix = 'filters',
}: {
  filters: JobFilters
  onChange: (patch: Partial<JobFilters>) => void
  onClear: () => void
  /** Keeps input ids unique when the panel renders twice (sidebar and mobile sheet). */
  idPrefix?: string
}) {
  const hasFilters = activeFilterCount(filters) > 0

  return (
    <div className="grid gap-7">
      <section className="grid gap-2">
        <Label htmlFor={`${idPrefix}-pay`}>Minimum pay</Label>
        <Select
          value={filters.minPay ? String(filters.minPay) : ANY_PAY}
          onValueChange={(value) => onChange({ minPay: value === ANY_PAY ? null : Number(value) })}
        >
          <SelectTrigger id={`${idPrefix}-pay`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_PAY}>Any pay</SelectItem>
            {PAY_OPTIONS.map((amount) => (
              <SelectItem key={amount} value={String(amount)}>
                {payLabel(amount)} a year
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Hourly roles count at {HOURS_PER_YEAR.toLocaleString('en-US')} hours a year.
        </p>
      </section>

      <section className="grid gap-2">
        <Label htmlFor={`${idPrefix}-location`}>Location</Label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={`${idPrefix}-location`}
            value={filters.location}
            onChange={(event) => onChange({ location: event.target.value })}
            placeholder="City or state"
            className="pl-9"
            autoComplete="off"
          />
        </div>
        <div className="-mx-2">
          <FilterCheckbox checked={filters.remote} onCheckedChange={(remote) => onChange({ remote })}>
            {filters.location.trim() ? 'Include remote roles' : 'Remote only'}
          </FilterCheckbox>
        </div>
      </section>

      <section className="grid gap-2">
        <h3 id={`${idPrefix}-level`} className="text-sm font-medium">
          Experience level
        </h3>
        <div role="group" aria-labelledby={`${idPrefix}-level`} className="-mx-2 grid gap-0.5">
          {EXPERIENCE_LEVELS.map((level) => (
            <FilterCheckbox
              key={level.value}
              checked={filters.levels.includes(level.value)}
              onCheckedChange={(checked) =>
                onChange({
                  levels: checked
                    ? [...filters.levels, level.value]
                    : filters.levels.filter((l) => l !== level.value),
                })
              }
            >
              {level.label}
            </FilterCheckbox>
          ))}
        </div>
      </section>

      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClear} className="justify-self-start">
          Clear filters
        </Button>
      )}
    </div>
  )
}
