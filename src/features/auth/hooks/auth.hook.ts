import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { setToken, clearToken, getToken } from '@/infra/auth-token'
import * as authService from '@/features/auth/service/auth.service'
import type { AuthState } from '@/features/auth/auth.types'

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  verify: (token: string) => Promise<void>
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
    email: null,
  })

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setState({ status: 'unauthenticated', email: null })
      return
    }

    authService
      .getMe()
      .then((res) => {
        setState({ status: 'authenticated', email: res.data.email })
      })
      .catch(() => {
        clearToken()
        setState({ status: 'unauthenticated', email: null })
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password)
    setToken(res.data.sessionToken)
    setState({ status: 'authenticated', email: res.data.email })
  }, [])

  const signup = useCallback(async (email: string, password: string) => {
    await authService.signup(email, password)
  }, [])

  const verify = useCallback(async (token: string) => {
    const res = await authService.verify(token)
    setToken(res.data.sessionToken)
    setState({ status: 'authenticated', email: res.data.email })
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      clearToken()
      setState({ status: 'unauthenticated', email: null })
    }
  }, [])

  return useMemo(
    () => ({ ...state, login, signup, verify, logout }),
    [state, login, signup, verify, logout],
  )
}
