'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import type { CartItemType } from '@/types'

export function CartDrawer() {
  const { isOpen, items, closeCart, removeItem, updateQuantity, getSubtotal, getGST, getTotal } =
    useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 z-[201] w-full max-w-md bg-[#111111] border-l border-[#2A2A2A] flex flex-col"
            id="cart-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2A2A]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-[#C0392B]" />
                <h2 className="font-label text-sm tracking-[0.25em] text-[#F5F5F5]">
                  YOUR BAG
                </h2>
                {items.length > 0 && (
                  <span className="bg-[#C0392B] text-white text-[10px] font-mono-tan w-5 h-5 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-luxury"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-[#2A2A2A]" />
                  <div>
                    <p className="font-heading text-[#F5F5F5] text-lg">Your bag is empty</p>
                    <p className="font-body text-[#A0A0A0] text-sm mt-2">
                      Discover handcrafted pieces built for ambition.
                    </p>
                  </div>
                  <Link href="/products" onClick={closeCart} className="btn-red text-xs mt-2">
                    Explore Collection
                  </Link>
                </div>
              ) : (
                items.map((item) => <CartItemCard key={item.id} item={item} removeItem={removeItem} updateQuantity={updateQuantity} />)
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-[#2A2A2A] px-6 py-6 space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between text-[#A0A0A0]">
                    <span>Subtotal</span>
                    <span>₹{getSubtotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#A0A0A0]">
                    <span>GST (18%)</span>
                    <span>₹{getGST().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#A0A0A0] text-xs">
                    <span>Shipping</span>
                    <span className="text-[#BFA07A]">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-[#F5F5F5] font-medium pt-2 border-t border-[#2A2A2A]">
                    <span className="font-label tracking-[0.2em] text-xs">TOTAL</span>
                    <span className="font-display text-xl text-[#C0392B]">
                      ₹{getTotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block btn-red text-center text-xs w-full"
                  id="checkout-btn"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-xs text-[#A0A0A0] hover:text-[#F5F5F5] transition-luxury font-body"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function CartItemCard({
  item,
  removeItem,
  updateQuantity,
}: {
  item: CartItemType
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
}) {
  const primaryImage = item.product.images?.find((img) => img.isPrimary)?.url
  const price = item.product.discountPrice ?? item.product.basePrice

  return (
    <div className="flex gap-4 pb-4 border-b border-[#2A2A2A]">
      {/* Image */}
      <div className="w-20 h-24 bg-[#1A1A1A] border border-[#2A2A2A] shrink-0 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={item.product.name}
            width={80}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={20} className="text-[#2A2A2A]" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-heading text-[#F5F5F5] text-sm leading-tight truncate">{item.product.name}</p>
        <p className="font-body text-[#A0A0A0] text-xs mt-1 truncate">{item.product.material}</p>
        <p className="font-display text-[#C0392B] text-lg mt-1">₹{(price * item.quantity).toLocaleString('en-IN')}</p>

        {/* Quantity */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 border border-[#2A2A2A]">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#2A2A2A] transition-luxury"
            >
              <Minus size={12} />
            </button>
            <span className="font-mono-tan text-[#F5F5F5] text-xs w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#2A2A2A] transition-luxury"
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="text-[#A0A0A0] hover:text-[#C0392B] transition-luxury"
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
