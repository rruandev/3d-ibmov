'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const router = useRouter()
  const params = useSearchParams()

  if (totalPages <= 1) return null

  function goTo(page: number) {
    const next = new URLSearchParams(params.toString())
    next.set('page', String(page))
    router.push(`/imoveis?${next.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginação">
      <PageBtn disabled={currentPage === 1} onClick={() => goTo(currentPage - 1)} label="Anterior">
        <ChevronLeft className="size-4" />
      </PageBtn>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          aria-current={p === currentPage}
          className={cn(
            'grid size-10 place-items-center rounded-xl text-sm font-medium transition-colors',
            p === currentPage
              ? 'bg-premium text-white shadow-soft'
              : 'border border-border text-muted-foreground hover:bg-muted',
          )}
        >
          {p}
        </button>
      ))}
      <PageBtn
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
        label="Próxima"
      >
        <ChevronRight className="size-4" />
      </PageBtn>
    </nav>
  )
}

function PageBtn({
  disabled,
  onClick,
  label,
  children,
}: {
  disabled: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}
