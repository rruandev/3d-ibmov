'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/ui/select'

const OPTIONS = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'area-desc', label: 'Maior área' },
]

export function SortSelect() {
  const router = useRouter()
  const params = useSearchParams()

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString())
    next.set('sort', value)
    next.delete('page')
    router.push(`/imoveis?${next.toString()}`)
  }

  return (
    <div className="w-48">
      <Select value={params.get('sort') ?? 'recent'} onChange={(e) => onChange(e.target.value)}>
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  )
}
