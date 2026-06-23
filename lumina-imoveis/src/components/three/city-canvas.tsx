'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

// Carrega a cena 3D apenas no client, sob demanda (code splitting).
const CityScene = dynamic(() => import('./city-scene'), {
  ssr: false,
  loading: () => <CanvasFallback />,
})

function CanvasFallback() {
  return (
    <div className="absolute inset-0 bg-dark-radial">
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,rgba(15,76,129,0.25),transparent_60%)]" />
    </div>
  )
}

/**
 * Só monta o Canvas quando o Hero está visível — evita custo de
 * WebGL fora da tela e melhora o LCP.
 */
export function CityCanvas() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { rootMargin: '200px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0">
      {visible ? <CityScene /> : <CanvasFallback />}
    </div>
  )
}
