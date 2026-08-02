import { stripe } from '@/lib/stripe'
import { activateSubscription } from '@/lib/subscription'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature')!

    let event
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
        console.error('Webhook signature verification failed', err)
        return NextResponse.json({ error: 'INVALID_SIGNATURE' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const userId = session.client_reference_id
        const plan = session.metadata?.plan

        if (userId && plan) {
            await activateSubscription(userId, plan as any)
        }
    }

    return NextResponse.json({ received: true })
}