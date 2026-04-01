import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const DEMO_USER_EMAIL = 'demo@tangred.in'

export async function getCurrentUserIdOrDemo() {
  const session = await auth()
  if (session?.user?.id) return session.user.id

  // Ensure a demo user exists in the database for unauthenticated access
  const demo = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      name: 'Guest User',
      isVerified: true,
    },
  })
  return demo.id
}
