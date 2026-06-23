import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { Lead, LeadInput } from '@/types'

let mockLeads: Lead[] = []

type Row = Record<string, unknown>

function fromRow(row: Row): Lead {
  return {
    id: String(row.id),
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    message: (row.message as string) ?? undefined,
    propertyId: (row.property_id as string) ?? undefined,
    propertyTitle: (row.property_title as string) ?? undefined,
    source: (row.source as string) ?? undefined,
    status: (row.status as Lead['status']) ?? 'novo',
    createdAt: row.created_at as string,
  }
}

export const leadRepository = {
  async create(input: LeadInput): Promise<Lead> {
    if (!isSupabaseConfigured) {
      const lead: Lead = {
        ...input,
        id: `lead-${Date.now()}`,
        status: input.status ?? 'novo',
        createdAt: new Date().toISOString(),
      }
      mockLeads = [lead, ...mockLeads]
      return lead
    }
    const supabase = await createClient()
    const { data, error } = await supabase!
      .from('leads')
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        property_id: input.propertyId,
        property_title: input.propertyTitle,
        source: input.source,
        status: input.status ?? 'novo',
      })
      .select('*')
      .single()
    if (error) throw error
    return fromRow(data)
  },

  async list(): Promise<Lead[]> {
    if (!isSupabaseConfigured) return mockLeads
    const admin = createAdminClient() ?? (await createClient())
    const { data, error } = await admin!
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map(fromRow)
  },

  async updateStatus(id: string, status: Lead['status']): Promise<void> {
    if (!isSupabaseConfigured) {
      mockLeads = mockLeads.map((l) => (l.id === id ? { ...l, status } : l))
      return
    }
    const admin = createAdminClient() ?? (await createClient())
    const { error } = await admin!.from('leads').update({ status }).eq('id', id)
    if (error) throw error
  },
}
