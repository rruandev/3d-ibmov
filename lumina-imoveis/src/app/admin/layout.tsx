import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, LayoutDashboard, MessageSquare, Plus } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const metadata: Metadata = {
  title: 'Painel administrativo',
  robots: { index: false, follow: false },
}

const MOBILE_LINKS = [
  { href: '/admin', label: 'Início', icon: LayoutDashboard },
  { href: '/admin/imoveis', label: 'Imóveis', icon: Building2 },
  { href: '/admin/imoveis/novo', label: 'Novo', icon: Plus },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ink">
      <AdminSidebar />
      <div className="flex-1">
        {!isSupabaseConfigured && (
          <div className="border-b border-gold/20 bg-gold/10 px-6 py-2.5 text-center text-xs text-gold">
            Modo demonstração — alterações ficam em memória até configurar o Supabase.
          </div>
        )}
        <div className="p-6 pb-24 lg:p-10 lg:pb-10">{children}</div>
      </div>

      {/* Navegação mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-white/10 bg-graphite lg:hidden">
        {MOBILE_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex flex-col items-center gap-1 py-3 text-[11px] text-white/60"
          >
            <l.icon className="size-5" />
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
