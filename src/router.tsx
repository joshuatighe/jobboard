import { createBrowserRouter, Navigate } from 'react-router'

import { MarketingLayout } from '@/components/layout/MarketingLayout'
import { RequireRole } from '@/components/layout/RequireRole'
import { LandingPage } from '@/routes/marketing/LandingPage'
import { NotFoundPage } from '@/routes/NotFoundPage'

// The landing page loads eagerly; everything behind it is code-split per route.
export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      // Public, so anyone can browse open roles (R4, R5). Applying requires a seeker account.
      {
        path: 'jobs',
        lazy: () => import('@/routes/seeker/JobSearchPage').then((m) => ({ Component: m.JobSearchPage })),
      },
      {
        path: 'jobs/:jobId',
        lazy: () => import('@/routes/seeker/JobDetailPage').then((m) => ({ Component: m.JobDetailPage })),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: 'sign-in',
    lazy: () => import('@/routes/auth/SignInPage').then((m) => ({ Component: m.SignInPage })),
  },
  {
    path: 'sign-up',
    lazy: () => import('@/routes/auth/SignUpPage').then((m) => ({ Component: m.SignUpPage })),
  },
  {
    element: <RequireRole role="seeker" />,
    children: [
      {
        lazy: () => import('@/components/layout/AppShell').then((m) => ({ Component: m.AppShell })),
        children: [
          {
            path: 'for-you',
            lazy: () => import('@/routes/seeker/ForYouPage').then((m) => ({ Component: m.ForYouPage })),
          },
          {
            path: 'applications',
            lazy: () =>
              import('@/routes/seeker/ApplicationsPage').then((m) => ({ Component: m.ApplicationsPage })),
          },
          {
            path: 'profile',
            lazy: () => import('@/routes/seeker/ProfilePage').then((m) => ({ Component: m.ProfilePage })),
          },
        ],
      },
    ],
  },
  {
    element: <RequireRole role="recruiter" />,
    children: [
      {
        lazy: () => import('@/components/layout/AppShell').then((m) => ({ Component: m.AppShell })),
        children: [
          {
            path: 'dashboard',
            lazy: () =>
              import('@/routes/recruiter/DashboardPage').then((m) => ({ Component: m.DashboardPage })),
          },
          { path: 'postings', element: <Navigate to="/dashboard" replace /> },
          {
            path: 'postings/new',
            lazy: () =>
              import('@/routes/recruiter/PostingEditorPage').then((m) => ({
                Component: m.PostingEditorPage,
              })),
          },
          {
            path: 'postings/:jobId',
            lazy: () =>
              import('@/routes/recruiter/PostingApplicantsPage').then((m) => ({
                Component: m.PostingApplicantsPage,
              })),
          },
          {
            path: 'postings/:jobId/edit',
            lazy: () =>
              import('@/routes/recruiter/PostingEditorPage').then((m) => ({
                Component: m.PostingEditorPage,
              })),
          },
        ],
      },
    ],
  },
])
