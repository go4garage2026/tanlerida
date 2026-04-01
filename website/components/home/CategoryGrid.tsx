import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/lib/catalog'

export function CategoryGrid() {
  return (
    <section className="py-10">
      <div className="section-shell">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-4 font-label text-[11px] tracking-[0.35em] text-[#C0392B]">COLLECTIONS</p>
            <h2 className="font-heading text-[36px] md:text-[48px]">The collection at a glance</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative block min-h-[420px] overflow-hidden rounded-[4px] border border-[#2A2A2A]"
            >
              <Image src={category.imageUrl ?? ''} alt={category.name} fill className="object-cover transition-luxury group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.78))]" />
              <div className="absolute inset-0 border border-transparent transition-luxury group-hover:border-[#C0392B]" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="mb-3 text-[11px] uppercase tracking-[0.32em] text-[#BFA07A]">Tangred Category</p>
                <h3 className="font-display text-4xl leading-none text-white md:text-5xl">{category.name}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-[#D0D0D0]">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
