'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { Pencil, Trash2, Star, Loader2 } from 'lucide-react'
import { deletePropertyAction } from '@/app/actions/property.actions'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Property } from '@/types'

export function PropertyTable({ properties }: { properties: Property[] }) {
  const [pending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir o imóvel "${title}"? Esta ação não pode ser desfeita.`)) return
    setDeletingId(id)
    startTransition(async () => {
      await deletePropertyAction(id)
      setDeletingId(null)
    })
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-graphite">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
          <tr>
            <th className="p-4 font-medium">Imóvel</th>
            <th className="p-4 font-medium">Local</th>
            <th className="p-4 font-medium">Tipo</th>
            <th className="p-4 font-medium">Preço</th>
            <th className="p-4 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white">
          {properties.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-white/5">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                    <Image src={p.images[0]?.url} alt={p.title} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate font-medium">
                      {p.featured && <Star className="size-3.5 shrink-0 fill-gold text-gold" />}
                      {p.title}
                    </p>
                    <p className="truncate text-xs text-white/40">/{p.slug}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-white/70">{p.neighborhood}, {p.city}</td>
              <td className="p-4">
                <Badge variant="muted" className="capitalize">{p.type}</Badge>
              </td>
              <td className="p-4 font-semibold text-gold">{formatCurrency(p.price, true)}</td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/imoveis/${p.id}/editar`}
                    className="grid size-9 place-items-center rounded-lg bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Editar"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    disabled={pending && deletingId === p.id}
                    className="grid size-9 place-items-center rounded-lg bg-white/5 text-white/70 transition-colors hover:bg-destructive/20 hover:text-destructive disabled:opacity-50"
                    aria-label="Excluir"
                  >
                    {pending && deletingId === p.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
