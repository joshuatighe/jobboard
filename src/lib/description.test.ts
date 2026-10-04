import { describe, expect, it } from 'vitest'

import { parseDescription } from '@/lib/description'

describe('parseDescription', () => {
  it('parses the seed format: summary, then headed bullet lists', () => {
    const text = [
      'Own the analyst workspace.',
      '',
      "What you'll do",
      '• Build fast interfaces',
      '• Design streaming UI',
      '',
      'Why Lumen AI',
      '• Meaningful equity',
    ].join('\n')

    expect(parseDescription(text)).toEqual([
      { type: 'paragraph', text: 'Own the analyst workspace.' },
      { type: 'heading', text: "What you'll do" },
      { type: 'list', items: ['Build fast interfaces', 'Design streaming UI'] },
      { type: 'heading', text: 'Why Lumen AI' },
      { type: 'list', items: ['Meaningful equity'] },
    ])
  })

  it('joins wrapped lines into one paragraph and splits on blank lines', () => {
    expect(parseDescription('First line\nsecond line\n\nNew paragraph')).toEqual([
      { type: 'paragraph', text: 'First line second line' },
      { type: 'paragraph', text: 'New paragraph' },
    ])
  })

  it('accepts dash and numbered bullets', () => {
    expect(parseDescription('- one\n* two\n1. three\n2) four')).toEqual([
      { type: 'list', items: ['one', 'two', 'three', 'four'] },
    ])
  })

  it('does not treat a sentence before a list as a heading', () => {
    expect(parseDescription('You will:\n- ship')).toEqual([
      { type: 'paragraph', text: 'You will:' },
      { type: 'list', items: ['ship'] },
    ])
  })

  it('returns no blocks for empty text', () => {
    expect(parseDescription('  \n\n')).toEqual([])
  })
})
