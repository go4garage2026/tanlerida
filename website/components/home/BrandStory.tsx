import Image from 'next/image'

const pillars = [
  {
    title: 'Indian craftsmanship',
    body: 'Small-batch leather work, exact finishing, and silhouettes designed for longevity rather than trend churn.',
  },
  {
    title: 'Modern professional wardrobe',
    body: 'Each product is tuned for offices, investor meetings, business travel, and formal occasions where polish matters.',
  },
  {
    title: 'AI-assisted consultation',
    body: 'Tan Leida connects body profile, occasion, and personal taste to the right Tangred recommendation.',
  },
]

export function BrandStory() {
  return (
    <section id="craft" className="py-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[4px] border border-[#2A2A2A] bg-[#111111]">
          <Image
            src="/landing/tangred-hero.png"
            alt="Tangred leather craftsmanship reference"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.72))]" />
          <div className="absolute bottom-0 left-0 right-0 grid gap-4 p-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-[4px] border border-white/10 bg-black/45 p-4 backdrop-blur-sm">
                <p className="font-label text-[10px] tracking-[0.28em] text-[#BFA07A]">{pillar.title}</p>
                <p className="mt-3 text-sm leading-6 text-[#D2D2D2]">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="mb-4 font-label text-[11px] tracking-[0.35em] text-[#C0392B]">OUR CRAFT</p>
          <h2 className="font-heading text-[36px] leading-[1.05] md:text-[48px]">Born in India. Built for ambition.</h2>
          <div className="my-8 h-px w-24 bg-[#C0392B]" />
          <div className="space-y-5 text-base text-[#A0A0A0] md:text-lg">
            <p>
              Tangred is designed for founders, counsel, operators, and creators who want luxury with structure instead
              of spectacle.
            </p>
            <p>
              The brand language stays dark, exact, and tactile: rich leather, composed proportions, and pieces that
              project authority without shouting.
            </p>
            <p>
              The landing page now tells that story in a cleaner sequence, then hands visitors into the store or the
              Tan Leida consultation with less friction.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
