'use client'

import { useEffect, useRef, useState } from 'react'

interface Options {
  duration?: number
  start?: number
}

/**
 * Conta de `start` até `end` quando o elemento entra na viewport.
 * Usa easing easeOutExpo para um efeito premium.
 */
export function useCountUp(end: number, { duration = 2000, start = 0 }: Options = {}) {
  const [value, setValue] = useState(start)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduce) {
          setValue(end)
          return
        }

        let raf = 0
        const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1)
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
          setValue(Math.round(start + (end - start) * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [end, duration, start])

  return { value, ref }
}
