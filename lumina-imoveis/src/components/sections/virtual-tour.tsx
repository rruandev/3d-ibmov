'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Rotate3d, Video, X } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { Reveal } from '@/components/shared/reveal'

const MODES = [
  { id: 'tour', label: 'Tour 360°', icon: Rotate3d, desc: 'Caminhe pelos ambientes em 360 graus.' },
  { id: 'video', label: 'Vídeo', icon: Video, desc: 'Apresentações em alta definição.' },
  { id: 'live', label: 'Visita interativa', icon: Play, desc: 'Acompanhe ao vivo com um especialista.' },
]

export function VirtualTour() {
  const [open, setOpen] = useState(false)

  return (
    <section id="tour" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Visite de qualquer lugar"
          title="Tour virtual imersivo"
          description="Economize tempo e visite os imóveis sem sair de casa, com a riqueza de detalhes de uma visita presencial."
        />

        <Reveal>
          <div className="group relative mt-14 aspect-video overflow-hidden rounded-3xl border border-border shadow-premium">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
              alt="Prévia do tour virtual"
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />

            <button
              onClick={() => setOpen(true)}
              className="absolute inset-0 grid place-items-center"
              aria-label="Reproduzir tour virtual"
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="grid size-20 place-items-center rounded-full bg-gold-gradient text-ink shadow-gold"
              >
                <Play className="size-7 translate-x-0.5 fill-ink" />
              </motion.span>
            </button>

            <div className="absolute inset-x-0 bottom-0 grid gap-px bg-white/10 sm:grid-cols-3">
              {MODES.map((m) => (
                <div key={m.id} className="flex items-center gap-3 bg-ink/70 px-6 py-5 backdrop-blur">
                  <m.icon className="size-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-semibold text-white">{m.label}</p>
                    <p className="text-xs text-white/50">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/90 p-4 backdrop-blur"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute right-6 top-6 grid size-11 place-items-center rounded-full glass-dark text-white"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="size-full"
              src="https://www.youtube.com/embed/3l2mZ8gXkDc?autoplay=1"
              title="Tour virtual"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}
