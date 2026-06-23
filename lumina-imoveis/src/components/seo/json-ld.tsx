import { SITE_CONFIG } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { Property } from '@/types'

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
        description: SITE_CONFIG.description,
        telephone: SITE_CONFIG.phone,
        email: SITE_CONFIG.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE_CONFIG.address,
          addressCountry: 'BR',
        },
        sameAs: Object.values(SITE_CONFIG.social),
      }}
    />
  )
}

export function PropertyJsonLd({ property }: { property: Property }) {
  const url = `${SITE_CONFIG.url}/imoveis/${property.slug}`
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': ['Product', 'Residence'],
        name: property.title,
        description: property.description,
        url,
        image: property.images.map((i) => i.url),
        offers: {
          '@type': 'Offer',
          price: property.price,
          priceCurrency: 'BRL',
          availability:
            property.status === 'disponivel'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/SoldOut',
          priceValidUntil: new Date(new Date().getFullYear() + 1, 0, 1)
            .toISOString()
            .slice(0, 10),
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.city,
          addressRegion: property.state,
          streetAddress: property.address ?? property.neighborhood,
          addressCountry: 'BR',
        },
        numberOfRooms: property.bedrooms,
        numberOfBathroomsTotal: property.bathrooms,
        floorSize: {
          '@type': 'QuantitativeValue',
          value: property.area,
          unitCode: 'MTK',
        },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Vagas de garagem', value: property.garage },
          { '@type': 'PropertyValue', name: 'Preço', value: formatCurrency(property.price) },
        ],
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${SITE_CONFIG.url}${item.url}`,
        })),
      }}
    />
  )
}
