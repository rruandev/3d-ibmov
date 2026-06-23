import Link from 'next/link'
import { Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { Logo } from './logo'
import { NAV_LINKS, SITE_CONFIG, PROPERTY_TYPES } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink">
      <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-premium/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-gold/10 blur-[120px]" />

      <div className="container relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 flex gap-3">
              <Social href={SITE_CONFIG.social.instagram} label="Instagram">
                <Instagram className="size-[18px]" />
              </Social>
              <Social href={SITE_CONFIG.social.linkedin} label="LinkedIn">
                <Linkedin className="size-[18px]" />
              </Social>
              <Social href={SITE_CONFIG.social.youtube} label="YouTube">
                <Youtube className="size-[18px]" />
              </Social>
            </div>
          </div>

          <FooterCol title="Navegação">
            {NAV_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Imóveis">
            {PROPERTY_TYPES.map((t) => (
              <FooterLink key={t.value} href={`/imoveis?type=${t.value}`}>
                {t.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Contato">
            <li className="flex items-start gap-3 text-sm text-white/60">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              {SITE_CONFIG.address}
            </li>
            <li>
              <a href={`tel:${SITE_CONFIG.phone}`} className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white">
                <Phone className="size-4 shrink-0 text-gold" />
                {SITE_CONFIG.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white">
                <Mail className="size-4 shrink-0 text-gold" />
                {SITE_CONFIG.email}
              </a>
            </li>
          </FooterCol>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/admin" className="transition-colors hover:text-white">Painel admin</Link>
            <span className="transition-colors hover:text-white">Política de privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-5 font-display text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-white/60 transition-colors hover:text-gold">
        {children}
      </Link>
    </li>
  )
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-white/10 text-white/70 transition-all hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
    >
      {children}
    </a>
  )
}
