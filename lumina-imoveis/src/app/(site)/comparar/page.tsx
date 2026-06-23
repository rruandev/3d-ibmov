import type { Metadata } from 'next'
import { ComparisonTable } from '@/components/property/comparison-table'

export const metadata: Metadata = {
  title: 'Comparar imóveis',
  description: 'Compare imóveis lado a lado e tome a melhor decisão.',
  robots: { index: false },
}

export default function ComparePage() {
  return (
    <div className="bg-background pb-24 pt-28">
      <div className="container">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Comparar imóveis
        </h1>
        <p className="mt-2 text-muted-foreground">
          Avalie até 4 imóveis lado a lado, característica por característica.
        </p>
        <ComparisonTable />
      </div>
    </div>
  )
}
