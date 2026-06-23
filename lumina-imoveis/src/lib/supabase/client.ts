'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './config'

/** Cliente Supabase para uso no browser (componentes client). */
export function createClient() {
  if (!isSupabaseConfigured) return null
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
}
