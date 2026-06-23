'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, MessageSquare, Plus, ExternalLink } from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/imoveis', label: 'Imóveis', icon: Building2 },
  { href: '/admin/imoveis/novo', label: 'Novo imóvel', icon: Plus },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-graphite p-5 lg:flex">
      <div className="px-2 py-3">
        <Logo />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-gold/15 text-gold'
                  : 'text-white/60 hover:bg-white/5 hover:text-white',
              )}
            >
              <link.icon className="size-[18px]" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ExternalLink className="size-[18px]" />
        Ver site
      </Link>
    </aside>
  )
}
