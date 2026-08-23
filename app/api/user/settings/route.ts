import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'



const schema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
})

export async function GET() {
    try {
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                phoneNumber: true,
                pendingEmail: true,
                password: true
            }
        })

        if (!user) return NextResponse.json(
            { success: false, error: 'USER_NOT_FOUND' }, { status: 404 }
        )

        return NextResponse.json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                pendingEmail: user.pendingEmail,
                hasPassword: user.password !== null
            }
        })

    } catch (err) {
        console.error('error in user settings GET route', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}


export async function PATCH(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'INVALID_INPUT' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ success: false, error: 'USER_NOT_FOUND' }, { status: 404 })
    const isGoogle: boolean = user.password === null ? true : false;

    const { name, email, phoneNumber } = parsed.data
    let pendingEmailSet = false

    if (email && email !== user.email) {
        if (isGoogle) {
            return NextResponse.json({ success: false, error: 'EMAIL_LOCKED_GOOGLE' }, { status: 403 })
        }
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) return NextResponse.json({ success: false, error: 'EMAIL_TAKEN' }, { status: 409 })

        const verifyToken = crypto.randomBytes(32).toString('hex')
        await prisma.user.update({
            where: { id: user.id },
            data: {
                pendingEmail: email,
                verifyToken,
                verifyTokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }
        })
        sendVerificationEmail(email, verifyToken, 'change')
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
            ...(name && { name }),
            ...(phoneNumber !== undefined && { phoneNumber }),
        }
    })

    return NextResponse.json({
        success: true,
        data: { name: updated.name, email: updated.email, phoneNumber: updated.phoneNumber },
        pendingEmailVerification: pendingEmailSet,
    })
}
