import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import type { Provider } from '@supabase/supabase-js'
import { supabase } from '@/infra/supabase.client'
import * as authService from '@/features/auth/service/auth.service'
import type { AuthState } from '@/features/auth/auth.types'

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  signInWithOAuth: (provider: Provider) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext }

export function useAuthProvider(): AuthContextValue {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    user: null,
    email: null,
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState({
          status: 'authenticated',
          user: session.user,
          email: session.user.email ?? null,
        })
      } else {
        setState({ status: 'unauthenticated', user: null, email: null })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setState({
            status: 'authenticated',
            user: session.user,
            email: session.user.email ?? null,
          })
        } else {
          setState({ status: 'unauthenticated', user: null, email: null })
        }
      },
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await authService.login(email, password)
  }, [])

  const signup = useCallback(async (email: string, password: string) => {
    await authService.signup(email, password)
  }, [])

  const signInWithOAuth = useCallback(async (provider: Provider) => {
    await authService.signInWithOAuth(provider)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
  }, [])

  return useMemo(
    () => ({ ...state, login, signup, signInWithOAuth, logout }),
    [state, login, signup, signInWithOAuth, logout],
  )
}
