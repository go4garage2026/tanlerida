import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart } from 'lucide-react'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary)?.url ?? product.images?.[0]?.url
  const price = product.discountPrice ?? product.basePrice
  const hasDiscount = !!product.discountPrice

  const isFeatured = product.isFeatured
  const isNew = new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000

  return (
    <div
      className={`product-card group relative flex flex-col h-full ${className}`}
      id={`product-card-${product.slug}`}
    >
      {/* Badge */}
      {(isFeatured || isNew) && (
        <div className="absolute top-3 left-3 z-10">
          {isNew ? (
            <span className="badge-red">New Arrival</span>
          ) : (
            <span className="badge-gold">Bestseller</span>
          )}
        </div>
      )}

      {/* Wishlist */}
      <button
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#0A0A0A]/60 backdrop-blur-sm flex items-center justify-center text-[#A0A0A0] hover:text-[#C0392B] transition-luxury opacity-0 group-hover:opacity-100"
        aria-label="Add to wishlist"
      >
        <Heart size={14} />
      </button>

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden" style={{ aspectRatio: '4/5' }}>
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            width={400}
            height={500}
            className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
          />
        ) : (
          <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
            <ShoppingBag size={40} className="text-[#2A2A2A]" />
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="font-body text-[#A0A0A0] text-[10px] tracking-[0.2em] uppercase mb-1">
          {product.material}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-heading text-[#F5F5F5] text-base leading-snug hover:text-[#C0392B] transition-luxury">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-2 flex-1 items-end">
          <p className="font-display text-[#C0392B] text-xl">
            ₹{price.toLocaleString('en-IN')}
          </p>
          {hasDiscount && (
            <p className="font-body text-[#A0A0A0] text-sm line-through">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </p>
          )}
        </div>

        {/* Add to cart — appears on hover */}
        <button
          className="w-full btn-ghost text-xs mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
          aria-label={`Add ${product.name} to cart`}
          id={`add-to-cart-${product.slug}`}
        >
          <ShoppingBag size={13} />
          Add to Bag
        </button>
      </div>
    </div>
  )
}

/* Skeleton loader */
export function ProductCardSkeleton() {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden" style={{ borderRadius: '2px' }}>
      <div className="skeleton" style={{ aspectRatio: '4/5' }} />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-6 w-24 rounded" />
      </div>
    </div>
  )
}
