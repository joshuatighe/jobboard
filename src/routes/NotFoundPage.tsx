import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="mt-2 text-3xl font-semibold">This page took another offer</h1>
      <p className="mt-2 text-muted-foreground">We couldn't find what you were looking for.</p>
      <Button asChild variant="outline" className="mt-8">
        <Link to="/">
          <ArrowLeft /> Back home
        </Link>
      </Button>
    </div>
  )
}
