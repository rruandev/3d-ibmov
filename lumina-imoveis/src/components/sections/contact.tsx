import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { Reveal } from '@/components/shared/reveal'
import { LeadForm } from '@/components/forms/lead-form'
import { SITE_CONFIG } from '@/lib/constants'

export function Contact() {
  return (
    <section id="contato" className="relative bg-graphite py-24 sm:py-32">
      <div className="container">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              light
              align="left"
              eyebrow="Fale conosco"
              title="Agende seu atendimento"
              description="Preencha o formulário e nossa equipe entrará em contato para entender o que você procura."
              className="mx-0"
            />

            <div className="mt-10 space-y-5">
              <ContactItem icon={<MapPin />} label="Endereço" value={SITE_CONFIG.address} />
              <ContactItem icon={<Phone />} label="Telefone" value={SITE_CONFIG.phone} href={`tel:${SITE_CONFIG.phone}`} />
              <ContactItem icon={<Mail />} label="E-mail" value={SITE_CONFIG.email} href={`mailto:${SITE_CONFIG.email}`} />
              <ContactItem icon={<Clock />} label="Atendimento" value="Seg. a Sáb., 9h às 19h" />
            </div>
          </div>

          <Reveal direction="left">
            <div className="rounded-3xl border border-white/10 glass-dark p-6 sm:p-8">
              <LeadForm variant="dark" source="contato-home" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold [&_svg]:size-5">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
        <p className="mt-0.5 text-white/85">{value}</p>
      </div>
    </div>
  )
  return href ? (
    <a href={href} className="block transition-opacity hover:opacity-80">
      {content}
    </a>
  ) : (
    content
  )
}
