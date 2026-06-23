'use client'

import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useFavorites } from '@/store/favorites.store'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'

export function FavoriteButton({
  id,
  className,
  size = 'default',
}: {
  id: string
  className?: string
  size?: 'default' | 'sm'
}) {
  const mounted = useMounted()
  const isFavorite = useFavorites((s) => s.ids.includes(id))
  const toggle = useFavorites((s) => s.toggle)

  const active = mounted && isFavorite

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
      }}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={active}
      className={cn(
        'grid place-items-center rounded-full glass-dark border-white/15 text-white transition-colors hover:bg-white/15',
        size === 'sm' ? 'size-9' : 'size-11',
        className,
      )}
    >
      <Heart
        className={cn(
          'transition-all',
          size === 'sm' ? 'size-4' : 'size-[18px]',
          active ? 'fill-gold text-gold' : 'fill-transparent',
        )}
      />
    </motion.button>
  )
}
