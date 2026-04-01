import Link from 'next/link'
import { Crown, Smartphone } from 'lucide-react'
import { TanLeridaFaqs, TanLeridaSteps } from '@/lib/catalog'

export default function TanLeridaPage() {
  return (
    <div className="pb-20 pt-24">
      <section className="relative overflow-hidden border-b border-[#2A2A2A] px-6 py-24 md:px-10 lg:px-16">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 75% 30%, rgba(192,57,43,0.16), transparent 28%), linear-gradient(135deg, #0A0A0A, #130b09)' }} />
        <div className="relative mx-auto max-w-[1200px]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[#C0392B]"><Crown size={18} /><span className="font-label text-[11px] tracking-[0.35em]">Tan Lerida™</span></div>
            <h1 className="mt-6 font-display text-[52px] leading-none md:text-[76px]">Your AI Master Tailor</h1>
            <p className="mt-6 max-w-2xl text-lg text-[#A0A0A0]">A premium consultation flow that reads your photographs, understands your wardrobe needs, and recommends the Tangred piece that will wear most convincingly on you.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="#get-the-app" className="btn-red flex items-center gap-2"><Smartphone size={16} /> Get the App</Link>
              <div className="border border-[#2A2A2A] bg-[#111111] px-6 py-4 text-sm text-[#A0A0A0]">Available on iOS &amp; Android</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-label text-[11px] tracking-[0.35em] text-[#C0392B]">HOW IT WORKS</p>
            <h2 className="mt-4 font-heading text-[40px] md:text-[52px]">A Four-Step Bespoke Flow</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TanLeridaSteps.map((step, index) => (
            <article key={step.id} className="border border-[#2A2A2A] bg-[#111111] p-6">
              <p className="font-mono-tan text-sm text-[#BFA07A]">0{index + 1}</p>
              <h3 className="mt-4 font-heading text-2xl">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#A0A0A0]">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="get-the-app" className="mx-auto max-w-[1200px] px-6 py-10 md:px-10">
        <div className="border border-[#C0392B] bg-[#111111] p-8 md:p-10">
          <div className="flex items-center gap-3 text-[#C0392B]"><Smartphone size={18} /><span className="font-label text-[11px] tracking-[0.35em]">DOWNLOAD</span></div>
          <h2 className="mt-4 font-heading text-[40px] md:text-[52px]">Get the Tangred App</h2>
          <p className="mt-4 max-w-2xl text-[#A0A0A0]">Tan Lerida™ is designed as a dedicated mobile experience — upload photos from your camera, get real-time AI styling, and receive your bespoke recommendation directly on your device.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:max-w-lg">
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 border border-[#2A2A2A] bg-black/40 px-5 py-4 transition-luxury hover:border-[#A0A0A0]">
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-[#F5F5F5]"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div><p className="text-[10px] text-[#A0A0A0]">Download on the</p><p className="font-label text-sm tracking-wide text-[#F5F5F5]">App Store</p></div>
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 border border-[#2A2A2A] bg-black/40 px-5 py-4 transition-luxury hover:border-[#A0A0A0]">
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-[#F5F5F5]"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm.91-.91L19.59 12l-1.87-2.21-2.27 2.27 2.27 2.15zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
              <div><p className="text-[10px] text-[#A0A0A0]">Get it on</p><p className="font-label text-sm tracking-wide text-[#F5F5F5]">Google Play</p></div>
            </a>
          </div>
          <p className="mt-6 text-xs text-[#A0A0A0]">Coming soon. Join the waitlist for early access.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <p className="font-label text-[11px] tracking-[0.35em] text-[#C0392B]">FAQ</p>
        <div className="mt-8 space-y-4">
          {TanLeridaFaqs.map((faq) => (
            <article key={faq.question} className="border border-[#2A2A2A] bg-[#111111] p-6">
              <h3 className="font-heading text-2xl">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-[#A0A0A0]">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
