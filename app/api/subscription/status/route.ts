// app/api/subscription/status/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
        select: {
            plan: true,
            isActive: true,
            startDate: true,
            currentPeriodEnd: true,
            endDate: true,
        }
    })

    if (!subscription) {
        return NextResponse.json({ success: false, error: 'NO_SUBSCRIPTION' }, { status: 404 })
    }

    return NextResponse.json({
        success: true,
        data: {
            plan: subscription.plan,
            isActive: subscription.isActive,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelScheduled: subscription.endDate !== null,
            cancelDate: subscription.endDate,
        }
    })
}