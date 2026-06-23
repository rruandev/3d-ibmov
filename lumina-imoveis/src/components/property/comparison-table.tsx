'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { GitCompareArrows, X } from 'lucide-react'
import { useComparison } from '@/store/comparison.store'
import { useMounted } from '@/hooks/use-mounted'
import { getPropertiesByIdsAction } from '@/app/actions/property.actions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatArea, formatCurrency } from '@/lib/utils'
import type { Property } from '@/types'

const ROWS: { label: string; render: (p: Property) => React.ReactNode }[] = [
  { label: 'Preço', render: (p) => formatCurrency(p.price) },
  { label: 'Tipo', render: (p) => <span className="capitalize">{p.type}</span> },
  { label: 'Finalidade', render: (p) => <span className="capitalize">{p.listingType}</span> },
  { label: 'Cidade', render: (p) => p.city },
  { label: 'Bairro', render: (p) => p.neighborhood },
  { label: 'Quartos', render: (p) => p.bedrooms },
  { label: 'Suítes', render: (p) => p.suites ?? '—' },
  { label: 'Banheiros', render: (p) => p.bathrooms },
  { label: 'Vagas', render: (p) => p.garage },
  { label: 'Área', render: (p) => formatArea(p.area) },
  {
    label: 'Preço / m²',
    render: (p) => formatCurrency(Math.round(p.price / p.area)),
  },
]

export function ComparisonTable() {
  const mounted = useMounted()
  const ids = useComparison((s) => s.ids)
  const remove = useComparison((s) => s.remove)
  const [properties, setProperties] = useState<Property[] | null>(null)

  useEffect(() => {
    if (!mounted) return
    getPropertiesByIdsAction(ids).then(setProperties)
  }, [ids, mounted])

  if (!mounted || properties === null) {
    return <Skeleton className="mt-10 h-96" />
  }

  if (properties.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
        <GitCompareArrows className="size-12 text-muted-foreground" />
        <div>
          <h3 className="font-display text-xl font-semibold">Nada para comparar ainda</h3>
          <p className="mt-1 text-muted-foreground">
            Adicione imóveis pela busca para compará-los aqui.
          </p>
        </div>
        <Button asChild variant="gold">
          <Link href="/imoveis">Explorar imóveis</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-10 overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="w-40 p-3 text-left align-bottom" />
            {properties.map((p) => (
              <th key={p.id} className="p-3 align-bottom">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full glass-dark text-white"
                    aria-label="Remover"
                  >
                    <X className="size-4" />
                  </button>
                  <Link href={`/imoveis/${p.slug}`} className="block">
                    <div className="relative aspect-[4/3]">
                      <Image src={p.images[0]?.url} alt={p.title} fill sizes="25vw" className="object-cover" />
                    </div>
                    <p className="line-clamp-1 p-3 text-left text-sm font-semibold">{p.title}</p>
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={row.label} className={i % 2 ? 'bg-muted/40' : ''}>
              <td className="p-3 text-sm font-medium text-muted-foreground">{row.label}</td>
              {properties.map((p) => (
                <td key={p.id} className="p-3 text-center text-sm font-medium">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
