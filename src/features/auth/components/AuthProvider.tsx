import type { ReactNode } from 'react'
import { AuthContext, useAuthProvider } from '@/features/auth/hooks/auth.hook'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthProvider()
  return <AuthContext value={auth}>{children}</AuthContext>
}
