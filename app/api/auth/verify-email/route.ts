import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=INVALID_TOKEN', req.url))
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpires: { gt: new Date() }
      }
    })

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=INVALID_OR_EXPIRED_TOKEN', req.url))
    }

    // Mark email as verified + invalidate token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verifyToken: null,
        verifyTokenExpires: null
      }
    })

    // Redirect to login with success message
    return NextResponse.redirect(new URL('/login?verified=true', req.url))

  } catch (err) {
    console.error(err)
    return NextResponse.redirect(new URL('/login?error=SERVER_ERROR', req.url))
  }
}