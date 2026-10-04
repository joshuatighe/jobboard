import type { ReactNode } from 'react'
import { CircleCheck } from 'lucide-react'

import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

const POINTS = [
  'Jobs ranked by how well they fit you',
  'Apply in one click with your saved resume',
  'Live application status, start to offer',
]

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>
      </div>
      <div className="relative isolate hidden overflow-hidden bg-zinc-950 text-white lg:flex lg:flex-col lg:justify-end lg:p-12">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)] bg-[size:40px_40px]"
        />
        <div
          aria-hidden
          className="absolute -top-32 -right-32 -z-10 size-[36rem] rounded-full bg-brand/40 blur-3xl"
        />
        <blockquote className="max-w-md text-2xl leading-snug font-medium tracking-tight">
          Hiring is a two-way match. JobBoard treats it like one.
        </blockquote>
        <ul className="mt-10 space-y-3 text-sm text-zinc-300">
          {POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <CircleCheck className="size-4 text-brand" /> {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
