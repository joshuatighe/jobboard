import { LogoMark } from '@/components/brand/Logo'

export function FullPageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <LogoMark className="size-9 animate-pulse" />
    </div>
  )
}
