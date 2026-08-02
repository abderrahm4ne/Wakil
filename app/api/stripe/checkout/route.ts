import { stripe } from '@/lib/stripe'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

const PLAN_PRICE_IDS: Record<string, string> = {
    STARTER: process.env.STARTER_PLAN_ID!,
    PRO: process.env.PRO_PLAN_ID!,
    BUSINESS: process.env.BUSINESS_PLAN_ID!,
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json()
    const normalizedPlan = plan.toUpperCase()
    const planId = PLAN_PRICE_IDS[normalizedPlan]
    if (!planId) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: planId, quantity: 1 }],
        client_reference_id: session.user.id,
        customer_email: session.user.email ?? undefined,
        metadata: {
            plan: normalizedPlan,
            userId: session.user.id,
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?checkout=cancelled`,
    })

    if (!checkoutSession.url) {
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: checkoutSession.url })
}