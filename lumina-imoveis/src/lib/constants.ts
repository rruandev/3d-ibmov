import type { ListingType, PropertyType } from '@/types'

export const SITE_CONFIG = {
  name: 'LUMINA Imóveis',
  shortName: 'LUMINA',
  description:
    'Plataforma imobiliária premium. Encontre apartamentos, casas e coberturas de luxo com a curadoria LUMINA.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ogImage: '/opengraph-image',
  phone: '+55 11 99999-0000',
  email: 'contato@lumina.com.br',
  address: 'Av. Brigadeiro Faria Lima, 4440 — Itaim Bibi, São Paulo / SP',
  social: {
    instagram: 'https://instagram.com/lumina',
    linkedin: 'https://linkedin.com/company/lumina',
    youtube: 'https://youtube.com/@lumina',
  },
} as const

export const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Imóveis', href: '/imoveis' },
  { label: 'Lançamentos', href: '/imoveis?listingType=lancamento' },
  { label: 'Luxo', href: '/imoveis?listingType=luxo' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Contato', href: '/#contato' },
] as const

export const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: 'compra', label: 'Compra' },
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'lancamento', label: 'Lançamentos' },
  { value: 'luxo', label: 'Luxo' },
]

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
]

export const CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Florianópolis',
  'Balneário Camboriú',
  'Curitiba',
  'Belo Horizonte',
] as const

export const PRICE_RANGES = [
  { label: 'Até R$ 500 mil', min: 0, max: 500_000 },
  { label: 'R$ 500 mil – 1 mi', min: 500_000, max: 1_000_000 },
  { label: 'R$ 1 mi – 3 mi', min: 1_000_000, max: 3_000_000 },
  { label: 'R$ 3 mi – 10 mi', min: 3_000_000, max: 10_000_000 },
  { label: 'Acima de R$ 10 mi', min: 10_000_000, max: Number.MAX_SAFE_INTEGER },
] as const

export const STATS = [
  { label: 'Imóveis vendidos', value: 2840, suffix: '+' },
  { label: 'Clientes satisfeitos', value: 1960, suffix: '+' },
  { label: 'Anos de mercado', value: 18, suffix: '' },
  { label: 'Cidades atendidas', value: 24, suffix: '' },
] as const

export const MAX_COMPARE = 4
