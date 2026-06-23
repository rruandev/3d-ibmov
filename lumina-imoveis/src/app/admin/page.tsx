import Link from 'next/link'
import { Building2, Plus, Star, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { propertyService } from '@/services/property.service'
import { leadService } from '@/services/lead.service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function AdminDashboard() {
  const { data: properties, total } = await propertyService.list({ perPage: 1000 })
  const leads = await leadService.list()

  const featured = properties.filter((p) => p.featured).length
  const avgPrice = properties.length
    ? Math.round(properties.reduce((s, p) => s + p.price, 0) / properties.length)
    : 0

  const stats = [
    { label: 'Imóveis cadastrados', value: total, icon: Building2, href: '/admin/imoveis' },
    { label: 'Em destaque', value: featured, icon: Star, href: '/admin/imoveis' },
    { label: 'Leads recebidos', value: leads.length, icon: MessageSquare, href: '/admin/leads' },
    { label: 'Ticket médio', value: formatCurrency(avgPrice, true), icon: TrendingUp },
  ]

  return (
    <div className="text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-white/50">Visão geral da operação LUMINA.</p>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/imoveis/novo">
            <Plus className="size-4" /> Cadastrar imóvel
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const card = (
            <div className="rounded-2xl border border-white/10 bg-graphite p-5 transition-colors hover:border-gold/30">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-gold/10 text-gold">
                  <stat.icon className="size-5" />
                </span>
                {stat.href && <ArrowRight className="size-4 text-white/30" />}
              </div>
              <p className="mt-4 font-display text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          )
          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {card}
            </Link>
          ) : (
            <div key={stat.label}>{card}</div>
          )
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Leads recentes */}
        <section className="rounded-2xl border border-white/10 bg-graphite p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Leads recentes</h2>
            <Link href="/admin/leads" className="text-sm text-gold hover:underline">
              Ver todos
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/40">Nenhum lead ainda.</p>
          ) : (
            <ul className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <li key={lead.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{lead.name}</p>
                    <p className="truncate text-xs text-white/40">{lead.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-white/40">{formatDate(lead.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Imóveis recentes */}
        <section className="rounded-2xl border border-white/10 bg-graphite p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Imóveis recentes</h2>
            <Link href="/admin/imoveis" className="text-sm text-gold hover:underline">
              Gerenciar
            </Link>
          </div>
          <ul className="space-y-3">
            {properties.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="truncate text-xs text-white/40">{p.neighborhood}, {p.city}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {p.featured && <Badge variant="gold">★</Badge>}
                  <span className="text-sm font-semibold text-gold">{formatCurrency(p.price, true)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
