'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_COMPARE } from '@/lib/constants'

interface ComparisonState {
  ids: string[]
  /** true se conseguiu adicionar, false se atingiu o limite */
  toggle: (id: string) => boolean
  remove: (id: string) => void
  has: (id: string) => boolean
  isFull: () => boolean
  clear: () => void
}

export const useComparison = create<ComparisonState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const { ids } = get()
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) })
          return true
        }
        if (ids.length >= MAX_COMPARE) return false
        set({ ids: [...ids, id] })
        return true
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      has: (id) => get().ids.includes(id),
      isFull: () => get().ids.length >= MAX_COMPARE,
      clear: () => set({ ids: [] }),
    }),
    { name: 'lumina:comparison' },
  ),
)
