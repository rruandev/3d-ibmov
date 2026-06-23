'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { LISTING_TYPES, CITIES, PROPERTY_TYPES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { ListingType } from '@/types'

export function QuickSearch({ className }: { className?: string }) {
  const router = useRouter()
  const [listingType, setListingType] = useState<ListingType>('compra')
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [query, setQuery] = useState('')

  function submit() {
    const params = new URLSearchParams()
    params.set('listingType', listingType)
    if (city) params.set('city', city)
    if (type) params.set('type', type)
    if (query) params.set('query', query)
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <div className={cn('glass-dark rounded-3xl border-white/10 p-2.5 shadow-premium', className)}>
      {/* Tabs de finalidade */}
      <div className="mb-2.5 flex gap-1 rounded-2xl bg-white/5 p-1">
        {LISTING_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setListingType(t.value)}
            className={cn(
              'flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-all',
              listingType === t.value
                ? 'bg-gold-gradient text-ink shadow-gold'
                : 'text-white/70 hover:text-white',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Bairro, cidade ou referência…"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/40"
          />
        </div>

        <SelectDark icon={<MapPin className="size-4" />} value={city} onChange={setCity}>
          <option value="">Cidade</option>
          {CITIES.map((c) => (
            <option key={c} value={c} className="text-ink">
              {c}
            </option>
          ))}
        </SelectDark>

        <SelectDark icon={<Building2 className="size-4" />} value={type} onChange={setType}>
          <option value="">Tipo</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="text-ink">
              {t.label}
            </option>
          ))}
        </SelectDark>

        <Button variant="gold" size="lg" className="h-12" onClick={submit}>
          <Search className="size-4" />
          Buscar
        </Button>
      </div>
    </div>
  )
}

function SelectDark({
  icon,
  value,
  onChange,
  children,
}: {
  icon: React.ReactNode
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/50">
        {icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-11 pr-8 text-sm text-white focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/40 [&>option]:bg-graphite"
      >
        {children}
      </select>
    </div>
  )
}
