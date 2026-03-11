import { createBrowserRouter, RouterProvider } from 'react-router'
import { RootLayout } from '@/routes/root'
import { DashboardPage } from '@/features/search/page/DashboardPage/DashboardPage'
import { NewSearchPage } from '@/features/search/page/NewSearchPage/NewSearchPage'
import { ResultsPage } from '@/features/search/page/ResultsPage/ResultsPage'
import { FacebookAuthPage } from '@/features/auth/page/FacebookAuthPage/FacebookAuthPage'
import { LoginPage } from '@/features/auth/page/LoginPage/LoginPage'
import { SignupPage } from '@/features/auth/page/SignupPage/SignupPage'
import { SettingsPage } from '@/features/settings/page/SettingsPage/SettingsPage'
import { NotFoundPage } from '@/features/not-found/page/NotFoundPage/NotFoundPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { GuestRoute } from '@/features/auth/components/GuestRoute'

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <GuestRoute>
        <SignupPage />
      </GuestRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'new', element: <NewSearchPage /> },
      { path: 'edit/:id', element: <NewSearchPage /> },
      { path: 'results/:id', element: <ResultsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'auth/facebook', element: <FacebookAuthPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
