'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CityCanvas } from '@/components/three/city-canvas'
import { QuickSearch } from '@/components/search/quick-search'
import { whatsappLink } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Cidade 3D */}
      <CityCanvas />

      {/* Gradientes de leitura */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/30 to-ink" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-transparent to-transparent" />

      <div className="container relative z-10 pt-28">
        <div className="max-w-3xl">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold">
              <Sparkles className="size-3.5" />
              Curadoria de imóveis premium
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            Encontre o imóvel ideal para o{' '}
            <span className="text-gold-gradient">próximo capítulo</span> da sua vida.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            Apartamentos, casas e coberturas de alto padrão selecionados a dedo.
            Uma experiência de compra à altura do seu próximo endereço.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild variant="gold" size="lg">
              <Link href="/imoveis">
                Ver imóveis
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <a
                href={whatsappLink(
                  SITE_CONFIG.phone,
                  'Olá! Gostaria de falar com um especialista LUMINA.',
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com especialista
              </a>
            </Button>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10"
          >
            <QuickSearch />
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-[11px] uppercase tracking-[0.2em]">Explore</span>
          <ChevronDown className="size-5 animate-bounce" />
        </div>
      </motion.div>
    </section>
  )
}
