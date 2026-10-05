/**
 * The character that ends a tag as you type. Skills use a comma; locations use a semicolon, so a
 * comma stays inside the tag ("San Francisco, CA").
 */
export type TagSeparator = ',' | ';'

/**
 * Adds typed or pasted text to a tag list. The text is split on the separator and on line breaks
 * (pasting one item per line works either way). Each tag is trimmed, has its whitespace collapsed
 * and any stray separators at its ends removed, and is cut to `maxLength`. Empty tags, duplicates
 * (ignoring case) and anything past `maxTags` are dropped. Returns `current` itself when nothing
 * was added.
 */
export function addTags(
  current: string[],
  raw: string,
  {
    separator = ',',
    maxTags = Infinity,
    maxLength = Infinity,
  }: { separator?: TagSeparator; maxTags?: number; maxLength?: number } = {},
): string[] {
  const next = [...current]
  for (const part of raw.split(new RegExp(`[${separator}\\r\\n]`))) {
    const tag = part
      .replace(/\s+/g, ' ')
      .replace(/^[\s,;]+|[\s,;]+$/g, '')
      .slice(0, maxLength)
      .trim()
    if (!tag || next.length >= maxTags) continue
    if (next.some((t) => t.toLowerCase() === tag.toLowerCase())) continue
    next.push(tag)
  }
  return next.length === current.length ? current : next
}
