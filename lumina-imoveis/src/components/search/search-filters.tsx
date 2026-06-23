'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { CITIES, LISTING_TYPES, PROPERTY_TYPES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function SearchFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [open, setOpen] = useState(false)

  const get = (k: string) => params.get(k) ?? ''

  const apply = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(params.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v)
        else next.delete(k)
      })
      next.delete('page')
      router.push(`/imoveis?${next.toString()}`)
    },
    [params, router],
  )

  const activeCount = ['type', 'city', 'minPrice', 'maxPrice', 'bedrooms', 'bathrooms', 'garage', 'minArea'].filter(
    (k) => params.get(k),
  ).length

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      {/* Linha principal */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          {LISTING_TYPES.map((t) => {
            const active = get('listingType') === t.value
            return (
              <button
                key={t.value}
                onClick={() => apply({ listingType: active ? '' : t.value })}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  active ? 'bg-premium text-white shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={get('query')}
            placeholder="Buscar por bairro, cidade ou referência…"
            className="pl-11"
            onKeyDown={(e) => {
              if (e.key === 'Enter') apply({ query: (e.target as HTMLInputElement).value })
            }}
          />
        </div>

        <Button variant="outline" onClick={() => setOpen((o) => !o)} className="relative">
          <SlidersHorizontal className="size-4" />
          Filtros
          {activeCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filtros avançados */}
      {open && (
        <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterField label="Tipo">
            <Select value={get('type')} onChange={(e) => apply({ type: e.target.value })}>
              <option value="">Todos</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </FilterField>

          <FilterField label="Cidade">
            <Select value={get('city')} onChange={(e) => apply({ city: e.target.value })}>
              <option value="">Todas</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FilterField>

          <FilterField label="Quartos (mín.)">
            <Select value={get('bedrooms')} onChange={(e) => apply({ bedrooms: e.target.value })}>
              <option value="">Qualquer</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </Select>
          </FilterField>

          <FilterField label="Vagas (mín.)">
            <Select value={get('garage')} onChange={(e) => apply({ garage: e.target.value })}>
              <option value="">Qualquer</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </Select>
          </FilterField>

          <FilterField label="Banheiros (mín.)">
            <Select value={get('bathrooms')} onChange={(e) => apply({ bathrooms: e.target.value })}>
              <option value="">Qualquer</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </Select>
          </FilterField>

          <FilterField label="Preço mín. (R$)">
            <Input
              type="number"
              defaultValue={get('minPrice')}
              placeholder="0"
              onBlur={(e) => apply({ minPrice: e.target.value })}
            />
          </FilterField>

          <FilterField label="Preço máx. (R$)">
            <Input
              type="number"
              defaultValue={get('maxPrice')}
              placeholder="Sem limite"
              onBlur={(e) => apply({ maxPrice: e.target.value })}
            />
          </FilterField>

          <FilterField label="Área mín. (m²)">
            <Input
              type="number"
              defaultValue={get('minArea')}
              placeholder="0"
              onBlur={(e) => apply({ minArea: e.target.value })}
            />
          </FilterField>

          {activeCount > 0 && (
            <div className="sm:col-span-2 lg:col-span-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/imoveis')}>
                <X className="size-4" />
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
