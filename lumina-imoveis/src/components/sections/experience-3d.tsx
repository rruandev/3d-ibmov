'use client'

import dynamic from 'next/dynamic'
import { Box, Layers, MousePointerClick, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { Reveal } from '@/components/shared/reveal'

const HouseScene = dynamic(() => import('@/components/three/house-scene'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="size-12 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
    </div>
  ),
})

const FEATURES = [
  { icon: Box, title: 'Modelos 3D otimizados', desc: 'Geometria leve com LOD para máxima performance.' },
  { icon: Layers, title: 'Lazy loading + Suspense', desc: 'Cada cena carrega só quando entra em tela.' },
  { icon: MousePointerClick, title: 'Totalmente interativo', desc: 'Gire, explore e sinta o imóvel em tempo real.' },
  { icon: Sparkles, title: 'Iluminação cinematográfica', desc: 'Luz dinâmica e profundidade realista.' },
]

export function Experience3D() {
  return (
    <section className="relative overflow-hidden bg-dark-radial py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-1/4 size-[500px] rounded-full bg-premium/20 blur-[140px]" />

      <div className="container relative">
        <SectionHeading
          light
          eyebrow="Tecnologia imersiva"
          title="Experiência 3D em cada detalhe"
          description="Explore os imóveis como nunca antes. Renderização em tempo real direto no navegador, sem plugins."
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 glass-dark sm:h-[500px]">
              <HouseScene />
              <div className="pointer-events-none absolute bottom-4 left-4 rounded-full glass-dark px-4 py-2 text-xs text-white/70">
                Arraste para girar · rotação automática
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-white/10 glass-dark p-6 transition-colors hover:border-gold/30">
                  <div className="mb-4 grid size-11 place-items-center rounded-xl bg-gold/10 text-gold">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
