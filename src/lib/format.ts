import type { Job } from '@/lib/types'

const compact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 0,
})

const exact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

/** `$120K – $160K` for salaries, `$35 – $45/hr` for hourly roles. */
export function formatPay(job: Pick<Job, 'pay_min' | 'pay_max' | 'pay_period'>): string {
  if (job.pay_period === 'hour') {
    const range =
      job.pay_min === job.pay_max
        ? exact.format(job.pay_min)
        : `${exact.format(job.pay_min)} – ${exact.format(job.pay_max)}`
    return `${range}/hr`
  }
  return job.pay_min === job.pay_max
    ? compact.format(job.pay_min)
    : `${compact.format(job.pay_min)} – ${compact.format(job.pay_max)}`
}

const relative = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto', style: 'narrow' })

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]

/** "3d ago", "yesterday", "just now". */
export function formatRelative(date: string | Date, now: Date = new Date()): string {
  const seconds = (new Date(date).getTime() - now.getTime()) / 1000
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

/** "Oct 4, 2026", for tooltips next to relative dates. */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  )
}
