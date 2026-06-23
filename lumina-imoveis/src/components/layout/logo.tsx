import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('group flex items-center gap-2.5', className)} aria-label="LUMINA Imóveis — início">
      <span className="relative grid size-9 place-items-center">
        <svg viewBox="0 0 40 40" className="size-9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="11" className="fill-gold-gradient" fill="url(#lum)" />
          <path d="M12 11v18h16" stroke="#0A0A0A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="27" cy="14" r="3" fill="#0A0A0A" />
          <defs>
            <linearGradient id="lum" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E6C55C" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#A8861F" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight text-white">
          LUMINA
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
          Imóveis
        </span>
      </span>
    </Link>
  )
}
