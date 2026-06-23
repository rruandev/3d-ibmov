'use client'

import { useTransition } from 'react'
import { Mail, Phone } from 'lucide-react'
import { updateLeadStatusAction } from '@/app/actions/lead.actions'
import { formatDate, cn } from '@/lib/utils'
import type { Lead } from '@/types'

const STATUS: { value: Lead['status']; label: string; color: string }[] = [
  { value: 'novo', label: 'Novo', color: 'bg-premium/20 text-premium-light' },
  { value: 'contatado', label: 'Contatado', color: 'bg-amber-500/20 text-amber-400' },
  { value: 'qualificado', label: 'Qualificado', color: 'bg-violet-500/20 text-violet-400' },
  { value: 'convertido', label: 'Convertido', color: 'bg-emerald-500/20 text-emerald-400' },
  { value: 'perdido', label: 'Perdido', color: 'bg-white/10 text-white/50' },
]

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [pending, startTransition] = useTransition()

  function onStatusChange(id: string, status: Lead['status']) {
    startTransition(async () => {
      await updateLeadStatusAction(id, status)
    })
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center text-white/50">
        Nenhum lead recebido ainda.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-graphite">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
          <tr>
            <th className="p-4 font-medium">Contato</th>
            <th className="p-4 font-medium">Imóvel</th>
            <th className="p-4 font-medium">Data</th>
            <th className="p-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white">
          {leads.map((lead) => (
            <tr key={lead.id} className={cn('transition-colors hover:bg-white/5', pending && 'opacity-70')}>
              <td className="p-4">
                <p className="font-medium">{lead.name}</p>
                <div className="mt-1 flex flex-col gap-0.5 text-xs text-white/50">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-gold">
                    <Mail className="size-3" /> {lead.email}
                  </a>
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-gold">
                    <Phone className="size-3" /> {lead.phone}
                  </a>
                </div>
                {lead.message && <p className="mt-2 max-w-xs text-xs text-white/40">“{lead.message}”</p>}
              </td>
              <td className="p-4 text-white/70">{lead.propertyTitle ?? '—'}</td>
              <td className="p-4 text-white/50">{formatDate(lead.createdAt)}</td>
              <td className="p-4">
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
                  className={cn(
                    'cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none [&>option]:bg-graphite [&>option]:text-white',
                    STATUS.find((s) => s.value === lead.status)?.color,
                  )}
                >
                  {STATUS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
