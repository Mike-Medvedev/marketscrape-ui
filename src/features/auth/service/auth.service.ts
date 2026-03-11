import type { Provider } from '@supabase/supabase-js'
import { supabase } from '@/infra/supabase.client'

export async function login(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signup(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
}

export async function signInWithOAuth(provider: Provider) {
  const { error } = await supabase.auth.signInWithOAuth({ provider })
  if (error) throw error
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
