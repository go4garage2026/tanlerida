import Link from 'next/link'
import { Crown, Camera, Palette, Sparkles } from 'lucide-react'

export function TanLeidaTeaser() {
  const features = [
    { icon: <Camera size={16} />, label: 'Upload Your Photos' },
    { icon: <Palette size={16} />, label: 'AI Style Analysis' },
    { icon: <Sparkles size={16} />, label: 'See Yourself in Tangred' },
  ]

  return (
    <section className="relative py-28 px-6 md:px-10 overflow-hidden">
      {/* Red glow background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(192,57,43,0.12) 0%, transparent 65%),
            #0A0A0A
          `,
        }}
      />
      <div className="grain-overlay" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 border border-[#C0392B]/40 mb-8 animate-[pulseRed_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          style={{ borderRadius: '2px' }}
        >
          <Crown size={28} className="text-[#C0392B]" />
        </div>

        {/* Label */}
        <p className="font-label text-[#C0392B] text-[12px] tracking-[0.4em] mb-5">TAN LEIDA™</p>

        {/* Heading */}
        <h2 className="font-display text-[48px] md:text-[56px] text-[#F5F5F5] leading-[1.1] font-light">
          Your Personal Master Tailor.
          <br />
          <em style={{ color: '#BFA07A', fontStyle: 'italic' }}>Now Digital.</em>
        </h2>

        {/* Body */}
        <p className="font-body text-[#A0A0A0] text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
          Upload your photos. Share your style. Tan Leida analyses your body profile, skin tone, 
          and preferences — then generates a photorealistic image of you wearing the perfect Tangred piece.
        </p>

        {/* CTA */}
        <Link
          href="/tan-leida"
          className="btn-red inline-flex mt-10 text-sm"
          id="tan-leida-teaser-cta"
        >
          Begin Your Consultation — ₹99
        </Link>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {features.map((feat) => (
            <div
              key={feat.label}
              className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-2 text-[#A0A0A0] font-body text-xs tracking-wide"
              style={{ borderRadius: '2px' }}
            >
              <span className="text-[#C0392B]">{feat.icon}</span>
              {feat.label}
            </div>
          ))}
        </div>

        {/* Pricing note */}
        <p className="font-body text-[#A0A0A0] text-xs mt-6">
          One-time fee. Lifetime session ID. <span className="text-[#BFA07A]">₹99 + 18% GST = ₹116.82</span>
        </p>
      </div>
    </section>
  )
}
