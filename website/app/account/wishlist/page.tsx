'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch products and show wishlisted ones
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.products) {
          // For now, show featured products as wishlist items
          // Full wishlist API will query the Wishlist table
          setWishlist(data.products.filter((p: Product) => p.isFeatured).slice(0, 6))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-32 md:px-10 lg:px-16">
      <p className="font-label text-[11px] tracking-[0.35em] text-[#C0392B]">ACCOUNT</p>
      <h1 className="mt-4 font-heading text-[42px] md:text-[56px]">Wishlist</h1>
      <p className="mt-4 max-w-2xl text-[#A0A0A0]">Save Tangred pieces you want to revisit, compare, or hand over to Tan Lerida for styling context.</p>

      {loading ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-80 skeleton" />)}
        </div>
      ) : wishlist.length === 0 ? (
        <p className="mt-10 text-center text-[#A0A0A0]">Your wishlist is empty.</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
