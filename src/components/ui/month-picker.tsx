import * as React from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: new Date(Date.UTC(2000, i, 1)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
}))

// Read once per page load, which is fine for picking past months.
const CURRENT_YEAR = new Date().getFullYear()

function parse(value: string) {
  const [year = '', month = ''] = value.split('-')
  return { year, month }
}

/**
 * Month + year as `YYYY-MM` (or '' until both are picked). Two selects instead of
 * `<input type="month">`, which Safari and Firefox render as a plain text box.
 */
function MonthPicker({
  id,
  label,
  value,
  onChange,
  disabled,
  yearsBack = 50,
  className,
  'aria-invalid': ariaInvalid,
}: {
  id?: string
  /** Names the two selects for screen readers, e.g. "Start date" → "Start date month". */
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  yearsBack?: number
  className?: string
  'aria-invalid'?: boolean
}) {
  const [draft, setDraft] = React.useState(() => parse(value))
  // Keep in sync when the form resets the value from outside.
  const [lastValue, setLastValue] = React.useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    if (value) setDraft(parse(value))
  }

  const years = Array.from({ length: yearsBack + 1 }, (_, i) => String(CURRENT_YEAR - i))

  function update(patch: Partial<typeof draft>) {
    const next = { ...draft, ...patch }
    setDraft(next)
    onChange(next.year && next.month ? `${next.year}-${next.month}` : '')
  }

  return (
    <div className={cn('grid grid-cols-[1fr_1.2fr] gap-2', className)}>
      <Select value={draft.month} onValueChange={(month) => update({ month })} disabled={disabled}>
        <SelectTrigger id={id} aria-label={`${label} month`} aria-invalid={ariaInvalid} className="w-full">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={draft.year} onValueChange={(year) => update({ year })} disabled={disabled}>
        <SelectTrigger aria-label={`${label} year`} aria-invalid={ariaInvalid} className="w-full">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { MonthPicker }
