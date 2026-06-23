import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-dark-radial px-6">
      <div className="text-center">
        <p className="font-display text-[120px] font-extrabold leading-none text-gold-gradient">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-white">Página não encontrada</h1>
        <p className="mt-3 max-w-md text-white/60">
          O endereço que você procura mudou ou não existe mais. Que tal explorar nossos imóveis?
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="gold">
            <Link href="/">
              <Home className="size-4" /> Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="glass">
            <Link href="/imoveis">
              <Search className="size-4" /> Ver imóveis
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
