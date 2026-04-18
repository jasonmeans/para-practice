import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey)

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const missingSupabaseConfig = [
  !supabaseUrl ? 'VITE_SUPABASE_URL' : null,
  !supabasePublishableKey ? 'VITE_SUPABASE_PUBLISHABLE_KEY' : null,
].filter((value): value is string => Boolean(value))

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured for this build.')
  }

  return supabase
}
