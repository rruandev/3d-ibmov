'use client'

import { useEffect, useState } from 'react'

/** Evita hydration mismatch para stores persistidas (zustand). */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
