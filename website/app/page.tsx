import { BrandStory } from '@/components/home/BrandStory'
import { CinematicShowcase } from '@/components/home/CinematicShowcase'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { HeroSection } from '@/components/home/HeroSection'
import { TanLeridaTeaser } from '@/components/home/TanLeridaTeaser'
import { Testimonials } from '@/components/home/Testimonials'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CinematicShowcase />
      <FeaturedProducts />
      <CategoryGrid />
      <BrandStory />
      <TanLeridaTeaser />
      <Testimonials />
    </div>
  )
}
