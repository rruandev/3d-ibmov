import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { agentRepository } from '@/repositories/agent.repository'
import { PropertyForm } from '@/components/admin/property-form'

export default async function NewPropertyPage() {
  const agents = await agentRepository.list()

  return (
    <div className="mx-auto max-w-4xl text-white">
      <Link
        href="/admin/imoveis"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft className="size-4" /> Voltar para imóveis
      </Link>
      <h1 className="mb-8 font-display text-2xl font-bold tracking-tight">Cadastrar novo imóvel</h1>
      <PropertyForm agents={agents} />
    </div>
  )
}
