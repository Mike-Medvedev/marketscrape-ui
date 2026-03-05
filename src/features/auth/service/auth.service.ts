import { httpClient } from '@/infra/http.client'
import {
  parseAuthResponse,
  parseMeResponse,
  type AuthResponse,
  type MeResponse,
} from '@/features/auth/auth.types'

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await httpClient.post('/api/v1/auth/login', { email, password })
  return parseAuthResponse(data)
}

export async function signup(email: string, password: string): Promise<void> {
  await httpClient.post('/api/v1/auth/signup', { email, password })
}

export async function verify(token: string): Promise<AuthResponse> {
  const { data } = await httpClient.get('/api/v1/auth/verify', {
    params: { token },
  })
  return parseAuthResponse(data)
}

export async function logout(): Promise<void> {
  await httpClient.post('/api/v1/auth/logout')
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await httpClient.get('/api/v1/auth/me')
  return parseMeResponse(data)
}
