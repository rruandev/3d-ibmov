import type { MetadataRoute } from 'next'
import { propertyService } from '@/services/property.service'
import { SITE_CONFIG } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_CONFIG.url
  const slugs = await propertyService.getAllSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/imoveis`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/favoritos`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/comparar`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const propertyRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/imoveis/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...propertyRoutes]
}
