import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Notification } from '@/components/shared/Notification'

export const metadata: Metadata = {
  title: {
    default: 'Tangred — Premium Handcrafted Indian Leather Goods',
    template: '%s | Tangred',
  },
  description:
    'Tangred crafts premium leather goods for the ambitious Indian professional. Explore handcrafted belts, bags, jackets, wallets and briefcases — and discover Tan Leida™, your personal AI style consultant.',
  keywords: [
    'premium leather goods India',
    'handcrafted leather bags',
    'luxury belts India',
    'leather jackets India',
    'Tan Leida AI tailor',
    'Tangred',
    'bespoke leather India',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Tangred',
    title: 'Tangred — Crafted for Those Who Command Respect',
    description:
      'Premium handcrafted Indian leather goods. Born in India. Built for Ambition.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tangred — Premium Indian Leather Goods',
    description: 'Handcrafted leather goods for the ambitious professional.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0A0A0A] text-[#F5F5F5] font-body antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <Notification />
        </Providers>
      </body>
    </html>
  )
}
