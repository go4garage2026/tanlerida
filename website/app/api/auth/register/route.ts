import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { buildOtpToken } from '@/lib/auth-tokens'
import { sendVerificationEmail } from '@/lib/resend'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json())
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        isVerified: true,
        googleId: true,
      },
    })

    if (existingUser?.isVerified) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 },
      )
    }

    if (existingUser?.googleId) {
      return NextResponse.json(
        { success: false, message: 'This email is already linked to Google sign-in. Continue with Google instead.' },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(payload.password, 12)
    const token = buildOtpToken()
    const user = await prisma.$transaction(async (tx) => {
      const nextUser = await tx.user.upsert({
        where: { email: payload.email },
        update: {
          name: payload.name,
          phone: payload.phone,
          passwordHash,
          isVerified: false,
        },
        create: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          passwordHash,
          isVerified: false,
        },
      })

      await tx.emailVerificationToken.deleteMany({
        where: {
          userId: nextUser.id,
          usedAt: null,
        },
      })

      await tx.emailVerificationToken.create({
        data: {
          userId: nextUser.id,
          tokenHash: token.tokenHash,
          expiresAt: token.expiresAt,
        },
      })

      return nextUser
    })

    await sendVerificationEmail(user.email, user.name ?? 'Client', token.otp, token.expiresAt)

    return NextResponse.json({ success: true, userId: user.id, requiresVerification: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to register.' }, { status: 400 })
  }
}
