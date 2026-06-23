'use client'

import { GitCompareArrows } from 'lucide-react'
import { useComparison } from '@/store/comparison.store'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'

export function CompareButton({
  id,
  className,
  size = 'default',
}: {
  id: string
  className?: string
  size?: 'default' | 'sm'
}) {
  const mounted = useMounted()
  const has = useComparison((s) => s.ids.includes(id))
  const toggle = useComparison((s) => s.toggle)
  const active = mounted && has

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const ok = toggle(id)
        if (!ok) {
          // Limite atingido — feedback simples
          alert('Você pode comparar até 4 imóveis. Remova um para adicionar outro.')
        }
      }}
      aria-label={active ? 'Remover da comparação' : 'Adicionar à comparação'}
      aria-pressed={active}
      className={cn(
        'grid place-items-center rounded-full glass-dark border-white/15 transition-colors hover:bg-white/15',
        active ? 'text-gold' : 'text-white',
        size === 'sm' ? 'size-9' : 'size-11',
        className,
      )}
    >
      <GitCompareArrows className={size === 'sm' ? 'size-4' : 'size-[18px]'} />
    </button>
  )
}
