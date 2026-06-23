import type { Metadata } from 'next'
import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { propertyService } from '@/services/property.service'
import { PropertyCard } from '@/components/property/property-card'
import { SearchFilters } from '@/components/search/search-filters'
import { SortSelect } from '@/components/search/sort-select'
import { Pagination } from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import type { PropertyFilters } from '@/types'

export const metadata: Metadata = {
  title: 'Imóveis à venda e para alugar',
  description:
    'Explore a seleção LUMINA de apartamentos, casas e coberturas de alto padrão. Filtre por cidade, preço, quartos e muito mais.',
  alternates: { canonical: '/imoveis' },
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function parseFilters(sp: Record<string, string | string[] | undefined>): PropertyFilters {
  const str = (k: string) => (typeof sp[k] === 'string' ? (sp[k] as string) : undefined)
  const num = (k: string) => {
    const v = str(k)
    return v ? Number(v) : undefined
  }
  return {
    listingType: str('listingType') as PropertyFilters['listingType'],
    type: str('type') as PropertyFilters['type'],
    city: str('city'),
    neighborhood: str('neighborhood'),
    query: str('query'),
    minPrice: num('minPrice'),
    maxPrice: num('maxPrice'),
    bedrooms: num('bedrooms'),
    bathrooms: num('bathrooms'),
    garage: num('garage'),
    minArea: num('minArea'),
    sort: (str('sort') as PropertyFilters['sort']) ?? 'recent',
    page: num('page') ?? 1,
    perPage: 9,
  }
}

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const filters = parseFilters(sp)
  const { data, total, page, totalPages } = await propertyService.list(filters)

  return (
    <div className="bg-background pb-24 pt-28">
      <div className="container">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Imóveis disponíveis
          </h1>
          <p className="mt-2 text-muted-foreground">
            {total} {total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>
        </div>

        <SearchFilters />

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <SortSelect />
        </div>

        {data.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
            <SearchX className="size-12 text-muted-foreground" />
            <div>
              <h3 className="font-display text-xl font-semibold">Nenhum imóvel encontrado</h3>
              <p className="mt-1 text-muted-foreground">Ajuste os filtros e tente novamente.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/imoveis">Limpar busca</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((property, i) => (
                <PropertyCard key={property.id} property={property} priority={i < 3} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  )
}
