import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email'


export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { success: false }
            )
        }
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || user.password === null) {
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
            user.verificationAttempts > 3
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

    sendVerificationEmail(email, token, 'register')

    return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' },
            { status: 500 }
        )
    }
}