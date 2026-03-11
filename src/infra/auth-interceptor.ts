import { client } from '@/generated/client.gen'
import { supabase } from '@/infra/supabase.client'

client.instance.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
