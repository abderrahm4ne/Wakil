import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
    try {
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const current = await prisma.subscription.findUnique({
            where: { userId: session.user.id }
        })

        if (!current) return NextResponse.json(
            { success: false, error: 'SUBSCRIPTION_NOT_FOUND' }, { status: 404 }
        )

        if (current.plan === 'FREE_TRIAL') return NextResponse.json(
            { success: false, error: 'CANNOT_RENEW_FREE_TRIAL' }, { status: 400 }
        )

        const start = new Date()
        const endDate = new Date(start)
        endDate.setMonth(endDate.getMonth() + 1)

        const subscription = await prisma.subscription.update({
        where: { userId: session.user.id },
        data: {
            isActive: true,
            startDate: start,
            endDate
        }
        })

        return NextResponse.json({ success: true, data: subscription })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
        { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}