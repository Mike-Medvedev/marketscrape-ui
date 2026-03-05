import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { Center, Loader } from '@mantine/core'
import { useAuth } from '@/features/auth/hooks/auth.hook'

interface GuestRouteProps {
  children: ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <Center h="100vh">
        <Loader color="var(--primary)" size="lg" />
      </Center>
    )
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
