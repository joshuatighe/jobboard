import { DataError } from '@carbon/icons-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/** Shown in place of data-backed screens until Supabase env vars are configured. */
export function SetupNotice() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="mb-2 inline-flex size-10 items-center justify-center border text-muted-foreground">
          <DataError className="size-5" />
        </div>
        <CardTitle>Connect Supabase to continue</CardTitle>
        <CardDescription>
          This screen needs a database. Add your project keys and restart the dev server.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto border bg-muted/50 p-3 font-mono text-xs leading-relaxed">
          {`# .env.local
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>`}
        </pre>
      </CardContent>
    </Card>
  )
}
