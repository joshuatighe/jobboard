export type DescriptionBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

const BULLET = /^\s*(?:[•\-*·]|\d+[.)])\s+/

/**
 * Job descriptions are plain text. This turns them into blocks for display:
 * bullet lines ("•", "-", "*", "1.") become lists, and a short line with no closing
 * punctuation that introduces a list ("What you'll do") becomes a heading.
 */
export function parseDescription(text: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = []
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
    paragraph = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() ?? ''
    if (!line) {
      flushParagraph()
      continue
    }

    if (BULLET.test(line)) {
      flushParagraph()
      const item = line.replace(BULLET, '')
      const last = blocks.at(-1)
      if (last?.type === 'list') last.items.push(item)
      else blocks.push({ type: 'list', items: [item] })
      continue
    }

    const next = lines[i + 1]?.trim() ?? ''
    const isHeading =
      paragraph.length === 0 && line.length <= 60 && !/[.!?:;,]$/.test(line) && BULLET.test(next)
    if (isHeading) blocks.push({ type: 'heading', text: line })
    else paragraph.push(line)
  }

  flushParagraph()
  return blocks
}
