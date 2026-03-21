import { TanLeridaSessionClient } from '@/components/tan-lerida/TanLeridaSessionClient'

export default async function TanLeridaSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-32 md:px-10 lg:px-16">
      <TanLeridaSessionClient initialSession={{ id, sessionCode: '', status: 'INITIATED', isPaid: false, createdAt: new Date() } as any} />
    </div>
  )
}
