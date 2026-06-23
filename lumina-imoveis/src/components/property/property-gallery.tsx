'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Expand, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PropertyImage } from '@/types'
import { cn } from '@/lib/utils'

export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const safe = images.length ? images : [{ url: '', alt: title }]

  const next = () => setActive((a) => (a + 1) % safe.length)
  const prev = () => setActive((a) => (a - 1 + safe.length) % safe.length)

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        {/* Imagem principal */}
        <button
          onClick={() => setLightbox(true)}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto"
        >
          <Image
            src={safe[active].url}
            alt={safe[active].alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full glass-dark px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Expand className="size-3.5" /> Ampliar
          </span>
        </button>

        {/* Miniaturas */}
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-2">
          {safe.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-xl ring-2 transition-all',
                active === i ? 'ring-gold' : 'ring-transparent hover:ring-border',
              )}
            >
              <Image src={img.url} alt={img.alt} fill sizes="20vw" className="object-cover" />
              {i === 3 && safe.length > 4 && (
                <span className="absolute inset-0 grid place-items-center bg-ink/60 text-sm font-semibold text-white">
                  +{safe.length - 4}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/95 p-4"
            onClick={() => setLightbox(false)}
          >
            <button className="absolute right-6 top-6 grid size-11 place-items-center rounded-full glass-dark text-white" aria-label="Fechar">
              <X className="size-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 grid size-12 place-items-center rounded-full glass-dark text-white"
              aria-label="Anterior"
            >
              <ChevronLeft className="size-6" />
            </button>
            <div className="relative aspect-[3/2] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image src={safe[active].url} alt={safe[active].alt} fill className="rounded-2xl object-contain" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 grid size-12 place-items-center rounded-full glass-dark text-white"
              aria-label="Próxima"
            >
              <ChevronRight className="size-6" />
            </button>
            <p className="absolute bottom-6 text-sm text-white/60">
              {active + 1} / {safe.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
