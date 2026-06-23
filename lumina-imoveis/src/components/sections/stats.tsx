'use client'

import { STATS } from '@/lib/constants'
import { useCountUp } from '@/hooks/use-count-up'
import { formatNumber } from '@/lib/utils'

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
      {STATS.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  )
}

function StatItem({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { value: current, ref } = useCountUp(value, { duration: 2200 })
  return (
    <div className="flex flex-col items-center justify-center gap-1 bg-graphite px-4 py-10 text-center">
      <span ref={ref} className="font-display text-4xl font-extrabold tracking-tight text-gold-gradient sm:text-5xl">
        {formatNumber(current)}
        {suffix}
      </span>
      <span className="text-sm font-medium text-white/60">{label}</span>
    </div>
  )
}
