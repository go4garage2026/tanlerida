import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    quote:
      '"The Executive Tote has been through boardroom presentations in Delhi, client dinners in Mumbai, and weekend trips to Coorg. Three years in — it looks better with age."',
    author: 'Vikram Nair',
    city: 'Bangalore',
    rating: 5,
    product: 'Executive Tote',
  },
  {
    id: 2,
    quote:
      '"Tan Leida recommended the Counsel Briefcase for my litigation practice. The AI understood exactly what I needed — structured, dignified, built to last. Perfect."',
    author: 'Priya Mehta',
    city: 'Mumbai',
    rating: 5,
    product: 'The Counsel Briefcase',
  },
  {
    id: 3,
    quote:
      '"I\'ve owned European leather goods. Tangred is in that league — except it\'s made here, for us, by hands that understand Indian summers and ambition."',
    author: 'Arjun Sharma',
    city: 'New Delhi',
    rating: 5,
    product: 'Moto Jacket',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
      {/* Heading */}
      <div className="text-center mb-14">
        <p className="font-label text-[#C0392B] text-[11px] tracking-[0.3em] mb-4">WHAT THEY SAY</p>
        <h2 className="font-heading text-[36px] md:text-[42px] text-[#F5F5F5]">
          Worn With Pride
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="card-surface p-6 flex flex-col gap-4 hover:border-[#C0392B]/20 transition-luxury"
          >
            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={13} className="fill-[#C0392B] text-[#C0392B]" />
              ))}
            </div>

            {/* Quote */}
            <p className="font-display text-[#F5F5F5] text-lg italic leading-relaxed flex-1">
              {t.quote}
            </p>

            {/* Author */}
            <div className="border-t border-[#2A2A2A] pt-4">
              <p className="font-body text-[#F5F5F5] text-sm font-medium">{t.author}</p>
              <p className="font-body text-[#A0A0A0] text-xs mt-0.5">
                {t.city} · <span className="text-[#BFA07A]">{t.product}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
