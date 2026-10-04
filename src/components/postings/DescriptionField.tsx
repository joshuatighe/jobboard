import { useState } from 'react'
import { Eye, FileText, PencilLine } from 'lucide-react'

import { JobDescription } from '@/components/jobs/JobDescription'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { DESCRIPTION_TEMPLATE } from '@/lib/postings'

/**
 * R10: the description as plain text, with a preview rendered exactly as the job page shows it
 * (`parseDescription`): "-" lines become bullets, and a short line above a list becomes a heading.
 */
export function DescriptionField({
  id,
  value,
  onChange,
  onBlur,
  invalid,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  invalid: boolean
}) {
  const [tab, setTab] = useState('write')

  return (
    <Tabs value={tab} onValueChange={setTab} className="gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList aria-label="Description editor">
          <TabsTrigger value="write">
            <PencilLine /> Write
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye /> Preview
          </TabsTrigger>
        </TabsList>
        {!value.trim() && tab === 'write' && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(DESCRIPTION_TEMPLATE)}>
            <FileText /> Start from an outline
          </Button>
        )}
      </div>
      <TabsContent value="write" className="grid gap-2">
        <Textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          rows={14}
          className="min-h-72 leading-relaxed"
          placeholder="What the team does, what this person will own, and what you're looking for."
          aria-invalid={invalid}
          aria-describedby={`${id}-hint${invalid ? ` ${id}-error` : ''}`}
        />
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          Plain text. Start a line with “-” for a bullet. A short line right above a list becomes a heading.
        </p>
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-72 rounded-lg border px-4 py-3">
          {value.trim() ? (
            <JobDescription text={value} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
