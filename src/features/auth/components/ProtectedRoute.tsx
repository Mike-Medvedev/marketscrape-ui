import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { Center, Loader } from '@mantine/core'
import { useAuth } from '@/features/auth/hooks/auth.hook'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <Center h="100vh">
        <Loader color="var(--primary)" size="lg" />
      </Center>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
