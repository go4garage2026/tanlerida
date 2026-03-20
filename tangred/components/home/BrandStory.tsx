export function BrandStory() {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto" id="craft">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Visual */}
        <div className="relative">
          {/* Placeholder editorial image */}
          <div
            className="w-full aspect-[4/5] border border-[#2A2A2A] relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1A0D07 0%, #111111 50%, #1A0A0A 100%)',
              borderRadius: '2px',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 40% 60%, rgba(192,57,43,0.15) 0%, transparent 60%)',
              }}
            />
            {/* Decorative text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <p
                  className="font-display text-[100px] text-[#1A1A1A] select-none leading-none"
                  style={{ letterSpacing: '-0.05em' }}
                >
                  T
                </p>
                <p className="font-body text-[#A0A0A0] text-xs tracking-[0.3em] mt-4">
                  HANDCRAFTED IN INDIA
                </p>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#C0392B]/40" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#C0392B]/40" />
          </div>

          {/* Floating stat */}
          <div
            className="absolute -bottom-6 -right-6 bg-[#1A1A1A] border border-[#2A2A2A] p-5 hidden md:block"
            style={{ borderRadius: '2px' }}
          >
            <p className="font-display text-3xl text-[#C0392B]">12+</p>
            <p className="font-body text-[#A0A0A0] text-xs mt-1">Years of Craft</p>
          </div>
        </div>

        {/* Right — Content */}
        <div>
          <p className="font-label text-[#C0392B] text-[11px] tracking-[0.35em] mb-5">OUR CRAFT</p>
          <h2 className="font-heading text-[36px] md:text-[44px] text-[#F5F5F5] leading-[1.15] mb-6">
            Born in India.
            <br />
            <em className="font-display italic" style={{ color: '#BFA07A', fontWeight: 400 }}>
              Built for Ambition.
            </em>
          </h2>

          <div className="space-y-5 font-body text-[#A0A0A0] text-base leading-relaxed">
            <p>
              Tangred was born from a simple conviction: that India's upper class deserves leather goods 
              of the same calibre as Europe's finest houses — but crafted with our hands, our traditions, 
              and an intimate understanding of the Indian professional's life.
            </p>
            <p>
              Every piece begins with full-grain hides, selected by hand at our atelier. Our master craftsmen 
              employ traditional saddlery techniques — hand-stitched seams, vegetable-tanned edges, burnished 
              brass hardware — refined over decades of practice.
            </p>
            <p>
              We do not do fast leather. We do not do shortcuts. We make pieces that earn their scars, 
              that deepen in colour with every boardroom, every journey, every triumph.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-[#2A2A2A]">
            {[
              { value: '100%', label: 'Full-grain hides' },
              { value: 'Hand', label: 'Stitched seams' },
              { value: '14–21', label: 'Day lead time' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-[#C0392B] text-2xl">{stat.value}</p>
                <p className="font-body text-[#A0A0A0] text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
