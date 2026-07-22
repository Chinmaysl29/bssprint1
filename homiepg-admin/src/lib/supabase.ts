import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Admin Supabase environment variables are not configured')
  return createSupabaseClient(url, key)
}
