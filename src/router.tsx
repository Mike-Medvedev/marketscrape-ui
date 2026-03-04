import { createBrowserRouter, RouterProvider } from 'react-router'
import { RootLayout } from '@/routes/root'
import { DashboardPage } from '@/features/search/page/DashboardPage'
import { NewSearchPage } from '@/features/search/page/NewSearchPage'
import { ResultsPage } from '@/features/search/page/ResultsPage'
import { FacebookAuthPage } from '@/features/auth/page/FacebookAuthPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'new', element: <NewSearchPage /> },
      { path: 'edit/:id', element: <NewSearchPage /> },
      { path: 'results/:id', element: <ResultsPage /> },
      { path: 'auth/facebook', element: <FacebookAuthPage /> },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
