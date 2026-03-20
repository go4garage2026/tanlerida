import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'
import Link from 'next/link'

// Dummy data for now, will be fetched from database
const featuredProducts: Product[] = [
  {
    id: '1',
    slug: 'executive-briefcase',
    name: 'The Executive Briefcase',
    description: 'A classic briefcase crafted from full-grain leather.',
    basePrice: 24500,
    material: 'Full-Grain English Bridle Leather',
    categoryId: 'office-bags',
    stock: 10,
    isFeatured: true,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'The Executive Briefcase',
        isPrimary: true,
        productId: '1',
      },
    ],
  },
  {
    id: '2',
    slug: 'tanlerida-moto-jacket',
    name: 'Tan Leida Moto Jacket',
    description: 'Premium red nappa leather moto jacket with brass hardware.',
    basePrice: 45000,
    material: 'Premium Red Nappa Leather',
    categoryId: 'jackets',
    stock: 5,
    isFeatured: true,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Moto Jacket',
        isPrimary: true,
        productId: '2',
      },
    ],
  },
  {
    id: '3',
    slug: 'minimalist-wallet',
    name: 'The Artisan Wallet',
    description: 'Slim bifold wallet handcrafted from vegetable-tanned leather.',
    basePrice: 4500,
    material: 'Vegetable-Tanned Leather',
    categoryId: 'accessories',
    stock: 20,
    isFeatured: false,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1627042633145-b780d842521d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Minimalist Wallet',
        isPrimary: true,
        productId: '3',
      },
    ],
  },
  {
    id: '4',
    slug: 'weekend-duffel',
    name: 'The Outlander Duffel',
    description: 'Spacious leather duffel bag for weekend getaways.',
    basePrice: 32000,
    material: 'Pebbled Calf Leather',
    categoryId: 'travel',
    stock: 8,
    isFeatured: true,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1554342872-034a06541bad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Weekend Duffel',
        isPrimary: true,
        productId: '4',
      },
    ],
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
      {/* Heading */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <p className="font-label text-[#C0392B] text-[11px] tracking-[0.3em] mb-4">THE ATELIER SELECTION</p>
          <h2 className="font-heading text-[36px] md:text-[44px] text-[#F5F5F5] leading-[1.1]">
            Featured <em className="font-display italic text-[#BFA07A]">Pieces</em>
          </h2>
        </div>
        <Link href="/products" className="btn-ghost text-sm shrink-0 border-b border-[#C0392B] pb-1 hover:border-[#C0392B]/50 transition-colors">
          View the Collection
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
