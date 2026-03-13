import { client } from '@/generated/client.gen'
import { supabase } from '@/infra/supabase.client'

client.instance.interceptors.request.use(async (config) => {
  let { data: { session } } = await supabase.auth.getSession()

  if (session) {
    const expiresAt = session.expires_at ?? 0
    const isExpired = expiresAt * 1000 - Date.now() < 60_000
    if (isExpired) {
      const { data } = await supabase.auth.refreshSession()
      if (data.session) session = data.session
    }
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})
