import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

type CookieToSet = { name: string; value: string; options?: CookieOptions }
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from './config'

/** Cliente Supabase para Server Components / Route Handlers. */
export async function createClient() {
  if (!isSupabaseConfigured) return null
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Chamado de um Server Component — pode ser ignorado com middleware ativo.
        }
      },
    },
  })
}

/**
 * Cliente administrativo (service role) — ignora RLS.
 * Usar APENAS em Server Actions / rotas protegidas do admin.
 */
export function createAdminClient() {
  if (!isSupabaseConfigured || !SUPABASE_SERVICE_ROLE_KEY) return null
  return createServerClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  })
}
