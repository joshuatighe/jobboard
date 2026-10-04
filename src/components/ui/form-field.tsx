import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'

/** Label + control + error message, wired for accessibility. */
export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
