'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ShareButton({
  title,
  url,
  className,
  size = 'default',
}: {
  title: string
  url: string
  className?: string
  size?: 'default' | 'sm'
}) {
  const [copied, setCopied] = useState(false)

  async function share(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const fullUrl = url.startsWith('http')
      ? url
      : `${typeof window !== 'undefined' ? window.location.origin : ''}${url}`
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl })
        return
      } catch {
        /* usuário cancelou */
      }
    }
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={share}
      aria-label="Compartilhar imóvel"
      className={cn(
        'grid place-items-center rounded-full glass-dark border-white/15 text-white transition-colors hover:bg-white/15',
        size === 'sm' ? 'size-9' : 'size-11',
        className,
      )}
    >
      {copied ? (
        <Check className={cn('text-emerald-400', size === 'sm' ? 'size-4' : 'size-[18px]')} />
      ) : (
        <Share2 className={size === 'sm' ? 'size-4' : 'size-[18px]'} />
      )}
    </button>
  )
}
