import { propertyRepository } from '@/repositories/property.repository'
import { agentRepository } from '@/repositories/agent.repository'
import type { Agent, PaginatedResult, Property, PropertyFilters } from '@/types'

/**
 * Camada de serviço — orquestra regras de negócio sobre os
 * repositórios. É o ponto de entrada usado por páginas e actions.
 */
export const propertyService = {
  list(filters: PropertyFilters = {}): Promise<PaginatedResult<Property>> {
    return propertyRepository.list(filters)
  },

  async getFeatured(limit = 6): Promise<Property[]> {
    const { data } = await propertyRepository.list({ featured: true, perPage: limit })
    return data
  },

  getBySlug(slug: string): Promise<Property | null> {
    return propertyRepository.getBySlug(slug)
  },

  getByIds(ids: string[]): Promise<Property[]> {
    return propertyRepository.getManyByIds(ids)
  },

  async getWithAgent(
    slug: string,
  ): Promise<{ property: Property; agent: Agent | null } | null> {
    const property = await propertyRepository.getBySlug(slug)
    if (!property) return null
    const agent = property.agentId
      ? await agentRepository.getById(property.agentId)
      : null
    return { property, agent }
  },

  /** Imóveis relacionados (mesma cidade, excluindo o atual). */
  async getRelated(property: Property, limit = 3): Promise<Property[]> {
    const { data } = await propertyRepository.list({
      city: property.city,
      perPage: limit + 1,
    })
    return data.filter((p) => p.id !== property.id).slice(0, limit)
  },

  async getAllSlugs(): Promise<string[]> {
    const { data } = await propertyRepository.list({ perPage: 1000 })
    return data.map((p) => p.slug)
  },
}
