import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

        const { immediate } = await req.json().catch(() => ({ immediate: false }))

        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id }
        })

        if (!subscription?.providerSubscriptionId) {
            return NextResponse.json({ success: false, error: 'NO_SUBSCRIPTION' }, { status: 400 })
        }

        if (immediate) {
            await stripe.subscriptions.cancel(subscription.providerSubscriptionId)
        } else {
            await stripe.subscriptions.update(subscription.providerSubscriptionId, {
                cancel_at_period_end: true
            })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('error in cancel subscription', err)
        return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 })
    }
}