import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id },
        })

        if (!subscription?.providerSubscriptionId || !subscription.isActive ) {
            return NextResponse.json(
                { success: false, error: 'NO_ACTIVE_SUBSCRIPTION' }, { status: 400 }
            )
        }

        // payment method saved ?
        const customer = await stripe.customers.retrieve(subscription.providerCustomerId!)
        if (customer.deleted) {
            return NextResponse.json(
                { success: false, error: 'CUSTOMER_DELETED' }, { status: 400 }
            )
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.providerSubscriptionId)
        const hasPaymentMethod = !!stripeSubscription.default_payment_method

        if (!hasPaymentMethod) {
            return NextResponse.json(
                { success: false, error: 'NO_PAYMENT_METHOD' }, { status: 400 }
            )
        }

        if (!subscription.endDate) {
            return NextResponse.json(
                { success: false, error: 'NOT_SCHEDULED_FOR_CANCELLATION' }, { status: 400 }
            )
        }

        await stripe.subscriptions.update(subscription.providerSubscriptionId, {
            cancel_at_period_end: false
        })

        return NextResponse.json({ success: true })
    }
    catch (err) {
        console.error('error renewing subscription', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}