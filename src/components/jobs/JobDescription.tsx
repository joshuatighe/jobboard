import { parseDescription } from '@/lib/description'

export function JobDescription({ text }: { text: string }) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90">
      {parseDescription(text).map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={i} className="pt-3 text-base font-semibold text-foreground">
                {block.text}
              </h2>
            )
          case 'list':
            return (
              <ul key={i} className="ml-5 list-disc space-y-1.5 marker:text-muted-foreground">
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            )
          case 'paragraph':
            return <p key={i}>{block.text}</p>
        }
      })}
    </div>
  )
}
