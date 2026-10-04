import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'

import { AuthLayout } from '@/components/layout/AuthLayout'
import { SetupNotice } from '@/components/layout/SetupNotice'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { fetchProfile, signIn } from '@/lib/api/auth'
import { homeFor } from '@/lib/routes'
import { isSupabaseConfigured } from '@/lib/supabase'

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})

type Values = z.infer<typeof schema>

export function SignInPage() {
  const { status, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string>()
  const from = (location.state as { from?: string } | null)?.from

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  if (status === 'signed-in' && profile) return <Navigate to={from ?? homeFor(profile.role)} replace />

  async function onSubmit(values: Values) {
    setFormError(undefined)
    try {
      const { user } = await signIn(values.email, values.password)
      const signedIn = await fetchProfile(user.id)
      navigate(from ?? homeFor(signedIn?.role), { replace: true })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to pick up where you left off."
      footer={
        <>
          New to JobBoard?{' '}
          <Link to="/sign-up" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
            Create an account
          </Link>
        </>
      }
    >
      {!isSupabaseConfigured ? (
        <SetupNotice />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <FormField id="email" label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
          </FormField>
          <FormField id="password" label="Password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
          </FormField>
          {formError && (
            <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/8 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting && <Loader2 className="animate-spin" />}
            Sign in
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
