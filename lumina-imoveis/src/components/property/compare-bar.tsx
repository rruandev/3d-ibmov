'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { GitCompareArrows, X } from 'lucide-react'
import { useComparison } from '@/store/comparison.store'
import { useMounted } from '@/hooks/use-mounted'
import { Button } from '@/components/ui/button'

export function CompareBar() {
  const mounted = useMounted()
  const ids = useComparison((s) => s.ids)
  const clear = useComparison((s) => s.clear)

  const show = mounted && ids.length > 0

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="fixed inset-x-0 bottom-4 z-40 px-4"
        >
          <div className="container">
            <div className="flex items-center justify-between gap-4 rounded-2xl glass-dark px-5 py-3 shadow-premium">
              <div className="flex items-center gap-3 text-white">
                <span className="grid size-10 place-items-center rounded-xl bg-gold/15 text-gold">
                  <GitCompareArrows className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {ids.length} {ids.length === 1 ? 'imóvel selecionado' : 'imóveis selecionados'}
                  </p>
                  <p className="text-xs text-white/50">Compare lado a lado até 4 imóveis</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clear}
                  className="grid size-9 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                  aria-label="Limpar comparação"
                >
                  <X className="size-4" />
                </button>
                <Button asChild variant="gold" size="sm">
                  <Link href="/comparar">Comparar agora</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
