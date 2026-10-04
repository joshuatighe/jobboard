import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="page-x flex min-h-[70svh] flex-col justify-center py-16">
      <p className="meta text-muted-foreground">404 · No listing at this address</p>
      <h1 className="mt-4 max-w-2xl text-headline">
        Whatever was here has been <span className="highlight">filled</span>, moved or never posted.
      </h1>
      <p className="mt-4 max-w-md text-[15px] text-muted-foreground">
        Check the link, or start from the open roles.
      </p>
      <div className="mt-8 flex gap-2">
        <Button asChild>
          <Link to="/jobs">Browse open roles</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft /> Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
