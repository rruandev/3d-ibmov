import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { propertyService } from '@/services/property.service'
import { SectionHeading } from '@/components/shared/section-heading'
import { PropertyCard } from '@/components/property/property-card'
import { StaggerGroup, StaggerItem } from '@/components/shared/reveal'
import { Button } from '@/components/ui/button'

export async function FeaturedProperties() {
  const properties = await propertyService.getFeatured(6)

  return (
    <section id="imoveis" className="relative py-24 sm:py-32">
      <div className="container">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeading
            align="left"
            eyebrow="Seleção exclusiva"
            title="Imóveis em destaque"
            description="Uma curadoria dos endereços mais desejados, escolhidos pela nossa equipe de especialistas."
            className="mx-0"
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/imoveis">
              Ver todos
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <StaggerGroup className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, i) => (
            <StaggerItem key={property.id}>
              <PropertyCard property={property} priority={i < 3} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
