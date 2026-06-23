import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Bath,
  BedDouble,
  Car,
  Check,
  ChevronRight,
  MapPin,
  Maximize,
  Phone,
  Rotate3d,
} from 'lucide-react'
import { propertyService } from '@/services/property.service'
import { PropertyGallery } from '@/components/property/property-gallery'
import { PropertyCard } from '@/components/property/property-card'
import { FavoriteButton } from '@/components/property/favorite-button'
import { CompareButton } from '@/components/property/compare-button'
import { ShareButton } from '@/components/property/share-button'
import { LeadForm } from '@/components/forms/lead-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PropertyJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { SITE_CONFIG } from '@/lib/constants'
import { formatArea, formatCurrency, whatsappLink } from '@/lib/utils'
import Image from 'next/image'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const slugs = await propertyService.getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const property = await propertyService.getBySlug(slug)
  if (!property) return { title: 'Imóvel não encontrado' }

  return {
    title: property.title,
    description: property.description.slice(0, 160),
    alternates: { canonical: `/imoveis/${property.slug}` },
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 200),
      images: property.images.map((i) => ({ url: i.url, alt: i.alt })),
      type: 'website',
    },
  }
}

export default async function PropertyDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const result = await propertyService.getWithAgent(slug)
  if (!result) notFound()

  const { property, agent } = result
  const related = await propertyService.getRelated(property)
  const isRent = property.listingType === 'aluguel'
  const url = `/imoveis/${property.slug}`

  return (
    <div className="bg-background pb-24 pt-28">
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Início', url: '/' },
          { name: 'Imóveis', url: '/imoveis' },
          { name: property.title, url },
        ]}
      />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <ChevronRight className="size-3.5" />
          <Link href="/imoveis" className="hover:text-foreground">Imóveis</Link>
          <ChevronRight className="size-3.5" />
          <span className="line-clamp-1 text-foreground">{property.title}</span>
        </nav>

        <PropertyGallery images={property.images} title={property.title} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Conteúdo principal */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {property.featured && <Badge variant="gold">Destaque</Badge>}
                  <Badge variant="outline" className="capitalize">{property.type}</Badge>
                  <Badge variant="muted" className="capitalize">{property.status}</Badge>
                </div>
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {property.title}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-4 text-gold" />
                  {property.address ? `${property.address} — ` : ''}
                  {property.neighborhood}, {property.city} / {property.state}
                </p>
              </div>
              <div className="flex gap-2">
                <FavoriteButton id={property.id} />
                <CompareButton id={property.id} />
                <ShareButton title={property.title} url={url} />
              </div>
            </div>

            {/* Specs */}
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-4">
              <SpecBox icon={<BedDouble />} value={property.bedrooms} label="Quartos" />
              <SpecBox icon={<Bath />} value={property.bathrooms} label="Banheiros" />
              <SpecBox icon={<Car />} value={property.garage} label="Vagas" />
              <SpecBox icon={<Maximize />} value={formatArea(property.area)} label="Área" />
            </div>

            {/* Descrição */}
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Sobre o imóvel</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </section>

            {/* Comodidades */}
            {property.amenities.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl font-semibold">Comodidades</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {property.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2.5 text-sm">
                      <span className="grid size-6 place-items-center rounded-full bg-gold/15 text-gold">
                        <Check className="size-3.5" />
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Tour virtual */}
            {(property.tourUrl || property.videoUrl) && (
              <section className="mt-10">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Rotate3d className="size-5 text-gold" /> Tour virtual
                </h2>
                <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-border">
                  <iframe
                    src={property.tourUrl || property.videoUrl}
                    title="Tour virtual"
                    className="size-full"
                    allowFullScreen
                  />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <p className="text-sm text-muted-foreground">{isRent ? 'Valor do aluguel' : 'Valor'}</p>
              <p className="font-display text-3xl font-bold tracking-tight">
                {formatCurrency(property.price)}
                {isRent && <span className="text-base font-normal text-muted-foreground">/mês</span>}
              </p>

              {agent && (
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    width={52}
                    height={52}
                    className="size-[52px] rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button asChild variant="gold" size="lg" className="w-full">
                  <a
                    href={whatsappLink(
                      agent?.phone ?? SITE_CONFIG.phone,
                      `Olá! Tenho interesse no imóvel "${property.title}".`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="size-4" /> Falar no WhatsApp
                  </a>
                </Button>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <p className="mb-4 font-display font-semibold">Solicite mais informações</p>
                <LeadForm propertyId={property.id} propertyTitle={property.title} source="detalhe-imovel" />
              </div>
            </div>
          </aside>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold tracking-tight">Imóveis relacionados</h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function SpecBox({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-gold/10 text-gold [&_svg]:size-5">
        {icon}
      </span>
      <span className="mt-1 font-display text-lg font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
