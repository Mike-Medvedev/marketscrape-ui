import { createClient } from '@supabase/supabase-js'
import { settings } from '@/settings'

export const supabase = createClient(
  settings.env.VITE_SUPABASE_URL,
  settings.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
)
