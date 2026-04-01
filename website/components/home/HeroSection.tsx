'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const heroStats = [
  { value: '8+', label: 'signature pieces' },
  { value: '6', label: 'leather categories' },
  { value: '₹99 + GST', label: 'Tan Leida access' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-28">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 18%, rgba(191,160,122,0.14), transparent 26%), radial-gradient(circle at 82% 32%, rgba(192,57,43,0.18), transparent 24%), linear-gradient(180deg, #0f0b09 0%, #0a0a0a 42%, #0a0a0a 100%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BFA07A] to-transparent opacity-60" />
      <div className="grain-overlay" />

      <div className="section-shell grid min-h-[calc(100vh-6rem)] items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-14 lg:py-16">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-3 rounded-full border border-[#2A2A2A] bg-white/[0.03] px-4 py-2"
          >
            <span className="font-label text-[11px] tracking-[0.35em] text-[#C0392B]">Tangred</span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#BFA07A]">Premium Indian Leather House</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.72 }}
            className="mt-6 max-w-4xl font-display text-[3.2rem] leading-[0.93] text-[#F5F5F5] sm:text-[4.2rem] lg:text-[5.6rem]"
          >
            Leather goods for rooms where
            <span className="block italic text-[#BFA07A]">presence decides the outcome.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.72 }}
            className="mt-6 max-w-2xl text-base leading-7 text-[#B6B6B6] sm:text-lg"
          >
            Tangred crafts premium Indian leather bags, belts, wallets, and jackets with a disciplined luxury language.
            Tan Leida extends that craft into a digital master tailor that studies your profile before recommending the
            right piece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.72 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/products" className="btn-primary">
              Explore Collection
              <ArrowRight size={16} />
            </Link>
            <Link href="/tan-lerida/payment" className="btn-outline">
              Begin Tan Leida
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.72 }}
            className="mt-10 grid gap-3 sm:grid-cols-3"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-[4px] border border-[#2A2A2A] bg-[#111111]/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.26)]">
                <p className="font-heading text-2xl text-[#F5F5F5]">{stat.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#9C9C9C]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="relative z-10"
        >
          <div className="relative overflow-hidden rounded-[4px] border border-[#2A2A2A] bg-[#111111] shadow-[0_40px_140px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.42))]" />
            <Image
              src="/landing/tangred-new-project-hero.png"
              alt="Tangred editorial landing visual"
              width={1100}
              height={1300}
              className="h-auto w-full object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[4px] border border-white/10 bg-black/50 p-4 backdrop-blur-sm">
                  <p className="font-label text-[10px] tracking-[0.3em] text-[#BFA07A]">Editorial Feel</p>
                  <p className="mt-2 text-sm leading-6 text-[#D7D7D7]">
                    Dark luxury composition, sharp tailoring cues, and handcrafted leather shown with restraint.
                  </p>
                </div>
                <div className="rounded-[4px] border border-white/10 bg-black/50 p-4 backdrop-blur-sm">
                  <p className="font-label text-[10px] tracking-[0.3em] text-[#C0392B]">Built For Mobile</p>
                  <p className="mt-2 text-sm leading-6 text-[#D7D7D7]">
                    Dense storytelling, clear CTAs, and card-based structure that holds up from 375px upward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#A0A0A0] lg:flex">
        <span className="font-label text-[10px] tracking-[0.35em]">SCROLL</span>
        <ChevronDown size={18} className="animate-[chevronBounce_2s_ease-in-out_infinite]" />
      </div>
    </section>
  )
}
