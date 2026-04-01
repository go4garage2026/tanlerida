import Image from 'next/image'
import Link from 'next/link'
import { Crown, Sparkles, WandSparkles } from 'lucide-react'
import { TAN_LERIDA_TOTAL_PAISE, formatPaise } from '@/lib/utils/currency'

const features = [
  {
    icon: Crown,
    title: 'Profile-led fit direction',
    body: 'Reads silhouette, tone, and use case before recommending a Tangred category.',
  },
  {
    icon: Sparkles,
    title: 'Narrative recommendation',
    body: 'Explains why a piece works for your body profile, wardrobe rhythm, and occasion.',
  },
  {
    icon: WandSparkles,
    title: 'Generated visual preview',
    body: 'Shows you a styled direction before you commit to the purchase journey.',
  },
]

export function TanLeridaTeaser() {
  return (
    <section className="relative overflow-hidden border-y border-[#2A2A2A] bg-[#111111] py-20">
      <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(192,57,43,0.16) 0%, transparent 55%)' }} />
      <div className="section-shell relative grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-center">
        <div className="relative overflow-hidden rounded-[4px] border border-[#2A2A2A] bg-black/20">
          <Image
            src="/landing/tangred-tan-lerida-page.png"
            alt="Tan Leida landing interface reference"
            width={1200}
            height={1400}
            className="h-auto w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.45))]" />
        </div>

        <div>
          <p className="mb-4 font-label text-[11px] tracking-[0.35em] text-[#C0392B]">FLAGSHIP EXPERIENCE</p>
          <h2 className="font-display text-[42px] leading-none md:text-[56px]">Your personal master tailor. Now digital.</h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#A0A0A0] md:text-lg">
            Tan Leida studies your body profile, interprets your wardrobe need, maps that to Tangred&apos;s catalog,
            and returns a recommendation in the voice of a refined tailor rather than a generic assistant.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-[4px] border border-[#BFA07A]/40 bg-black/25 px-5 py-4">
            <span className="font-label text-[11px] tracking-[0.3em] text-[#BFA07A]">Access Fee</span>
            <span className="font-heading text-2xl text-[#F5F5F5]">{formatPaise(TAN_LERIDA_TOTAL_PAISE)}</span>
          </div>

          <div className="mt-8 grid gap-4">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div key={feature.title} className="rounded-[4px] border border-[#2A2A2A] bg-black/25 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#C0392B]/40 bg-[#C0392B]/10 text-[#C0392B]">
                      <Icon size={18} />
                    </div>
                    <p className="font-heading text-xl text-[#F5F5F5]">{feature.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#A0A0A0]">{feature.body}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/tan-lerida/payment" className="btn-red">
              Begin Consultation
            </Link>
            <Link href="/tan-lerida" className="btn-ghost">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
