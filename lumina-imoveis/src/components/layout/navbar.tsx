'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GitCompareArrows, Heart, Menu, Phone, X } from 'lucide-react'
import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants'
import { useFavorites } from '@/store/favorites.store'
import { useComparison } from '@/store/comparison.store'
import { useMounted } from '@/hooks/use-mounted'
import { cn, whatsappLink } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const mounted = useMounted()
  const favCount = useFavorites((s) => s.ids.length)
  const compareCount = useComparison((s) => s.ids.length)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'py-2' : 'py-4',
      )}
    >
      <div className="container">
        <div
          className={cn(
            'flex items-center justify-between rounded-2xl px-4 transition-all duration-500 sm:px-6',
            scrolled
              ? 'h-14 glass-dark shadow-premium'
              : 'h-16 bg-transparent',
          )}
        >
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <IconLink href="/favoritos" label="Favoritos" count={mounted ? favCount : 0}>
              <Heart className="size-[18px]" />
            </IconLink>
            <IconLink href="/comparar" label="Comparar" count={mounted ? compareCount : 0}>
              <GitCompareArrows className="size-[18px]" />
            </IconLink>

            <Button asChild variant="gold" size="sm" className="ml-1 hidden sm:inline-flex">
              <a
                href={whatsappLink(SITE_CONFIG.phone, 'Olá! Gostaria de falar com um especialista LUMINA.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="size-4" />
                Especialista
              </a>
            </Button>

            <button
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col gap-2 bg-graphite p-6 shadow-premium"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10"
                  aria-label="Fechar menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild variant="gold" className="mt-4">
                <a href={whatsappLink(SITE_CONFIG.phone, 'Olá! Gostaria de falar com um especialista LUMINA.')}>
                  Falar com especialista
                </a>
              </Button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function IconLink({
  href,
  label,
  count,
  children,
}: {
  href: string
  label: string
  count: number
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative grid size-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
          {count}
        </span>
      )}
    </Link>
  )
}
