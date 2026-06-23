import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CompareBar } from '@/components/property/compare-bar'
import { ScrollProgress } from '@/components/shared/scroll-progress'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <CompareBar />
      <Footer />
    </>
  )
}
