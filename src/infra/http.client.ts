import axios from 'axios'
import { settings } from '@/settings'

export const httpClient = axios.create({
  baseURL: settings.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})
