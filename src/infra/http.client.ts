import axios from 'axios'
import { settings } from '@/settings'
import { supabase } from '@/infra/supabase.client'

export const httpClient = axios.create({
  baseURL: settings.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
