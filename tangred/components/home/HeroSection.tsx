'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background — deep leather texture feel */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(40,20,10,0.8) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 30%, rgba(30,10,5,0.6) 0%, transparent 50%),
            linear-gradient(135deg, #0D0604 0%, #1A0D07 30%, #0A0A0A 100%)
          `,
        }}
      />

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Red ambient glow — left side */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(192,57,43,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 md:px-10 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-label text-[#C0392B] text-[14px] tracking-[0.4em] mb-6"
        >
          TANGRED
        </motion.p>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="font-display text-[52px] md:text-[72px] lg:text-[88px] text-[#F5F5F5] font-light leading-[1.05]"
          style={{ letterSpacing: '-0.02em' }}
        >
          Crafted for Those
          <br />
          <em className="italic" style={{ color: '#BFA07A', fontStyle: 'italic' }}>Who Command Respect</em>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="font-body text-[#A0A0A0] text-lg md:text-xl mt-6 max-w-xl mx-auto"
        >
          Premium Indian Leather, Tailored to Your Legacy
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link href="/products" className="btn-primary" id="hero-explore-btn">
            Explore Collection
          </Link>
          <Link href="/tan-leida" className="btn-outline" id="hero-tan-leida-btn">
            Meet Tan Leida™
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-label text-[#A0A0A0] text-[10px] tracking-[0.3em]">SCROLL</span>
        <ChevronDown
          size={18}
          className="text-[#A0A0A0] animate-[chevronBounce_2s_ease-in-out_infinite]"
        />
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-5 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }}
      />
    </section>
  )
}
