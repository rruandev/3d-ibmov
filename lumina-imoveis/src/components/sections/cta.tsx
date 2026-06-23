'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { whatsappLink } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      {/* Aura premium */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 size-[400px] rounded-full bg-premium/30 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-gold/15 blur-[120px]" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 glass-dark px-8 py-16 text-center sm:px-16 sm:py-24"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Vamos começar?
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Seu próximo imóvel está{' '}
            <span className="text-gold-gradient">mais perto</span> do que você imagina.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Fale com um especialista e receba uma seleção personalizada de imóveis em até 24 horas.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <a href="#contato">
                Agendar atendimento
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="glass" size="lg">
              <a
                href={whatsappLink(SITE_CONFIG.phone, 'Olá! Quero agendar um atendimento com a LUMINA.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chamar no WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
