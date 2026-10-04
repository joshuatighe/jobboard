import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** False until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set. The UI shows a setup notice. */
export const isSupabaseConfigured = Boolean(url && anonKey)

/** The single Supabase client. Only `lib/api` should import this. */
export const supabase = createClient<Database>(
  url || 'http://localhost:54321',
  anonKey || 'missing-anon-key',
)
