import { z } from 'zod/v4'

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_GOOGLE_MAPS_API_KEY: z.string().min(1),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.issues)
  throw new Error('Invalid environment variables')
}

export const settings = {
  env: parsed.data,
  isDev: parsed.data.VITE_ENV === 'development',
  isProd: parsed.data.VITE_ENV === 'production',
} as const
