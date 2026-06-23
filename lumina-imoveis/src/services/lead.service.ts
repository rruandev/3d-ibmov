import { leadRepository } from '@/repositories/lead.repository'
import type { Lead, LeadInput } from '@/types'

export const leadService = {
  create(input: LeadInput): Promise<Lead> {
    // Aqui poderiam entrar integrações: e-mail, CRM, webhook etc.
    return leadRepository.create(input)
  },

  list(): Promise<Lead[]> {
    return leadRepository.list()
  },

  updateStatus(id: string, status: Lead['status']): Promise<void> {
    return leadRepository.updateStatus(id, status)
  },
}
