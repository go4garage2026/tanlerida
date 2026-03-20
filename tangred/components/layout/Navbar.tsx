'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingBag, Heart, Search, User, ChevronDown, Crown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { MobileMenu } from './MobileMenu'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Collections', href: '/products' },
  { label: 'Leather Goods', href: '/products' },
  { label: 'Our Craft', href: '/#craft' },
  { label: 'Tan Leida™', href: '/tan-leida', special: true },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { data: session } = useSession()
  const totalItems = useCartStore((s) => s.getTotalItems())
  const toggleCart = useCartStore((s) => s.toggleCart)
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          scrolled
            ? 'bg-[rgba(10,10,10,0.95)] backdrop-blur-sm border-b border-[#2A2A2A]'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 h-16 md:h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-2xl md:text-[28px] tracking-[0.15em] text-[#F5F5F5] hover:text-white transition-colors shrink-0"
            style={{ fontWeight: 600 }}
          >
            TANGRED
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`font-body text-[13px] uppercase tracking-[0.15em] transition-luxury relative group ${
                    link.special
                      ? 'text-[#F5F5F5] nav-glow'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
                  }`}
                >
                  {link.label}
                  {!link.special && (
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C0392B] transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            {/* Search */}
            <button
              className="hidden md:flex text-[#A0A0A0] hover:text-[#F5F5F5] transition-luxury p-1"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="hidden md:flex text-[#A0A0A0] hover:text-[#F5F5F5] transition-luxury p-1"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative text-[#A0A0A0] hover:text-[#F5F5F5] transition-luxury p-1"
              id="cart-toggle-btn"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C0392B] text-white text-[9px] font-mono-tan w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* User */}
            {session ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#F5F5F5] transition-luxury"
                  id="user-menu-btn"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      className="w-7 h-7 rounded-full border border-[#2A2A2A]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                      <User size={14} />
                    </div>
                  )}
                  <ChevronDown size={12} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-52 bg-[#1A1A1A] border border-[#2A2A2A] shadow-2xl z-50"
                      style={{ borderRadius: '2px' }}
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="p-4 border-b border-[#2A2A2A]">
                        <p className="text-xs text-[#A0A0A0] font-body truncate">{session.user?.email}</p>
                      </div>
                      <nav className="py-2">
                        {[
                          { label: 'My Account', href: '/account' },
                          { label: 'My Orders', href: '/orders' },
                          { label: 'Wishlist', href: '/account/wishlist' },
                          { label: 'Addresses', href: '/account/addresses' },
                        ].map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2.5 text-xs font-body text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#2A2A2A]/50 tracking-wider transition-luxury"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                        <Link
                          href="/account/tan-leida"
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-body text-[#C0392B] hover:bg-[#2A2A2A]/50 tracking-wider transition-luxury"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Crown size={12} />
                          Tan Leida™
                        </Link>
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false) }}
                          className="w-full text-left px-4 py-2.5 text-xs font-body text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#2A2A2A]/50 tracking-wider transition-luxury border-t border-[#2A2A2A] mt-2"
                        >
                          Sign Out
                        </button>
                      </nav>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex btn-ghost text-xs tracking-widest"
                id="navbar-login-btn"
              >
                Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex flex-col gap-[5px] p-1 text-[#F5F5F5]"
              aria-label="Toggle menu"
              id="mobile-menu-btn"
            >
              <span
                className={`block h-px w-6 bg-current transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block h-px w-6 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block h-px w-6 bg-current transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu />
    </>
  )
}
