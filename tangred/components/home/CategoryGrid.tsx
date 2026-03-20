import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    name: 'Leather Bags',
    slug: 'office-bags',
    description: 'Office totes, weekenders, briefcases',
  },
  {
    name: 'Belts & Accessories',
    slug: 'belts',
    description: 'Vegetable-tanned, for every occasion',
  },
  {
    name: 'Jackets & Apparel',
    slug: 'jackets',
    description: 'Nappa & full-grain leather outerwear',
  },
]

export function CategoryGrid() {
  return (
    <section className="py-20 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
      {/* Heading */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
        <div>
          <p className="font-label text-[#C0392B] text-[11px] tracking-[0.3em] mb-3">EXPLORE</p>
          <h2 className="font-heading text-[36px] md:text-[44px] text-[#F5F5F5]">
            Shop by Category
          </h2>
        </div>
        <Link href="/products" className="btn-ghost text-xs shrink-0">
          View All →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={`group relative overflow-hidden border border-[#2A2A2A] hover:border-[#C0392B]/40 transition-all duration-500 ${
              i === 0 ? 'md:row-span-2' : ''
            }`}
            style={{
              borderRadius: '2px',
              height: i === 0 ? '480px' : '216px',
              background: 'linear-gradient(135deg, #1A0D07, #111111)',
            }}
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-50"
              style={{
                background:
                  i === 0
                    ? 'radial-gradient(ellipse at 30% 70%, rgba(192,57,43,0.2) 0%, transparent 60%)'
                    : 'radial-gradient(ellipse at 80% 20%, rgba(192,57,43,0.15) 0%, transparent 50%)',
              }}
            />

            {/* Scale effect on hover */}
            <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.02]">
              <div
                className="w-full h-full"
                style={{
                  background: `
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")
                  `,
                }}
              />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-body text-[#A0A0A0] text-xs mb-1">{cat.description}</p>
              <h3
                className="font-display text-[#F5F5F5] transition-colors duration-300 group-hover:text-white"
                style={{ fontSize: i === 0 ? '36px' : '28px', lineHeight: 1.1, fontWeight: 500 }}
              >
                {cat.name}
              </h3>
              <span className="inline-flex items-center gap-2 text-[#C0392B] text-xs font-body mt-3 transition-all duration-300 group-hover:gap-3">
                Shop Now
                <span>→</span>
              </span>
            </div>

            {/* Red border reveal */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#C0392B] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </Link>
        ))}
      </div>
    </section>
  )
}
