import { leadService } from '@/services/lead.service'
import { LeadsTable } from '@/components/admin/leads-table'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const leads = await leadService.list()

  return (
    <div className="text-white">
      <h1 className="font-display text-2xl font-bold tracking-tight">Leads</h1>
      <p className="mt-1 text-sm text-white/50">
        {leads.length} {leads.length === 1 ? 'lead recebido' : 'leads recebidos'}. Atualize o status conforme o atendimento.
      </p>
      <div className="mt-8">
        <LeadsTable leads={leads} />
      </div>
    </div>
  )
}
