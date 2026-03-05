import axios from 'axios'
import { settings } from '@/settings'
import { getToken } from '@/infra/auth-token'

export const httpClient = axios.create({
  baseURL: settings.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
