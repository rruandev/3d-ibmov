import { SectionHeading } from '@/components/shared/section-heading'
import { Reveal } from '@/components/shared/reveal'
import { Stats } from './stats'

const TIMELINE = [
  { year: '2008', title: 'O início', desc: 'Nasce a LUMINA com a missão de redefinir o mercado de alto padrão.' },
  { year: '2014', title: 'Expansão', desc: 'Chegamos às principais capitais e ao litoral catarinense.' },
  { year: '2019', title: 'Inovação digital', desc: 'Pioneiros em tours virtuais e experiências 3D no Brasil.' },
  { year: '2026', title: 'Referência nacional', desc: 'Mais de 2.800 imóveis entregues e 24 cidades atendidas.' },
]

export function About() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          light
          eyebrow="Nossa história"
          title="18 anos transformando endereços em conquistas"
          description="Une-se à LUMINA uma equipe obcecada por detalhes, transparência e resultados que mudam vidas."
        />

        <div className="mt-16">
          <Stats />
        </div>

        {/* Timeline */}
        <div className="relative mt-20">
          <div className="absolute left-0 top-6 hidden h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block" />
          <div className="grid gap-10 lg:grid-cols-4">
            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.12}>
                <div className="relative">
                  <div className="mb-5 flex items-center gap-3 lg:block">
                    <span className="relative z-10 grid size-12 place-items-center rounded-full bg-gold-gradient font-display text-sm font-bold text-ink shadow-gold">
                      {i + 1}
                    </span>
                  </div>
                  <span className="font-display text-2xl font-bold text-gold-gradient">{item.year}</span>
                  <h3 className="mt-1 font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
