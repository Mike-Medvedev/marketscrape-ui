import type { CreateClientConfig } from '@/generated/client'
import { settings } from '@/settings'

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseURL: settings.env.VITE_API_URL,
})
