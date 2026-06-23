import { AGENTS } from '@/data/agents'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { Agent } from '@/types'

export const agentRepository = {
  async list(): Promise<Agent[]> {
    if (!isSupabaseConfigured) return AGENTS
    const supabase = await createClient()
    const { data, error } = await supabase!.from('agents').select('*')
    if (error) throw error
    return (data ?? []).map((row) => ({
      id: String(row.id),
      name: row.name,
      role: row.role,
      photo: row.photo,
      phone: row.phone,
      email: row.email,
      bio: row.bio ?? undefined,
      creci: row.creci ?? undefined,
    }))
  },

  async getById(id: string): Promise<Agent | null> {
    const all = await this.list()
    return all.find((a) => a.id === id) ?? null
  },
}
