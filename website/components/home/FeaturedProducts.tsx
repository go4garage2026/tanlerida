import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { featuredProducts } from '@/lib/catalog'

export function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="section-shell">
        <div className="mb-12 grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
          <div>
            <p className="mb-4 font-label text-[11px] tracking-[0.35em] text-[#C0392B]">THE TANGRED EDIT</p>
            <h2 className="font-heading text-[36px] leading-[1.05] text-[#F5F5F5] md:text-[48px]">
              Quietly assertive leather, selected for workdays, travel, and ceremonial presence.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#A0A0A0] md:text-base">
              These are the first pieces a new visitor should understand: structured bags, elevated belts, and the
              jacket that carries the Tan Leida voice into evening wear.
            </p>
          </div>
          <Link href="/products" className="text-sm uppercase tracking-[0.18em] text-[#A0A0A0] transition-luxury hover:text-[#F5F5F5]">
            View all products
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
