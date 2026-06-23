import type { Metadata } from 'next'
import { FavoritesList } from '@/components/property/favorites-list'

export const metadata: Metadata = {
  title: 'Meus favoritos',
  description: 'Seus imóveis favoritos salvos na LUMINA.',
  robots: { index: false },
}

export default function FavoritesPage() {
  return (
    <div className="bg-background pb-24 pt-28">
      <div className="container">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Meus favoritos
        </h1>
        <p className="mt-2 text-muted-foreground">Os imóveis que você salvou para rever depois.</p>
        <FavoritesList />
      </div>
    </div>
  )
}
