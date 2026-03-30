import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            passwordHash: true,
            isVerified: true,
            TanLeridaAccess: true,
            TanLeridaId: true,
          },
        })

        if (!user?.passwordHash) return null
        if (!user.isVerified) {
          throw new Error('EMAIL_NOT_VERIFIED')
        }

        const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!passwordMatches) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          TanLeridaAccess: user.TanLeridaAccess,
          TanLeridaId: user.TanLeridaId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user?.id) {
        token.id = user.id
        token.TanLeridaAccess = user.TanLeridaAccess ?? false
        token.TanLeridaId = user.TanLeridaId ?? null
      }

      if ((trigger === 'update' || !token.id) && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: String(token.email) },
          select: { id: true, TanLeridaAccess: true, TanLeridaId: true },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.TanLeridaAccess = dbUser.TanLeridaAccess
          token.TanLeridaId = dbUser.TanLeridaId
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id)
        session.user.TanLeridaAccess = Boolean(token.TanLeridaAccess)
        session.user.TanLeridaId = token.TanLeridaId ? String(token.TanLeridaId) : null
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
