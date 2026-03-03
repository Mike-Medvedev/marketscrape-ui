import { createBrowserRouter, RouterProvider } from 'react-router'
import { RootLayout } from './routes/root'
import { Index } from './routes/index'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
