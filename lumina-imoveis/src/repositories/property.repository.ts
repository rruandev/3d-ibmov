import { PROPERTIES } from '@/data/properties'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { slugify } from '@/lib/utils'
import type {
  PaginatedResult,
  Property,
  PropertyFilters,
  PropertyInput,
} from '@/types'

// In-memory mock store (mutável em runtime para o dashboard demo)
let mockStore: Property[] = [...PROPERTIES]

const DEFAULT_PER_PAGE = 9

// ── Mapeamento snake_case (DB) <-> camelCase (domínio) ───────────
type Row = Record<string, unknown>

function fromRow(row: Row): Property {
  return {
    id: String(row.id),
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string,
    price: Number(row.price),
    listingType: row.listing_type as Property['listingType'],
    type: row.type as Property['type'],
    status: (row.status as Property['status']) ?? 'disponivel',
    city: row.city as string,
    state: row.state as string,
    neighborhood: row.neighborhood as string,
    address: (row.address as string) ?? undefined,
    latitude: (row.latitude as number) ?? undefined,
    longitude: (row.longitude as number) ?? undefined,
    bedrooms: Number(row.bedrooms),
    bathrooms: Number(row.bathrooms),
    garage: Number(row.garage),
    area: Number(row.area),
    suites: (row.suites as number) ?? undefined,
    images: (row.images as Property['images']) ?? [],
    amenities: (row.amenities as string[]) ?? [],
    featured: Boolean(row.featured),
    agentId: (row.agent_id as string) ?? undefined,
    tourUrl: (row.tour_url as string) ?? undefined,
    videoUrl: (row.video_url as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string) ?? undefined,
  }
}

function toRow(input: PropertyInput): Row {
  return {
    title: input.title,
    slug: input.slug || slugify(input.title),
    description: input.description,
    price: input.price,
    listing_type: input.listingType,
    type: input.type,
    status: input.status,
    city: input.city,
    state: input.state,
    neighborhood: input.neighborhood,
    address: input.address,
    latitude: input.latitude,
    longitude: input.longitude,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    garage: input.garage,
    area: input.area,
    suites: input.suites,
    images: input.images,
    amenities: input.amenities,
    featured: input.featured,
    agent_id: input.agentId,
    tour_url: input.tourUrl,
    video_url: input.videoUrl,
  }
}

// ── Filtragem em memória (mock) ─────────────────────────────────
function applyFilters(items: Property[], f: PropertyFilters): Property[] {
  let result = [...items]
  if (f.listingType) result = result.filter((p) => p.listingType === f.listingType)
  if (f.type) result = result.filter((p) => p.type === f.type)
  if (f.featured) result = result.filter((p) => p.featured)
  if (f.city) result = result.filter((p) => p.city === f.city)
  if (f.neighborhood)
    result = result.filter((p) =>
      p.neighborhood.toLowerCase().includes(f.neighborhood!.toLowerCase()),
    )
  if (f.query) {
    const q = f.query.toLowerCase()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }
  if (f.minPrice != null) result = result.filter((p) => p.price >= f.minPrice!)
  if (f.maxPrice != null) result = result.filter((p) => p.price <= f.maxPrice!)
  if (f.bedrooms != null) result = result.filter((p) => p.bedrooms >= f.bedrooms!)
  if (f.bathrooms != null) result = result.filter((p) => p.bathrooms >= f.bathrooms!)
  if (f.garage != null) result = result.filter((p) => p.garage >= f.garage!)
  if (f.minArea != null) result = result.filter((p) => p.area >= f.minArea!)
  if (f.maxArea != null) result = result.filter((p) => p.area <= f.maxArea!)

  switch (f.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'area-desc':
      result.sort((a, b) => b.area - a.area)
      break
    default:
      result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }
  return result
}

