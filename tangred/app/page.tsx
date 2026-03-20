import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { BrandStory } from '@/components/home/BrandStory'
import { TanLeidaTeaser } from '@/components/home/TanLeidaTeaser'
import { Testimonials } from '@/components/home/Testimonials'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedProducts />
      <CategoryGrid />
      <BrandStory />
      <TanLeidaTeaser />
      <Testimonials />
    </main>
  )
}
