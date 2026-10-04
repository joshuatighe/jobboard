import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type CarbonIconType, CircleDash, Portfolio, Search } from '@carbon/icons-react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { z } from 'zod'

import { AuthLayout } from '@/components/layout/AuthLayout'
import { SetupNotice } from '@/components/layout/SetupNotice'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { signUp } from '@/lib/api/auth'
import { homeFor } from '@/lib/routes'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'

const schema = z
  .object({
    role: z.enum(['seeker', 'recruiter']),
    fullName: z.string().trim().min(2, 'Enter your name'),
    companyName: z.string().trim().optional(),
    email: z.email('Enter a valid email'),
    password: z.string().min(8, 'Use at least 8 characters'),
  })
  .refine((v) => v.role === 'seeker' || (v.companyName?.length ?? 0) >= 2, {
    path: ['companyName'],
    message: 'Enter your company name',
  })

type Values = z.infer<typeof schema>

const ROLES: { value: UserRole; label: string; description: string; icon: CarbonIconType }[] = [
  { value: 'seeker', label: "I'm job hunting", description: 'Find and apply to jobs', icon: Search },
  { value: 'recruiter', label: "I'm hiring", description: 'Post jobs, review talent', icon: Portfolio },
]

export function SignUpPage() {
  const { status, profile } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [formError, setFormError] = useState<string>()
  const [checkEmail, setCheckEmail] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { role: params.get('role') === 'recruiter' ? 'recruiter' : 'seeker' },
  })
  const role = useWatch({ control, name: 'role' })

  if (status === 'signed-in' && profile) return <Navigate to={homeFor(profile.role)} replace />

  async function onSubmit(values: Values) {
    setFormError(undefined)
    try {
      const { session } = await signUp({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: values.role,
        companyName: values.role === 'recruiter' ? values.companyName : undefined,
      })
      if (session) navigate(homeFor(values.role), { replace: true })
      else setCheckEmail(true)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <AuthLayout
      title={checkEmail ? 'Check your email' : 'Create your account'}
      description={
        checkEmail
          ? 'We sent you a confirmation link. Click it to finish signing up.'
          : 'Free for job seekers. Pick a side; it takes a minute.'
      }
      footer={
        <>
          Already have an account?{' '}
          <Link to="/sign-in" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
            Sign in
          </Link>
        </>
      }
    >
      {!isSupabaseConfigured ? (
        <SetupNotice />
      ) : checkEmail ? null : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div role="radiogroup" aria-label="Account type" className="grid grid-cols-2 gap-3">
            {ROLES.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={role === value}
                onClick={() => setValue('role', value)}
                className={cn(
                  'flex cursor-pointer flex-col items-start gap-3 border p-4 text-left transition-colors outline-none hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  role === value && 'border-foreground bg-card ring-1 ring-foreground hover:bg-card',
                )}
              >
                <Icon className={cn('size-5', role === value ? 'text-foreground' : 'text-muted-foreground')} />
                <div>
                  <div className="font-serif text-lg leading-tight">{label}</div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </div>
              </button>
            ))}
          </div>

          <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
            <Input
              id="fullName"
              autoComplete="name"
              placeholder="Ada Lovelace"
              aria-invalid={!!errors.fullName}
              {...register('fullName')}
            />
          </FormField>
          {role === 'recruiter' && (
            <FormField id="companyName" label="Company" error={errors.companyName?.message}>
              <Input
                id="companyName"
                autoComplete="organization"
                placeholder="Acme Inc."
                aria-invalid={!!errors.companyName}
                {...register('companyName')}
              />
            </FormField>
          )}
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
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
          </FormField>
          {formError && (
            <p role="alert" className="border border-destructive/30 bg-destructive/8 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting && <CircleDash className="animate-spin" />}
            Create account
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
