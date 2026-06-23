import { Hero } from '@/components/sections/hero'
import { FeaturedProperties } from '@/components/sections/featured-properties'
import { Experience3D } from '@/components/sections/experience-3d'
import { VirtualTour } from '@/components/sections/virtual-tour'
import { About } from '@/components/sections/about'
import { Testimonials } from '@/components/sections/testimonials'
import { CTA } from '@/components/sections/cta'
import { Contact } from '@/components/sections/contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <Experience3D />
      <VirtualTour />
      <About />
      <Testimonials />
      <CTA />
      <Contact />
    </>
  )
}
