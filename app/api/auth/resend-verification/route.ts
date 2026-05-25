import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { success: false }
            )
        }
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return NextResponse.json({ success: true })
        }

        if (user.emailVerified) {
            return NextResponse.json(
                { success: true, message: "EMAIL_ALREADY_VERIFIED"}
            )
        }

        const token = crypto.randomBytes(32).toString('hex')

        const expires = new Date(
            Date.now() + 1000 * 60 * 60
        )
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

        if (
            user.lastVerificationSent && 
            user.lastVerificationSent > oneHourAgo && 
            user.verificationAttempts > 2
        ) {
            return NextResponse.json(
                { success: false, error: 'RATE_LIMITED' },
                { status: 429 }
            )
        }

        const attempts = user.lastVerificationSent && user.lastVerificationSent > oneHourAgo 
            ? user.verificationAttempts + 1 
            : 1

        await prisma.user.update({
            where: { email },
            data: { 
                verifyToken: token, 
                verifyTokenExpires: expires,
                verificationAttempts: attempts,
                lastVerificationSent: new Date()
            }
        })

        await resend.emails.send({
            from: 'Wakil <onboarding@resend.dev>',
            to: email,
            subject: 'Verify your email',
            html: `<a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}">Verify Email</a>`
        })

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' },
            { status: 500 }
        )
    }
}