// ─────────────────────────────────────────────────────────────
//  Repository
// ─────────────────────────────────────────────────────────────
export const propertyRepository = {
  async list(filters: PropertyFilters = {}): Promise<PaginatedResult<Property>> {
    const page = filters.page ?? 1
    const perPage = filters.perPage ?? DEFAULT_PER_PAGE

    if (!isSupabaseConfigured) {
      const filtered = applyFilters(mockStore, filters)
      const total = filtered.length
      const start = (page - 1) * perPage
      return {
        data: filtered.slice(start, start + perPage),
        total,
        page,
        perPage,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
      }
    }

    const supabase = await createClient()
    let query = supabase!.from('properties').select('*', { count: 'exact' })

    if (filters.listingType) query = query.eq('listing_type', filters.listingType)
    if (filters.type) query = query.eq('type', filters.type)
    if (filters.featured) query = query.eq('featured', true)
    if (filters.city) query = query.eq('city', filters.city)
    if (filters.neighborhood) query = query.ilike('neighborhood', `%${filters.neighborhood}%`)
    if (filters.query) query = query.ilike('title', `%${filters.query}%`)
    if (filters.minPrice != null) query = query.gte('price', filters.minPrice)
    if (filters.maxPrice != null) query = query.lte('price', filters.maxPrice)
    if (filters.bedrooms != null) query = query.gte('bedrooms', filters.bedrooms)
    if (filters.bathrooms != null) query = query.gte('bathrooms', filters.bathrooms)
    if (filters.garage != null) query = query.gte('garage', filters.garage)
    if (filters.minArea != null) query = query.gte('area', filters.minArea)
    if (filters.maxArea != null) query = query.lte('area', filters.maxArea)

    const orderMap = {
      'price-asc': ['price', true],
      'price-desc': ['price', false],
      'area-desc': ['area', false],
      recent: ['created_at', false],
    } as const
    const [col, asc] = orderMap[filters.sort ?? 'recent']
    query = query.order(col, { ascending: asc })

    const start = (page - 1) * perPage
    query = query.range(start, start + perPage - 1)

    const { data, count, error } = await query
    if (error) throw error
    const total = count ?? 0
    return {
      data: (data ?? []).map(fromRow),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    }
  },

  async getBySlug(slug: string): Promise<Property | null> {
    if (!isSupabaseConfigured) {
      return mockStore.find((p) => p.slug === slug) ?? null
    }
    const supabase = await createClient()
    const { data, error } = await supabase!
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    return data ? fromRow(data) : null
  },

  async getById(id: string): Promise<Property | null> {
    if (!isSupabaseConfigured) return mockStore.find((p) => p.id === id) ?? null
    const supabase = await createClient()
    const { data, error } = await supabase!
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data ? fromRow(data) : null
  },

  async getManyByIds(ids: string[]): Promise<Property[]> {
    if (ids.length === 0) return []
    if (!isSupabaseConfigured) return mockStore.filter((p) => ids.includes(p.id))
    const supabase = await createClient()
    const { data, error } = await supabase!.from('properties').select('*').in('id', ids)
    if (error) throw error
    return (data ?? []).map(fromRow)
  },

  async create(input: PropertyInput): Promise<Property> {
    if (!isSupabaseConfigured) {
      const now = new Date().toISOString()
      const created: Property = {
        ...input,
        id: `prop-${Date.now()}`,
        slug: input.slug || slugify(input.title),
        createdAt: now,
        updatedAt: now,
      }
      mockStore = [created, ...mockStore]
      return created
    }
    const admin = createAdminClient() ?? (await createClient())
    const { data, error } = await admin!
      .from('properties')
      .insert(toRow(input))
      .select('*')
      .single()
    if (error) throw error
    return fromRow(data)
  },

  async update(id: string, input: Partial<PropertyInput>): Promise<Property> {
    if (!isSupabaseConfigured) {
      mockStore = mockStore.map((p) =>
        p.id === id ? { ...p, ...input, updatedAt: new Date().toISOString() } : p,
      )
      return mockStore.find((p) => p.id === id)!
    }
    const admin = createAdminClient() ?? (await createClient())
    const { data, error } = await admin!
      .from('properties')
      .update(toRow(input as PropertyInput))
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error
    return fromRow(data)
  },

  async remove(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      mockStore = mockStore.filter((p) => p.id !== id)
      return
    }
    const admin = createAdminClient() ?? (await createClient())
    const { error } = await admin!.from('properties').delete().eq('id', id)
    if (error) throw error
  },
}
