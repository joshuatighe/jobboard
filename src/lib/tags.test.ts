import { describe, expect, it } from 'vitest'

import { addTags } from '@/lib/tags'

describe('addTags', () => {
  it('splits on commas by default', () => {
    expect(addTags([], 'React, TypeScript,Figma')).toEqual(['React', 'TypeScript', 'Figma'])
  })

  it('keeps commas inside the tag when the separator is a semicolon', () => {
    expect(addTags([], 'San Francisco, CA', { separator: ';' })).toEqual(['San Francisco, CA'])
    expect(addTags([], 'San Francisco, CA; New York, NY', { separator: ';' })).toEqual([
      'San Francisco, CA',
      'New York, NY',
    ])
  })

  it('splits pasted lines with either separator', () => {
    expect(addTags([], 'Austin, TX\nBoston, MA\r\nChicago, IL', { separator: ';' })).toEqual([
      'Austin, TX',
      'Boston, MA',
      'Chicago, IL',
    ])
    expect(addTags([], 'React\nPostgres')).toEqual(['React', 'Postgres'])
  })

  it('tidies whitespace and stray separators at the ends', () => {
    expect(addTags([], '  San   Francisco,  CA , ', { separator: ';' })).toEqual(['San Francisco, CA'])
    expect(addTags([], ', Remote;', { separator: ';' })).toEqual(['Remote'])
  })

  it('ignores empty parts and case-insensitive duplicates', () => {
    const current = ['New York, NY']
    expect(addTags(current, ' ; new york, ny ;', { separator: ';' })).toBe(current)
    expect(addTags(['react'], 'React, Vue')).toEqual(['react', 'Vue'])
  })

  it('respects maxTags and maxLength', () => {
    expect(addTags(['a'], 'b, c, d', { maxTags: 3 })).toEqual(['a', 'b', 'c'])
    expect(addTags([], 'TypeScript', { maxLength: 4 })).toEqual(['Type'])
  })
})
