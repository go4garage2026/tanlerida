import { notFound } from 'next/navigation'
import { TanLeridaSessionClient } from '@/components/tan-lerida/TanLeridaSessionClient'
import { getTanLeridaSession } from '@/lib/tan-lerida-store'

export default async function TanLeridaSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = getTanLeridaSession(id)

  if (!session) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-32 md:px-10 lg:px-16">
      <TanLeridaSessionClient initialSession={session} />
    </div>
  )
}
