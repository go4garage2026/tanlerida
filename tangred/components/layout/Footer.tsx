import Link from 'next/link'
import { Instagram, Twitter, Linkedin, Crown } from 'lucide-react'

const footerLinks = {
  Shop: [
    { label: 'Office Bags', href: '/category/office-bags' },
    { label: 'Belts', href: '/category/belts' },
    { label: 'Jackets', href: '/category/jackets' },
    { label: 'Wallets', href: '/category/wallets' },
    { label: 'Briefcases', href: '/category/briefcases' },
    { label: 'Accessories', href: '/category/accessories' },
  ],
  Company: [
    { label: 'Our Story', href: '/#craft' },
    { label: 'Craftsmanship', href: '/#craft' },
    { label: 'Press', href: '/press' },
    { label: 'Careers', href: '/careers' },
  ],
  Support: [
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Care Instructions', href: '/care' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A] mt-24">
      {/* Tan Leida Banner */}
      <div className="bg-[#111111] border-b border-[#2A2A2A] py-8 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Crown size={20} className="text-[#C0392B]" />
            <div>
              <p className="font-label text-[#F5F5F5] text-sm tracking-[0.2em]">TAN LEIDA™ — YOUR AI MASTER TAILOR</p>
              <p className="font-body text-[#A0A0A0] text-xs mt-0.5">Personalised styling powered by AI. See yourself in Tangred.</p>
            </div>
          </div>
          <Link href="/tan-leida" className="btn-outline text-xs shrink-0">
            Begin Consultation — ₹99
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-3xl tracking-[0.15em] text-[#F5F5F5] block mb-4">
              TANGRED
            </Link>
            <p className="font-body text-[#A0A0A0] text-sm leading-relaxed max-w-xs">
              Born in India. Built for Ambition. Every Tangred piece is handcrafted by master leather artisans 
              for those who command respect.
            </p>
            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-[#2A2A2A] flex items-center justify-center text-[#A0A0A0] hover:text-[#F5F5F5] hover:border-[#F5F5F5]/30 transition-luxury"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-label text-[#F5F5F5] text-xs tracking-[0.3em] mb-5">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-[#A0A0A0] text-sm hover:text-[#F5F5F5] transition-luxury"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-[#2A2A2A]">
          <p className="font-body text-[#A0A0A0] text-xs">
            © {new Date().getFullYear()} Tangred. All rights reserved. Handcrafted in India.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'GST: 29XXXXX1234A1Z5'].map((item, i) => (
              <span key={i} className="font-body text-[#A0A0A0] text-xs hover:text-[#F5F5F5] transition-luxury cursor-pointer">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
