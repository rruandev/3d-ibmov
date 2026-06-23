import Link from 'next/link'
import { Plus } from 'lucide-react'
import { propertyService } from '@/services/property.service'
import { PropertyTable } from '@/components/admin/property-table'
import { Button } from '@/components/ui/button'

export default async function AdminPropertiesPage() {
  const { data, total } = await propertyService.list({ perPage: 1000 })

  return (
    <div className="text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Imóveis</h1>
          <p className="mt-1 text-sm text-white/50">{total} imóveis cadastrados.</p>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/imoveis/novo">
            <Plus className="size-4" /> Novo imóvel
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <PropertyTable properties={data} />
      </div>
    </div>
  )
}
