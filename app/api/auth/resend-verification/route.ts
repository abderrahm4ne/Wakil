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
            html: ` <div style="font-family: sans-serif; line-height: 1.5; color: #333; height: 500px; width: 700px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <h2 style="color: #0070f3;">Verify Your Email</h2>
                    <p>Click the button below to verify your email address.</p>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Verify Email</a>
                </div>`
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