// ─────────────────────────────────────────────────────────────
// Domínio — Tipagens centrais
// ─────────────────────────────────────────────────────────────

export type PropertyType = 'apartamento' | 'casa' | 'cobertura' | 'terreno' | 'comercial'

export type ListingType = 'compra' | 'aluguel' | 'lancamento' | 'luxo'

export type PropertyStatus = 'disponivel' | 'reservado' | 'vendido'

export interface PropertyImage {
  url: string
  alt: string
}

export interface Property {
  id: string
  title: string
  slug: string
  description: string
  price: number
  /** compra | aluguel | lancamento | luxo */
  listingType: ListingType
  type: PropertyType
  status: PropertyStatus
  city: string
  state: string
  neighborhood: string
  address?: string
  latitude?: number
  longitude?: number
  bedrooms: number
  bathrooms: number
  garage: number
  /** área em m² */
  area: number
  suites?: number
  images: PropertyImage[]
  amenities: string[]
  featured: boolean
  /** ID do corretor responsável */
  agentId?: string
  /** URL de tour 360 / vídeo */
  tourUrl?: string
  videoUrl?: string
  createdAt: string
  updatedAt?: string
}

export interface Agent {
  id: string
  name: string
  role: string
  photo: string
  phone: string
  email: string
  bio?: string
  creci?: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  message?: string
  propertyId?: string
  propertyTitle?: string
  source?: string
  status: 'novo' | 'contatado' | 'qualificado' | 'convertido' | 'perdido'
  createdAt: string
}

// ── Filtros de busca ──────────────────────────────────────────
export interface PropertyFilters {
  listingType?: ListingType
  type?: PropertyType
  city?: string
  neighborhood?: string
  query?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  garage?: number
  minArea?: number
  maxArea?: number
  featured?: boolean
  sort?: 'recent' | 'price-asc' | 'price-desc' | 'area-desc'
  page?: number
  perPage?: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// ── DTOs ─────────────────────────────────────────────────────
export type PropertyInput = Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & {
  slug?: string
}

export type LeadInput = Omit<Lead, 'id' | 'createdAt' | 'status'> & {
  status?: Lead['status']
}
