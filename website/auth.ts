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
            tanLeidaAccess: true,
            tanLeidaId: true,
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
          tanLeridaAccess: user.tanLeidaAccess,
          tanLeridaId: user.tanLeidaId,
          tanLeidaAccess: user.tanLeidaAccess,
          tanLeidaId: user.tanLeidaId,
          TanLeridaAccess: user.tanLeidaAccess,
          TanLeridaId: user.tanLeidaId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user?.id) {
        token.id = user.id
        token.tanLeridaAccess = user.tanLeridaAccess ?? user.tanLeidaAccess ?? user.TanLeridaAccess ?? false
        token.tanLeridaId = user.tanLeridaId ?? user.tanLeidaId ?? user.TanLeridaId ?? null
        token.tanLeidaAccess = token.tanLeridaAccess
        token.tanLeidaId = token.tanLeridaId
        token.TanLeridaAccess = token.tanLeridaAccess
        token.TanLeridaId = token.tanLeridaId
      }

      if ((trigger === 'update' || !token.id) && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: String(token.email) },
          select: { id: true, tanLeidaAccess: true, tanLeidaId: true },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.tanLeridaAccess = dbUser.tanLeidaAccess
          token.tanLeridaId = dbUser.tanLeidaId
          token.tanLeidaAccess = dbUser.tanLeidaAccess
          token.tanLeidaId = dbUser.tanLeidaId
          token.TanLeridaAccess = dbUser.tanLeidaAccess
          token.TanLeridaId = dbUser.tanLeidaId
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id)
        session.user.tanLeridaAccess = Boolean(token.tanLeridaAccess ?? token.tanLeidaAccess ?? token.TanLeridaAccess)
        session.user.tanLeridaId = token.tanLeridaId
          ? String(token.tanLeridaId)
          : token.tanLeidaId
            ? String(token.tanLeidaId)
            : token.TanLeridaId
              ? String(token.TanLeridaId)
              : null
        session.user.tanLeidaAccess = session.user.tanLeridaAccess
        session.user.tanLeidaId = session.user.tanLeridaId
        session.user.TanLeridaAccess = session.user.tanLeridaAccess
        session.user.TanLeridaId = session.user.tanLeridaId
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
