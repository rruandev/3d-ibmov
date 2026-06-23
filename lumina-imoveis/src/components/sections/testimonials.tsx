'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { TESTIMONIALS } from '@/data/testimonials'
import { cn } from '@/lib/utils'

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)

  const go = (next: number) => {
    setDir(next > index || (index === TESTIMONIALS.length - 1 && next === 0) ? 1 : -1)
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  useEffect(() => {
    const id = setInterval(() => go(index + 1), 6000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const t = TESTIMONIALS[index]

  return (
    <section className="relative overflow-hidden bg-graphite py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 size-[600px] -translate-x-1/2 rounded-full bg-gold/5 blur-[160px]" />
      <div className="container relative">
        <SectionHeading
          light
          eyebrow="Quem viveu, recomenda"
          title="Histórias que nos orgulham"
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <Quote className="mx-auto size-12 text-gold/30" />
          <div className="relative mt-6 h-[260px] sm:h-[220px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={t.id}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col items-center text-center"
              >
                <div className="mb-5 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="text-balance font-display text-xl font-medium leading-relaxed text-white sm:text-2xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="size-12 rounded-full border-2 border-gold/40 object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-white/50">{t.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <NavBtn onClick={() => go(index - 1)} label="Anterior">
              <ChevronLeft className="size-5" />
            </NavBtn>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Depoimento ${i + 1}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === index ? 'w-6 bg-gold' : 'w-1.5 bg-white/20 hover:bg-white/40',
                  )}
                />
              ))}
            </div>
            <NavBtn onClick={() => go(index + 1)} label="Próximo">
              <ChevronRight className="size-5" />
            </NavBtn>
          </div>
        </div>
      </div>
    </section>
  )
}

function NavBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
    >
      {children}
    </button>
  )
}
