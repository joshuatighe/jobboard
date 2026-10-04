import * as React from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * A list of short tags (skills, locations). Enter or comma adds, Backspace on an empty input
 * removes the last tag, and pasting a comma-separated list adds each item. Duplicates are ignored
 * regardless of case.
 */
function TagInput({
  id,
  value,
  onChange,
  placeholder,
  maxTags = 30,
  maxLength = 40,
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: {
  id?: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxTags?: number
  maxLength?: number
  className?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}) {
  const [draft, setDraft] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const full = value.length >= maxTags

  function add(raw: string) {
    const next = [...value]
    for (const part of raw.split(',')) {
      const tag = part.trim().replace(/\s+/g, ' ').slice(0, maxLength)
      if (!tag || next.length >= maxTags) continue
      if (next.some((t) => t.toLowerCase() === tag.toLowerCase())) continue
      next.push(tag)
    }
    if (next.length !== value.length) onChange(next)
    setDraft('')
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
    inputRef.current?.focus()
  }

  return (
    <div
      data-slot="tag-input"
      aria-invalid={ariaInvalid}
      onClick={() => inputRef.current?.focus()}
      className={cn(
        'flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 border border-input bg-background px-2 py-1.5 transition-[border-color,box-shadow] duration-150 dark:bg-input/15',
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
    >
      <ul className="contents" aria-label="Added">
        {value.map((tag, index) => (
          <li
            key={tag}
            className="inline-flex h-6 max-w-full items-center gap-1 border border-transparent bg-secondary pr-0.5 pl-2 text-xs font-medium text-secondary-foreground"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={(event) => {
                event.stopPropagation()
                remove(index)
              }}
              className="inline-flex size-5 cursor-pointer items-center justify-center text-muted-foreground transition-colors outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <X className="size-3" />
            </button>
          </li>
        ))}
      </ul>
      <input
        ref={inputRef}
        id={id}
        value={draft}
        disabled={full}
        aria-describedby={ariaDescribedBy}
        placeholder={full ? `Up to ${maxTags}` : value.length ? 'Add another…' : placeholder}
        onChange={(event) => {
          const next = event.target.value
          if (next.includes(',')) add(next)
          else setDraft(next)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            add(draft)
          } else if (event.key === 'Backspace' && !draft && value.length) {
            event.preventDefault()
            remove(value.length - 1)
          }
        }}
        onBlur={() => add(draft)}
        className="h-6 min-w-24 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
      />
    </div>
  )
}

export { TagInput }
