import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { propertyRepository } from '@/repositories/property.repository'
import { agentRepository } from '@/repositories/agent.repository'
import { PropertyForm } from '@/components/admin/property-form'

type Params = Promise<{ id: string }>

export default async function EditPropertyPage({ params }: { params: Params }) {
  const { id } = await params
  const [property, agents] = await Promise.all([
    propertyRepository.getById(id),
    agentRepository.list(),
  ])
  if (!property) notFound()

  return (
    <div className="mx-auto max-w-4xl text-white">
      <Link
        href="/admin/imoveis"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft className="size-4" /> Voltar para imóveis
      </Link>
      <h1 className="mb-8 font-display text-2xl font-bold tracking-tight">
        Editar: <span className="text-gold">{property.title}</span>
      </h1>
      <PropertyForm property={property} agents={agents} />
    </div>
  )
}
