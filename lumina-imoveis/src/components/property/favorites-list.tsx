'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/store/favorites.store'
import { useMounted } from '@/hooks/use-mounted'
import { getPropertiesByIdsAction } from '@/app/actions/property.actions'
import { PropertyCard } from './property-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Property } from '@/types'

export function FavoritesList() {
  const mounted = useMounted()
  const ids = useFavorites((s) => s.ids)
  const [properties, setProperties] = useState<Property[] | null>(null)

  useEffect(() => {
    if (!mounted) return
    getPropertiesByIdsAction(ids).then(setProperties)
  }, [ids, mounted])

  if (!mounted || properties === null) {
    return (
      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3]" />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
        <Heart className="size-12 text-muted-foreground" />
        <div>
          <h3 className="font-display text-xl font-semibold">Nenhum favorito ainda</h3>
          <p className="mt-1 text-muted-foreground">
            Toque no coração dos imóveis que mais gostar para salvá-los aqui.
          </p>
        </div>
        <Button asChild variant="gold">
          <Link href="/imoveis">Explorar imóveis</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  )
}
