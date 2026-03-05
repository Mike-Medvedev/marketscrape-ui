import { Outlet } from 'react-router'
import { AppLayout } from '@/theme/components/AppLayout/AppLayout'

export function RootLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
