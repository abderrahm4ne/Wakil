import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() } // not expired
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'INVALID_OR_EXPIRED_TOKEN' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashed = await bcrypt.hash(password, 12)

    // Update password + invalidate token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpires: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error in Register", err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}