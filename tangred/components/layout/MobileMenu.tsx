'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useUIStore } from '@/store/uiStore'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown } from 'lucide-react'

const navLinks = [
  { label: 'Collections', href: '/products' },
  { label: 'Leather Goods', href: '/products' },
  { label: 'Our Craft', href: '/#craft' },
  { label: 'Tan Leida™', href: '/tan-leida', special: true },
]

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore()
  const { data: session } = useSession()

  // Lock scroll when open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col lg:hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#2A2A2A]">
            <span className="font-display text-xl tracking-[0.15em] text-[#F5F5F5]">TANGRED</span>
            <button
              onClick={closeMobileMenu}
              className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-luxury"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 flex flex-col justify-center px-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block py-5 font-display text-4xl font-light tracking-wide border-b border-[#2A2A2A] transition-luxury ${
                    link.special
                      ? 'text-[#C0392B]'
                      : 'text-[#F5F5F5] hover:text-[#A0A0A0]'
                  }`}
                >
                  {link.special && <Crown size={20} className="inline mr-2 mb-1" />}
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom */}
          <div className="px-8 pb-10 border-t border-[#2A2A2A] pt-6 space-y-3">
            {session ? (
              <>
                <p className="text-xs text-[#A0A0A0] font-body mb-4">Signed in as {session.user?.name}</p>
                <Link href="/account" onClick={closeMobileMenu} className="block btn-ghost text-center text-xs">
                  My Account
                </Link>
                <button
                  onClick={() => { signOut(); closeMobileMenu() }}
                  className="w-full btn-ghost text-xs"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMobileMenu} className="block btn-primary text-center text-xs">
                  Login
                </Link>
                <Link href="/register" onClick={closeMobileMenu} className="block btn-ghost text-center text-xs">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
