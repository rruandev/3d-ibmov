'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Bath, BedDouble, Car, MapPin, Maximize } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from './favorite-button'
import { CompareButton } from './compare-button'
import { formatArea, formatCurrency } from '@/lib/utils'
import type { Property } from '@/types'

const LISTING_LABEL: Record<Property['listingType'], string> = {
  compra: 'Venda',
  aluguel: 'Aluguel',
  lancamento: 'Lançamento',
  luxo: 'Luxo',
}

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 })

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  const isRent = property.listingType === 'aluguel'

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="preserve-3d group relative"
    >
      <Link
        href={`/imoveis/${property.slug}`}
        className="block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow duration-500 group-hover:shadow-premium"
      >
        {/* Imagem */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0]?.url}
            alt={property.images[0]?.alt ?? property.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2" style={{ transform: 'translateZ(40px)' }}>
            {property.featured && <Badge variant="gold">Destaque</Badge>}
            <Badge variant="glass">{LISTING_LABEL[property.listingType]}</Badge>
          </div>

          {/* Ações */}
          <div className="absolute right-4 top-4 flex gap-2" style={{ transform: 'translateZ(40px)' }}>
            <FavoriteButton id={property.id} size="sm" />
            <CompareButton id={property.id} size="sm" />
          </div>

          {/* Preço */}
          <div className="absolute bottom-4 left-4" style={{ transform: 'translateZ(50px)' }}>
            <p className="font-display text-2xl font-bold text-white drop-shadow-lg">
              {formatCurrency(property.price)}
              {isRent && <span className="text-sm font-normal text-white/70">/mês</span>}
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5">
          <h3 className="line-clamp-1 font-display text-lg font-semibold tracking-tight">
            {property.title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-gold" />
            {property.neighborhood}, {property.city}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
            <Spec icon={<BedDouble className="size-4" />} value={property.bedrooms} label="quartos" />
            <Spec icon={<Bath className="size-4" />} value={property.bathrooms} label="banheiros" />
            <Spec icon={<Car className="size-4" />} value={property.garage} label="vagas" />
            <Spec icon={<Maximize className="size-4" />} value={formatArea(property.area)} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function Spec({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label?: string }) {
  return (
    <span className="flex items-center gap-1.5" title={label}>
      <span className="text-gold">{icon}</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  )
}
